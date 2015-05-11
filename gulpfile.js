
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jsx = require('gulp-jsxtransform');

gulp.task('bundle', function() {
    gulp.src('./todo/static/todo/storage.js')
        .pipe(browserify({debug:true}))
        .pipe(gulp.dest('./build/static/todo/js'));
});

gulp.task('bundle-libs', function() {
    gulp.src('./todo/static/todo/libs.js')
        .pipe(browserify({insertGlobals: true}))
        .pipe(gulp.dest('./build/static/todo/js'));
});

gulp.task('jsx', function() {
    gulp.src('./todo/static/todo/list_components.js')
        .pipe(jsx({harmony:true}))
        .pipe(gulp.dest('./build/static/todo/js'));
});

gulp.task('build', ['jsx', 'bundle-libs', 'bundle'], function(){});
