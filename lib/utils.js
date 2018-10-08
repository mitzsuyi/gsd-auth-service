'use strict';

const Bcrypt = require('bcryptjs');

// Helper to use async without try/catch
// Based on http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
exports.to = function (promise) {

  return promise
    .then((result) => [null, result])
    .catch((err) => [err]);
};

exports.normalizeString = function (inputString) {

  return String(inputString).trim().toLowerCase();
};

exports.average = function (arr) {

  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

exports.renameKey = function (obj, originalKey, newKey) {

  const newObj = Object.assign({}, obj, { [newKey]: obj[originalKey] });
  delete newObj[originalKey];
  return newObj;
};

exports.encryptData = function (plainTextData) {

  const saltRounds = 10;

  return Bcrypt.hash(plainTextData, saltRounds);
};

exports.compareData = function (plainTextData, encryptedData) {

  return Bcrypt.compare(plainTextData, encryptedData);
};
