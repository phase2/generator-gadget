module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-shell');

  grunt.config.set(['shell', 'composer-manager'], {
    command: 'php ./modules/contrib/composer_manager/scripts/init.php',
    options: {
      execOptions: {
        cwd: '<%= config.buildPaths.html %>'
      }
    }
  });

  grunt.config.set(['shell', 'composer-drupal-rebuild'], {
    command: 'composer drupal-rebuild',
    options: {
      execOptions: {
        cwd: '<%= config.buildPaths.html %>'
      }
    }
  });

  grunt.config.set(['shell', 'composer-update'], {
    command: 'composer update --lock',
    options: {
      execOptions: {
        cwd: '<%= config.buildPaths.html %>'
      }
    }
  });

  var message = 'Run composer manager to aggregate and process module composer.json files.';
  grunt.registerTask('composer-manager', message, function() {
    var tasks = [
      'shell:composer-manager',
      'shell:composer-drupal-rebuild',
      'shell:composer-update'
    ];

    // Add `pre-composer-manager` and `post-composer-manager` options to
    // Gruntconfig scripts.
    require('grunt-drupal-tasks/lib/scripts')(grunt)
      .eventify(grunt.config('config.scripts'), this.name, this.name, tasks);

    grunt.task.run(tasks);
  });

  // Rewire the scaffold task to follow with composer-manager.
  grunt.task.renameTask('scaffold', 'scaffold-pre-composer-manager');
  grunt.registerTask('scaffold', ['scaffold-pre-composer-manager', 'composer-manager']);

  // Wire up the `grunt help` command.
  require('grunt-drupal-tasks/lib/help')(grunt).add({
    task: 'composer-manager',
    group: 'Build Process'
  });
};
