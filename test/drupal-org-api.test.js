var _ = require('lodash');
var assert = require('yeoman-assert');
var drupal = require('../generators/lib/drupalProjectVersion');

describe('Drupal.org API Client', function() {
  describe('latestRelease', function() {
    it ('should retrieve the latest Drupal 8 core release', function(done) {
      drupal.latestRelease('drupal', '8.x', done, function(err, result, done) {
        assert.ok(!err && result, 'Retrieved a result for Drupal 8 release.');
        if (err) {
          console.error(err);
        }
        done();
      });
    })

    it ('should retrieve the latest Drupal 7 core release', function(done) {
      drupal.latestRelease('drupal', '7.x', done, function(err, result, done) {
        assert.ok(!err && result, 'Retrieved a result for Drupal 7 release.');
        if (err) {
          console.error(err);
        }
        done();
      });
    });
  });

  describe('latestReleaseStable', function() {
    it ('should retrieve the latest Drupal 8 core release', function(done) {
      drupal.latestReleaseStable('drupal', '8.x', done, function(err, result, done) {
        assert.ok(!err && result, 'Retrieved a result for Drupal 8 release.');
        if (err) {
          console.error(err);
        }
        done();
      });
    })

    it ('should retrieve the latest Drupal 7 core release', function(done) {
      drupal.latestReleaseStable('drupal', '7.x', done, function(err, result, done) {
        assert.ok(!err && result, 'Retrieved a result for Drupal 7 release.');
        if (err) {
          console.error(err);
        }
        done();
      });
    });
  });

  describe('isCached', function() {
    it ('should retrieve follow-up requests from the cache.', function() {
      assert.ok(drupal.isCached('drupal', '8.x'), 'Previously retrieved drupal 8.x data.');
    });
  });

  describe('numericCoreVersion', function() {
    it ('should convert a version number to the core version digits', function() {
      assert.equal(8, drupal.numericCoreVersion('8.2.6'), '8.2.6 returns 8');
    });
    it ('should convert a major version to the core version digits', function() {
      assert.equal(8, drupal.numericCoreVersion('8.x'), '8.x returns 8');
    });
  });

  describe('toMinorRange', function() {
    it ('should convert a version number to a minor range', function() {
      assert.equal('^8.2', drupal.toMinorRange('8.2.6'), '8.2.6 becomes ^8.2');
    });
  });

});
