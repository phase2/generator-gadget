
function init() {
  var module = { id: 'openatrium' };

  module.option = {
    name: 'Open Atrium',
    value: 'openatrium'
  };

  module.versions = [
    {name: 'OpenAtrium 2', value: '7.x'},
  ];

  module.versionDefault = '7.x';

  module.whenCallback = function(answers) {
    return answers.drupalDistro == 'openatrium';
  }

  module.releaseVersion = function(majorVersion, done, cb) {
    require('../drupalProjectVersion').latestRelease(module.id, majorVersion, done, cb);
  };

  module.drushMakeFile = function(yo, done) {
    var tokens = {
      drupalDistroRelease: yo.drupalDistroRelease,
      coreCompatibility: yo.drupalDistroVersion
    };
    yo.fs.copyTpl(
      yo.templatePath('openatrium/project.make'),
      yo.destinationPath('src/project.make'),
      tokens
    );

    // The Core Makefile is managed by Atrium and varies by release.
    yo.fetch(
      'http://cgit.drupalcode.org/openatrium/plain/drupal-org-core.make?id=' + yo.drupalDistroRelease,
      'src',
      function () {
        yo.fs.copy('src/drupal-org-core.make?id=' + yo.drupalDistroRelease, 'src/drupal-org-core.make');
        yo.fs.delete('src/drupal-org-core.make?id=' + yo.drupalDistroRelease);
        done();
      }
    );
  }

  return module;
};

module.exports = init();
