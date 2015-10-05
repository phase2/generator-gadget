'use strict';
/**
 * General-purpose questions that a parent-generator may want to leverage.
 */

var _ = require('lodash');

function name() {
  return 'project-name';
}

function description() {
  return 'Drupal site to bring knowledge to the right people.';
}

function init(options) {
  var questions = [];
  if (_.isUndefined(options.projectName)) {
    questions.push(
      {
        type: 'input',
        name: 'projectName',
        message: 'Machine-name of your project?',
        default: name()
      }
    );
  }
  if (_.isUndefined(options.projectDescription)) {
    questions.push(
      {
        type: 'input',
        name: 'projectDescription',
        message: 'One-line project description?',
        default: description()
      }
    );
  }

  return questions;
}

exports.init = init;
