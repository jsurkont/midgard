const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('winston');
require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  logger.level = 'info';
} else {
  logger.level = 'debug';
}

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  logger.info('Database connection established');
});

require('./services/listeners'); // Initialize device listeners
require('./services/schedule'); // Initialize repetitive jobs

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(require('morgan')('dev'));  // Log requests to the console.
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./routes')(app);
app.get('*', (req, res) => res.status(200).send({
  error: 'Page not found',
}));

module.exports = app;
