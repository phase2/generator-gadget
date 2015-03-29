# Gadget
## The Yeoman Generator for Drupal and Grunt Drupal Tasks

Code Status:
[![Travis CI status](https://travis-ci.org/phase2/generator-gadget.png?branch=master)](https://travis-ci.org/phase2/generator-gadget)
[![Dependency Status](https://david-dm.org/phase2/generator-gadget.svg)](https://david-dm.org/phase2/generator-gadget)
[![npm version](https://badge.fury.io/js/generator-gadget.svg)](https://www.npmjs.com/package/generator-gadget)

## Requirements

* Install _Node.js v0.10.0 or better_ either using a
<a href="https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager">package manager</a>
like apt-get, brew, or yum or a
<a href="http://nodejs.org/download/">standalone installer</a>.

* Once _Node.js_ is installed, use _npm_ to install this,
<a href="https://www.npmjs.com/package/generator-gadget">generator-gadget</a>,
with <a href="https://www.npmjs.com/package/yo">yo</a>, the Yeoman command line
tool and <a href="https://www.npmjs.com/package/grunt-cli">grunt-cli</a>, the
Grunt command line tool, by running:

```
npm install -g generator-gadget grunt-cli yo
```

* Drupal and some of the development tools bundled with Grunt Drupal Tasks have
additional requirements, including <a href="http://php.net">PHP</a>,
<a href="http://bundler.io/">Bundler</a>,
<a href="https://getcomposer.org/download/">Composer</a>, Ruby, and RubyGems.

## Usage

To set up a new Drupal project with Grunt Drupal Tasks using Gadget, run:

```
yo gadget
```

## Features

Gadget will set up a Drupal site project with the site skeleton and tools
provided by Grunt Drupal Tasks, including:

- Installs the latest published version of Grunt Drupal Tasks. (To install the
pre-release version of Grunt Drupal Tasks, run `yo gadget --use-master`.)

- Allows the user to choose between a Drupal 7 or 8 project.

- Configures the Drush makefile with the latest core release version.

## Additional Resources

- For information on using Grunt Drupal Tasks after installing with Gadget, see
the Grunt Drupal Tasks
<a href="https://github.com/phase2/grunt-drupal-tasks/blob/master/README.md">README.md</a>.
