/*global require*/
"use strict";

var gulp = require('gulp'),
    path = require('path'),
    // data = require('gulp-data'),
    pug = require('gulp-pug'),
    faker = require('gulp-faker'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync');

/*
 * Directories here
 */
var paths = {
    public: './public/',
    sass: './src/sass/',
    css: './public/css/',
    js: './public/js/'
    // data: './src/_data/'
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('pug', function () {
    return gulp.src('./src/*.pug')

        .pipe(pug({
            pretty: true
        }))
        .pipe(faker())
        .on('error', function (err) {
            process.stderr.write(err.message + '\n');
            this.emit('end');
        })
        .pipe(gulp.dest(paths.public))
});

// Move the javascript files into our /src/js folder
gulp.task('js', function () {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.stream());
});
/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('rebuild', ['pug'], function () {
    browserSync.reload();
});

/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'pug'], function () {
    browserSync({
        server: {
            baseDir: paths.public
        },
        notify: false
    });
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
    return gulp.src(paths.sass + '*.scss')
        .pipe(sass({
            includePaths: [paths.sass],
            // outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(paths.sass + '**/*.scss', ['sass']);
    gulp.watch('./src/**/*.pug', ['rebuild']);
});

// Build task compile sass and pug.
gulp.task('build', ['sass', 'pug']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch', 'js']);
