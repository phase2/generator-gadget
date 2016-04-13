var request = require('request');

function init() {
  var module = {
    id: 'openatrium',
    profile: 'openatrium'
  };

  module.option = {
    name: 'Open Atrium',
    value: module.id
  };

  module.versions = [
    {name: 'OpenAtrium 2', value: '7.x'},
  ];

  module.versionDefault = '7.x';

  module.description = 'This project is built on [' + module.option.name + '](http://openatrium.com) for more information visit the [Atrium Project Homepage](https://drupal.org/project/openatrium).';

  module.releaseVersion = function(majorVersion, done, cb) {
    require('../../lib/drupalProjectVersion').latestRelease(module.id, majorVersion, done, cb);
  };

  module.drushMakeFile = function(yo, options, done) {
    var releaseVersion = options.drupalDistroRelease.match(/^\d+\.x\-(.+)/)[1];

    var tokens = options;
    tokens.drupalDistroName = module.id,
    tokens.drupalDistroRelease = releaseVersion,
    tokens.coreCompatibility = options.drupalDistroVersion;
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
      yo.templatePath('drupal/' + options.drupalDistro.id + '/project-dev.make.yml'),
      yo.destinationPath('src/project-dev.make.yml'),
      tokens
    );

    yo.fs.copyTpl(
      yo.templatePath('drupal/' + options.drupalDistro.id + '/project-specific.make.yml'),
      yo.destinationPath('src/' + options.projectName + '.make.yml'),
      tokens
    );

    // The Core Makefile is managed by Atrium and varies by release.
    var filename = 'drupal-org-core.make?id=' + options.drupalDistroRelease;
    request('http://cgit.drupalcode.org/openatrium/plain/' + filename,
      function (error, response, body) {
        if (!error && response.statusCode == 200 && body.length) {
          yo.fs.write(yo.destinationPath('src/drupal-org-core.make'), body);
          done();
        }
      }
    );
  }

  return module;
};

module.exports = init();
