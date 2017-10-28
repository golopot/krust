const gulp = require('gulp')
const less = require('gulp-less')

gulp.task('less', function(){
  return gulp.src('./less/*.less')
    .pipe(less({
      paths: [ __dirname ]
    }))
    .pipe(gulp.dest('./build/css'))
})

gulp.task('watch', ['------'], function(){
  gulp.watch(['./src/**', './less/**'], ['------'] )
})

gulp.task('------', ['less'] )
gulp.task('default', ['------'] )
