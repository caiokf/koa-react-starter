const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const babelify = require('babelify');
const babel = require('gulp-babel');
const browserify = require('browserify');
const cssmodulesify = require('css-modulesify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const Cache = require('gulp-file-cache');
const fs = require('fs');

var cache = new Cache();

const paths = {
  clientEntrypoint: './client/app.js',
  clientBundleDir: './public/dist',
  clientSourceFiles: [
    './client/**/*.js',
    './client/**/*.scss'
  ],

  serverBuildDir: './dist',
  serverSourceFiles : [
    './server.js',
    './config.js',
    './server/**/*.js'
  ]
};

const babelConfig = {
  presets: ['es2017', 'react', 'stage-3']
};

gulp.task('compile:server', () => {
  return gulp
    .src(paths.serverSourceFiles)
    .pipe(babel({ presets: ['es2015', 'react'], "plugins": ["transform-async-to-generator"] }))
    .pipe(gulp.dest(paths.serverBuildDir))
});

gulp.task('compile:client', () => {
  browserify(paths.clientEntrypoint)
    .transform('babelify', { presets: ['es2015', 'react'], "plugins": ["transform-async-to-generator"] })
    .plugin('css-modulesify', {
        o: paths.clientBundleDir + '/bundle.css',
        use: [
          'postcss-modules-local-by-default',
          'postcss-modules-extract-imports',
          'postcss-modules-scope'
        ]
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.clientBundleDir));
});

gulp.task('watch:client', ['compile:client'] , () => {
  gulp.watch(paths.clientSourceFiles , ['compile:client']);
});

gulp.task('build', ['watch:client','compile:server'], () => {
  return nodemon({
    script: './dist/server.js',
    ext: 'js',
    watch: paths.serverSourceFiles,
    tasks: ['compile']
  });
});
