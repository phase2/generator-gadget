var request = require('request');
var merge = require('merge');
var gadget = require('../util');

function init() {
  var module = {
    id: 'octane',
    // Generated project will be based on Lightning, not Octane directly.
    // Octane only used as template for build files.
    profile: 'lightning'
  };

  module.option = {
    name: 'Octane/Lightning',
    value: module.id
  };

  module.versions = [
    {name: 'Octane 8.x', value: '8.x'}
  ];

  module.versionDefault = '8.x';

  module.description = 'This project is built on [' + module.option.name + '] distribution.';

  module.releaseVersion = function(majorVersion, done, cb) {
    cb(null, '8.x', done);
  };

  module.drushMakeFile = function(yo, options, done) {
    // Using all composer.  No Drush make files.
    done();
  };

  module.loadComposer = function(yo, options) {
    var composer = {};
    var file = yo.templatePath('drupal/drupal/' + options.drupalDistroRelease + '/composer.json');
    if (gadget.fsExistsSync(file)) {
      composer = yo.fs.readJSON(file);
      // Octane gets it's version of Drupal Core from Lightning.
      // The composer.json template is pulled from the Drupal distro, which does
      // use a drupal/core version. To ensure some core processing logic does
      // not execute for Octane we remove this entry as the one key difference.
      delete composer.require['drupal/core'];
    }
    return composer;
  }

  module.modifyComposer = function(yo, options, localComposer, isNewProject, done, cb) {
    // We fetch the current composer.json from Drupal.org for the distro.
    // Then we merge the "require", "require-dev", patches" sections with either
    // the existing project composer.json, or the Drupal base template.
    if (options.offline) {
      cb(null, localComposer, done);
    }
    else {
      // Lastest Octane distro code living on drupal.org
      var url = 'http://cgit.drupalcode.org/' + module.id
        + '/plain/composer.json';

      request(url,
        function (error, response, body) {
          if (!error && response.statusCode == 200 && body.length) {
            var remoteComposer = JSON.parse(body);
            // Read the default Drupal composer.json template.
            if (isNewProject) {
              // drupal.org composer determines source for drupal modules.
              // @todo if the remoteComposer starts having changes to composer
              // repositories this will need to be changed to update existing
              // composer.json.
              localComposer.repositories = remoteComposer.repositories;
            }

            // Merge in requirements from drupal.org composer.
            localComposer.require = merge.recursive(true, localComposer.require, remoteComposer.require);
            localComposer.extra['enable-patching'] = remoteComposer.extra['enable-patching'];
            // Merge in patches from drupal.org composer.
            localComposer.extra['patches'] = merge.recursive(true, localComposer.extra['patches'], remoteComposer.extra['patches'], true);
            // Merge in require-dev from drupal.org composer.
            localComposer['require-dev'] = merge.recursive(true, localComposer['require-dev'], remoteComposer['require-dev']);

            cb(null, localComposer, done);
          }
          else if (error) {
            yo.log.error("Could not retrieve Octane's composer.json.");
            cb(error, null, done);
          }
          done();
        }
      );
    }
  };

  return module;
}

module.exports = init();
