
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
    var releaseVersion = yo.drupalDistroRelease.match(/^\d+\.x\-(.+)/)[1];

    var tokens = {
      drupalDistroRelease: releaseVersion,
      coreCompatibility: yo.drupalDistroVersion
    };
    yo.fs.copyTpl(
      yo.templatePath('openatrium/project.make'),
      yo.destinationPath('src/project.make'),
      tokens
    );

    // The Core Makefile is managed by Atrium and varies by release.
    var filename = 'drupal-org-core.make?id=' + yo.drupalDistroRelease;
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
