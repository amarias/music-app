const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// Copy All HTML Files to Dist
function copyHtml(finish) {
    gulp.src(['./src/*.html'])
        .pipe(gulp.dest('./dist'));
    finish();
}

// Copy CSS, Compile Sass and Add Vendor Prefixes
function styles(finish) {
    gulp.src(['./src/styles/*'])
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/styles'));
    finish();
}

// Concat JS Files then Minify
function scripts(finish) {
    gulp.src(['./src/scripts/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/scripts'));
    finish();
}

// Optimize Images
function images(finish) {
    gulp.src(['./src/images/*'])
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'));
    finish();
}

// Copy Sounds
function sounds(finish) {
    gulp.src(['./src/sounds/*'])
        .pipe(gulp.dest('./dist/sounds'));
    finish();
}

// BrowserSync
function browser_sync() {
    browserSync.init({
        server: './dist'
    });
}

function reload(finish){
    browserSync.reload();
    finish();
}

// Watch
function watchFiles() {
    gulp.watch('./src/images/*', gulp.series(images, reload));
    gulp.watch('./src/sounds/*', gulp.series(sounds, reload));
    gulp.watch('./src/*.html', gulp.series(copyHtml, reload));
    gulp.watch('./src/styles/*.scss', gulp.series(styles, reload));
    gulp.watch('./src/scripts/*.js', gulp.series(scripts, reload));
}

const build = gulp.parallel(copyHtml, styles, scripts, images, sounds);

exports.build = build;
exports.default = gulp.series(build, gulp.parallel(browser_sync, watchFiles));