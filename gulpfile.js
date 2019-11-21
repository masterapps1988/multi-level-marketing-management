// Konfigurasi
var gulp  = require('gulp');
var gutil = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");
var notify = require('gulp-notify');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate')
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');
const replace = require("gulp-replace");
const versionConfig = {
    'value': '%MDS%',
    'append': {
        'to': [{
          'type'  : 'js',
          'attr'  : ['src', 'custom-src'], // String or Array, undefined this will use default. css: "href", js: ...
          'key'   : '_v',
          'value' : '%DT%',
          'cover' : 1,
          'files': ['app.min.js', /dependency.js/] // Array [{String|Regex}] of explicit files to append to
      }]
    }
};

var root = 'resources/assets/';
var rootJs = root + 'js/';
var scripts = [];
var htmls = [];
var template = [];

scripts.push(rootJs + 'script.js');
scripts.push(rootJs + 'libs/modules/*');
scripts.push(rootJs + 'app/app.bootstrap.js');

scripts.push(rootJs + 'libs/components/components.js');
scripts.push(rootJs + 'libs/directives/*');
scripts.push(rootJs + 'libs/services/*');
scripts.push(rootJs + 'libs/factories/*');

scripts.push(rootJs + 'app/app.js');
scripts.push(rootJs + 'app/config.js');
scripts.push(rootJs + 'app/controllers/*');

htmls.push(rootJs + 'app/views/*.html');
template.push('resources/views/**/*.ejs');

gulp.task("scripts", function() {
    return gulp
    .src(scripts)
    .pipe(concat("app.min.js"))
    .pipe(ngAnnotate())
    .pipe(uglify({ mangle: false }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("public/build/"));
});

gulp.task("css", function() {
    return gulp
    .src('resources/assets/css/style.css')
    .pipe(cssnano())
    .pipe(gulp.dest('public/build/css/'));
});

function cleanJS() {
    return del(['public/build/app.js']);
};

function cleanCSS() {
    return del(['public/build/css/']);
};

// Default Task. Local webserver dan sinkronisasi dengan browser.
gulp.task('default', function(){
    gulp.src(rootJs + '/libs/components/*.html')
    .pipe(gulp.dest('public/build/libs/components/'));

    gulp
    .src(template)
    // .pipe(gulpLoadPlugins().htmlmin({collapseWhitespace: true}))
    .pipe(gulpLoadPlugins().versionNumber(versionConfig))
    .pipe(gulp.dest('app/views'));

    gulp
    .src(rootJs + 'app/views/*.html')
    .pipe(gulp.dest('public/build/views'));

    gulp.watch(template)
    .on('change', function(obj){
        return gulp
        .src(obj, {base: 'resources/views/'})
        // .pipe(gulpLoadPlugins().htmlmin({collapseWhitespace: true}))
        .pipe(gulpLoadPlugins().versionNumber(versionConfig))
        .pipe(gulp.dest('app/views'))
        // .pipe(notify({ message: "Template files successfully copied" }));
    });
    
    gulp.watch(htmls)
    .on('change', function(obj){
      return gulp.src(obj, {base: rootJs + 'app/views/'})
      .pipe(gulp.dest('public/build/views/'))
    //   .pipe(notify({ message: "Html files successfully copied" }));
    });

    gulp.watch(scripts, gulp.series(cleanJS, 'scripts'));
    gulp.watch('resources/assets/css/style.css', gulp.series(cleanCSS, 'css'));
});
