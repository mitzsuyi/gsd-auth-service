'use strict';

const querystring = require('querystring');
const Joi = require('joi');

let TOKENS 

let _server;

const userData = require('./shared');
const responsePayloadJSON = (response) => JSON.parse(response.payload);

const getServer = async (setServer) => {

  if (_server === undefined) {
    _server = await require('./server');
    await _server.mongo.db.collection('User').deleteMany();
   const response = await routeRequest(setServer)("POST", "/users", userData.createUser)
   TOKENS = responsePayloadJSON(response)
   setServer(_server);
  }

  return _server;
};


const URLENCODED_HEADER = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

exports.URLENCODED_HEADER = URLENCODED_HEADER

const inject = async (request, setServer, params) => {

  const server = await getServer(setServer);
  if (params.authenticated) {
     let headers = request.headers || {}
      Object.assign(headers, {
          'x-access-token': TOKENS.jwt
        }
      )
      request.headers = headers
    }
   if (params.withRefreshToken) {
     Object.assign(request.payload, {refresh_token: TOKENS.refresh_token})
    }

  if (request.headers && request.headers == URLENCODED_HEADER.headers) {  
      request.payload = querystring.stringify(request.payload)
   }
  return server.inject(request);
};

const DELETE_POST=["POST","DELETE"]
const routeRequest = (setServer) => {

  return async (method, path, payload, params={}) => {

    const options = { payload };
    if (!options.payload) {
      delete options.payload;
    }

    Object.assign(options, params.options) 

    if (DELETE_POST.includes(method) && !(params.options && params.options.headers)) {
      Object.assign(options, URLENCODED_HEADER)
    } 

    const request = Object.assign({},
      {
        method,
        url: path
      },
      options
    );

    return inject(request, setServer, params);
  };
};

exports.validateSchema= async (object, schema, expect)=>{
  const result =  Joi.validate(object, schema) 
  expect(result.error).to.equal(null)
} 
exports.routeRequest = routeRequest;

exports.responsePayloadJSON = responsePayloadJSON
