'use strict';

const Lab = require('lab');

const { describe, it } = exports.lab = Lab.script();

//const { server } = require('./server');

const { acceptsUrlEncodedContentTye,
  requiresAuthentication,
  respondsWithJSON,
  requiresRefreshTokenString
} = require('./behaviors');

const { jwtSchema } = require('./models');

describe('POST /access_tokens/refresh', () => {

  it('refreshes expired access token',() => {

  });

  requiresAuthentication(it);

  acceptsUrlEncodedContentTye(it);

  requiresRefreshTokenString(it);

  respondsWithJSON(it);

  it('response matches jwtSchema', () => {

    console.log(jwtSchema);
  });

});
