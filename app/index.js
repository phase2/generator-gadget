'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');

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
      this.props = _.assign(props, this.options);
      this.drupalDistro = this.props.drupalDistro;
      this.drupalDistroVersion = this.props['drupalDistroVersion-' + this.drupalDistro];

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
    this.drupalDistroRelease = this.drupalDistroVersion;

    // Handle version used by updates.drupal.org for 8.x.x releases.
    var drupalUpdatesVersion = this.drupalDistroVersion;
    if (drupalUpdatesVersion.match(/^8\.\d+\.x$/)) {
      drupalUpdatesVersion = '8.x';
    }

    // Find the latest stable release for the Drupal distro version.
    var done = this.async();
    this.distros[this.drupalDistro].releaseVersion(drupalUpdatesVersion, done, function(err, version, done) {
      if (err) {
        this.log.error(err);
        return done(err);
      }
      this.drupalDistroRelease = version;
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
        this.templatePath(path.resolve(this.drupalDistro, this.drupalDistroVersion)),
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

      pkg.name = this.props.projectName;
      pkg.description = this.props.projectDescription;

      this.fs.writeJSON('package.json', pkg);
    },

    composerJson: function () {
      var composer = this.fs.readJSON('composer.json');
      composer.name = this.props.projectName;
      composer.description = this.props.projectDescription;
      this.fs.writeJSON('composer.json', composer);
    },

    gruntConfig: function () {
      var gcfg = this.fs.readJSON('Gruntconfig.json')

      if (!gcfg) {
        //TODO: throw error
      }

      // Process theme options and insert into Gruntconfig.json.
      if (this.options.themeName && this.options.themePath) {
        var themeOpts = {
          path: "<%= config.srcPaths.drupal %>/themes/" + this.options.themeName
        };

        if (this.options.themeType === 'compass') {
          themeOpts.compass = true;
        }
        else if (this.options.themeType === 'grunt' && this.options.themeGruntTask) {
          themeOpts.grunt = true;
          themeOpts.gruntTask = this.options.themeGruntTask;
        }

        if (this.options.themeScripts) {
          themeOpts.scripts = this.options.themeScripts;
        }

        if (!gcfg.hasOwnProperty('themes')) {
          gcfg.themes = {};
        }
        gcfg.themes[this.options.themeName] = themeOpts;
      }

      gcfg.serve = { "profile": this.distros[this.drupalDistro].profile };
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
      require('./readme').generate(this);
    },

    drushMakefile: function () {
      this.log('Setting up Drush makefile to install Drupal Distribution ' + this.drupalDistro + ' version ' + chalk.red(this.drupalDistroRelease) + '.\n');
      var done = this.async();
      this.distros[this.drupalDistro].drushMakeFile(this, done);
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall();
    }
  },

  end: function () {
    this.log('\nGadget has ' + chalk.red('finished') + ' setting up the Drupal project scaffold with Grunt Drupal Tasks!\n');
    this.log('Run `' + chalk.red('grunt') + '` to run the first build of this project.\n');
  }
});
