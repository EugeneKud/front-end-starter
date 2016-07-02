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
    DEST: 'dist',
    CSS_OUTPUT_FILE: 'main.css',
    JS_OUTPUT_FILE: 'main.js'
};

const PATH = {
    HTML_SRC: `${PROJECT.SRC}/**/*.html`,
    HTML_DEST: `${PROJECT.DEST}`,
    NUNJUCKS_SRC: `${PROJECT.SRC}/**/*.nunjucks`,
    NUNJUCKS_TEMPLATES_FOLDER: `${PROJECT.SRC}/nunjucks-templates`,
    CSS_SRC: `${PROJECT.SRC}/styles/**/*.css`,
    SCSS_SRC: `${PROJECT.SRC}/styles/**/*.scss`,
    STYLES_DEST: `${PROJECT.DEST}/css`,
    JS_SRC: `${PROJECT.SRC}/scripts/**/*.js`,
    TS_SRC: `${PROJECT.SRC}/scripts/**/*.ts`,
    SCRIPTS_DEST: `${PROJECT.DEST}/js`
};

const DEPENDENCIES = {
    NORMALIZE_CSS: 'node_modules/normalize.css/normalize.css'
};

gulp.task('html', () => {
    return merge2(
        gulp.src([PATH.NUNJUCKS_SRC, `!${PATH.NUNJUCKS_TEMPLATES_FOLDER}/**/*.nunjucks`])
            .pipe(gulpNunjucksRender({
                path: [PATH.NUNJUCKS_TEMPLATES_FOLDER]
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
        gulp.src(DEPENDENCIES.NORMALIZE_CSS),
        gulp.src(PATH.SCSS_SRC)
            .pipe(gulpSass()).on('error', gulpSass.logError),
        gulp.src(PATH.CSS_SRC)
    )
        .pipe(gulpConcat(PROJECT.CSS_OUTPUT_FILE))
        .pipe(gulpCssNano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(gulp.dest(PATH.STYLES_DEST));
});

gulp.task('scripts', () => {
    return merge2(gulp.src(PATH.TS_SRC)
            .pipe(gulpTypescript({
                noImplicitAny: true
            })),
        gulp.src(PATH.JS_SRC)
    )
        .pipe(gulpConcat(PROJECT.JS_OUTPUT_FILE))
        .pipe(gulp.dest(PATH.SCRIPTS_DEST))
});

gulp.task('serve', ['build'], () => {
    browserSync({
        server: [PROJECT.DEST],
        port: 3000
    });
    gulp.watch([PATH.HTML_SRC, PATH.NUNJUCKS_SRC], ['html', BROWSER_SYNC_RELOAD]);
    gulp.watch([PATH.CSS_SRC, PATH.SCSS_SRC], ['styles', BROWSER_SYNC_RELOAD]);
    gulp.watch([PATH.JS_SRC, PATH.TS_SRC], ['scripts', BROWSER_SYNC_RELOAD]);
});

gulp.task('clean', () =>
    del.sync([PROJECT.DEST])
);

gulp.task('build', ['clean', 'html', 'styles', 'scripts']);

gulp.task('default',
    ['build']
);