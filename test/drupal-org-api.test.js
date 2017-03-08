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
    it ('should return Major.X as a viable minor range.', function() {
      assert.equal('8.x', drupal.toMinorRange('8.x'), '8.x becomes 8.x');
    });
  });

  describe('toDrupalMajorVersion', function() {
    it ('should leave a properly formatted version alone.', function() {
      assert.equal('8.x', drupal.toDrupalMajorVersion('8.x'), 'A major version such as 8.x should be left alone.');
    });
    it ('should convert a semantic version to a Drupal major version.', function() {
      assert.equal('8.x', drupal.toDrupalMajorVersion('8.2.6'), '8.2.6 should be converted to 8.x');
    });
    it ('should ignore the presence of a pre-release suffix.', function() {
      assert.equal('8.x', drupal.toDrupalMajorVersion('8.3.0-beta2'), '8.3.0-beta2 should be converted to 8.x');
    });
    it ('should convert a semver patch level range to Drupal major version..', function() {
      assert.equal('8.x', drupal.toDrupalMajorVersion('8.2.x'), '8.2.x should be converted to 8.x');
    });
  });


});
