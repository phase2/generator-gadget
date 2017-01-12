# CHANGELOG

## NEXT [XXXX/XX/XX]

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
