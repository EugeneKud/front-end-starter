'use strict';

import gulp from 'gulp';
import del from 'del';
import htmlMin from 'gulp-htmlmin';

const dir = {
    src: 'src',
    dest: 'dist'
};

const path = {
    htmlSrc: `${dir.src}/**/*.html`,
    htmlDest: `${dir.dest}`
};

gulp.task('html', () => {
    return gulp.src(path.htmlSrc)
        .pipe(htmlMin({
            collapseWhitespace: true, // most important, remove unnecessary spaces and line breaks
            removeRedundantAttributes: true,
            removeEmptyAttributes: true // <html lang=""> gets removed
        }))
        .pipe(gulp.dest(path.htmlDest)); // output files
});

gulp.task('clean', () => del.sync(['dist']));

gulp.task('default', ['clean', 'html']);