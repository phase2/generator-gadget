function init() {
  var module = {
    id: 'drupal',
    profile: 'standard'
  };

  module.option = {
    name: 'Drupal',
    value: module.id
  };

  module.versions = [
    {name: 'Drupal 8', value: '8.x'},
    {name: 'Drupal 7', value: '7.x'}
  ];

  module.versionDefault = '8.x';

  module.description = 'This project is built directly on Drupal Core, it is not leveraging other distributions. For more information visit the [Drupal Project homepage](http://drupal.org/project/drupal).';

  module.whenCallback = function(answers) {
    return answers.drupalDistro == 'drupal';
  };

  module.releaseVersion = function(majorVersion, done, cb) {
    require('../../lib/drupalProjectVersion').latestRelease(module.id, majorVersion, done, cb);
  };

  module.drushMakeFile = function(yo, done) {
    var tokens = {
      drupalDistroRelease: yo.drupalDistroRelease,
      coreCompatibility: yo.drupalDistroVersion
    };
    yo.fs.copyTpl(
      yo.templatePath('drupal/project.make'),
      yo.destinationPath('src/project.make'),
      tokens
    );

    done();
  };

  return module;
}

module.exports = init();
