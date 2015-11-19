'use strict';
/**
 * General-purpose questions that a parent-generator may want to leverage.
 */

var chalk = require('chalk');
var _ = require('lodash');

var distros = require('../app/distros');
var prompts = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Machine-name of your project?',
    // Name of the parent directory.
    default: _.last(process.cwd().split('/')),
    validate: function (input) {
      return (input.search(' ') === -1) ? true : 'No spaces allowed.';
    }
  },
  {
    type: 'input',
    name: 'projectDescription',
    message: 'One-line project description?'
  },

  {
    type: 'list',
    name: 'drupalDistro',
    message: 'Which ' + chalk.red('Drupal distribution') + ' would you like to use?',
    default: 'drupal',
    filter: function(answer) {
      return distros[answer];
    },
    choices: function(answers) {
      var opts = [];
      for (var i in distros) {
        opts.push(distros[i].option);
      }

      return opts;
    }
  },
  {
    type: 'list',
    name: 'drupalDistroVersion',
    message: function(answers) {
      return 'Which version of '
        + chalk.red(answers['drupalDistro'].option.name)
        + ' would you like to use?';
    },
    default: function(answers) {
      return answers['drupalDistro'].versionDefault;
    },
    choices: function(answers) {
      return answers['drupalDistro'].versions;
    }
  }
];

module.exports = prompts;
