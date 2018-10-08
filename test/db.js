'use strict';

const mongoDb = (server) => server.mongo.db;
exports.dbClearUsers = (server) => {

  return mongoDb(server).collection('User').deleteMany();
};
