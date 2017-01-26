'use strict'
var cli = require('heroku-cli-util');
var guvHeroku = require('../lib/heroku');
var guvScale = require('../lib/guvscale');
var Promise = require('bluebird');
var fs = require('fs');

module.exports = {
  topic: 'guvscale',
  command: 'getconfig',
  description: 'gets latest guvscale config and saves it into a file',
  help: 'heroku guvscale:getconfig filename.yml',
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
    return guvHeroku.getToken(context.app, heroku)
    .then(function (appConfig) {
      return guvScale.getLatestConfig(appConfig.id, appConfig.token);
    })
    .then(function (config) {
      if (!context.flags.file) {
        // No file provided, just write to STDOUT
        console.log(config.configYaml);
        return;
      }
      var writeFile = Promise.promisify(fs.writeFile);
      return writeFile(context.flags.file, config.configYaml, {
        encoding: 'utf8'
      });
    });
  })
};
