'use strict';

/**
 * Retrieve Drupal project release data.
 *
 * @todo extract to a library.
 * @todo switch to promises.
 */

var request = require('request');
var xml2js = require('xml2js');
var _ = require('lodash');

function init() {
  var module = {};

  /**
   * Project Release Data Cache
   *
   * Cache the data associated with any given major version of a project for the
   * extent of a single generator run. We cache it already parsed to an object.
   */
  var cache = {};

  function loadReleaseData(project, majorVersion, done, cb) {
    var cid = project + majorVersion;
    if (cache[cid]) {
      return cb(null, cache[cid], done);
    }

    var releaseUri = 'https://updates.drupal.org/release-history/';
    request(releaseUri + project + '/' + majorVersion, function(error, response, body) {
      if (!error && response.statusCode == 200 && body.length) {
        xml2js.parseString(body, function (err, result) {
          if (!err && result && result.project) {
            cache[cid] = result.project;
            return cb(null, result.project, done);
          }
          else {
            return cb('Could not parse latest version of ' + project + '. Received:\n', result, done);
          }
        });
      }
      else {
        var msg = 'Could not retrieve latest version of ' + project + ' for Drush makefile.\n';
        if (error.code == 'ETIMEDOUT') {
          msg += 'Failure was caused by a network timeout. If testing Gadget, try running with --offline.\n';
        }
        return cb(msg, null, done);
      }
    });
  }

  function latestRelease(project, majorVersion, done, cb) {
    loadReleaseData(project, majorVersion, done, function(err, result, done) {
      if (!err && result.releases
        && result.releases[0]
        && result.releases[0].release
        && result.releases[0].release[0]
        && result.releases[0].release[0].version
      ) {
        return cb(null, result.releases[0].release[0].version[0], done);
      }
      else {
        err = 'No version data found.';
      }
      if (err) {
        return cb(err, null, done);
      }
    });
  }

  function latestReleaseStable(project, majorVersion, done, cb) {
    loadReleaseData(project, majorVersion, done, function(err, result, done) {
      if (!err && result.releases
        && result.releases[0]
        && result.releases[0].release
      ) {
        var release = _.find(result.releases[0].release, function(release) {
          return !release.version_extra;
        })
        return cb(null, release.version[0], done);
      }
      else {
        err = 'No version data found.';
      }

      if (err) {
        return cb(err, null, done);
      }
    });
  }

  // Generate the numeric core version from a more typical Drupal version number.
  function numericCoreVersion(version) {
    return version.slice(0, version.indexOf('.'));
  }

  // Convert a semver version from '8.2.6' to a minor range '^8.2'.
  function toMinorRange(version) {
    var regex = /^(\d+\.\d+)\.\d+/;
    var range = version.match(regex);
    return '^' + range[1];
  }

  /**
   * Determine if we have successfully cached the release data.
   */
  function isCached(project, majorVersion) {
    var cid = project+majorVersion;
    return cache[cid] && cache[cid].short_name[0] == project && cache[cid].api_version[0] == majorVersion;
  }

  module.latestRelease = latestRelease;
  module.latestReleaseStable = latestReleaseStable;
  module.numericCoreVersion = numericCoreVersion;
  module.toMinorRange = toMinorRange;
  // This function facilitates testing & troubleshooting.
  module.isCached = isCached;


  return module;
}

module.exports = init();
