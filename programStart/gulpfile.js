var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin'),
    minifyHTML = require('gulp-minify-html');
//拷贝文件
gulp.task('index',function(){
    return gulp.src(['./program/**/*.json',
        './program/**/*.eot',
        './program/**/*.svg',
        './program/**/*.ttf',
        './program/**/*.woff'])
        .pipe(gulp.dest('./publish'))
});
//清除
gulp.task('clean', function() {
    return gulp.src(['./publish'],{
        read:false})
        .pipe(clean());
});

//检查脚本
gulp.task('lint', function() {
    gulp.src('./program/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

//sass处理
gulp.task('sass',function(){
    sass('./program/style/scss/*.scss',{sourcemap: true})
        .pipe(sourcemaps.init())
        .on('error', sass.logError)
        .pipe(sourcemaps.write())
        .pipe(sourcemaps.write('maps', {
            includeContent: false,
            sourceRoot: 'source'
        }))
        .pipe(gulp.dest('./program/style/css/'));

});

//css压缩处理
gulp.task('styles', function() {
    return gulp.src('./program/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./publish'));
});
//合并、压缩文件处理
gulp.task('scripts', function() {
    gulp.src('./program/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./publish'))
});
gulp.task('concat',function(){
    return gulp.src([
        './program/scripts/lib/exp.js',
        './program/scripts/common/header.js',
        './program/scripts/eBase/eBase.js',
        './program/scripts/eBase/config.js',
        './program/scripts/eBase/util.js',
        './program/scripts/eBase/extend.js',
        './program/scripts/eBase/layout.js',
        './program/scripts/eBase/factory.js',
        './program/scripts/common/validate.js',
        './program/scripts/app.js'])
        .pipe(concat('app.js'))
        .pipe(uglify('app.js'))
        .pipe(gulp.dest('./publish/scripts'));
});

// Images
gulp.task('images', function() {
    gulp.src('./program/**/*.jpg')
        .pipe(gulp.dest('./publish'));
    gulp.src('./program/**/*.png')
        .pipe(gulp.dest('./publish'));
});

//html

gulp.task('html',function(){
    gulp.src('./program/**/*.html')
        .pipe(minifyHTML({empty:true,spare:false,cdata:true,conditionals:true,quotes:true}))
        .pipe(gulp.dest('./publish'));
});

gulp.task('livereload', function () {
});
//监听文件
gulp.task('watch', function() {
    gulp.watch('./program/**/*.scss', ['styles']);
    gulp.watch('./**/*.scss', ['sass']);
});
gulp.task('browser-sync', function() {
    var files = [
        '**/*.html',
        '**/*.css',
        '**/*.js',
        '**/*.*',
        '**/**/*.*',
    ];
    browserSync.init(files,{
        server: {
            baseDir: "./"
        }
    });
});

//默认任务
gulp.task('default', ['clean'], function(){
    gulp.start(
        'sass',
        'index',
        'styles',
        'scripts',
        'concat',
        'images',
        'html'
    );
    //gulp.start('html');
});