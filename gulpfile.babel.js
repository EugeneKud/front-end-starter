'use strict';

import gulp from 'gulp';
import del from 'del';
import htmlMin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import cssNano from 'gulp-cssnano';
import typescript from 'gulp-typescript';
import browserSync from 'browser-sync';

const reload = browserSync.reload;

const dir = {
    src: 'src',
    dest: 'dist'
};

const path = {
    htmlSrc: `${dir.src}/**/*.html`,
    htmlDest: `${dir.dest}`,
    scssSrc: `${dir.src}/scss/**/*.scss`,
    scssDest: `${dir.dest}/css`,
    tsSrc: `${dir.src}/ts/**/*.ts`,
    tsDest: `${dir.dest}/js`
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

gulp.task('typescript', () => {
    return gulp.src(path.tsSrc)
        .pipe(typescript({
            noImplicitAny: true,
            out: 'main.js'
        }))
        .pipe(gulp.dest(path.tsDest))
});

gulp.task('clean', () => del.sync(['dist']));

gulp.task('default', ['clean', 'html', 'styles', 'typescript']);

gulp.task('serve', () => {
    browserSync({
        server: [dir.dest],
        port: 3000
    });

    gulp.watch(path.htmlSrc, ['html', reload]);
    gulp.watch(path.scssSrc, ['styles', reload]);
    gulp.watch(path.tsSrc, ['typescript', reload]);
});