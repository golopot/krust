const gulp = require('gulp')
const less = require('gulp-less')

gulp.task('less', function(){
  return gulp.src('./less/main.less')
    .pipe(less({
      paths: [ __dirname ]
    }))
    .pipe(gulp.dest('../dist/css'))
})

gulp.task('watch', ['------'], function(){
  gulp.watch(['./src/**', './less/**'], ['------'] )
})

gulp.task('------', ['less'] )
gulp.task('default', ['------'] )
