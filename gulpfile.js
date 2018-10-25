var gulp = require('gulp');
watch = require('gulp-watch');
var $ = require('gulp-load-plugins')();
//以下為gulp套件，為了精簡不要寫那麼多require，所以使用gulp-load-plugins來簡化
// var jade = require('gulp-jade');
// var sass = require('gulp-sass');
// var plumber = require('gulp-plumber');
// var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer'); //屬於postcss的插件，所以不能刪
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();
var minimist = require('minimist')
var gulpSequence = require('gulp-sequence')


var envOptions={
  string: 'env',
  default: {env:'develop'}
}

var options = minimist(process.argv.slice(2),envOptions)

gulp.task('clean', function () {
  return gulp.src(['./.tmp','./public'], {read: false})
      .pipe($.clean());
});

gulp.task('copyHTML', function(){
    return gulp.src('./source/**/*.html')
     .pipe(gulp.dest('./public/'))
})

gulp.task('jade', function() {
    // var YOUR_LOCALS = {};
   
    gulp.src('./source/**/*.jade')
      .pipe($.plumber())
      
      .pipe($.jade({
        pretty: true
      }))
      .pipe(gulp.dest('./public/'))
      .pipe(browserSync.stream())
  });

  gulp.task('sass', function () {
    var plugins = [
        autoprefixer({browsers: ['last 3 version','> 5%']}),
    ];
    return gulp.src(['./source/sass/**/*.sass', './source/sass/**/*.scss'])
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      //載入bootstrap
      .pipe($.sass({
        outputStyle: 'nested',
        includePaths: ['./node_modules/bootstrap/scss']
      }))
      //編譯完成css
      .pipe($.sass().on('error', $.sass.logError)) 
      //增加前綴詞
      .pipe($.postcss(plugins)) 
      .pipe($.if(options.env==='production',$.cleanCss()))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css'))
      .pipe(browserSync.stream())
  });
   
  gulp.task('babel', () =>
    gulp.src('./source/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['@babel/env']
        }))
        .pipe($.concat('all.js'))
        .pipe($.if(options.env==='production',$.uglify({
          compress:{
            drop_console: true
          }
        })))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.stream())
);

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles({
      "overrides":{
        "vue":{
          "main":"dist/vue.js"
        }
      }
    }))
        .pipe(gulp.dest('./.tmp/vendors'))
        cb(err)
});

gulp.task('vendorJS',['bower'],function(){
  return gulp.src('./.tmp/vendors/**/**.js')
    .pipe($.order([
      'jquery.js',
      'bootstrap.js'
    ]))
    .pipe($.concat('vendors.js'))
    .pipe($.if(options.env==='production',$.uglify()))
    .pipe(gulp.dest('./public/js'))
})

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./public"
      },
      reloadDebounce: 2000
  });
});

gulp.task('image-min', () =>
    gulp.src('./source/images/*')
        .pipe($.if(options.env==='production',$.imagemin()))
        .pipe(gulp.dest('./public/images'))
);

  gulp.task('watch', function () {
    gulp.watch(['./source/sass/**/*.sass', './source/sass/**/*.scss'], ['sass']);
    gulp.watch('./source/**/*.jade', ['jade']);
    gulp.watch('./source/**/*.js', ['babel']);
  });

  gulp.task('deploy',function(){
    return gulp.src('./public/**/*')
    .pipe($.ghPages())
  })

  gulp.task('build',gulpSequence('clean','jade','sass','babel','vendorJS'))

  gulp.task('default',['jade','sass','babel','vendorJS','browser-sync','image-min','watch']);