'use strict';

const Hapi = require('hapi');

const Auth = require('./lib/auth');
const Db = require('./lib/db');
const User = require('./lib/user');

const { HOST, PORT } = require('./environment');

const _server = new Hapi.Server({
  host: HOST,
  port: PORT,
  routes: {
    cors: {
      origin: ['*'],
      additionalHeaders: ['x-access-token']
    }
  }
});

const configureServer = async function (server) {

  // Register modules

  await Auth.register(server);
  await Db.register(server);
  await User.register(server);

  // Routes

  server.route({ path: '/users', method: 'POST', config: User.create });
  server.route({ path: '/me', method: 'GET', config: User.me });
  server.route({ path: '/access-tokens', method: 'POST', config: Auth.login });
  server.route({ path: '/access-tokens/refresh', method: 'POST', config: Auth.refreshToken });
  server.route({ path: '/access-tokens', method: 'DELETE', config: Auth.logout });
};

const start = async function (server) {

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

void async function () {

  if (!module.parent) {
    await configureServer(_server);
    await start(_server);
  }
}();

module.exports = {
  server: _server,
  configureServer
};
