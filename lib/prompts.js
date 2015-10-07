'use strict';
/**
 * General-purpose questions that a parent-generator may want to leverage.
 */

var chalk = require('chalk');
var _ = require('lodash');

var distros = require('../app/distros');
var prompts = [];

prompts.push(
  {
    type: 'input',
    name: 'projectName',
    message: 'Machine-name of your project?',
    // Name of the parent directory.
    default: _.last(process.cwd().split('/')),
    validate: function (input) {
      return (input.search(' ') === -1) ? true : 'No spaces allowed.';
    }
  }
);

prompts.push(
  {
    type: 'input',
    name: 'projectDescription',
    message: 'One-line project description?',
    default: 'A one-line description to provide context to the name.'
  }
);

var chooseDistro = {
  type: 'list',
  name: 'drupalDistro',
  message: 'Which ' + chalk.red('Drupal distribution') + ' would you like to use?',
  default: 'drupal',
  choices: []
};

for (var i in distros) {
  chooseDistro.choices.push(distros[i].option);
}

prompts.push(chooseDistro);

for (var i in distros) {
  var version = {
    type: 'list',
    name: 'drupalDistroVersion-' + distros[i].id,
    message: 'Which version of ' + chalk.red(distros[i].option.name) + ' would you like to use?',
    default: distros[i].versionDefault,
    choices: distros[i].versions,
    when: distros[i].whenCallback
  };
  prompts.push(version);
}

module.exports = prompts;
