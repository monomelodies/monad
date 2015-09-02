
var gulp = require('gulp');
var concat = require('gulp-concat');
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

gulp.task('styles', function() {

    gulp.src('./bower_components/bootstrap-sass/assets/{fonts,images}/**/*.*', {base: './bower_components/bootstrap-sass/assets'})
        .pipe(gulp.dest('./dist'));

    gulp.src('./src/_sass/default.scss')
        .pipe(compass({
            css: 'dist',
            sass: 'src/_sass',
            import_path: ['./bower_components/bootstrap-sass/assets/stylesheets']
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
    './bower_components/angular-sanitize/angular-sanitize.js',
    './bower_components/autofill-event/src/autofill-event.js',
    './bower_components/angular-gettext/dist/angular-gettext.js'
];

gulp.task('libraries', function() {

    gulp.src(scripts)
        .pipe(concat('libraries.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('expose', function() {

    gulp.src('./assets/**/*.png', {base: './assets'})
        .pipe(gulp.dest('./dist'));

    gulp.src('./src/**/*.{html,json}', {base: './src'})
        .pipe(gulp.dest('./dist'));

    gulp.src('./LICENSE')
        .pipe(concat('LICENSE.txt'))
        .pipe(gulp.dest('./dist'));

});

gulp.task('watch', function() {

    gulp.watch(['./bower_components/bootstrap-sass/assets/stylesheets/**/*.scss', './src/_sass/**/*.scss'], ['styles']);
    gulp.watch(['./assets/**/*.png', './src/**/*.{html,json}', './LICENSE'], ['expose']);

});

gulp.task('default', ['libraries', 'styles', 'expose', 'watch']);

