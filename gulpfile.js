const {src, dest, task, series, watch, parallel} = require("gulp");
const rm = require("gulp-rm");
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');
const env = process.env.NODE_ENV;
const imagemin = require('gulp-imagemin');

const {DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS} = require('./gulp.config');

sass.compiler = require('node-sass');

task( "clean", () => {
  return src( `${DIST_PATH}/**/*`, { read: false }).pipe( rm() );
  return src( "dist/**/*", { read: false }).pipe( rm() );
});

task ("copy:html", () => {
  return src(`${SRC_PATH}/*.html`).pipe(dest(DIST_PATH)).pipe(reload({stream:true}));
  // return src("src/*.html").pipe(dest("dist")).pipe(reload({stream:true}));
});

// const styles = [
//   "node_modules/normalize.css/normalize.css",
// ];
task ("styles", () => {
  return src([...STYLES_LIBS,"src/styles/main.scss"
  ])
    .pipe(gulpif(env === 'dev',sourcemaps.init()))
    .pipe(concat('main.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(px2rem({
      dpr: 1,             // base device pixel ratio (default: 2)
      rem: 16,            // root element (html) font-size (default: 16)
      one: false          // whether convert 1px to rem (default: false)
    })
    )
    .pipe(gulpif(env === 'dev',
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
    })))
    .pipe(gulpif(env === 'prod', gcmq()))
    .pipe(gulpif(env === 'prod', cleanCSS()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({stream:true}));
});

task ("scripts", () => {
  return src([...JS_LIBS,"src/scripts/*.js"])
  .pipe(gulpif(env === 'dev', sourcemaps.init()))
  .pipe(concat('main.min.js', {newLine: ";"}))
  .pipe(gulpif(env === 'prod', babel({
      presets: ['@babel/env']
  })))
  .pipe(gulpif(env === 'prod', uglify()))
  .pipe(gulpif(env === 'dev', sourcemaps.write()))
  .pipe(dest(DIST_PATH))
  .pipe(reload({stream:true}));
});


task('server', () => {
  browserSync.init({
      server: {
          baseDir: `./${DIST_PATH}`
          // baseDir: "./dist"
      },
      open: false
  });
});

task( "icons", () => {
  return src( "src/images/icons/*.svg")
  // .pipe(
  //   svgo({
  //     plugins: [
  //       {
  //         removeAttrs: {
  //           attrs: "(fill|stroke|style|width|height|data.*)"
  //         }
  //       }
  //     ]
  //   }) 
  // )
  // .pipe(svgSprite({
  //   mode: {
  //     symbol: {
  //       sprite: "../sprite.svg"
  //     }
  //   }
  // }))
  .pipe(dest(`${DIST_PATH}/images/icons`));
})

task('image:build', () => {
  return src('src/images/*.*')
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [
        {
          removeViewBox: false
        }
      ]
    }))
    .pipe(dest(`${DIST_PATH}/images`))
});

task ("watch", ()=> {
  watch("./src/styles/**/*.scss", series("styles"));
  watch("./src/*.html", series("copy:html"));
  watch("./src/scripts/*.js", series("scripts"));
  watch("./src/images/icons/*.svg", series("icons"));
  watch("./src/images/*.*", series("image:build"));
})

task ("default",
  series(
    "clean", 
    parallel("copy:html","scripts", "icons", "image:build","styles"), 
    parallel("server", "watch")
  )
);

task ("build",
  series(
    "clean", 
    parallel("copy:html","scripts", "icons", "image:build","styles")
  )
);