module.exports = function(grunt) {

  // Load all plugins and tasks defined by the grunt-drupal-tasks package.
  require('grunt-drupal-tasks')(grunt);

  // If bin/grunt exists, load task files.
  if (grunt.file.exists(__dirname + '/bin/grunt')) {
    grunt.loadTasks(__dirname + '/bin/grunt');
  }

};
