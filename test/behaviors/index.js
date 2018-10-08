'use strict';

const { createResponseSchema } = require('../models');
const { expect } = require('code');
const { responsePayloadJSON, validateSchema } = require('../helpers');
const Sleep = require('await-sleep');

const { TOKEN_EXPIRY } = require('../../environment');

const acceptsUrlEncodedContentType = (it, request, method, path, payload, options = {}) => {

  it('only accept www-form-urlencoded content type', async () => {

    const params = Object.assign({ options:{
      headers:{ 'Content-Type': 'application/json' }
    } }, options);

    let response = await request(method, path, payload, params);
    expect(response.statusCode).to.equal(400);

    response = await request(method, path, payload, options);
    expect(response.statusCode).to.equal(options.statusCode || 200);
  });
};

const respondsWithJSON = (it, request, method, path, payload) => {

  it('responds with json', async () => {

    const response = await request(method, path, payload);
    expect(response.headers['content-type']).to.include('application/json');
  });
};

const accessTokenHeaderOptions = function (accessToken){

  return { options:{ headers:{ 'x-access-token': accessToken } } };


};

const getMe = function (request, accessToken){

  return request('GET', '/me', {}, accessTokenHeaderOptions(accessToken));
};

const refreshesExpiredToken = (it, request, method, path, payload, options) => {

  it('refreshes expired token', async () => {

    let response = await request('POST', '/access-tokens', Shared.loginData, {});

    expect(response.statusCode).to.equal(200);

    await Sleep(parseInt(TOKEN_EXPIRY) * 1.5);

    let accessToken = responsePayloadJSON(response);

    response = await getMe(request, accessToken.jwt);
    expect(response.statusCode).to.equal(401);

    response = await request('POST', '/access-tokens/refresh', { refresh_token: accessToken.refresh_token }, accessTokenHeaderOptions(accessToken.jwt));
    expect(response.statusCode).to.equal(200);
    accessToken = responsePayloadJSON(response);
    response = await getMe(request, accessToken.jwt);
    expect(response.statusCode).to.equal(200);
  });
};

const tokenExpiresInShortTime = (it, request, method, path, payload, options) => {

  it('token expires in short time', async () => {

    let response = await request(method, path, payload, options);

    expect(response.statusCode).to.equal(200);

    await Sleep(parseInt(TOKEN_EXPIRY) * 1.5);

    const accessToken = responsePayloadJSON(response).jwt;
    response = await getMe(request, accessToken);

    expect(response.statusCode).to.equal(401);
    expect(response.result.message).to.include('Expired token');
  });
};

const requiresRefreshTokenString = (it, request, method, path, payload, options) => {

  it('requires refresh token string', async () => {

    const withoutRefreshToken = clone(options);
    delete withoutRefreshToken.withRefreshToken;

    let response = await request(method, path, payload, withoutRefreshToken);
    expect(response.statusCode).to.equal(400);

    response = await request(method, path, payload, options);
    expect(response.statusCode).to.equal(options.statusCode || 200);
  });
};

const requiresAuthentication = (it, request, method, path, payload, options) => {

  it('requires authentication', async () => {

    let response = await request(method, path, payload, options);
    expect(response.statusCode).to.equal(options.statusCode || 200);

    response = await request(method, path, payload, { withRefreshToken: true });
    expect(response.statusCode).to.equal(401);
  });
};

const Shared = require('../shared');

const userData = Shared.users;

const clone = (object) => Object.assign({}, object);

const behavesLikeCreateUser = (it, request, method, path, payload, options = {}) => {

  acceptsUrlEncodedContentType(it, request, method, path, payload, options);

  it('requires both email and password', async () => {

    const payloads = [], responses = [];
    let without;

    ['email', 'password'].forEach((omit) => {

      without = clone(payload);
      delete without[omit];
      payloads.push(without);
    });
    responses.push(await request(method, path, payloads[0]));
    responses.push(await request(method, path, payloads[1]));

    responses.forEach((response) => {

      expect(response.statusCode).to.equal(400);
    });
  });
  it('password must match passwordSchema', async () => {

    const withBadPassword = Object.assign({}, payload, { password:userData.password_bad });
    let response = await request(method, path, withBadPassword, options);
    expect(response.statusCode).to.equal(options.badPasswordCode || 400);
    const withGoodPassword = Object.assign({}, payload, { password:userData.password });
    response = await request(method, path, withGoodPassword, options);
    expect(response.statusCode).to.equal(200);
  });

  respondsWithJSON(it, request, method, path, payload, options);

  it('response matches createResponseSchema', async () => {

    const response = await request(method, path, payload, options);
    expect(response.statusCode).to.equal(200);
    const responseJSON = responsePayloadJSON(response);
    validateSchema(responseJSON, createResponseSchema, expect);
  });
};

module.exports = {
  behavesLikeCreateUser,
  acceptsUrlEncodedContentType,
  requiresAuthentication,
  respondsWithJSON,
  requiresRefreshTokenString,
  refreshesExpiredToken,
  tokenExpiresInShortTime
};
