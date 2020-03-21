require('dotenv').config();

exports.handler = (event, _context, callback) => {
  const mailgun = require('mailgun-js');

  const mg = new mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  const contentType = event.headers['content-type'];
  const boundary = '--' + multipart.getBoundary(contentType);
  console.log('BOUNDARY: ', boundary);
  console.log(event.headers);
  console.log(event.isBase64Encoded);
  const data = Buffer.from(event.body, 'base64');
  // console.log(data);

  const parts = multipart.Parse(data, boundary);
  console.log(parts.length);
  // parts.forEach(P => {
  //   console.log('Parts: ', P);
  // });

  // console.log(Object.keys(data.attachment));

  // const email = {
  //   from: `Pranjal Agnihotri <beingPranjal6@gmail.com>`,
  //   to: `${data.name} <${data.email}>`,
  //   subject: data.subject,
  //   body: data.body
  // };

  // mg.messages().send(email, (error, response) => {
  //   if (error) console.error('ERROR::::', error);
  //   else console.log('RESULT::::', response);
  //   callback(error, {
  //     statusCode: 200,
  //     body: JSON.stringify(response)
  //   });
  // });

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      result: 'It worked'
    })
  });
};
