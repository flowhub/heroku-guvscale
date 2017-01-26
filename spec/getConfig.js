var chai = require('chai');
var nock = require('nock');
var cli = require('heroku-cli-util');
cli.raiseErrors = true;
var commands = require('../index').commands;

describe('guvscale:getconfig', function () {
  var cmd = commands.find(function (c) {
    if (c.topic === 'guvscale' && c.command === 'getconfig') {
      return true;
    }
    return false;
  });
  beforeEach(function () {
    cli.mockConsole();
  });
  describe('without enabled guvscale add-on', function () {
    it('it should fail', function () {
      var herokuApi = nock('https://api.heroku.com:443')
      .get('/apps/unconfiguredapp/config-vars')
      .reply(200, {});
      return cmd.run({
        app: 'unconfiguredapp'
      })
      .catch (function (err) {
        chai.expect(err.message).to.contain('guvscale is not configured');
        // Ensure we hit the mock
        return herokuApi.done()
      })
    });
  });
  describe('with enabled guvscale add-on', function () {
    var guvId = '9c54c74a-9513-4647-a7c4-27fc5d86ea47';
    it('it should succeed', function () {
      var herokuApi = nock('https://api.heroku.com:443')
      .get('/apps/configuredapp/config-vars')
      .reply(200, {
        GUVSCALE_ID: guvId,
        GUVSCALE_TOKEN: 'foo'
      });
      var guvApi = nock('https://api.guvscale.com:443')
      .get('/config/' + guvId)
      .reply(200, {
        configYaml: 'RETURNED YAML'
      });
      return cmd.run({
        app: 'configuredapp'
      })
      .then (function () {
        chai.expect(cli.stdout).to.contain('RETURNED YAML');
        return true;
      })
      .then (function () {
        // Ensure we hit the Heroku mock
        return herokuApi.done()
      })
      .then (function () {
        // Ensure we hit the Heroku mock
        return guvApi.done()
      })
    });
  });
});
