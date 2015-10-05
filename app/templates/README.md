# <%= title %>

> <%= description %>

<!-- Insert short paragraph describing the project's architecture and where to find more information. -->

<%= distroDescription %>

## Requirements

* [Node.js](https://nodejs.com) >= v0.10.33 via a [package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) or [standalone installer](http://nodejs.org/download/)
* [Grunt](https://gruntjs.org) (`npm install -g grunt-cli`)
* PHP 5.4
* [Composer](https://getcomposer.org/download) (e.g. `brew install composer`)

## About This Repository

This codebase is maintained in a minimal working repository containing custom code
and manifests of upstream dependencies. [Grunt-Drupal-Tasks](https://github.com/phase2/grunt-drupal-tasks)
(a Node.js tool based on the popular Grunt task-runner) is used for development
and operational management of the application code. A build process downloads and assembles all dependencies for deployment into the webserver.

## Installation

* **`npm install`:** Retrieve build system dependencies.
* **`grunt`:** Validate and assemble functional Drupal codebase.

## Get Oriented

* To learn about available commands run `grunt help`.
