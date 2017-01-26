'use strict'
var cli = require('heroku-cli-util');
var guvHeroku = require('../lib/heroku');
var guvScale = require('../lib/guvscale');
var Promise = require('bluebird');
var fs = require('fs');

module.exports = {
  topic: 'guvscale',
  command: 'setconfig',
  description: 'updates guvscale config based on a YAML file',
  help: 'heroku guvscale:setconfig --file filename.yml',
  needsAuth: true,
  needsApp: true,
  flags: [
    {
      name: 'file',
      char: 'f',
      description: 'File to write the config to',
      hasValue: true
    }
  ],
  run: cli.command(function (context, heroku) {
    if (!context.flags || !context.flags.file) {
      cli.error('No filename provided');
      return Promise.reject();
    }
    var readFile = Promise.promisify(fs.readFile);
    return readFile(context.flags.file, {
      encoding: 'utf-8'
    })
    .then(function (configYaml) {
      return guvHeroku.getToken(context.app, heroku)
      .then(function (appConfig) {
        return guvScale.setConfig(appConfig.id, appConfig.token, configYaml);
      })
    })
    .then(function () {
      cli.log("GuvScale configuration updated from " + context.flags.file);
      return Promise.resolve();
    });
  })
};
