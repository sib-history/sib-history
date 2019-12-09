var gulp = require('gulp'),
    rigger = require('gulp-rigger'),
    watch = require('gulp-watch'),
    browserSync = require("browser-sync"),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    reload = browserSync.reload;
var prefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var debug = require('gulp-debug');

var config = {
    server: {
        baseDir: "."
    },
    tunnel: false,
    host: 'localhost',
    port: 8080,
    online: true,
    logPrefix: "Den"
};

gulp.task('html', async function () {
    gulp.src('src/*.html') //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest('.')) //Выплюнем их в папку build
        .pipe(reload({stream: true}));
});

gulp.task('scss', async function () {
    gulp.src('src/css/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssnano()) //Сожмем
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css/'))
        .pipe(reload({stream: true}));
});

gulp.task('css', async function () {
    gulp.src('src/css/*.css')
        .pipe(gulp.dest('css/'))
        .pipe(reload({stream: true}));
});

gulp.task('font', async function () {
    gulp.src('src/font/*.*') //Выберем файлы по нужному пути
        .pipe(gulp.dest('font/')) //Выплюнем их в папку build
        .pipe(reload({stream: true}));
});

gulp.task('img', async function () {
    return gulp.src('src/img/*.*') //Выберем файлы по нужному пути
        .pipe(gulp.dest('img/')) //Выплюнем их в папку build
        .pipe(reload({stream: true}));
});

gulp.task('js', async function () {
    gulp.src('src/js/*.js') //Выберем файлы по нужному пути
        .pipe(gulp.dest('js/')) //Выплюнем их в папку build
        .pipe(reload({stream: true}));
});

gulp.task('webserver', async function () {
    browserSync(config);
});

gulp.task('watch', function(){
    watch(['src/**/*.html'], function(event, cb) {
        gulp.parallel('html');
    });
    watch(['src/css/**/*.css'], function(event, cb) {
        gulp.parallel('css');
    });
    watch(['src/img/**/*.*'], function(event, cb) {
        gulp.parallel('img');
    });
    watch(['src/font/**/*.*'], function(event, cb) {
        gulp.parallel('font');
    });
    watch(['src/js/**/*.*'], function(event, cb) {
        gulp.parallel('js');
    });
    watch(['src/css/*.scss'], function(event, cb) {
        gulp.parallel('scss');
    });
});


gulp.task('default', gulp.series(['html', 'scss', 'css', 'img', 'font', 'js', 'webserver', 'watch']), async function () {
    console.log('run def');
});