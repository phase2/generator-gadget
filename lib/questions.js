'use strict';
/**
 * General-purpose questions that a parent-generator may want to leverage.
 */

function name() {
  return 'project-name';
}

function description() {
  return 'Drupal site to bring knowledge to the right people.';
}

module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the machine-name of your project?',
    default: name()
  },
  {
    type: 'input',
    name: 'description',
    message: 'One-line project description?',
    default: description()
  }
];
