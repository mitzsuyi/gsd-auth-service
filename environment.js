'use strict';

const development = {
  HOST: 'localhost',
  PORT: 6060,
  APP_SECRET: 'Life is too short to write another login page.',
  MONGODB_URI: 'mongodb://localhost:27017/gsd-auth-service'
};

const production = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  APP_SECRET: process.env.APP_SECRET,
  MONGODB_URI: process.env.MONGODB_URI
};

module.exports = process.env.NODE_ENV === 'production' ? production : development;
