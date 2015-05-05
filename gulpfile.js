
var gulp = require('gulp');
var watch = require('gulp-watch');
var compass = require('gulp-compass');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');

gulp.task('styles', function() {
    gulp.src('./src/_sass/default.scss').
         pipe(compass({
            css: 'dist',
            sass: 'src/_sass'
         })).
         pipe(minifyCss()).
         pipe(gulp.dest('dist'));
});

var scripts = [
    './node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js',
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/angular/angular.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    './bower_components/angular-route/angular-route.min.js',
    './bower_components/angular-translate/angular-translate.min.js',
    './bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js',
    './bower_components/ng-ckeditor/ng-ckeditor.min.js',
    './bower_components/ng-file-upload/ng-file-upload-all.min.js',
    './bower_components/angular-sanitize/angular-sanitize.min.js',
    './bower_components/autofill-event/src/autofill-event.js'
];
gulp.task('scripts', function() {
    gulp.src(scripts).
         pipe(concat('libraries.js')).
         pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('src/_sass/**/*.scss', ['styles']);
    gulp.watch(scripts, ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'watch']);

