'use strict';

const configure = require('spfx-base-data-services/gulp');
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const localization = require('gulp-spfx-localization');
const beautify = require('gulp-jsbeautifier');
const prettier = require('gulp-prettier');
const ts = require('gulp-typescript');
const gulpeslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
build.addSuppression(/Warning - \[sass\] The local CSS class '[^']+' is not camelCase and will not be type-safe\./);


configure(__dirname, true);

build.tslintCmd.enabled = false;

const tsProject = ts.createProject('tsconfig.json');

function isFixed(file) {
	return file.eslint != null && file.eslint.fixed;
}

let eslint = build.subTask('eslint', function (gulp, buildOptions, done) {
    const hasFixFlag = process.argv.slice(2).includes('--fix');
    tsProject.src()
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(gulpeslint({fix: hasFixFlag}))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(gulpeslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(gulpIf(isFixed, gulp.dest("./src")));
      done();
});

build.rig.addPreBuildTask(eslint)

gulp.task('generate-translation', function () {
    // Input Excel file
    var files = gulp.src("./language.csv");

    //Mapping of each language
    var langMap = {
        'en-us': "en-us",
        'fr-fr': "fr-fr",
        'de-de': "de-de",
        'es-es': "es-es",
        'it-it': "it-it",
        'pl-pl': "pl-pl",
        'pt-br': "pt-br",
        'ro-ro': "ro-ro",
        'ru-ru': "ru-ru",
        'sr-latn-rs': "sr-latn-rs",
        'th-th': "th-th",
        'zn-cn': 'zn-cn'
    };

    return files.pipe(localization({
        'moduleFile': "mystrings.d.ts",
        'keyColumnName': "key",
        'langMap': langMap,
        'interfaceName': "IControlsStrings",
        'moduleName': "ControlsStrings",
        'separator': ';'
    }))
        .pipe(beautify())
        .pipe(gulp.dest('./src/loc'));
})

gulp.task('ts-beautify', gulp.series('generate-translation', function (done) {
    gulp.src('./src/loc/mystrings.d.ts')
        .pipe(prettier({
            singleQuote: true
        }))
        .pipe(gulp.dest('./src/loc'));
      done();
  }));
  
  gulp.task('localization', gulp.series('generate-translation', 'ts-beautify'));

build.initialize(gulp);
