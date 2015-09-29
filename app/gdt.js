'use strict';

var jf = require('jsonfile');
var chalk = require('chalk');

module.exports = function(yo) {
  var module = {};

  module.install = function() {
   var done = yo.async(),
      self = yo,
      spid;

    if (yo.options['skip-install']) {
      return done();
    }

    yo.log('\nInstalling latest version of Grunt Drupal Tasks...');
    yo.npmVersion = yo.options['use-master'] ? 'git+https://github.com/phase2/grunt-drupal-tasks.git#master' : 'grunt-drupal-tasks';
    spid = yo.spawnCommand('npm', ['install', yo.npmVersion]);
    spid.on('close', function (code) {
      if (code) {
        self.log.error('\nAn error occurred while fetching Grunt Drupal Tasks.\n');
        process.exit(1);
      }

      jf.readFile('./node_modules/grunt-drupal-tasks/package.json', function(err, obj) {
        if (err || !obj || !obj.version) {
          self.log.error('\nAn error occurred while installing Grunt Drupal Tasks.\n');
          process.exit(1);
        }

        self.log('\nInstalled version ' + chalk.red(obj.version) + ' of Grunt Drupal Tasks.\n');
        done();
      });
    });
  }

  return module;
}
