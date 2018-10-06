'use strict';

const Joi = require('joi');

const jwtSchema = Joi.object().keys({
  jwt: Joi.string()
});

const createResponseSchema = Joi.object().keys({
  jwt: Joi.string(),
  refresh_token: Joi.string()
});

const getMeSchema =  Joi.object().keys({
  name: Joi.string(),
  email: Joi.string(),
  avatar_url: Joi.string()
});

module.exports = {
  createResponseSchema,
  getMeSchema,
  jwtSchema
};
