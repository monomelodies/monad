
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
    './vendor/jquery/dist/jquery.min.js',
    './vendor/bootstrap/dist/js/bootstrap.min.js',
    './vendor/angular/angular.min.js',
    './vendor/angular-route/angular-route.min.js',
    './vendor/angular-translate/angular-translate.min.js',
    './vendor/ng-ckeditor/ng-ckeditor.min.js',
    './vendor/ng-file-upload/ng-file-upload-all.min.js',
    './vendor/angular-sanitize/angular-sanitize.min.js'
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

