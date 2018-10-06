'use strict';

const Lab = require('lab');

const { describe, it } = exports.lab = Lab.script();

//const { server } = require('./server');

const { behavesLikeCreateUser } = require('./behaviors');

describe('POST /access_tokens', () => {

  it('logs a user in',() => {

  });
  behavesLikeCreateUser(it);
});
