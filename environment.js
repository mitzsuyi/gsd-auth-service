'use strict';

const LIFE_TOO_SHORT = 'Life is too short to write another login page.';

const development = {
  HOST: 'localhost',
  PORT: 6060,
  APP_SECRET: LIFE_TOO_SHORT,
  MONGODB_URI: 'mongodb://localhost:27017/gsd-auth-service'
};

const production = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  APP_SECRET: process.env.APP_SECRET,
  MONGODB_URI: process.env.MONGODB_URI
};

const test = {
  APP_SECRET: LIFE_TOO_SHORT,
  MONGODB_URI: 'mongodb://localhost:29017/gsd-auth-service-test'
};

const ENVS = {
  production,
  test,
  development
};

module.exports = ENVS[process.env.NODE_ENV];
