exports.handler = (event, _context, callback) => {
  console.log(event.body);
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({ yoyo: 'wowowoow' })
  });
};
