const gulp = require('gulp');

// Tasks
require('./gulp/dev.js');
require('./gulp/docs.js');

gulp.task('default', gulp.series(
    'clean:dev',
    gulp.parallel('html:dev', 'scss:dev', 'images:dev', 'fonts:dev', 'icons:dev', 'js:dev'),
    gulp.parallel('server:dev', 'watch:dev')
));

gulp.task('docs', gulp.series(
    'clean:docs',
    gulp.parallel('html:docs', 'scss:docs', 'images:docs', 'fonts:docs', 'icons:docs', 'js:docs'),
    gulp.parallel('server:docs')
));