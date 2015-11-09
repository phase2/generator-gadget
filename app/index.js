'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');

var options = {};

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    if (!this.options.skipWelcome) {
      this.log(yosay(
        'Welcome to ' + chalk.red('Gadget') + ', the gnarly generator for Grunt Drupal Tasks!'
      ));
    }

    this.pkg = require('../package.json');
    this.distros = require('./distros');
  },

  prompting: function () {
    var self = this;
    var done = this.async();

    var prompts = require('../lib/prompts');
    prompts = _.filter(prompts, function (item) {
      return _.isUndefined(self.options[item.name]);
    });

    this.prompt(prompts, function (props) {
      options = _.assign(props, this.options);
      this.log("\nOk, I'm going to start assembling this project...");
      done();
    }.bind(this));
  },

  // Install Grunt Drupal Tasks, either the latest published version or the
  // current development version in the master branch.
  installGDT: function() {
    require('./gdt')(this).install();
  },

  // Determine the latest stable release for the requested Drupal core version.
  getDistroRelease: function () {
    // Provide a fallback value in case the request fails.
    options.drupalDistroRelease = options.drupalDistroVersion;

    // Handle version used by updates.drupal.org for 8.x.x releases.
    var majorVersionForUpdateSystem = options.drupalDistroVersion;
    if (majorVersionForUpdateSystem.match(/^8\.\d+\.x$/)) {
      majorVersionForUpdateSystem = '8.x';
    }

    // Find the latest stable release for the Drupal distro version.
    var done = this.async();
    options.drupalDistro.releaseVersion(majorVersionForUpdateSystem, done, function(err, version, done) {
      if (err) {
        this.log.error(err);
        return done(err);
      }
      options.drupalDistroRelease = version;
      done();
    }.bind(this));
  },

  writing: {
    template: function () {
      this.directory(
        this.destinationPath('node_modules/grunt-drupal-tasks/example'),
        this.destinationPath()
      );

      this.directory(
        this.templatePath(path.resolve(options.drupalDistro.id, options.drupalDistroVersion)),
        this.destinationPath()
      );
    },

    gitignore: function () {
      this.fs.move(
        this.destinationPath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    packageJson: function () {
      var pkg = this.fs.readJSON('package.json');

      if (!pkg) {
        //TODO: throw error
      }

      // If the latest published version of GDT is not used, then update the
      // project's package.json accordingly.
      if (this.npmVersion !== 'grunt-drupal-tasks') {
        pkg.dependencies['grunt-drupal-tasks'] = this.npmVersion;
      }

      pkg.name = options.projectName;
      pkg.description = options.projectDescription;

      this.fs.writeJSON('package.json', pkg);
    },

    composerJson: function () {
      var composer = this.fs.readJSON('composer.json');
      composer.name = options.projectName;
      composer.description = options.projectDescription;
      this.fs.writeJSON('composer.json', composer);
    },

    gruntConfig: function () {
      var gcfg = this.fs.readJSON('Gruntconfig.json')

      if (!gcfg) {
        //TODO: throw error
      }

      // Process theme options and insert into Gruntconfig.json.
      if (options.themeName && options.themePath) {
        var themeOpts = {
          path: "<%= config.srcPaths.drupal %>/themes/" + options.themeName
        };

        if (options.themeType === 'compass') {
          themeOpts.compass = true;
        }
        else if (options.themeType === 'grunt' && options.themeGruntTask) {
          themeOpts.grunt = true;
          themeOpts.gruntTask = options.themeGruntTask;
        }

        if (options.themeScripts) {
          themeOpts.scripts = options.themeScripts;
        }

        if (!gcfg.hasOwnProperty('themes')) {
          gcfg.themes = {};
        }
        gcfg.themes[options.themeName] = themeOpts;
      }

      gcfg.project = { "profile": options.drupalDistro.profile };
      gcfg.generated = { name: this.pkg.name, version: this.pkg.version };

      this.fs.writeJSON('Gruntconfig.json', gcfg);
    },

    gruntfile: function () {
      this.fs.copy(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );
    },

    readme: function () {
      if (!options['skip-readme']) {
        this.fs.copyTpl(
          this.templatePath('README.md'),
          this.destinationPath('README.md'),
          // Extracted to facilitate parallel README generation by a parent.
          require('../lib/util').tokens(options)
        );
      }
    },

    drushMakefile: function () {
      this.log('Setting up Drush makefile to install Drupal Distribution '
        + options.drupalDistro.option.name + ' version '
        + chalk.red(options.drupalDistroRelease) + '.\n');
      var done = this.async();
      options.drupalDistro.drushMakeFile(this, options, done);
    }
  },

  install: function () {
    if (!options['skip-install']) {
      this.npmInstall();
    }
  },

  end: function () {
    this.log('\nGadget has ' + chalk.red('finished')
      + ' setting up the Drupal project scaffold with Grunt Drupal Tasks!\n');
    this.log('Run `' + chalk.red('grunt')
      + '` to run the first build of this project.\n');
  }
});
