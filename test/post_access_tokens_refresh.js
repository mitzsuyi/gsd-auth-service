'use strict';

const Lab = require('lab');

const { expect } = require('code');

const { describe, it } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest();

const { acceptsUrlEncodedContentType,
  requiresAuthentication,
  respondsWithJSON,
  requiresRefreshTokenString,
  tokenExpiresInShortTime,
  refreshesExpiredToken
} = require('./behaviors');

const { jwtSchema } = require('./models');
const { responsePayloadJSON, validateSchema } = require('./helpers');

const OPTIONS = { authenticated:true, withRefreshToken:true };
const PAYLOAD = {};
const PATH = '/access-tokens/refresh';
const METHOD = 'POST';

describe('POST /access_tokens/refresh', () => {

  it('refreshes expired access token', async () => {

    const response = await request(METHOD, PATH, PAYLOAD, OPTIONS);
    expect(response.statusCode).to.equal(200);
  });

  requiresAuthentication(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  acceptsUrlEncodedContentType(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  requiresRefreshTokenString(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  respondsWithJSON(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  it('response matches jwtSchema', async () => {

    const response = await request(METHOD, PATH, PAYLOAD, OPTIONS);
    const responseJSON = responsePayloadJSON(response);
    validateSchema(responseJSON, jwtSchema, expect);
  });

  tokenExpiresInShortTime(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  refreshesExpiredToken(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

});
