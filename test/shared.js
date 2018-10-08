'use strict';

const EMAIL = 'email';
const BAD_PASSWORD = 'bAdPasS';
const GODD_PASSWORD = 'tesT12345';
const NAME = 'user';

const createUser = {
  name: NAME,
  email: EMAIL,
  password: GODD_PASSWORD
};


module.exports = {
  createUser,
  users: Object.assign({}, createUser, { password_bad: BAD_PASSWORD })
};
