'use strict';
/**
 * General-purpose questions that a parent-generator may want to leverage.
 */

var chalk = require('chalk');
var _ = require('lodash');

var distros = require('./distros');
var labelMaker = require('./util').labelMaker;

var prompts = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Machine-name of your project?',
    // Name of the parent directory.
    default: _.last(process.cwd().split('/')),
    validate: function (input) {
      if (input.search(' ') !== -1) return 'No spaces allowed.';
      if (/[A-Z]/.test(input)) return 'Lower-case characters only.';
      return true;
    }
  },
  {
    type: 'input',
    name: 'projectDescription',
    message: 'One-line project description?',
    validate: function(input) {
      if (input.search('"') !== -1) return 'No quotes allowed.';
      return true;
    },
    default: function(answers) {
      return labelMaker(answers['projectName']) + ' Drupal codebase.';
    }
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
