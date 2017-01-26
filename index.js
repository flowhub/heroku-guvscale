'use strict'
exports.topic = {
  name: 'guvscale',
  description: 'Heroku CLI plugin for guvscale.com'
};

exports.commands = [
  require('./commands/configGet.js'),
  require('./commands/configSet.js')
];
