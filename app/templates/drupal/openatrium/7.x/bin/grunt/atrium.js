module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-shell');

  // Make Atrium libraries available from sites/all/libraries.
  // Many modules do not properly respect the declaration of the contrib Libraries API.
  grunt.config(['symlink', 'oa-libraries'], {
    expand: true,
    cwd: '<%= config.buildPaths.html %>/profiles/openatrium/libraries',
    src: ['*'],
    dest: '<%= config.buildPaths.html %>/sites/all/libraries'
  });

  // Retrieve a development snapshot of Atrium.
  if (grunt.option('dev')) {
    grunt.config(['shell', 'get-atrium-dev'], {
      command: 'bash bin/get-atrium-dev.sh <%= config.buildPaths.build %>/cache'
    });

    grunt.config(['shell', 'move-atrium'], {
      command: 'mv openatrium ../html/profiles',
      options: {
        execOptions: {
          cwd: 'build/cache',
        }
      }
    });
  }

  // Rewire the scaffold task based on tailored Atrium commands.
  grunt.task.renameTask('scaffold', 'scaffold-pre-atrium');
  grunt.registerTask('scaffold', ['scaffold-pre-atrium', 'symlink:oa-libraries']);

  // Rewire the main build task based on Atrium development builds.
  if (grunt.option('dev')) {
    grunt.task.renameTask('default', 'default-pre-atrium');
    grunt.registerTask('default', [
      'shell:get-atrium-dev',
      'default-pre-atrium',
      'shell:move-atrium'
    ]);

    var make_args = grunt.config.get('drush.make.args');
    make_args.push('--working-copy');
    make_args.push('--no-gitinfofile');
    make_args.push('--no-cache');

    // grunt-drupal-tasks does not provide a clean facilitate to override the
    // Gruntconfig makefile.
    make_args[1] = 'src/project-dev.make';
    grunt.config.set('drush.make.args', make_args);
  }
};
