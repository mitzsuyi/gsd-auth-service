'use strict';

const Querystring = require('querystring');
const Joi = require('joi');

const UserData = require('./shared');

const responsePayloadJSON = (response) => JSON.parse(response.payload);
const { dbClearUsers } = require('./db');

const clearUsers = function (server) {

  return dbClearUsers(server);
};

const setServer = async (params, state) => {

  if (state.getServer() === undefined) {
    const server = await require('./server');
    state.setServer(server);
  }
};

const setTokens = async (params, server, state) => {

  await clearUsers(server);
  const response = await state.doRequest('POST', '/users', UserData.createUser, { skipTokens:true });
  state.setTokens(responsePayloadJSON(response) );
};


const URLENCODED_HEADER = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

exports.URLENCODED_HEADER = URLENCODED_HEADER;

const inject = async function (_request, params, state) {

  const request = Object.assign({}, _request);
  await setServer(params, state);
  const server = state.getServer();
  let tokens = state.getTokens();
  if (params.authenticated && !params.skipTokens){
    if (!tokens || params.refreshTokens) {
      await setTokens(params, server, state);
      tokens = state.getTokens();
    }
  }

  if (params.authenticated) {
    const headers = Object.assign({}, request.headers || {});
    Object.assign(headers, {
      'x-access-token': tokens.jwt
    }
    );
    request.headers = headers;
  }

  if (params.withRefreshToken) {
    Object.assign(request.payload, { refresh_token: tokens.refresh_token });
  }

  if (request.headers && request.headers['Content-Type'] === URLENCODED_HEADER.headers['Content-Type']) {
    request.payload = Querystring.stringify(request.payload);
  }

  if (params.clearUsers){
    await clearUsers(server);
  }

  return server.inject(request);
};

const DELETE_POST = ['POST','DELETE'];
const routeRequest = function () {

  const state = {
    _server: undefined,
    _tokens: undefined,
    getServer: function (){

      return state._server;
    },
    getTokens:function (){

      return state._tokens;
    },
    setServer: (server) => {

      state._server = server;
    },
    setTokens: (tokens) => {

      state._tokens = tokens;
    }
  };

  const doRequest = function (method, path, payload, params = {}) {

    const options = { payload: Object.assign({}, payload) };
    if (!options.payload) {
      delete options.payload;
    }

    Object.assign(options, params.options || {});
    if (DELETE_POST.includes(method) && !(params.options && params.options.headers)) {
      Object.assign(options, URLENCODED_HEADER);
    }

    const request = Object.assign({},
      {
        method,
        url: path
      },
      options
    );
    state.doRequest = doRequest;

    return inject(request, params, state);
  };

  return doRequest;
};

exports.validateSchema = function (object, schema, expect) {

  const result =  Joi.validate(object, schema);
  expect(result.error).to.equal(null);
};

exports.routeRequest = routeRequest;

exports.responsePayloadJSON = responsePayloadJSON;
