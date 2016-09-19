var request = require('request');

function init() {
  var module = {
    id: 'octane',
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
    done();
  };

  module.modifyComposer = function(yo, options, composer, done) {
    // Grab the latest composer.json file for the distro.
    var url = 'http://cgit.drupalcode.org/' + options.drupalDistro.id
      + '/plain/composer.json';

    request(url,
      function (error, response, body) {
        if (!error && response.statusCode == 200 && body.length) {
          yo.fs.write(yo.destinationPath('composer-distro.json'), body);
          var distroComposer = yo.fs.readJSON(yo.destinationPath('composer-distro.json'));
          // Read the default Drupal composer.json template.
          var composer = yo.fs.readJSON(yo.templatePath('drupal/drupal/' + options.drupalDistroRelease + '/composer.json'));
          composer.name = options.projectName;
          composer.description = options.projectDescription;
          // drupal.org composer determines source for drupal modules.
          composer.repositories = distroComposer.repositories;
          // Pull in requirements from drupal.org composer.
          composer.require = distroComposer.require;
          // Pull in patches from drupal.org composer.
          composer.extra['enable-patching'] = distroComposer.extra['enable-patching'];
          composer.extra['patches'] = distroComposer.extra['patches'];
          // Merge in require-dev from drupal.org composer.
          for (var key in distroComposer['require-dev']) {
            if (!(key in composer['require-dev'])) {
              composer['require-dev'][key] = distroComposer['require-dev'][key];
            }
          }
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
