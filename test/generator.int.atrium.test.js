'use strict';

var assert = require('yeoman-assert');
var os = require('os');
var path = require('path');
var test = require('yeoman-test');

describe('gadget:app for Atrium', function() {

  before(function (done) {
    var testDir = path.join(os.tmpdir(), './temp-test-atrium');
    console.log(testDir);
    test.run(path.join(__dirname, '../generators/app'))
      .inDir(testDir)
      .withOptions({
        'skip-install': true,
        projectName: 'oa',
        projectDescription: 'test atrium project',
        drupalDistro: 'openatrium',
        drupalDistroVersion: '7.x'
      })
      .on('end', done);
  });

  it('creates files', function() {
    assert.file([
      'README.md',
      // Distribution-specific makefile.
      'src/project.make.yml',
      // gtd scaffolding dotfiles are copying.
      'src/modules/.gitkeep',
      // General-purpose behat.yml is not overridden.
      'test/behat.yml',
    ]);
  });
});
