const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

// Compile Sass
gulp.task('sass', function(){
    return gulp.src(['src/styles/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// Watch and serve
gulp.task('serve', ['sass'], function(){
    browserSync.init({
        server: './src'
    });

    gulp.watch(['src/styles/*.scss'], ['sass']);
    gulp.watch(['src/*.html']).on('change', browserSync.reload);
});

// add minify task

// add autoprefixer task

// Default
gulp.task('default', ['serve']);