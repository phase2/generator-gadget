'use strict';

var assert = require('yeoman-assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var test = require('yeoman-test');
var _ = require('lodash');

describe('gadget:app for Drupal 8', function () {
  describe('online', function () {
    before(function (done) {
      var testDir = path.join(os.tmpdir(), './temp-test-standard');
      console.log(testDir);
      test.run(path.join(__dirname, '../generators/app'))
        .inDir(testDir)
        .withOptions({
          'skip-install': true,
          projectName: 'drupal8',
          projectDescription: 'test drupal8 project',
          drupalDistro: 'drupal',
          drupalDistroVersion: '8.x',
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'README.md',
        'composer.json',
        // gtd scaffolding dotfiles are copying.
        'src/modules/.gitkeep',
        // General-purpose behat.yml is not overridden.
        'test/behat.yml',
        // Behat example tests are present.
        'test/features/example.feature',
      ]);
    });

    describe('composer.json', function() {
      it('has a valid composer.json', function() {
        assert.jsonFileContent('composer.json', {
          'name': 'drupal8',
        });
      });

      it('specifies a real drupal/core version', function() {
        var json = JSON.parse(fs.readFileSync('composer.json', 'utf8'));
        assert.ok(json.require['drupal/core'] && _.isString(json.require['drupal/core']));
      });
    });
  });

  describe('offline', function () {
    before(function (done) {
      var testDir = path.join(os.tmpdir(), './temp-test-standard');
      console.log(testDir);
      test.run(path.join(__dirname, '../generators/app'))
        .inDir(testDir)
        .withOptions({
          'skip-install': true,
          projectName: 'drupal8',
          projectDescription: 'test drupal8 project',
          drupalDistro: 'drupal',
          drupalDistroVersion: '8.x',
          offline: true
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'README.md',
        'composer.json',
        // gtd scaffolding dotfiles are copying.
        'src/modules/.gitkeep',
        // General-purpose behat.yml is not overridden.
        'test/behat.yml',
        // Behat example tests are present.
        'test/features/example.feature',
      ]);
    });

    describe('composer.json', function() {
      it('has a valid composer.json', function() {
        assert.jsonFileContent('composer.json', {
          'name': 'drupal8',
        });
      });

      it('specifies a real drupal/core version', function() {
        var json = JSON.parse(fs.readFileSync('composer.json', 'utf8'));
        assert.ok(json.require['drupal/core'] && _.isString(json.require['drupal/core']));
      });
    });

  });

});
