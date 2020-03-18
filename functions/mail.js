require('dotenv').config();
exports.handler = (event, _context, callback) => {
  const mailgun = require('mailgun-js');
  const mg = new mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  const data = JSON.parse(event.body);

  console.log(data);

  const email = {
    from: `Pranjal Agnihotri <beingPranjal6@gmail.com>`,
    to: `${data.name} <${data.email}>`,
    subject: data.subject,
    body: data.body
  };

  mg.messages().send(email, (error, response) => {
    if (error) console.error('ERROR::::', error);
    else console.log('RESULT::::', response);
    callback(error, {
      statusCode: 200,
      body: JSON.stringify(response)
    });
  });

  // callback(null, {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     yoyo: 'HEYHEY'
  //   })
  // });
};
