var request = require('request');
var merge = require('merge');

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

  module.modifyComposer = function(yo, options, localComposer, isNewProject, done) {
    // We fetch the current composer.json from Drupal.org for the distro.
    // Then we merge the "require", "require-dev", patches" sections with either
    // the existing project composer.json, or the Drupal base template.

    if (options.offline) {
      if (isNewProject) {
        // If no composer.json yet, start with the Drupal template.
        localComposer = yo.fs.readJSON(yo.templatePath('drupal/drupal/' + options.drupalDistroRelease + '/composer.json'));
      }
      return localComposer;
    }
    else {
      // Lastest Octane distro code living on drupal.org
      var url = 'http://cgit.drupalcode.org/' + options.drupalDistro.id
        + '/plain/composer.json';

      request(url,
        function (error, response, body) {
          if (!error && response.statusCode == 200 && body.length) {
            var remoteComposer = JSON.parse(body);
            // Read the default Drupal composer.json template.
            if (isNewProject) {
              // If no composer.json yet, start with the Drupal template.
              localComposer = yo.fs.readJSON(yo.templatePath('drupal/drupal/' + options.drupalDistroRelease + '/composer.json'));

              // drupal.org composer determines source for drupal modules.
              localComposer.repositories = remoteComposer.repositories;
            }

            // Set the project properties.
            localComposer.name = options.projectName;
            localComposer.description = options.projectDescription;

            // Merge in requirements from drupal.org composer.
            localComposer.require = merge.recursive(true, localComposer.require, remoteComposer.require);
            localComposer.extra['enable-patching'] = remoteComposer.extra['enable-patching'];
            // Merge in patches from drupal.org composer.
            localComposer.extra['patches'] = merge.recursive(true, localComposer.extra['patches'], remoteComposer.extra['patches'], true);
            // Merge in require-dev from drupal.org composer.
            localComposer['require-dev'] = merge.recursive(true, localComposer['require-dev'], remoteComposer['require-dev']);

            yo.fs.writeJSON('composer.json', localComposer);
          }
          done();
        }
      );
      return localComposer;
    }
  };

  return module;
}

module.exports = init();
