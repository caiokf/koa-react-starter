const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const babelify = require('babelify');
const babel = require('gulp-babel');
const browserify = require('browserify');
const cssmodulesify = require('css-modulesify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const livereload = require('gulp-livereload');
const fs = require('fs');

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

gulp.task('watch:server', ['compile:server'] , () => {
  nodemon({
    script: './dist/server.js',
    ext: 'js',
    watch: paths.serverSourceFiles,
    tasks: ['compile']
  });
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
    .pipe(gulp.dest(paths.clientBundleDir))
    .pipe(livereload());
});

gulp.task('watch:client', ['compile:client'] , () => {
  livereload.listen();
  gulp.watch(paths.clientSourceFiles , ['compile:client']);
});

gulp.task('serve', ['watch:client', 'watch:server']);

gulp.task('default', ['serve']);
