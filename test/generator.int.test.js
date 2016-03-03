'use strict';

var assert = require('yeoman-assert');
var os = require('os');
var path = require('path');
var test = require('yeoman-test');

describe('gadget:app', function () {
  before(function (done) {
    test.run(path.join(__dirname, '../app'))
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

  it('creates files for Drupal 8.x', function() {
    assert.file([
      'README.md',
      // Distribution-specific makefile.
      'src/project.make.yml',
      // gtd scaffolding dotfiles are copying.
      'src/modules/.gitkeep',
      // General-purpose behat.yml is not overridden.
      'test/behat.yml',
      // Behat example tests are present.
      'test/features/example.feature'
    ]);
  });
});
