
var gulp = require('gulp');
var watch = require('gulp-watch');
var compass = require('gulp-compass');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var bootstrap = [
    './bower_components/bootstrap/dist/css/bootstrap.min.css',
    './bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
];
gulp.task('styles', function() {

    gulp.src(bootstrap)
        .pipe(concat('bootstrap.css'))
        .pipe(gulp.dest('dist'));

    gulp.src('./src/_sass/default.scss')
        .pipe(compass({
            css: 'dist',
            sass: 'src/_sass'
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));

});

var scripts = [
    './node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js',
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
gulp.task('scripts', function() {

    gulp.src('./bower_components/ckeditor/**/*.*', {base: './bower_components'})
        .pipe(gulp.dest('./dist/'));

    gulp.src(scripts)
        .pipe(concat('libraries.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));

});

gulp.task('watch', function() {

    gulp.watch(bootstrap.concat(['./src/_sass/**/*.scss']), ['styles']);
    gulp.watch(scripts.concat(['./bower_components/ckeditor/**/*.*']), ['scripts']);

});

gulp.task('default', ['styles', 'scripts', 'watch']);

