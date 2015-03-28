
var gulp = require('gulp');
var watch = require('gulp-watch');
var compass = require('gulp-compass');

gulp.task('styles', function() {
    gulp.src('./_sass/default.scss').
         pipe(compass({
            css: 'css',
            sass: '_sass'
         })).
         pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
    gulp.watch('_sass/**/*.scss', ['styles']);
});

gulp.task('default', function() {
});

