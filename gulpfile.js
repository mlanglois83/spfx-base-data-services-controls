'use strict';

const configure = require('spfx-base-data-services/gulp')
const fs = require('fs');
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const path = require('path');
const localization = require('gulp-spfx-localization');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');
const beautify = require('gulp-jsbeautifier');
const prettier = require('gulp-prettier');
const tsconfig = require('./tsconfig.json');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);


configure(__dirname, true);

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
        'keyColumnName': "key",
        'langMap': langMap,
        'interfaceName': "IControlsStrings",
        'moduleName': "ControlsStrings",
        'separator': ';'
    }))
        .pipe(beautify())
        .pipe(gulp.dest('./src/loc'));
})

gulp.task('ts-beautify', ['generate-translation'], function () {
    return gulp.src('./language/mystrings.d.ts')
        .pipe(prettier({
            singleQuote: true
        }))
        .pipe(gulp.dest('./src/loc'));
});

gulp.task('localization', ['ts-beautify']);

build.initialize(gulp);
