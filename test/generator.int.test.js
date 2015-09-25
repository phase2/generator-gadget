'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('gadget:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({'skip-install': true})
      .withPrompt({
        drupalDistro: 'drupal',
        'drupalDistroVersion-drupal': '8.0.x'
      })
      .on('end', done);
  });

  it('creates files for Drupal 8.x', function () {
    assert.file([
      'src/project.make',
      'test/features/example.feature'
    ]);
  });
});
