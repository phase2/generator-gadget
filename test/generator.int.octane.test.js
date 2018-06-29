'use strict';

var assert = require('yeoman-assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var test = require('yeoman-test');
var _ = require('lodash');

describe('gadget:app for Octane', function() {

  describe('minimal', function() {
    before(function (done) {
      var testDir = path.join(os.tmpdir(), './temp-test-octane');
      console.log(testDir);
      test.run(path.join(__dirname, '../generators/app'))
        .inDir(testDir)
        .withOptions({
          'skip-install': true,
          projectName: 'octane',
          projectDescription: 'test octane project',
          drupalDistro: 'octane',
          drupalDistroVersion: '8.x'
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'README.md',
        // Distribution-specific makefile.
        'composer.json',
        // gtd scaffolding dotfiles are copying.
        'src/modules/.gitkeep',
        // General-purpose behat.yml is not overridden.
        'test/behat.yml',
      ]);
    });

    describe('composer.json', function() {
      it('has a valid composer.json', function() {
        assert.jsonFileContent('composer.json', {
          'name': 'organization/octane',
        });
      });

      it('does not specify a core version', function() {
        var json = JSON.parse(fs.readFileSync('composer.json', 'utf8'));
        assert.ok(!json.require['drupal/core']);
      });

      it('does include merged dependencies from the Octane composer.json', function() {
        var json = JSON.parse(fs.readFileSync('composer.json', 'utf8'));
        assert.ok(json.require['acquia/lightning']);
        assert.ok(json['require-dev']['se/selenium-server-standalone']);
      });
    });
  });

  describe('w/ profile', function () {
    before(function (done) {
      var testDir = path.join(os.tmpdir(), './temp-test-octane');
      console.log(testDir);
      test.run(path.join(__dirname, '../generators/app'))
        .inDir(testDir)
        .withOptions({
          'skip-install': true,
          projectName: 'octane',
          projectDescription: 'test octane project',
          drupalDistro: 'octane',
          drupalDistroVersion: '8.x',
          doGenerateProfile: true,
          projectProfile: 'genr8'
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'src/profiles/genr8/genr8.info.yml',
        'src/profiles/genr8/genr8.profile'
      ]);
    });
  });

});
