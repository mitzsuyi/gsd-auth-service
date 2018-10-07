'use strict';

const Lab = require('lab');

const { expect } = require('code');

const { describe, it } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest((server) => {
  afterEach(async () => {
    await server.mongo.db.collection('User').deleteMany();
  });
});

const { getMeSchema } = require('./models');

const {
  requiresAuthentication,
  respondsWithJSON
} = require('./behaviors');

const PAYLOAD = {};
const PATH = 'me';
const METHOD = 'GET';

describe('GET /me', () => {

  it('returns current user info',() => {

  });

  requiresAuthentication(it, METHOD, PATH, PAYLOAD);

  respondsWithJSON(it, METHOD, PATH, PAYLOAD);

  it('response matches getMeSchema', () => {

  });

});
