'use strict';

const Lab = require('lab');

const { expect } = require('code');

const { describe, it } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest();

const { getMeSchema } = require('./models');
const { responsePayloadJSON, validateSchema } = require('./helpers');

const {
  requiresAuthentication,
  respondsWithJSON
} = require('./behaviors');

const PAYLOAD = {};
const PATH = '/me';
const METHOD = 'GET';

const OPTIONS = { authenticated:true };

describe('GET /me', () => {

  it('returns current user info', async () => {

    const response = await request(METHOD, PATH, PAYLOAD, OPTIONS);
    const responseJSON = responsePayloadJSON(response);
    await validateSchema(responseJSON, getMeSchema, expect);
  });

  requiresAuthentication(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  respondsWithJSON(it, request, METHOD, PATH, PAYLOAD, OPTIONS);
});
