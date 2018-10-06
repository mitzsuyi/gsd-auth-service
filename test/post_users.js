'use strict';

const Lab = require('lab');

const { describe, it } = exports.lab = Lab.script();

//const { server } = require('./server');

const { behavesLikeCreateUser } = require('./behaviors');

describe('POST /users', () => {

  describe('Create', () => {

    it('creates a user',() => {

    });
    behavesLikeCreateUser(it);
  });
});
