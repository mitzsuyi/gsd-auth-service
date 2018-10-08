'use strict';

const Lab = require('lab');

const { expect } = require('code');

const { describe, it } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest();

const { behavesLikeCreateUser, tokenExpiresInShortTime } = require('./behaviors');

const loginData = require('./shared').loginData;

const PAYLOAD = loginData;

const PATH = '/access-tokens';
const METHOD = 'POST';
const OPTIONS = {};

describe('POST /access_tokens', () => {

  it('logs a user in', async () => {

    const response = await request(METHOD, PATH, PAYLOAD);
    expect(response.statusCode).to.equal(200);
  });
  behavesLikeCreateUser(it, request, METHOD, PATH, PAYLOAD, { badPasswordCode:401 });

  tokenExpiresInShortTime(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

});
