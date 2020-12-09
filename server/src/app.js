const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const middlewares = require('./middlewares');
const mailer = require('./api/mailer');

const app = express();

app.use(express.json());
app.use(morgan('common'));
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    status: 'Hey!!',
  });
});

app.use('/api/mailer', mailer);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
