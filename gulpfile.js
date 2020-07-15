'use strict';

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


build.task("test-webpack", build.serial(build.configureRig, build.configureWebpack));

build.configureWebpack.setConfig({
    additionalConfiguration: (config) => {
        // include sourcemaps for dev
        if (!build.getConfig().production) {
            config.module.rules.push({
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              use: ['source-map-loader'],
              enforce: 'pre',
            }); 
        }  
        // only prod buid
        if (build.getConfig().production) { 
            // get excluded names for uglify
            const reserved = glob.sync('./src/{services,models}/**/*.ts').map((filePath) => {
                return filePath.replace(/.*\/(\w+)\.ts/g, "$1");
            }).concat("SPFile", "TaxonomyTerm", "TaxonomyHiddenListService", "TaxonomyHidden", "UserService", "User");
            config.optimization.minimizer = 
            [
                new TerserPlugin
                (
                    {
                        extractComments: false,
                        sourceMap: false,
                        cache: false,
                        parallel: false,
                        terserOptions:
                        { 
                            output: { comments: false },
                            compress: { warnings: false },
                            mangle: { 
                                reserved: reserved // rem sample from doc ['$super', '$', 'exports', 'require']
                            }                               
                        }
                    }
                )
            ];
        }
        return config;
    }
});

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
