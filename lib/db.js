'use strict';

const Mongodb = require('hapi-mongodb');

const { MONGODB_URI } = require('../environment');

const internals = {};

exports.register = async function (server) {

  const dbOpts = {
    url: `${MONGODB_URI}`,
    decorate: true
  };

  // Register db

  await server.register({
    plugin: Mongodb,
    options: dbOpts
  });

  // Add indexes

  const db = server.mongo.db;

  await db.collection('User').createIndex(
    { email: 1 }, { sparse: true, unique: true }
  );

  await db.collection('Token').createIndex(
    { userId: 1 }, { sparse: true, unique: true }
  );

  return server;
};
