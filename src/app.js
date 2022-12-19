require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const router = require('./routes/router');
const ErrorHandler = require('./middleware/errorHandler');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(router);
app.use((error, req, res, next) => {
  if (error instanceof ErrorHandler) {
    console.log(error);
    return res
      .status(error.statusCode)
      .json({
        message: error.message,
      });
  }

  return res.status(500).json({
    error: 'Internal server error',
  });
});

module.exports = app;
