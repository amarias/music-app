const del = require("del");
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// Clean Dist
function clean(){
    return del('./dist/');
}

// Copy All HTML Files to Dist
function copyHtml(done) {
    gulp.src(['./src/*.html'])
        .pipe(gulp.dest('./dist'));
    done();
}

// Copy CSS, Compile Sass and Add Vendor Prefixes
function styles(done) {
    gulp.src(['./src/styles/*'])
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/styles'));
    done();
}

// Concat JS Files then Minify
function scripts(done) {
    gulp.src(['./src/scripts/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/scripts'));
    done();
}

// Optimize Images
function images(done) {
    gulp.src(['./src/images/*'])
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'));
    done();
}

// Copy Sounds
function sounds(done) {
    gulp.src(['./src/sounds/*'])
        .pipe(gulp.dest('./dist/sounds'));
    done();
}

// BrowserSync
function browser_sync() {
    browserSync.init({
        server: './dist'
    });
}

function reload(done){
    browserSync.reload();
    done();
}

// Watch
function watchFiles() {
    gulp.watch('./src/images/*', gulp.series(images, reload));
    gulp.watch('./src/sounds/*', gulp.series(sounds, reload));
    gulp.watch('./src/*.html', gulp.series(copyHtml, reload));
    gulp.watch('./src/styles/*.scss', gulp.series(styles, reload));
    gulp.watch('./src/scripts/*.js', gulp.series(scripts, reload));
}

// Tasks
const build = gulp.series(clean, gulp.parallel(copyHtml, styles, scripts, images, sounds));

exports.clean = clean;
exports.build = build;
exports.default = gulp.series(build, gulp.parallel(browser_sync, watchFiles));