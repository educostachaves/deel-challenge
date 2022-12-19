const dotenv = require('dotenv');

dotenv.config();

const serverConfig = {
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV,
};

module.exports = serverConfig;
