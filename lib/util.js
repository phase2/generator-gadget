var _ = require('lodash');

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
