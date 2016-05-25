var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
  return gulp.src("src/app.js")
    .pipe(babel({
        presets: ['es2015', 'stage-0']
    }))
    .pipe(gulp.dest("dist"));
});

