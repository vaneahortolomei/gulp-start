const {src, dest, watch, parallel, series} = require('gulp');


const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefix = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');

//сборка стилей
function buildStyles(){
  return src('app/scss/style.scss')
      .pipe(scss({outputStyle: 'compressed'}))
      .pipe(concat('style.min.css'))
      .pipe(autoprefix({
        overrideBrowserslist: ['last 10 version'],
        grid: true
      }))
      .pipe(dest('app/css'))
      .pipe(browserSync.stream())
}

//клинер диста
function cleanDist(){
  return del('dist')
}

//отслеживание сборки
function watching(){
  watch(['app/scss/**/*.scss'], buildStyles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
  watch(['app/*.html']).on("change", browserSync.reload);
}

//созлание сервера
function browsersync(){
  browserSync.init({
    server: {
      baseDir: "./app",
    }
  });
}


//билдер для диста
function build() {
  return src([
    'app/css/style.min.css',
    'app/fonts/**/*',
    'app/js/main.min.js',
    'app/*.html'
  ], {base: 'app'})
      .pipe(dest('dist'))
}

//минификация для картинок разных форматов
function images() {
  return src('app/img/**/*')
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
          plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
          ]
        })
      ]))
      .pipe(dest('dist/img'))
}

//минификация для жс
function scripts() {
  return src([
    'app/js/main.js'
  ])
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(dest('app/js'))
      .pipe(browserSync.stream())
}


exports.buildStyles = buildStyles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.build = build;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(buildStyles, cleanDist, images, build);
exports.default = parallel(scripts, browsersync, watching);
