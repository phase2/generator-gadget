# Gadget
## The Yeoman Generator for Drupal and Grunt Drupal Tasks

Code Status (master branch): [![Travis CI status](https://travis-ci.org/phase2/generator-gadget.png?branch=master)](https://travis-ci.org/phase2/generator-gadget)
[![Dependency Status](https://david-dm.org/phase2/generator-gadget.svg)](https://david-dm.org/phase2/generator-gadget)
[![npm version](https://badge.fury.io/js/generator-gadget.svg)](https://www.npmjs.com/package/generator-gadget)

## Requirements

* Install _Node.js v0.10.0 or better_ either using a
<a href="https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager">package manager</a>
like apt-get, brew, or yum or a
<a href="http://nodejs.org/download/">standalone installer</a>.

* Once _Node.js_ is installed, use _npm_ to install
<a href="https://www.npmjs.com/package/grunt-cli">grunt-cli</a>, the Grunt
command line tool, and <a href="https://www.npmjs.com/package/yo">yo</a>, the
Yeoman command line tool, by running:

```
npm install -g grunt-cli yo
```

* Some optional features, used in the included example and end-to-end test
suite, require additional tools, including <a href="http://bundler.io/">Bundler</a>,
<a href="https://getcomposer.org/download/">Composer</a>, Ruby, and RubyGems.

## Usage

To set up a new Drupal project to develop with Grunt Drupal Tasks, run:

```
yo gadget
```

Yeoman will ask whether you intend to use Drupal 7 or 8, and then installs
Grunt Drupal Tasks and builds out an appropriate Drupal site skeleton.
