'use strict';

const Lab = require('lab');

const { describe, it } = exports.lab = Lab.script();

//const { server } = require('./server');

const { getMeSchema } = require('./models');

const {
  requiresAuthentication,
  respondsWithJSON
} = require('./behaviors');


describe('GET /me', () => {

  it('returns current user info',() => {

  });

  requiresAuthentication(it);

  respondsWithJSON(it);

  it('response matches getMeSchema', () => {

    console.log(getMeSchema);
  });

});
