'use strict';

var _ = require('lodash');

function labelMaker(str) {
  return _.words(str).map(function(word) {
    return _.capitalize(word);
  }).join(' ');
}

module.exports.generate = function(yo) {
  var distro = yo.distros[yo.drupalDistro];

  var tokens = {
    title: labelMaker(yo.props.name),
    description: yo.props.description,
    distroDescription: distro.description
  };

  yo.fs.copyTpl(
    yo.templatePath('README.md'),
    yo.destinationPath('README.md'),
    tokens
  );
}
