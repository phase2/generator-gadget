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
    name: 'Octane',
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

  module.modifyComposer = function(yo, options, composer, isNewProject, done) {
    // We fetch the current composer.json from Drupal.org for the distro.
    // Then we merge the "require", "require-dev", patches" sections with either
    // the existing project composer.json, or the Drupal base template.

    // Lastest Octane distro code living on drupal.org
    var url = 'http://cgit.drupalcode.org/' + options.drupalDistro.id
      + '/plain/composer.json';

    request(url,
      function (error, response, body) {
        if (!error && response.statusCode == 200 && body.length) {
          var distroComposer = JSON.parse(body);
          // Read the default Drupal composer.json template.
          if (isNewProject) {
            // If no composer.json yet, start with the Drupal template.
            composer = yo.fs.readJSON(yo.templatePath('drupal/drupal/' + options.drupalDistroRelease + '/composer.json'));

            // drupal.org composer determines source for drupal modules.
            composer.repositories = distroComposer.repositories;
          }

          // Set the project properties.
          composer.name = options.projectName;
          composer.description = options.projectDescription;

          // Merge in requirements from drupal.org composer.
          composer.require = merge.recursive(true, composer.require, distroComposer.require);
          composer.extra['enable-patching'] = distroComposer.extra['enable-patching'];
          // Merge in patches from drupal.org composer.
          composer.extra['patches'] = merge.recursive(true, composer.extra['patches'], distroComposer.extra['patches'], true);
          // Merge in require-dev from drupal.org composer.
          composer['require-dev'] = merge.recursive(true, composer['require-dev'], distroComposer['require-dev']);

          yo.fs.writeJSON('composer.json', composer);
        }
        done();
      }
    );
    return composer;
  };

  return module;
}

module.exports = init();
