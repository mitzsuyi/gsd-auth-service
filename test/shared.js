'use strict';

const EMAIL = 'email';
const BAD_PASSWORD = 'bAdPasS';
const GODD_PASSWORD = 'tesT12345';
const NAME = 'user';

const loginData = {
  email: EMAIL,
  password: GODD_PASSWORD
};

const createUser = Object.assign({ name: NAME }, loginData);


module.exports = {
  createUser,
  loginData,
  users: Object.assign({}, createUser, { password_bad: BAD_PASSWORD })
};
