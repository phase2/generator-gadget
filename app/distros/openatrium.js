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
    var v = options.drupalDistroRelease;
    var releaseVersion = v.slice(v.indexOf('-') + 1);

    var tokens = {
      drupalDistroName: module.id,
      drupalDistroRelease: releaseVersion,
      coreCompatibility: options.drupalDistroVersion,
      projectName: options.projectName,
      cache: false,
      smtp: false
    };

    if (options['cacheVersion']) {
      tokens.cache = options['cacheInternal'];
      tokens.cacheVersion = options['cacheVersion'];
    }

    if (options['smtpVersion']) {
      tokens.smtp = 'smtp';
      tokens.smtpVersion = options['smtpVersion'];
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
    var url = 'http://cgit.drupalcode.org/' + options.drupalDistro.id
      + '/plain/drupal-org-core.make?id=' + options.drupalDistroRelease;
    request(url,
      function (error, response, body) {
        if (!error && response.statusCode == 200 && body.length) {
          yo.fs.write(yo.destinationPath('src/drupal-org-core.make'), body);
        }
        done();
      }
    )
  };

  return module;
}

module.exports = init();
