'use strict';

import gulp from 'gulp';
import del from 'del';
import htmlMin from 'gulp-htmlmin';

gulp.task('html', () => {
    return gulp.src('src/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true, // most important, remove unnecessary spaces and line breaks
            removeRedundantAttributes: true,
            removeEmptyAttributes: true
        }))
        .pipe(gulp.dest('dist')); // output files
});

gulp.task('clean', () => del(['dist']));

gulp.task('default', ['clean', 'html']);