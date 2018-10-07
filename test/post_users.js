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

const PAYLOAD = userData.createUser
const PATH = '/users';
const METHOD = 'POST';

describe('POST /users', () => {

  describe('Create', () => {

    it('creates a user', async () => {

      const response = await request(METHOD, PATH, {
        payload: PAYLOAD
      });
      expect(response.statusCode).to.equal(200);
    });
    behavesLikeCreateUser(it, request, METHOD, PATH, PAYLOAD);
  });
});
