'use strict';

const Lab = require('lab');

const { expect } = require('code');

const { describe, it, afterEach } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest((server) => {
  afterEach(async () => {
    await server.mongo.db.collection('User').deleteMany();
  });
});

const { behavesLikeCreateUser } = require('./behaviors');

const userData = require('./shared').users;

const PAYLOAD = {
  email: userData.email,
  password: userData.password
};
const PATH = '/access_tokens';
const METHOD = 'POST';

describe('POST /access_tokens', () => {

  it('logs a user in',() => {

  });
  behavesLikeCreateUser(it, METHOD, PATH, PAYLOAD);
});
