
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
      coreCompatibility: options.drupalDistroVersion
    };
    yo.fs.copyTpl(
      yo.templatePath('project-distro.make'),
      yo.destinationPath('src/project.make'),
      tokens
    );

    // The Core Makefile is managed by Atrium and varies by release.
    var filename = 'drupal-org-core.make?id=' + options.drupalDistroRelease;
    yo.fetch(
      'http://cgit.drupalcode.org/openatrium/plain/' + filename,
      'src',
      function () {
        yo.fs._copySingle('src/' + filename, 'src/drupal-org-core.make');
        yo.fs.delete('src/' + filename);
        done();
      }
    );
  }

  return module;
};

module.exports = init();
