'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Md5 = require('md5');

const { to, normalizeString, encryptData, compareData } = require('./utils');

const internals = {};

internals.passwordSchema = function () {

  return Joi.string()
    .required()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/);
};

// http://en.gravatar.com/site/implement/hash/
internals.getAvatarUrl = function (email) {

  const baseUrl = 'https://www.gravatar.com/avatar';
  const query = `d=mm&s=200`;
  const hash = Md5(normalizeString(email));

  return `${baseUrl}/${hash}?${query}`;
};

internals.checkPassword = function (server) {

  return async function (email, password) {

    const db = server.mongo.db;

    let err, passwordIsOk, user;

    [err, user] = await to(db.collection('User').findOne({ email: normalizeString(email) }));
    if (err) {
      throw Boom.internal();
    }

    if (!user) {
      throw Boom.unauthorized('User does not exist.');
    }

    [err, passwordIsOk] = await to(compareData(password, user.password));
    if (err) {
      throw Boom.internal();
    }

    if (!passwordIsOk) {
      throw Boom.unauthorized('Incorrect password.');
    }

    return user._id;
  };
};

exports.register =  function (server) {

  server.method('user.checkPassword', internals.checkPassword(server));
};

exports.create = {
  description: 'Creates a user.',
  auth: false,
  validate: {
    payload: {
      email: Joi.string().required(),
      name: Joi.string().required(),
      password: internals.passwordSchema()
    }
  },
  async handler(request, h) {

    const auth = request.server.methods.auth;
    const db = request.mongo.db;

    const { email, name, password } = request.payload;
    let encryptedPassword, err, result, tokens;

    [err, encryptedPassword] = await to(encryptData(password));
    if (err) {
      return Boom.internal();
    }

    [err, result] = await to(db.collection('User').insertOne({
      email: normalizeString(email),
      name,
      password: encryptedPassword
    }));
    if (err && err.code === 11000) {
      return Boom.badRequest('User already exists.');
    }

    if (err) {
      return Boom.internal();
    }

    const userId = result.insertedId;

    [err, tokens] = await to(auth.getTokens(userId));
    if (err) {
      return err;
    }

    return { jwt: tokens.accessToken, refresh_token: tokens.refreshToken };
  }
};

exports.me = {
  description: 'Returns info of current user.',
  async handler(request, h) {

    const db = request.mongo.db;
    const ObjectID = request.mongo.ObjectID;
    const userId = request.auth.credentials._id;

    const [err, user] = await to(db.collection('User').findOne(
      { _id: ObjectID(userId) },
      { _id: false, name: true, email: true }
    ));
    if (err) {
      return Boom.internal();
    }

    const avatarUrl = internals.getAvatarUrl(user.email);
    Object.assign(user, { avatar_url: avatarUrl });

    return user;
  }
};

exports.passwordSchema = internals.passwordSchema;

