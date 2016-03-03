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
      command: 'bash bin/get-atrium-dev.sh <%= config.buildPaths.build %>/temp/profiles'
    });
  }

  // Rewire the scaffold task based on tailored Atrium commands.
  grunt.task.renameTask('scaffold', 'scaffold-pre-atrium');
  grunt.registerTask('scaffold', ['scaffold-pre-atrium', 'symlink:oa-libraries']);

  // Rewire the main build task based on Atrium development builds.
  if (grunt.option('dev')) {
    var make_args = grunt.config.get('drush.make.args');
    make_args.push('--working-copy');
    make_args.push('--no-gitinfofile');
    make_args.push('--no-cache');

    // grunt-drupal-tasks does not provide a clean facilitate to override the
    // Gruntconfig makefile.
    make_args[1] = 'src/project-dev.make.yml';
    grunt.config.set('drush.make.args', make_args);

    // Define the make-atrium job by duplicating the standard make configuration.
    grunt.config.set('drush.make-atrium', grunt.config('drush.make'));
    var make_args = grunt.config.get('drush.make-atrium.args');
    make_args[1] = '<%= config.buildPaths.build %>/temp/profiles/openatrium/scripts/oa-drush-dev.make';
    make_args.push('--no-core');
    make_args.push('--contrib-destination=profiles/openatrium');
    grunt.config.set('drush.make-atrium.args', make_args);

    grunt.registerTask('drushmake', 'Prepare the build directory and run "drush make"', function() {
      grunt.task.run([
        'mkdir:init',
        'clean:temp',
        'drush:make',
        // Retrieve Atrium 2.x and place in transitional codebase.
        'shell:get-atrium-dev',
        // Ensure Atrium's dependencies are placed in the openatrium profile directory tree.
        'drush:make-atrium',
        'clean:default',
        'copy:tempbuild',
        'clean:temp'
      ]);
    });

  }
};
