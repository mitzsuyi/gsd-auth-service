'use strict';

const Lab = require('lab');

const { describe, it } = exports.lab = Lab.script();

//const { server } = require('./server');

const { acceptsUrlEncodedContentTye,
  requiresAuthentication,
  requiresRefreshTokenString
} = require('./behaviors');


describe('DELETE /access_tokens', () => {

  it('logs out a user',() => {

  });

  requiresAuthentication(it);

  acceptsUrlEncodedContentTye(it);

  requiresRefreshTokenString(it);

  it('responds with 204 status code', () => {

  });
});
