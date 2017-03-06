'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');

var gadget = require('../lib/util');

var options = {};

module.exports = Generator.extend({
  initializing: function () {
    this.pkg = require('../../package.json');

    if (!this.options.skipWelcome) {
      this.log(yosay(
        'Welcome to ' + chalk.red.bold('Gadget ' + this.pkg.version)
        + ', the gnarly generator for Grunt Drupal Tasks!'
      ));
    }
  },

  prompting: function () {
    var self = this;

    if (this.options.hasOwnProperty('drupalDistro') && typeof this.options.drupalDistro === 'string') {
      var distros = require('../lib/distros');
      this.options.drupalDistro = distros[this.options.drupalDistro];
    }

    if (this.options.hasOwnProperty('drupal-distro') && typeof this.options['drupal-distro'] === 'string') {
      var distros = require('../lib/distros');
      this.options['drupalDistro'] = distros[this.options['drupal-distro']];
    }

    var prompts = require('../lib/prompts');
    prompts = _.filter(prompts, function (item) {
      return _.isUndefined(self.options[item.name]);
    });

    return this.prompt(prompts).then(function (props) {
      options = _.assign(props, this.options);
      if (!options['cacheInternal']) {
        options.cacheInternal = 'database';
      }
      this.log("\nOk, I'm going to start assembling this project...");
    }.bind(this));
  },

  configuring: {
    // Determine the latest stable release for the requested Drupal core version.
    getDistroRelease: function () {
      if (options['offline']) {
        options.drupalDistroRelease = 0;
      }
      else {
        // Find the latest stable release for the Drupal distro version.
        var done = this.async();
        options.drupalDistro.releaseVersion(options.drupalDistroVersion, done, function(err, version, done) {
          if (err) {
            this.log.error(err);
            return done(err);
          }
          options.drupalDistroRelease = version;
          done();
        }.bind(this));
      }
    },

    cacheVersion: function() {
      if (options.cacheInternal != 'database') {
        if (options['offline']) {
          options.cacheVersion = 0;
        }
        else {
          var done = this.async();
          require('../lib/drupalProjectVersion')
            // the other options for cache are redis and memcache, which happen
            // to be the names of the contrib modules that integrate with them.
            .latestRelease(options.cacheInternal, options.drupalDistroVersion, done, function(err, version, done) {
              if (err) {
                this.log.error(err);
                return done(err);
              }
              options.cacheVersion = version.substr(4);
              done();
            }.bind(this)
          );
        }
      }
    },

    smtpVersion: function() {
      if (options.mailhog) {
        if (options['offline']) {
          options.smtpVersion = 0;
        }
        else {
          var done = this.async();
          require('../lib/drupalProjectVersion')
            .latestRelease('smtp', options.drupalDistroVersion, done, function(err, version, done) {
              if (err) {
                this.log.error(err);
                return done(err);
              }
              options.smtpVersion = version.substr(4);

              done();
            }.bind(this)
          );
        }
      }
    },

    gdtBase: function() {
      // Load existing composer.json now since it will get overridden by template.
      this.composerOrig = this.fs.readJSON('composer.json');
      this.fs.copy(
        path.resolve(this.templatePath('gdt'), '**', '*'),
        this.destinationRoot(),
        {
          globOptions: { dot: true }
        }
      );
      this.fs.copyTpl(
        path.resolve(this.templatePath('gdt'), 'test', 'behat.yml'),
        path.resolve(this.destinationRoot(), 'test', 'behat.yml'),
        options
      );
    },

    // This has been moved up from writing because the details of some of these
    // files may need to be loaded as part of configuring other write operations,
    // and the parallelization model for generator composition requires
    // dependencies to be handled in an earlier priority context.
    distroAdditions: function () {
      var srcFiles = path.resolve(
        this.templatePath('drupal'),
        options.drupalDistro.id,
        options.drupalDistroVersion
      );

      if (gadget.fsExistsSync(srcFiles)) {
        this.fs.copy(
          path.resolve(srcFiles),
          this.destinationRoot(),
          {
            globOptions: { dot: true }
          }
        );
      }
    },

    // While there are write operations in this, other write operations may need
    // to examine the composer.json to determine their own configuration.
    composerJson: function () {
      // Import any existing composer.json that was saved above.
      var composer = {};
      var isNewProject = (this.composerOrig == undefined);
      if (isNewProject) {
        // Project hasn't been generated yet, so start with composer template.
        composer = this.fs.readJSON('composer.json');
      }
      else {
        // Use original composer file if project already generated.
        composer = this.composerOrig;
      }

      composer.name = options.projectName;
      composer.description = options.projectDescription;
      // Allow distros to modify the composer.json.
      if (typeof options.drupalDistro.modifyComposer == 'function') {
        var done = this.async();
        composer = options.drupalDistro.modifyComposer(this, options, composer, isNewProject, done);
      }
      this.fs.writeJSON('composer.json', composer);
    }
  },

  writing: {


    projectResources: function () {
      this.fs.copy(
        this.templatePath('project/gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('project/editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    packageJson: function () {
      var pkg = this.fs.readJSON('package.json');

      // Inject grunt-drupal-tasks into the dependency list.
      pkg.dependencies['grunt-drupal-tasks'] = gadget.npmVersion(
        'grunt-drupal-tasks',
        '//github.com/phase2/grunt-drupal-tasks.git',
        this.options['use-master'] || this.options['offline']
      );

      pkg.name = options.projectName;
      pkg.description = options.projectDescription;

      if (!pkg['scripts']) {
        pkg.scripts = {};
      }
      if (!pkg.scripts['postinstall'] && options['themePath']) {
        pkg.scripts['postinstall'] = 'cd ' + options.themePath + ' && npm install';
      }

      this.fs.writeJSON('package.json', pkg);
    },

    gruntConfig: function () {
      var gcfg = this.fs.readJSON('Gruntconfig.json');

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

      gcfg.project = { 'profile': options.drupalDistro.profile };
      gcfg.generated = { name: this.pkg.name, version: this.pkg.version };

      this.fs.writeJSON('Gruntconfig.json', gcfg);
    },

    readme: function () {
      if (!options['skip-readme']) {
        this.fs.copyTpl(
          this.templatePath('README.md'),
          this.destinationPath('README.md'),
          // Extracted to facilitate parallel README generation by a parent.
          gadget.tokens(options)
        );
      }
    },

    drushMakefile: function () {
      // Make files only for 7.x and less.
      var coreVersion = require('../lib/drupalProjectVersion').numericCoreVersion(options.drupalDistroVersion);
      if (coreVersion < 8) {
        this.log('Setting up Drush makefile to install Drupal Distribution '
          + options.drupalDistro.option.name + ' version '
          + chalk.red(options.drupalDistroRelease) + '.\n');
        var done = this.async();
        options.drupalDistro.drushMakeFile(this, options, done);
      }
    }
  },

  install: function () {
    if (!options['skip-install'] && !options['offline']) {
      this.npmInstall();
    }
  },

  end: function () {
    if (!options['skipGoodbye']) {
      this.log('\nGadget has ' + chalk.red('finished')
        + ' setting up the Drupal project scaffold with Grunt Drupal Tasks!\n');
      this.log('Run `' + chalk.red('grunt')
        + '` to start the first build of this project.\n');
    }
  }
});
