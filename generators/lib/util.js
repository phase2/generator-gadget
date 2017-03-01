var _ = require('lodash');
var spawn = require('yeoman-generator/lib/actions/spawn_command');

module.exports.labelMaker = function(str) {
  return _.words(str).map(function(word) {
    return _.capitalize(word);
  }).join(' ');
};

module.exports.tokens = function(options) {
  return {
    title: module.exports.labelMaker(options.projectName),
    description: options.projectDescription,
    distroDescription: options.drupalDistro.description
  };
};

module.exports.npmVersion = function(name, relativeRepoUrl, useMaster) {
  if (useMaster) {
    return 'git+https:' + relativeRepoUrl + '#master';
  }
  else {
    var version = spawn.spawnCommandSync(
      'npm',
      ['show', name, 'version'],
      {stdio: 'pipe'}
    ).stdout.toString('utf8');
    return '~' + _.trim(version);
  }
}

module.exports.fsExistsSync = function(path) {
  var fs = require('fs');

  if (fs.existsSync) {
    return fs.existsSync(path);
  }
  else {
    try {
      fs.accessSync(path);
      return true;
    }
    catch(ex) {
      return false;
    }
  }
}
