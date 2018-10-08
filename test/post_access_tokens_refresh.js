'use strict';

const Lab = require('lab');

const { expect } = require('code');

const { describe, it, afterEach } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest((server) => {
  afterEach(async () => {
    await server.mongo.db.collection('User').deleteMany();
  });
});

const { acceptsUrlEncodedContentType,
  requiresAuthentication,
  respondsWithJSON,
  requiresRefreshTokenString
} = require('./behaviors');

const { jwtSchema } = require('./models');
const {responsePayloadJSON, validateSchema} = require('./helpers')

const OPTIONS = {authenticated:true, withRefreshToken:true}
const PAYLOAD={}
const PATH = '/access-tokens/refresh';
const METHOD = 'POST';

describe('POST /access_tokens/refresh', () => {

  it('refreshes expired access token', async() => {
    const response = await request(METHOD, PATH, PAYLOAD, OPTIONS);    
    expect(response.statusCode).to.equal(200);
  });

  requiresAuthentication(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  acceptsUrlEncodedContentType(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  requiresRefreshTokenString(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  respondsWithJSON(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  it('response matches jwtSchema', async() => {

    const response = await request(METHOD, PATH, PAYLOAD, OPTIONS);
    const responseJSON = responsePayloadJSON(response);
    validateSchema(responseJSON, jwtSchema, expect)
  });

});
