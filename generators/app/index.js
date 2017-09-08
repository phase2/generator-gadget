'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');

var gadget = require('../lib/util');
var drupalOrgApi = require('../lib/drupalProjectVersion');

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

    if (this.options.hasOwnProperty('drupalDistro') && typeof self.options.drupalDistro === 'string') {
      var distros = require('../lib/distros');
      self.options.drupalDistro = distros[self.options.drupalDistro];
    }

    if (this.options.hasOwnProperty('drupal-distro') && typeof self.options['drupal-distro'] === 'string') {
      var distros = require('../lib/distros');
      self.options['drupalDistro'] = distros[self.options['drupal-distro']];
    }

    var prompts = require('../lib/prompts');
    prompts = _.filter(prompts, function (item) {
      return _.isUndefined(self.options[item.name]);
    });

    if (!self.options['cacheInternal']) {
      self.options.cacheInternal = 'database';
    }
    // The generator uses a separate options object, let's make sure it is not
    // dependent on prompt processing.
    options = self.options;

    return this.prompt(prompts).then(function (props) {
      options = _.assign(props, self.options);
      this.log("\nOk, I'm going to start assembling this project...");
    }.bind(self));
  },

  configuring: {
    // Determine the latest stable release for the requested Drupal core version.
    getDistroRelease: function () {
      if (options['offline']) {
        options.drupalDistroRelease = '0.0.0';
      }
      else {
        // Find the latest stable release for the Drupal distro version.
        var done = this.async();
        options.drupalDistro.releaseVersion(options.drupalDistroVersion, done, function(err, version, done) {
          if (err) {
            this.env.error('Could not retrieve distribution project info: ' + err);
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
          // the other options for cache are redis and memcache, which happen
          // to be the names of the contrib modules that integrate with them.
          drupalOrgApi.latestRelease(options.cacheInternal, options.drupalDistroVersion, done,
            function(err, version, done) {
              if (err) {
                this.env.error('Could not retrieve project info for selected cache system: ' + err);
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
      if (options.mail == 'mailhog') {
        if (options['offline']) {
          options.smtpVersion = 0;
        }
        else {
          var done = this.async();
          drupalOrgApi.latestRelease('smtp', options.drupalDistroVersion, done,
            function(err, version, done) {
              if (err) {
                this.env.error('Could not retrieve project info for selected mail system: ' + err);
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
      // Load any existing composer.json now before it is overridden by template.
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

    generateProfile: function() {
      if (options.doGenerateProfile) {
        // When executed via test, defaulting to use a profile will work but
        // producing a default profile name does not because of the conditional
        // prompt logic. This reintroduces the same default value.
        options.projectProfile = options.projectProfile || options.projectName;
        options.projectProfileLabel = gadget.labelMaker(options.projectProfile);
        options.parentProfile = (options.drupalDistro.id != 'drupal') ? options.drupalDistro.id : '';
        this.fs.copyTpl(
          path.resolve(this.templatePath('profile'), 'profile-name.info.yml'),
          path.resolve(this.destinationRoot(), 'src', 'profiles', options.projectProfile, options.projectProfile + '.info.yml'),
          options
        );
        this.fs.copyTpl(
          path.resolve(this.templatePath('profile'), 'profile-name.profile'),
          path.resolve(this.destinationRoot(), 'src', 'profiles', options.projectProfile, options.projectProfile + '.profile'),
          options
        );
      }
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

      this.composer = options.drupalDistro.loadComposer(this, options);
    },

    // While there are write operations in this, other write operations may need
    // to examine the composer.json to determine their own configuration.
    prepareComposerJson: function () {
      var isNewProject = (this.composerOrig == undefined);
      if (!isNewProject) {
        // Use original composer file if project already generated.
        this.composer = this.composerOrig;
      }

      this.composer.name = 'organization/' + options.projectName;
      this.composer.description = options.projectDescription;
      // Allow distros to modify the composer.json.
      if (typeof options.drupalDistro.modifyComposer == 'function') {
        var done = this.async();
        options.drupalDistro.modifyComposer(options, this.composer, isNewProject, done, function(err, result, done) {
          if (!err && result) {
            this.composer = result;
          }
          else {
            this.log.warning("Could not retrieve Octane's composer.json: "  + err);
            return done(err);
          }
          done();
        }.bind(this));
      }
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
        pkg.scripts['postinstall'] = 'cd ' + path.join(options.themePath, options.themeName) + ' && npm install';
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
          path: path.join(options.themePath, options.themeName)
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

      gcfg.project = { 'profile': options.projectProfile || options.drupalDistro.profile };
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

    composerJson: function() {
      this.fs.writeJSON('composer.json', this.composer);
    },

    drushMakefile: function () {
      // Make files only for 7.x and less.
      var coreVersion = drupalOrgApi.numericCoreVersion(options.drupalDistroVersion);
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
