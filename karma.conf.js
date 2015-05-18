
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: [
        'dist/bundle.js',
        'bower_components/ckeditor/ckeditor.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'tests/**/*.spec.js',
        '**/*.html'
    ],
    ngHtml2JsPreprocessor: {
        moduleName: 'TEMPLATES',
        prependPrefix: 'monad/'
    },
    exclude: [
    ],
    preprocessors: {
        'tests/**/*.js': ['browserify'],
        '**/*/*.html': ['ng-html2js']
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
