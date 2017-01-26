'use strict'
var Promise = require('bluebird');
var request = require('request-promise');
var packageInfo = require('../package.json');

exports.getLatestConfig = function (appId, token) {
  var options = {
    method: 'GET',
    uri: 'https://api.guvscale.com/config/' + appId,
    headers: {
      'User-Agent': packageInfo.name + '/' + packageInfo.version,
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
  return request(options);
};

exports.setConfig = function (appId, token, configYaml) {
  var options = {
    method: 'POST',
    uri: 'https://api.guvscale.com/config/' + appId,
    headers: {
      'User-Agent': packageInfo.name + '/' + packageInfo.version,
      'Authorization': 'Bearer ' + token
    },
    body: {
      config: configYaml
    },
    json: true
  };
  return request(options);
};
