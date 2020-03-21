require('dotenv').config();

exports.handler = function(event, _context, callback) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Data to send
  const data = JSON.parse(event.body);
  console.log('Data: ', data);
  const msg = {
    to: data.email,
    from: 'Sweet Mails <sweet@mails.com>',
    subject: data.subject,
    text: data.body
  };

  sgMail
    .send(msg)
    .then(() => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          response: 'SENT SUCCESSFULLY'
        })
      });
    })
    .catch(err => {
      callback(err, {
        statusCode: 500,
        body: JSON.stringify({
          status: 'Oohh error occured..'
        })
      });
    });
};
