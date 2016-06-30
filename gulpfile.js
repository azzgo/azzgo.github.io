var gulp = require('gulp')
var gutil = require('gulp-util')
var runSequence = require('run-sequence')
var data = require('gulp-data')
var path = require('path')
var fs = require('fs')

var pug = require('gulp-pug')

var connect = require('gulp-connect')
var postcss = require('gulp-postcss')
var stylus = require('gulp-stylus')
var module = require('postcss-modules')
var autoprefixer = require('autoprefixer')

var ghpages = require('gh-pages')
var path = require('path')
var del = require('del')

gulp.task('build', function(){
  return runSequence('clean', 'styles', 'pug', 'assets')
})

gulp.task('pug', function(){
  return gulp.src('src/*.pug')
    .pipe(data(function(file) {
      return {
        common: JSON.parse(fs.readFileSync('./src/styles/common.css.json', 'utf-8')),
        css: JSON.parse(fs.readFileSync('./src/styles/' + path.basename(file.path.slice(0, -4)) + '.css.json', 'utf-8'))
      }
    }))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('./public'))
    .pipe(connect.reload())
})

gulp.task('styles', function(){
  var processors = [autoprefixer(), module()]
  return gulp.src('src/styles/*.styl')
    .pipe(stylus({
      'include css': true
    }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/styles'))
    .pipe(connect.reload())
})

gulp.task('assets', function(){
  return gulp.src('assets/**')
    .pipe(gulp.dest('./public'))
})

gulp.task('clean', function(cb){
  return del('./public', cb)
})

gulp.task('deploy', function(cb) {
  return ghpages.publish(path.join(__dirname, 'public'), {
    branch: 'master',
    repo: 'git@github.com:azzgo/azzgo.github.io.git',
    logger: function(message) {
      console.log(message);
    }
  }, cb)
})

gulp.task('server', ['build'], function(){
  connect.server({
    root: 'public/',
    port: 8080,
    livereload: true
  })

  gulp.watch('./src/styles/**.styl', function() {
    runSequence('styles', 'pug')
  })
  gulp.watch('./src/**.pug', ['pug'])
})