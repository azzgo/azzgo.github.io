var gulp = require('gulp')
var pug = require('gulp-pug')
var gutil = require('gulp-util');
var ghpages = require('gh-pages');
var path = require('path');

gulp.task('pug', function(){
  gulp.src('src/**.pug')
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('./public'))
})

gulp.task('deploy', function() {
  ghpages.publish(path.join(__dirname, 'public'), {
    branch: 'master',
    repo: 'git@github.com:azzgo/azzgo.github.io.git'
  }, function(err) { 
    if(err){
      gutil.log("Error on Deploy", err)
    }
  })
})
