'use strict';

const Lab = require('lab');

const { expect } = require('code');

const { describe, it } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest();

const { behavesLikeCreateUser } = require('./behaviors');

const userData = require('./shared').users;

const PAYLOAD = {
  email: userData.email,
  password: userData.password
};
const PATH = '/access-tokens';
const METHOD = 'POST';

describe('POST /access_tokens', () => {

  it('logs a user in', async () => {

    const response = await request(METHOD, PATH, PAYLOAD);
    expect(response.statusCode).to.equal(200);
  });
  behavesLikeCreateUser(it, request, METHOD, PATH, PAYLOAD, { badPasswordCode:401 });
});
