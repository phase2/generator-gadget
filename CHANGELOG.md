# CHANGELOG

## v1.0.1 [2017/06/02]

* Update Drupal 8 composer.json to drupal-project versions.
* Add a default value to the project description prompt.
* Change the composer.json project name to include 'organization/' prefix for strict format compliance.

### Technical Plumbing

* Added Greenkeeper to help manage dependency updates.
* Updated to yeoman-generator 1.x with various related refactorings.
* Add Docker integration for development.
* Add Longjohn as a dev dependency to fix asynchronous debugging, such as learning anything about templating errors.
* Overhauled Drupal Update Feed integration, it is now almost a full-fledged API client.
* Light reorganization to reduce race conditions.

## v1.0.0 [2017/02/18]

* Generated composer.json updates
    * Drupal Console from v0.11 to v1.0.0-rc16
    * Remove duplicate phpunit entry

## v1.0.0-rc1 [2017/01/12]

* Drupal 8 projects now use Composer as their sole dependency manager. Drush Make is only used for Drupal 7/Atrium projects.
* Add a project distribution option for [Octane](https://github.com/phase2/octane).
    * Added the merge library as a generator dependency so Octane projects receive a composer.json which combines the gadget template with the current Octane stable release manifest.
* Update Drupal 8 dev dependencies to match Drupal Core. (Note that they are not computed dynamically at generator-time, unlike the distribution version.)
* Drop support for Node v0.12. Begin support for Node 6 and Node 7.
* Adjust default behat.yml configuration to work more cleanly out-of-box for CI.
* Fixed switch deprecated eslint no-comment-dangle configuration option to comment-dangle.

## v0.5.0 [2016/07/01]

- Added hidden support for SMTP module added to makefile.
- Offline mode via `--offline`
- Drupal 8 composer.json updates: Drush 8.x, Coder 8.2.x especially.
- Switch to make.yml format for Drush Makefiles
- Stability improvements

## v0.4.0 [2016/03/02]

- Added support for cache options (including database, Memcache, Redis).
- Added support for distributions with multiple make files (especially Atrium).
- Added README.md for generated projects.
- Dropped support for Node.js v0.10. Node.js v0.12.x or later is required.
- Improved Travis CI tests with runs with Node.js 5.x, 4.x, and 0.12.x.
- Improved documentation.
