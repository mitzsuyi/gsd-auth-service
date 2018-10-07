'use strict';

const Boom = require('boom');
const Crypto = require('crypto');
const HapiJwt = require('hapi-auth-jwt2');
const Joi = require('joi');
const Jwt = require('jsonwebtoken');

const { APP_SECRET } = require('../environment');
const { to, encryptData, compareData } = require('./utils');

const internals = {};

internals.createRefreshToken = function (server) {

  return async function (userId) {

    const db = server.mongo.db;
    const ObjectID = server.mongo.ObjectID;

    let encryptedToken, err;

    const randomBytes = Crypto.randomBytes(128);
    const token = `${userId}${randomBytes.toString('hex')}`;

    [err, encryptedToken] = await to(encryptData(token));
    if (err) {
      throw err;
    }

    [err] = await to(db.collection('Token').findOneAndUpdate(
      { userId: ObjectID(userId) },
      { userId, token: encryptedToken },
      { upsert: true }

    ));

    if (err) {
      throw err;
    }

    return token;
  };
};

internals.createAccessToken = function () {

  return async function (userId) {

    const token = Jwt.sign({ _id: userId }, APP_SECRET, { expiresIn: '10m' });

    return token;
  };
};

internals.getTokens = function (server) {

  return async function (userId) {

    const auth = server.methods.auth;

    let accessToken, err, refreshToken;

    [err, accessToken] = await to(auth.createAccessToken(userId));
    if (err) {
      throw Boom.internal();
    }

    [err, refreshToken] = await to(auth.createRefreshToken(userId));
    if (err) {
      throw Boom.internal();
    }

    return { accessToken, refreshToken };
  };
};

// https://github.com/dwyl/hapi-auth-jwt2/pull/249#issuecomment-352155073
internals.validateAccessToken = function () {

  return function (decoded) {

    return { isValid: true, credentials: decoded };
  };
};

internals.validateRefreshToken = function (server) {

  return async function (userId, refreshToken) {

    const db = server.mongo.db;
    const ObjectID = server.mongo.ObjectID;

    let err, refreshTokenIsOk, storedRefreshToken;
    [err, storedRefreshToken] = await to(db.collection('Token').findOne({ userId: ObjectID(userId) }));
    if (err) {
      throw Boom.internal();
    }

    if (!storedRefreshToken) {
      throw Boom.badRequest('User not logged in.');
    }

    [err, refreshTokenIsOk] = await to(compareData(refreshToken, storedRefreshToken.token));
    if (err) {
      throw Boom.internal();
    }

    if (!refreshTokenIsOk) {
      throw Boom.unauthorized();
    }

    return true;

  };
};

const DELETE_POST=["delete", "post"]
const URLENCODED = "application/x-www-form-urlencoded"

internals.validatesFormDataContentTypeOnPost = (request, reply)=> {
  if (DELETE_POST.includes(request.method)){
    if (request.headers['content-type'] !== URLENCODED) throw Boom.badRequest("Request format incorrect")
  }  
  return reply.continue
}

exports.register = async function (server) {

  server.method('auth.createAccessToken', internals.createAccessToken(server));
  server.method('auth.createRefreshToken', internals.createRefreshToken(server));
  server.method('auth.validateRefreshToken', internals.validateRefreshToken(server));
  server.method('auth.getTokens', internals.getTokens(server));

  await server.register(HapiJwt);

  const authOptions = {
    headerKey: 'x-access-token',
    key: APP_SECRET,
    validate: internals.validateAccessToken(server)
  };

  server.auth.strategy('jwt', 'jwt', authOptions);
  server.auth.strategy('jwt-no-exp', 'jwt', Object.assign({}, authOptions, {
    verifyOptions: { ignoreExpiration: true }
  }));

  server.auth.default('jwt');

  server.ext('onRequest', internals.validatesFormDataContentTypeOnPost)

  return server;
};

exports.login = {
  description: 'Logs in a user.',
  auth: false,
  validate: {
    payload: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  async handler(request, h) {

    const auth = request.server.methods.auth;
    const user = request.server.methods.user;

    const { email, password } = request.payload;
    let err, tokens, userId;

    [err, userId] = await to(user.checkPassword(email, password));
    if (err) {
      return err;
    }

    [err, tokens] = await to(auth.getTokens(userId));
    if (err) {
      return err;
    }

    return { jwt: tokens.accessToken, refresh_token: tokens.refreshToken };
  }
};

exports.refreshToken = {
  description: 'Refreshes an access token.',
  auth: 'jwt-no-exp',
  validate: {
    payload: {
      refresh_token: Joi.string().required()
    }
  },
  async handler(request, h) {

    const auth = request.server.methods.auth;

    const refreshToken = request.payload.refresh_token;
    const userId = request.auth.credentials._id;

    let accessToken, err;

    [err] = await to(auth.validateRefreshToken(userId, refreshToken));
    if (err) {
      return err;
    }

    [err, accessToken] = await to(auth.createAccessToken(userId));
    if (err) {
      return Boom.internal();
    }

    return { jwt: accessToken };
  }
};

exports.logout = {
  description: 'Logs out a user.',
  validate: {
    payload: {
      refresh_token: Joi.string().required()
    }
  },
  async handler(request, h) {

    const auth = request.server.methods.auth;
    const refreshToken = request.payload.refresh_token;
    const userId = request.auth.credentials._id;

    const db = request.mongo.db;
    const ObjectID = request.mongo.ObjectID;

    let err;

    [err] = await to(auth.validateRefreshToken(userId, refreshToken));
    if (err) {
      return err;
    }

    [err] = await to(db.collection('Token').findOneAndDelete({ userId: ObjectID(userId) }));
    if (err) {
      return Boom.internal();
    }

    return h.response().code(204);
  }
};
