'use strict';

const { server, configureServer } = require('../index');

module.exports = (async () => {

  await configureServer(server);
  return server;
})();
