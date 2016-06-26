'use strict';

import gulp from 'gulp';
import del from 'del';
import htmlMin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import cssNano from 'gulp-cssnano';

const dir = {
    src: 'src',
    dest: 'dist'
};

const path = {
    htmlSrc: `${dir.src}/**/*.html`,
    htmlDest: `${dir.dest}`,
    scssSrc: `${dir.src}/scss/**/*.scss`,
    scssDest: `${dir.dest}/css`
};

gulp.task('html', () => {
    return gulp.src(path.htmlSrc)
        .pipe(htmlMin({
            collapseWhitespace: true, // most important, remove unnecessary spaces and line breaks
            removeRedundantAttributes: true,
            removeEmptyAttributes: true, // <html lang=""> gets removed
            removeComments: true
        }))
        .pipe(gulp.dest(path.htmlDest)); // output files
});

gulp.task('styles', () => {
    return gulp.src(path.scssSrc)
        .pipe(sass())
        .pipe(cssNano())
        .pipe(gulp.dest(path.scssDest));
});

gulp.task('clean', () => del.sync(['dist']));

gulp.task('default', ['clean', 'html', 'styles']);