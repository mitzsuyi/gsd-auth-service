'use strict';

const Hapi = require('hapi');

const Auth = require('./lib/auth');
const Db = require('./lib/db');
const User = require('./lib/user');

const { HOST, PORT } = require('./environment');

const start = async function () {

  const server = new Hapi.Server({
    host: HOST,
    port: PORT,
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['x-access-token']
      }
    }
  });

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

  await server.start();

  console.log(`Server running at: ${server.info.uri}`);

};

start();
