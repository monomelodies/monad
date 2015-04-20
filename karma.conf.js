
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: [
        'dist/libraries.js',
        'vendor/ckeditor/ckeditor.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'tests/**/*.js'
    ],
    exclude: [
    ],
    preprocessors: {
        'tests/**/*.js': ['browserify']
    },
    browserify: {
        debug: true,
        transform: ['babelify']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
