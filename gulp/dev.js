const gulp = require('gulp');

//HTML
const fileInclude = require('gulp-file-include');

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');

// Clean task
gulp.task('clean:dev', function(done) {
    if (fs.existsSync('./build/')) {
        return gulp.src('./build/', {read: false})
            .pipe(clean({force: true}));
    }

    done();
});

// File include settings task
const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file',
};

// Plumber notify task
const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false,
        }),
    };
}

// HTML task
gulp.task('html:dev', function() {
    return (
        gulp.src('./src/html/**/*.html')
            .pipe(changed('./build/', {hasChanged: changed.compareContents}))
            .pipe(plumber(plumberNotify('HTML')))
            .pipe(fileInclude(fileIncludeSettings))
            .pipe(gulp.dest('./build/'))
    );
});

// SCSS task
gulp.task('scss:dev', function() {
    return (
        gulp.src('./src/scss/*.scss')
            .pipe(changed('./build/css/'))
            .pipe(plumber(plumberNotify('SCSS')))
            .pipe(sourceMaps.init())
            .pipe(sassGlob())
            .pipe(sass())
            .pipe(sourceMaps.write())
            .pipe(gulp.dest('./build/css/'))
    );
});

// Images task
gulp.task('images:dev', function() {
    return (
        gulp.src('./src/images/**/*')
            .pipe(changed('./build/images/'))
            .pipe(gulp.dest('./build/images/'))
    );
});

// Fonts task
gulp.task('fonts:dev', function() {
    return (
        gulp.src('./src/fonts/**/*')
            .pipe(changed('./build/fonts/'))
            .pipe(gulp.dest('./build/fonts/'))
    );
});

// Icons task
gulp.task('icons:dev', function() {
    return gulp.src('./src/icons/*.svg').pipe(gulp.dest('./build/icons/'));
});

// JS task
gulp.task('js:dev', function() {
    return (
        gulp.src('./src/js/*.js')
            .pipe(changed('./build/js'))
            .pipe(plumber(plumberNotify('JS')))
            .pipe(babel())
            .pipe(webpack(require('../webpack.config.js')))
            .pipe(gulp.dest('./build/js/'))
    );
});

// Server options task
const serverOptions = {
    livereload: true,
    open: true,
}

// Server task
gulp.task('server:dev', function() {
    return gulp.src('./build/').pipe(server(serverOptions));
});

// Watch task
gulp.task('watch:dev', function() {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss:dev'));
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('./src/images/**/*', gulp.parallel('images:dev'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('./src/icons/**/*', gulp.parallel('icons:dev'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});