'use strict';

var assert = require('yeoman-assert');
var os = require('os');
var path = require('path');
var test = require('yeoman-test');

describe('gadget:app for Octane', function () {

  before(function (done) {
    var testDir = path.join(os.tmpdir(), './temp-test');
    console.log(testDir);
    test.run(path.join(__dirname, '../app'))
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
});
