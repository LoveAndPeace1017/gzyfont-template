const gulp = require('gulp');
const sass = require('gulp-sass');
const clean = require('gulp-clean');

sass.compiler = require('node-sass');


gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('copy-js', function () {
    return gulp.src('./public/script/**/*.js')
        .pipe(gulp.dest('./dist/script/'));
});

gulp.task('copy-tinymce', function () {
    return gulp.src('./public/tinymce/**')
        .pipe(gulp.dest('./dist/tinymce/'));
});

gulp.task('copy-img', function () {
    return gulp.src('./public/images/server/**/*.*')
        .pipe(gulp.dest('./dist/images/server'));
});
gulp.task('copy-css', function () {
    return gulp.src('./public/style/**/*.*')
        .pipe(gulp.dest('./dist/style'));
});
gulp.task('copy-monitor', function () {
    return gulp.src('./public/monitor.html')
        .pipe(gulp.dest('./dist/'));
});
gulp.task('wx-signature', function () {
    return gulp.src('./public/MP_verify_LZxff8o1qTWPoNhs.txt')
        .pipe(gulp.dest('./dist/'));
});
gulp.task('app-signature', function () {
    return gulp.src('./public/apple-app-site-association')
        .pipe(gulp.dest('./dist/'));
});
gulp.task('sass', function () {
    return gulp.src('./public/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./public/style'));

});

gulp.task('watch', function () {
    gulp.watch('./public/sass/**/*.scss', gulp.series('sass'));
});


gulp.task("default",gulp.series('copy-js','copy-tinymce','copy-img','sass','copy-css','copy-monitor','wx-signature','app-signature'));