var _ = require('lodash');
var assert = require('yeoman-assert');
var distros = require('../generators/lib/distros');

describe('Distribution Plugins', function() {
  for(var id in distros) {
    // This structure copies the value into the test to ensure the same value
    // is not reused for multiple test runs.
    testPluginConformance(id, distros[id]);
  }
});

function testPluginConformance(id, distro) {
  describe('have an ' + id + ' implementation', function() {
    it('should have a complete definition', function(done) {
      assert(distro.id);
      assert(distro.option);
      assert(distro.option.name);
      assert(distro.option.value);
      assert(distro.versions);
      assert(distro.versions.length > 0);
      assert(distro.versionDefault);
      assert(distro.releaseVersion);
      assert(distro.drushMakeFile);
      done();
    });

    it('should require the filename and distro ID be identical', function(done) {
      assert.equal(distro.id, id);
      done();
    });

    it('should have a versionDefault in the versions list', function(done) {
      var versions = _.map(distro.versions, 'value');
      assert(versions.indexOf(distro.versionDefault) !== -1);
      done();
    });
  });
}
