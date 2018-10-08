'use strict';

const Lab = require('lab');

const { expect } = require('code');

const { describe, it } = exports.lab = Lab.script();

const request = require('./helpers').routeRequest();

const { acceptsUrlEncodedContentType,
  requiresAuthentication,
  requiresRefreshTokenString
} = require('./behaviors');

const PAYLOAD = {};

const PATH = '/access-tokens';
const METHOD = 'DELETE';

const OPTIONS = { authenticated:true, refreshTokens: true, withRefreshToken:true, statusCode: 204 };

describe('DELETE /access_tokens', () => {

  it('logs out a user', async () => {

    await request(METHOD, PATH, PAYLOAD, OPTIONS);
    const response = await request(METHOD, PATH, PAYLOAD, { authenticated:true, withRefreshToken:true, skipTokens: true });
    expect(response.statusCode).to.equal(400);
    expect(response.result.message).to.include('User not logged in');
  });

  requiresAuthentication(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  acceptsUrlEncodedContentType(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  requiresRefreshTokenString(it, request, METHOD, PATH, PAYLOAD, OPTIONS);

  it('responds with 204 status code', async () => {

    const response = await request(METHOD, PATH, PAYLOAD, OPTIONS);
    expect(response.statusCode).to.equal(204);
  });
});
