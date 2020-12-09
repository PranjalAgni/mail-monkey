const { Router } = require('express');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');

const router = Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const store = multer.memoryStorage();
const upload = multer({
  storage: store,
});

/**
 * @api {POST} /send/ Sends mail
 * @apiName SendMail
 *
 * @apiParam {String} subject Subject of the mail.
 * @apiParam {String} text Text of the mail.
 * @apiParam {String} email Recipients email.
 * @apiParam {String} fromEmail Senders email.
 *
 * @apiSuccess {String} message Message ("OK").
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Ok"
 *     }
 *
 * @apiError {String} message Error message failer
 * @apiError {String} reason Reason for error
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Failed",
 *       "reason": "Unauthorized"
 *     }
 */
router.post(
  '/send',
  upload.fields([{ name: 'attachment', maxCount: 2 }]),
  (req, res, next) => {
    const data = req.body;
    console.log('Data: ', data);

    const msg = {
      to: `${data.name} <${data.email}>`,
      from: `${data.fromEmail}`,
      subject: data.subject,
      text: data.text,
    };

    const file = req.files?.attachment[0];

    if (file) {
      const fileContent = Buffer.from(file?.buffer).toString('base64');
      const attachment = [];
      attachment.push({
        content: fileContent,
        filename: file?.originalname,
        type: file?.mimetype,
        disposition: 'attachment',
        contentId: `file_attachment_${file?.path}`,
      });

      msg['attachment'] = attachment;
    }

    sgMail
      .send(msg)
      .then(() => {
        res.status(200);
        res.sendStatus(200).json({
          message: 'OK',
        });
      })
      .catch((err) => {
        res.status(500);
        res.json({
          message: 'Failed',
          reason: err.message,
        });
        console.error('Error: ', JSON.stringify(err, null, '\t'));
        next(err);
      });
  }
);

module.exports = router;
