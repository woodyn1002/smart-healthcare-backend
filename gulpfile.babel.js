import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';

const paths = {
    js: {
        src: 'src/**/*.js',
        dest: 'dist/'
    },
    configs: {
        src: 'src/config/**/*.json',
        dest: 'dist/config/'
    }
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del(['dist']);

export function js() {
    return gulp.src(paths.js.src)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('./', {sourceRoot: '../src'}))
        .pipe(gulp.dest(paths.js.dest));
}

export function configs() {
    return gulp.src(paths.configs.src)
        .pipe(gulp.dest(paths.configs.dest));
}

/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
    gulp.watch(paths.js.src, js);
    gulp.watch(paths.configs.src, configs);
}

export {watchFiles as watch};

const build = gulp.series(clean, gulp.parallel(js, configs));
/*
 * Export a default task
 */
export default build;