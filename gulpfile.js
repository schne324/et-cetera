'use strict';

var gulp = require('gulp');
var path = require('path');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');

var BUILD_DIR = 'build';

gulp.task('default', ['templates', 'styles', 'scripts']);

gulp.task('templates', function () {
	gulp.src(path.join('templates', '**/*.jade'))
		.pipe(jade())
		.pipe(gulp.dest(BUILD_DIR));
});

gulp.task('styles', function () {
	gulp.src(path.join('styles', '**/*.styl'))
		.pipe(stylus())
		.pipe(gulp.dest(BUILD_DIR));
});

gulp.task('scripts', function () {
	gulp.src(path.join('scripts', '**/*.js'))
		.pipe(gulp.dest(BUILD_DIR));
});

gulp.task('watch', function () {
	gulp.watch('templates/**/*.jade', ['templates']);
	gulp.watch('styles/**/*.styl', ['styles']);
	gulp.watch('scripts/**/*.js', ['scripts']);
});