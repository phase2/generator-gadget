'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('gadget:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({
        'skip-install': true,
        projectName: 'drupal8',
        projectDescription: 'test drupal8 project',
        drupalDistro: 'drupal',
        drupalDistroVersion: '8.x'
      })
      .on('end', done);
  });

  it('creates files for Drupal 8.x', function () {
    assert.file([
      // Distribution-specific makefile.
      'src/project.make',
      // gtd scaffolding dotfiles are copying.
      'src/modules/.gitkeep',
      // General-purpose behat.yml is not overridden.
      'test/behat.yml',
      // Behat example tests are present.
      'test/features/example.feature'
    ]);
  });
});
