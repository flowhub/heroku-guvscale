'use strict'
var Promise = require('bluebird');

exports.getToken = function (app, heroku) {
  return heroku
  .get('/apps/' + app + '/config-vars')
  .then(function (vars) {
    if (!vars['GUVSCALE_ID'] || !vars['GUVSCALE_TOKEN']) {
      return Promise.reject(new Error('guvscale is not configured for this app'));
    }
    return Promise.resolve({
      id: vars['GUVSCALE_ID'],
      token: vars['GUVSCALE_TOKEN']
    });
  });
};
