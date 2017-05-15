# Gadget: A Generator for New Drupal Projects

[![Greenkeeper badge](https://badges.greenkeeper.io/phase2/generator-gadget.svg)](https://greenkeeper.io/)

> [Yeoman](http://yeoman.io) generator to scaffold a [Drupal](https://www.drupal.org) project for use with [grunt-drupal-tasks](https://github.com/phase2/grunt-drupal-tasks).

[![Travis CI status](https://travis-ci.org/phase2/generator-gadget.png?branch=master)](https://travis-ci.org/phase2/generator-gadget)
[![Dependency Status](https://david-dm.org/phase2/generator-gadget.svg)](https://david-dm.org/phase2/generator-gadget)
[![npm version](https://badge.fury.io/js/generator-gadget.svg)](https://www.npmjs.com/package/generator-gadget)

## Features

Gadget will set up a Drupal project with the site skeleton and tools to build your project and configure your build
system with the Grunt Drupal Tasks kit.

* Automatically uses the latest version of Grunt Drupal Tasks.
* Select from Drupal 7, Drupal 8, Atrium 2, or Octane. The latest published release of the selected option will be used.
* For Drupal 8, creates a `composer.json` file that requires the latest stable Drupal, Drupal Console, and Drush.
* For Drupal 7, creates a Drush Makefile so your grunt build process is ready to assemble a working codebase immediately!
* Provides numerous configuration files for Git, IDE's, and other tools for Drupal best practices out-of-the-box.
* The entire Grunt Drupal Tasks features list is ready to go, including Behat Testing, Static Analysis, and Continuous-Integration readiness.

## Requirements

* Install _Node.js v4 or better_ either using a
[package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
like apt-get, brew, or yum or a [standalone installer](http://nodejs.org/download/)

* Once _Node.js_ is installed, use _npm_ to install the generator. If you have
not used a Yeoman generator before install the [`yo`](https://www.npmjs.com/package/yo) package as well.
[Grunt Drupal Tasks](https://github.com/phase2/grunt-drupal-tasks) requires the [grunt task runner](https://www.npmjs.com/package/grunt-cli) as well.

```
npm install -g generator-gadget grunt-cli yo
```

Grunt Drupal Tasks leverages a number of additional tools from outside the Node ecosystem, such as [PHP](http://php.net) and
[Composer](https://getcomposer.org/download/). See Grunt-Drupal-Tasks for details.

## Usage

To set up a new Drupal project with Grunt Drupal Tasks using Gadget, run the following in a new directory:

```
yo gadget
```

## Options

* `--offline`: Will make a best effort to complete generator run, though some generated values
  may be non-applicable, such as Drupal Core version of "0".
* `--use-master`: Will make a point of leveraging the master version of Grunt Drupal Tasks.
* `--skip-install`: Will skip running `npm install` at the end of the generation process.
* `--skip-readme`: Will not generate a README.md. (Useful when you've already hand-crafted the perfect project introduction!)
* `--skipWelcome`: Skip opening welcome message.
* `--skipGoodbye`: Skip closing messages.

## Additional Resources

* For information on using Grunt Drupal Tasks after installing with Gadget, see the [Grunt Drupal Tasks documentation](https://phase2.github.io/grunt-drupal-tasks).
* Interested in the Frontend? Check out our sibling project, [Generator Patter Lab Starter](https://github.com/phase2/generator-pattern-lab-starter) to get a theme ready to go with options for Pattern Lab, icon fonts, SASS, visual regression testing, and more.
