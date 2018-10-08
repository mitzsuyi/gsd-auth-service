'use strict';

const Joi = require('joi');

const Lab = require('lab');

const { expect } = require('code');

const { describe, it, afterEach } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest((server) => {
  afterEach(async () => {
    await server.mongo.db.collection('User').deleteMany();
  });
});

const { getMeSchema } = require('./models');
const {responsePayloadJSON, validateSchema }= require('./helpers')

const {
  requiresAuthentication,
  respondsWithJSON
} = require('./behaviors');

const PAYLOAD = {};
const PATH = '/me';
const METHOD = 'GET';

const OPTIONS = {authenticated:true}

describe('GET /me', () => {

  it('returns current user info', async () => {
    const response = await request(METHOD, PATH, PAYLOAD, OPTIONS)
    const responseJSON = responsePayloadJSON(response)
    await validateSchema(responseJSON, getMeSchema, expect)
  });

  requiresAuthentication(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  respondsWithJSON(it, request, METHOD, PATH, PAYLOAD, OPTIONS);
});
