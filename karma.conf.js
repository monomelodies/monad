
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: [
        'dist/ckeditor/ckeditor.js',
        'dist/libraries.js',
        'dist/bundle.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'tests/setup.js',
        'tests/**/*.spec.js',
        'src/**/*.html'
    ],
    ngHtml2JsPreprocessor: {
        moduleName: 'TEMPLATES',
        stripPrefix: 'src\/',
        prependPrefix: '../monad/'
    },
    exclude: [
    ],
    preprocessors: {
        'tests/**/*.js': ['babel'],
        'src/**/*.html': ['ng-html2js']
    },
    babelPreprocessor: {
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

