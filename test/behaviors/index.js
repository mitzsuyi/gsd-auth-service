'use strict';

const Joi = require('joi');

const { createResponseSchema } = require('../models');
const { expect } = require('code');
const responsePayloadJSON = require('../helpers').responsePayloadJSON;

const acceptsUrlEncodedContentType = (it, request, method, path, payload, options={}) => {

  it('only accept www-form-urlencoded content type', async () => {
    const params = Object.assign({options:{
      headers:{"Content-Type": "application/json"}
    }}, options)
    
    let response = await request(method, path, payload, params)
    expect(response.statusCode).to.equal(400);
    
    response = await request(method, path, payload, options)
    expect(response.statusCode).to.equal(options.statusCode || 200);
  });
};

const respondsWithJSON = (it, request, method, path, payload) => {

  it('responds with json', async () => {

    const response = await request(method, path, payload);
    expect(response.headers['content-type']).to.include('application/json');
  });
};

const requiresRefreshTokenString = (it, request, method, path, payload, options) => {

  it('requires refresh token string', async () => {
     const withoutRefreshToken = clone(options)
     delete withoutRefreshToken.withRefreshToken
     console.log(withoutRefreshToken)
     let response = await request(method, path, payload, withoutRefreshToken);
     expect(response.statusCode).to.equal(400)

     response = await request(method, path, payload, options);
     expect(response.statusCode).to.equal(options.statusCode || 200)
  });
};

const requiresAuthentication = (it, request, method, path, payload, options) => {

  it('requires authentication', async () => {
     
    let response = await request(method, path, payload, options)
    expect(response.statusCode).to.equal(options.statusCode || 200)

    response = await request(method, path, payload);
    expect(response.statusCode).to.equal(401)
  });
};

const shared = require('../shared')
const userData = shared.users, createUser= shared.createUser

const clone = (object) => Object.assign({}, object);

const behavesLikeCreateUser = (it, request, method, path, payload) => {

  acceptsUrlEncodedContentType(it, request, method, path, payload);

  it('requires both email and password', () => {

    const responses = [];
    let response, without;

    ['email', 'password'].forEach(async (omit) => {

      without = delete clone(payload)[omit];
      response = await request(method, path, without);
      responses.push(response);
    });
    expect(responses[0]).to.equal(400);
    expect(responses[1]).to.equal(400);
  });
  it('password must match passwordSchema', async () => {

    const withBadPassword = Object.assign({}, payload, { password:userData.password_bad });
    let response = await request(method, path, withBadPassword);
    expect(response.statusCode).to.equal(400);
    const withGoodPassword = Object.assign({}, payload, { password:userData.password });
    response = await request(method, path, withGoodPassword);
    expect(response.statusCode).to.equal(200);
  });

  respondsWithJSON(it, request, method, path, payload);

  it('response matches createResponseSchema', async () => {

    const response = await request(method, path, payload);
    expect(response.statusCode).to.equal(200);
    const responseJSON = responsePayloadJSON(response);
    expect(Joi.validate(responseJSON, createResponseSchema)).to.equal(true);
  });
};

module.exports = {
  behavesLikeCreateUser,
  acceptsUrlEncodedContentType,
  requiresAuthentication,
  respondsWithJSON,
  requiresRefreshTokenString
};
