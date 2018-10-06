'use strict';

//const Joi = require('joi');

const { createResponseSchema } = require('../models');

const acceptsUrlEncodedContentTye = (it) => {

  it('only accept www-form-urlencoded content type',() => {

  });
};

const respondsWithJSON = (it) => {

  it('responds with json', () => {

  });
};

const requiresRefreshTokenString = (it) => {

  it('requires refresh token string',() => {

  });
};

const requiresAuthentication = (it) => {

  it('requires authentication',() => {

  });
};

const behavesLikeCreateUser = (it, server) => {

  acceptsUrlEncodedContentTye(it);

  it('requires both email and password', () => {

  });
  it('password must match passwordSchema', () => {

  });
  it('response type is application/json',() => {

  });
  it('response matches createResponseSchema',() => {

    console.log(createResponseSchema);
  });
};

module.exports = {
  behavesLikeCreateUser,
  acceptsUrlEncodedContentTye,
  requiresAuthentication,
  respondsWithJSON,
  requiresRefreshTokenString
};
