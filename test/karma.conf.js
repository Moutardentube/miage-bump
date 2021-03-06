// Karma configuration

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '../node_modules/angular/angular.js',                             // angular
      '../node_modules/angular-ui-router/release/angular-ui-router.js', // ui-router
      '../node_modules/angular-mocks/angular-mocks.js',                 // loads our modules for tests
      '../demo/bower_components/angular-ui-ace/ui-ace.js',
      '../demo/bower_components/angular-ui-router/release/angular-ui-router.js',
      '../demo/bower_components/angular-animate/angular-animate.js',
      '../demo/bower_components/angular-aria/angular-aria.js',
      '../demo/bower_components/angular-material/angular-material.js',
      '../demo/bower_components/angular-material/angular-material-mocks.js',
      '../demo/bower_components/eklabs.angularStarterPack/release/eklabs.angularStarterPack.js',
      '../demo/build/miage.bump.js',
      '../demo/build/miage.bump_view.js',
      'specs/unitTest.specs.js',
      'specs/bump.specs.js',
      'specs/directive.bump.button.specs.js',
      'specs/directive.bump.profile.specs.js',
      'specs/directive.bump.tops.specs.js',
      'specs/directive.bump.trends.specs.js',
      'specs/directive.bump.matches.specs.js',
      'specs/navigation.specs.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
