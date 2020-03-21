const { Router } = require('express');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
require('dotenv').config();

const router = Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const store = multer.memoryStorage();
const upload = multer({
  storage: store
});

router.post(
  '/send',
  upload.fields([{ name: 'attachment', maxCount: 2 }]),
  (req, res, next) => {
    const data = req.body;
    const file = req.files.attachment[0];

    const fileContent = Buffer.from(file.buffer).toString('base64');

    const msg = {
      to: `${data.name} <${data.email}>`,
      from: 'Sweet Mails <sweet@mails.com>',
      subject: data.subject,
      text: data.body,
      attachments: [
        {
          content: fileContent,
          filename: file.originalname,
          type: file.mimetype,
          disposition: 'attachment',
          contentId: `file_attachment_${file.path}`
        }
      ]
    };

    sgMail
      .send(msg)
      .then(() => {
        res.json({
          status: 'Sent successfully....'
        });
      })
      .catch(next);
  }
);

module.exports = router;
