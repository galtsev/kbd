
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jsx = require('gulp-jsxtransform');
var del = require('del');
var swig_transform = require('gulp-swig');

gulp.task('copy', function() {
    return gulp.src('./todo/static/todo/js/*.js')
        .pipe(gulp.dest('./build/static/todo/js'));
});

gulp.task('bundle', ['jsx', 'copy'], function() {
    return gulp.src('./build/static/todo/js/main.js')
        .pipe(browserify({debug:true}))
        .pipe(gulp.dest('./dist/static/todo/js'));
});

gulp.task('bundle-libs', ['copy'], function() {
    return gulp.src('./build/static/todo/js/libs.js')
        .pipe(browserify({insertGlobals: true}))
        .pipe(gulp.dest('./dist/static/todo/js'));
});

gulp.task('jsx', function() {
    return gulp.src('./todo/static/todo/jsx/*.js')
        .pipe(jsx({harmony:true}))
        .pipe(gulp.dest('./build/static/todo/js'));
});

gulp.task('clean', function(cb) {
    del(['./dist', './build'], cb)
});

gulp.task('watch', function() {
    gulp.watch('./todo/static/todo/{js,jsx}/*.js', ['bundle']);
});

gulp.task('swig', function() {
    var opts = {
        data: {
            static_url: "/static/"
        }
    };
    return gulp.src('./todo/static/todo/html/*.swig')
        .pipe(swig_transform(opts))
        .pipe(gulp.dest('./dist/static/todo/html'));
});

gulp.task('build', ['bundle-libs', 'bundle', 'swig']);
