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

    var tokens = {
      drupalDistroName: module.id,
      drupalDistroRelease: releaseVersion,
      coreCompatibility: options.drupalDistroVersion,
      projectName: options.projectName,
      memcache: false
    };

    if (options['memcacheVersion']) {
      tokens.memcache = true;
      tokens.memcacheVersion = options['memcacheVersion'];
    }

    yo.fs.copyTpl(
      yo.templatePath('drupal/' + options.drupalDistro.id + '/project-main.make'),
      yo.destinationPath('src/project.make'),
      tokens
    );

    yo.fs.copyTpl(
      yo.templatePath('drupal/' + options.drupalDistro.id + '/project-dev.make'),
      yo.destinationPath('src/project-dev.make'),
      tokens
    );

    yo.fs.copyTpl(
      yo.templatePath('drupal/' + options.drupalDistro.id + '/project-specific.make'),
      yo.destinationPath('src/' + options.projectName + '.make'),
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
