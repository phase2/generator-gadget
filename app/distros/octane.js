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

  // Merge keys from jsonB into jsonA.
  // Existing values of jsonA are overwritten if they appear in jsonB.
  // If recurse is true, call recursively for one level of subkeys.
  function mergeJson(jsonA, jsonB, recurse) {
    jsonA = (typeof jsonA !== 'undefined') ?  jsonA : {};
    jsonB = (typeof jsonB !== 'undefined') ?  jsonB : {};
    recurse = (typeof recurse !== 'undefined') ?  recurse : false;

    var result = {};
    for (var key in jsonA) {
      result[key] = jsonA[key];
    }
    for (var key in jsonB) {
      result[key] = jsonB[key];
      if (recurse && (typeof jsonA[key] == 'object') && (typeof jsonB[key] == 'object')) {
        // Only one level of recursion.
        result[key] = mergeJson(jsonA[key], jsonB[key], false);
      }
    }
    return result;
  }

  module.modifyComposer = function(yo, options, composer, composerExists, done) {
    // Grab the latest composer.json file for the distro.
    var url = 'http://cgit.drupalcode.org/' + options.drupalDistro.id
      + '/plain/composer.json';

    request(url,
      function (error, response, body) {
        if (!error && response.statusCode == 200 && body.length) {
          yo.fs.write('composer-distro.json', body);
          var distroComposer = yo.fs.readJSON('composer-distro.json');
          // Read the default Drupal composer.json template.
          var drupalComposer = yo.fs.readJSON(yo.templatePath('drupal/drupal/' + options.drupalDistroRelease + '/composer.json'));
          if (!composerExists) {
            // If no composer.json yet, start with the Drupal template.
            composer = drupalComposer;
          }
          composer.name = options.projectName;
          composer.description = options.projectDescription;
          // drupal.org composer determines source for drupal modules.
          composer.repositories = distroComposer.repositories;
          // Merge in requirements from drupal.org composer.
          composer.require = mergeJson(composer.require, distroComposer.require);
          composer.extra['enable-patching'] = distroComposer.extra['enable-patching'];
          // Merge in patches from drupal.org composer.
          composer.extra['patches'] = mergeJson(composer.extra['patches'], distroComposer.extra['patches'], true);
          // Merge in require-dev from drupal.org composer.
          composer['require-dev'] = mergeJson(composer['require-dev'], distroComposer['require-dev']);
          yo.fs.writeJSON('composer.json', composer);
          yo.fs.delete('composer-distro.json');
        }
        done();
      }
    );
    return composer;
  };

  return module;
}

module.exports = init();
