var gulp = require('gulp');
var less = require('gulp-less');
var uglify  = require('gulp-uglify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');

gulp.task('less', function () {
    gulp.src(['./less/*.less'])
        .pipe(less())
        .pipe(gulp.dest('./css'));
});

gulp.task('js', function(){
    var jsfiles = ['main'];
    for( var i in jsfiles){
        var f = jsfiles[i];
        browserify({debug: true})
            .external('jquery')
            .require('./js/main/'+f+'.js', {'expose': f})
            .bundle()
            .pipe(source(f+'.js'))
            .pipe(streamify(uglify()))
            .pipe(gulp.dest('./js'));
    }
});

gulp.task('default', function () {
    gulp.run('less');
    gulp.run('js');

    //监视less文件的变化
    //gulp.watch('./less/**/*.less', function () {
    //    gulp.run('less');
    //});
});
