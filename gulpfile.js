const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const babelify = require('babelify');
const babel = require('gulp-babel');
const browserify = require('browserify');
const Cache = require('gulp-file-cache');
const fs = require('fs');

var cache = new Cache();

const paths = {
  inputReact : './client/App.js',
  outputReact : './public/assets/js',
  dirReact : './client/**/*.js',
  app : [
    './server.js',
    './config.js',
    './server/**/*.js'
  ]
};

const babelConfig = {
  presets: ['es2017', 'react', 'stage-3']
};

const swallowError = (error) => {
  console.log(error.message);
}

gulp.task('compile', () => {
  return gulp
    .src(paths.app)
    .pipe(babel({ presets: ['es2015', 'react'], "plugins": ["transform-async-to-generator"] }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('babel', () => {
  browserify(paths.inputReact)
    .transform('babelify', babelConfig)
    .bundle()
    .on('error', swallowError)
    .pipe(fs.createWriteStream(`${paths.outputReact}/bundle.js`));
});

gulp.task('babel:watch', ['babel'] , () => {
  gulp.watch(paths.dirReact , ['babel']);
});

gulp.task('set', ['babel:watch','compile'], () => {
  return nodemon({
    script: 'dist/server.js',
    ext: 'js',
    watch: paths.app,
    tasks: ['compile']
  });
});
