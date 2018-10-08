'use strict';

const Lab = require('lab');

const { expect } = require('code');

const { describe, it } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest();

const { behavesLikeCreateUser, tokenExpiresInShortTime } = require('./behaviors');

const createUser = require('./shared').createUser;

const PAYLOAD = createUser;
const PATH = '/users';
const METHOD = 'POST';
const OPTIONS = { skipTokens:true, clearUsers:true };

describe('POST /users', () => {

  describe('Create', () => {

    it('creates a user', async () => {

      const response = await request(METHOD, PATH, PAYLOAD, OPTIONS);
      expect(response.statusCode).to.equal(200);
    });
    behavesLikeCreateUser(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

    tokenExpiresInShortTime(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  });
});
