var request = require('request');
var xml2js = require('xml2js');

function init() {
  var module = {};

  function latestRelease(project, majorVersion, done, cb) {
    var releaseUri = 'https://updates.drupal.org/release-history/';
    request(releaseUri + project + '/' + majorVersion, function (error, response, body) {
      if (!error && response.statusCode == 200 && body.length) {
        xml2js.parseString(body, function (err, result) {
          if (!err && result && result.project && result.project.releases && result.project.releases[0] && result.project.releases[0].release && result.project.releases[0].release[0] && result.project.releases[0].release[0].version) {
            cb(null, result.project.releases[0].release[0].version[0], done);
          }
          else {
            cb('Could not parse latest version of ' + project + ' for Drush makefile. Received:\n', result, done);
          }
        });
      }
      else {
        cb('Could not retrieve latest version of ' + project + ' for Drush makefile.\n', done);
      }
    });
  }

  module.latestRelease = latestRelease;

  return module;
}

module.exports = init();
