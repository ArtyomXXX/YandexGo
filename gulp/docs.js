const gulp = require('gulp');

// HTML
const htmlclean = require('gulp-htmlclean');
const fileInclude = require('gulp-file-include');

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCSS = require('gulp-webp-css');

// Images
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html');

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
gulp.task('clean:docs', function(done) {
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', {read: false})
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
gulp.task('html:docs', function() {
    return (
        gulp.src('./src/html/**/*.html')
            .pipe(changed('./docs/'))
            .pipe(plumber(plumberNotify('HTML')))
            .pipe(fileInclude(fileIncludeSettings))
            .pipe(webpHTML())
            .pipe(htmlclean())
            .pipe(gulp.dest('./docs/'))
    );
});

// SCSS task
gulp.task('scss:docs', function() {
    return (
        gulp.src('./src/scss/*.scss')
            .pipe(changed('./docs/css/'))
            .pipe(plumber(plumberNotify('SCSS')))
            .pipe(sourceMaps.init())
            .pipe(autoprefixer()
            .pipe(webpCSS())
            .pipe(sassGlob())
            .pipe(sass()))
            .pipe(csso())
            .pipe(sourceMaps.write())
            .pipe(gulp.dest('./docs/css/'))
    );
});  

// Images task
gulp.task('images:docs', function() {
    return (
        gulp.src('./src/images/**/*')
            .pipe(changed('./docs/images/'))
            .pipe(webp())
            .pipe(gulp.dest('./docs/images/'))

            .pipe(gulp.src('./src/images/**/*'))
            .pipe(changed('./docs/images/'))
            .pipe(gulp.dest('./docs/images/'))
    );
});

// Fonts task
gulp.task('fonts:docs', function() {
    return (
        gulp.src('./src/fonts/**/*')
            .pipe(changed('./docs/fonts/'))
            .pipe(gulp.dest('./docs/fonts/'))
    );
});

// Icons task
gulp.task('icons:docs', function() {
    return gulp.src('./src/icons/*.svg').pipe(gulp.dest('./docs/icons/'));
});

// JS task
gulp.task('js:docs', function() {
    return (
        gulp.src('./src/js/*.js')
            .pipe(changed('./docs/js'))
            .pipe(plumber(plumberNotify('JS')))
            .pipe(babel())
            .pipe(webpack(require('../webpack.config.js')))
            .pipe(gulp.dest('./docs/js/'))
    );
});

// Server options task
const serverOptions = {
    livereload: true,
    open: true,
}

// Server task
gulp.task('server:docs', function() {
    return gulp.src('./docs/').pipe(server(serverOptions));
});