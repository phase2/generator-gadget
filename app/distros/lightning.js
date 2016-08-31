var request = require('request');

function init() {
  var module = {
    id: 'lightning',
    profile: 'lightning'
  };

  module.option = {
    name: 'Lightning',
    value: module.id
  };

  module.versions = [
    {name: 'Lightning 1.x', value: '8.x'}
  ];

  module.versionDefault = '8.x';

  module.description = 'This project is built on [' + module.option.name + '](https://www.drupal.org/project/lightning).';

  module.releaseVersion = function(majorVersion, done, cb) {
    require('../../lib/drupalProjectVersion').latestRelease(module.id, majorVersion, done, cb);
  };

  module.drushMakeFile = function(yo, options, done) {
    var v = options.drupalDistroRelease;
    var releaseVersion = v.slice(v.indexOf('-') + 1);

    var tokens = options;
    tokens.coreCompatibility = options.drupalDistroVersion;
    tokens.drupalDistroRelease = releaseVersion,
    tokens.cache = false;

    if (options['cacheVersion']) {
      tokens.cache = options['cacheInternal'];
      tokens.cacheVersion = options['cacheVersion'];
    }

    yo.fs.copyTpl(
      yo.templatePath('drupal/' + options.drupalDistro.id + '/project-main.make.yml'),
      yo.destinationPath('src/project.make.yml'),
      tokens
    );


    yo.fs.copyTpl(
      yo.templatePath('drupal/' + options.drupalDistro.id + '/project-specific.make.yml'),
      yo.destinationPath('src/' + options.projectName + '.make.yml'),
      tokens
    );

    // The Core Makefile is managed by Lightning and varies by release.
    var url = 'http://cgit.drupalcode.org/' + options.drupalDistro.id
      + '/plain/drupal-org-core.make?id=' + options.drupalDistroRelease;
    request(url,
      function (error, response, body) {
        if (!error && response.statusCode == 200 && body.length) {
          yo.fs.write(yo.destinationPath('src/drupal-org-core.make'), body);
        }
        done();
      }
    );

  };

  return module;
}

module.exports = init();
