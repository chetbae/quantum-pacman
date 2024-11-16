const gulp = require("gulp");
const gulpSass = require("gulp-sass");
const sass = require("sass");
const concat = require("gulp-concat");
const removeCode = require("gulp-remove-code");

// Configure gulp-sass to use dart-sass
const sassCompiler = gulpSass(sass);

function styles() {
  return gulp
    .src("app/style/scss/**/*.scss")
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(concat("app.css"))
    .pipe(gulp.dest("build"));
}

function scripts() {
  return gulp
    .src("app/scripts/**/*.js")
    .pipe(removeCode({ production: true }))
    .pipe(concat("app.js"))
    .pipe(gulp.dest("build"));
}

function watch() {
  gulp.watch("app/style/**/*.scss", styles);
  gulp.watch("app/scripts/**/*.js", scripts);
}

const build = gulp.parallel(styles, scripts);

exports.watch = watch;
exports.default = build;
