'use strict';

import gulp from 'gulp';
import del from 'del';
import gulpHtmlMin from 'gulp-htmlmin';
import gulpSass from 'gulp-sass';
import gulpCssNano from 'gulp-cssnano';
import gulpTypescript from 'gulp-typescript';
import browserSync from 'browser-sync';
import merge2 from 'merge2';
import gulpConcat from 'gulp-concat';
import gulpNunjucksRender from 'gulp-nunjucks-render';

const BROWSER_SYNC_RELOAD = browserSync.reload;

const PROJECT = {
    SRC: 'src',
    DEST: 'dist'
};

const PATH = {
    HTML_SRC: `${PROJECT.SRC}/**/*.html`,
    HTML_DEST: `${PROJECT.DEST}`,
    SCSS_SRC: `${PROJECT.SRC}/scss/**/*.scss`,
    SCSS_DEST: `${PROJECT.DEST}/css`,
    TS_SRC: `${PROJECT.SRC}/ts/**/*.ts`,
    TS_DEST: `${PROJECT.DEST}/js`,
    NUNJUCKS_SRC: `${PROJECT.SRC}/**/*.nunjucks`,
    NUNJUCKS_DEST: `${PROJECT.DEST}`,
    NUNJUCKS_TEMPLATES: `${PROJECT.SRC}/nunjucks-templates`
};

gulp.task('html', () => {
    return merge2(
        gulp.src([PATH.NUNJUCKS_SRC, `!${PATH.NUNJUCKS_TEMPLATES}/**/*.nunjucks`])
            .pipe(gulpNunjucksRender({
                path: [PATH.NUNJUCKS_TEMPLATES]
            })),
        gulp.src(PATH.HTML_SRC) // regular HTML files
    )
        .pipe(gulpHtmlMin({
            collapseWhitespace: true, // most important, remove unnecessary spaces and line breaks
            removeRedundantAttributes: true,
            removeEmptyAttributes: true, // <html lang=""> gets removed
            removeComments: true
        }))
        .pipe(gulp.dest(PATH.HTML_DEST)); // output files
});

gulp.task('styles', () => {
    return merge2(
        gulp.src(PATH.SCSS_SRC)
            .pipe(gulpSass()).on('error', gulpSass.logError),
        gulp.src('node_modules/normalize.css/normalize.css')
    )
        .pipe(gulpConcat('main.css'))
        .pipe(gulpCssNano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(gulp.dest(PATH.SCSS_DEST));
});

gulp.task('typescript', () => {
    return gulp.src(PATH.TS_SRC)
        .pipe(gulpTypescript({
            noImplicitAny: true,
            out: 'main.js'
        }))
        .pipe(gulp.dest(PATH.TS_DEST))
});

gulp.task('serve', ['build'], () => {
    browserSync({
        server: [PROJECT.DEST],
        port: 3000
    });
    gulp.watch([PATH.HTML_SRC, PATH.NUNJUCKS_SRC], ['html', BROWSER_SYNC_RELOAD]);
    gulp.watch(PATH.SCSS_SRC, ['styles', BROWSER_SYNC_RELOAD]);
    gulp.watch(PATH.TS_SRC, ['typescript', BROWSER_SYNC_RELOAD]);
});

gulp.task('clean', () =>
    del.sync([PROJECT.DEST])
);

gulp.task('build', ['clean', 'html', 'styles', 'typescript']);

gulp.task('default',
    ['build']
);