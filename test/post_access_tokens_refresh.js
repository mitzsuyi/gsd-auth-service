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

const PAYLOAD = {
  refresh_token:'expired-token'
};

const PATH = '/access_tokens/refresh';
const METHOD = 'POST';

describe('POST /access_tokens/refresh', () => {

  it('refreshes expired access token',() => {

  });

  requiresAuthentication(it, request, METHOD, PATH, PAYLOAD);

  acceptsUrlEncodedContentType(it, request, METHOD, PATH, PAYLOAD);

  requiresRefreshTokenString(it, request, METHOD, PATH, PAYLOAD);

  respondsWithJSON(it, request, METHOD, PATH, PAYLOAD);

  it('response matches jwtSchema', () => {

  });

});
