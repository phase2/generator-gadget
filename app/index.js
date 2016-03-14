'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');

var gadget = require('../lib/util');

var options = {};

module.exports = yeoman.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');

    if (!this.options.skipWelcome) {
      this.log(yosay(
        'Welcome to ' + chalk.red.bold('Gadget ' + this.pkg.version)
        + ', the gnarly generator for Grunt Drupal Tasks!'
      ));
    }
  },

  prompting: function () {
    var self = this;
    var done = this.async();

    if (this.options.hasOwnProperty('drupalDistro') && typeof this.options.drupalDistro === 'string') {
      var distros = require('../app/distros');
      this.options.drupalDistro = distros[this.options.drupalDistro];
    }

    var prompts = require('../lib/prompts');
    prompts = _.filter(prompts, function (item) {
      return _.isUndefined(self.options[item.name]);
    });

    this.prompt(prompts, function (props) {
      options = _.assign(props, this.options);
      if (!options['cacheInternal']) {
        options.cacheInternal = 'database';
      }
      this.log("\nOk, I'm going to start assembling this project...");
      done();
    }.bind(this));
  },

  configuring: {
    // Determine the latest stable release for the requested Drupal core version.
    getDistroRelease: function () {
      // Provide a fallback value in case the request fails.
      options.drupalDistroRelease = options.drupalDistroVersion;

      // Handle version used by updates.drupal.org for 8.x.x releases.
      options.majorVersionForUpdateSystem = options.drupalDistroVersion;
      if (options.majorVersionForUpdateSystem.match(/^8\.\d+\.x$/)) {
        options.majorVersionForUpdateSystem = '8.x';
      }

      if (options['offline']) {
        options.drupalDistroRelease = 0;
      }
      else {
        // Find the latest stable release for the Drupal distro version.
        var done = this.async();
        options.drupalDistro.releaseVersion(options.majorVersionForUpdateSystem, done, function(err, version, done) {
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
            .latestRelease(options.cacheInternal, options.majorVersionForUpdateSystem, done, function(err, version, done) {
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

    gdtBase: function() {
      this.fs.copy(
        path.resolve(this.templatePath('gdt'), '**', '*'),
        this.destinationRoot(),
        {
          globOptions: { dot: true }
        }
      );
    }
  },

  writing: {
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
    if (!options['skipGoodbye']) {
      this.log('\nGadget has ' + chalk.red('finished')
        + ' setting up the Drupal project scaffold with Grunt Drupal Tasks!\n');
      this.log('Run `' + chalk.red('grunt')
        + '` to start the first build of this project.\n');
    }
  }
});
