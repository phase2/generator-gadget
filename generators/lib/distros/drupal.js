var gadget = require('../util');
var drupalOrgApi = require('../drupalProjectVersion');

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

  module.releaseVersion = function(majorVersion, done, cb) {
    drupalOrgApi.latestReleaseStable(module.id, majorVersion, done, cb);
  };

  module.loadComposer = function(yo, options) {
    var file = yo.templatePath('drupal/' + module.id + '/' + options.drupalDistroVersion + '/composer.json');
    if (gadget.fsExistsSync(file)) {
      return yo.fs.readJSON(file);
    }
    return yo.fs.readJSON(yo.templatePath('gdt/composer.json'));
  }

  module.drushMakeFile = function(yo, options, done) {
    var tokens = {
      drupalDistroRelease: options.drupalDistroRelease,
      coreCompatibility: options.drupalDistroVersion,
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
      yo.templatePath('drupal/drupal/project.make.yml'),
      yo.destinationPath('src/project.make.yml'),
      tokens
    );

    done();
  };

  return module;
}

module.exports = init();
