var request = require('request');

function init() {
  var module = {
    id: 'octane',
    profile: 'lightning'
  };

  module.option = {
    name: 'Octane',
    value: module.id
  };

  module.versions = [
    {name: 'Octane 8.x', value: '8.x'}
  ];

  module.versionDefault = '8.x';

  module.description = 'This project is built on [' + module.option.name + '] distribution.';

  module.releaseVersion = function(majorVersion, done, cb) {
    cb(null, '8.x', done);
  };

  module.drushMakeFile = function(yo, options, done) {
    done();
  };

  return module;
}

module.exports = init();
