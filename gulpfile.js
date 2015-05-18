
var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var watchify = require('watchify');
var babel = require('gulp-babel');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var compass = require('gulp-compass');
var minifyCss = require('gulp-minify-css');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');

var bootstrap = [
    './bower_components/bootstrap/dist/css/bootstrap.min.css',
    './bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
];
gulp.task('styles', function() {

    gulp.src(bootstrap)
        .pipe(concat('bootstrap.css'))
        .pipe(gulp.dest('dist'));

    gulp.src('./bower_components/bootstrap/dist/fonts/**/*.*', {base: './bower_components/bootstrap/dist'})
        .pipe(gulp.dest('./'));

    gulp.src('./src/_sass/default.scss')
        .pipe(compass({
            css: 'dist',
            sass: 'src/_sass'
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));

});

var scripts = [
    './node_modules/babel-core/browser-polyfill.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/angular/angular.js',
    './bower_components/angular-bootstrap/ui-bootstrap.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    './bower_components/angular-route/angular-route.js',
    './bower_components/angular-translate/angular-translate.js',
    './bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js',
    './bower_components/angular-ckeditor/angular-ckeditor.js',
    './bower_components/ng-file-upload/ng-file-upload-all.js',
    './bower_components/angular-sanitize/angular-sanitize.js',
    './bower_components/autofill-event/src/autofill-event.js'
];

var customopts = {
    entries: './src/angular.js',
    debug: true
};
var opts = assign({}, watchify.args, customopts);
var b = watchify(browserify(opts));
b.transform(babelify);

function bundle() {
    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
};

gulp.task('bundle', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

gulp.task('expose', function() {

    gulp.src(scripts)
        .pipe(concat('libraries.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));

    gulp.src('./bower_components/ckeditor/**/*.*', {base: './bower_components'})
        .pipe(gulp.dest('./dist'));

    gulp.src('./assets/**/*.png', {base: './assets'})
        .pipe(gulp.dest('./dist'));

    gulp.src(['./src/**/*.html', './src/**/*.json'], {base: './src'})
        .pipe(gulp.dest('./dist'));

});

gulp.task('watch', function() {

    gulp.watch(bootstrap.concat(['./src/_sass/**/*.scss']), ['styles']);
    gulp.watch(scripts.concat(['./bower_components/ckeditor/**/*.*', './src/**/*.html', './src/**/*.json', './assets/**/*.png']), ['expose']);

});

gulp.task('default', ['styles', 'expose', 'bundle', 'watch']);

