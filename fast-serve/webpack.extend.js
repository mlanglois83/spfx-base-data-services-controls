
/*
* User webpack settings file. You can add your own settings here.
* Changes from this file will be merged into the base webpack configuration file.
* This file will not be overwritten by the subsequent spfx-fast-serve calls.
*/
const IgnoreNotFoundExportPlugin = require("./IgnoreNotFoundExportPlugin.js");

// you can add your project related webpack configuration here, it will be merged using webpack-merge module
// i.e. plugins: [new webpack.Plugin()]
const webpackConfig = {
    plugins: [new IgnoreNotFoundExportPlugin()]
};

const path = require("path");
const _root = path.resolve(__dirname,"..");
function root(args) {
  return path.join.apply(path, [_root].concat(args));
}

// for even more fine-grained control, you can apply custom webpack settings using below function
const transformConfig = function (initialWebpackConfig) {
    // transform the initial webpack config here, i.e.
    // initialWebpackConfig.plugins.push(new webpack.Plugin()); etc.
    addAlliases(initialWebpackConfig);
    addSourceMaps(initialWebpackConfig);
    return initialWebpackConfig;
}

module.exports = {
  webpackConfig,
  transformConfig
}

const addSourceMaps = (config) => {
    config.module.rules.push({
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        use: ['source-map-loader'],
        exclude: [root('node_modules/@pnp'), root('node_modules/spfx-base-data-services/node_modules/@pnp')],
        enforce: 'pre',
    });
}

const addAlliases = (config) => {
  const tsconfig = require(path.resolve(__dirname, "..", "tsconfig.json"));  
  config.resolve = config.resolve || { modules: ['node_modules'] };
  config.resolve.alias = {};
  if (tsconfig.compilerOptions.paths) {
     
      var baseUrl = ".";
      // get base url
      if (tsconfig.compilerOptions.baseUrl) {
          baseUrl = tsconfig.compilerOptions.baseUrl.replace(/\/*$/g, '');
      }
      // transform paths to resolve
      for (const key in tsconfig.compilerOptions.paths) {
          if (tsconfig.compilerOptions.paths.hasOwnProperty(key)) {
              if (tsconfig.compilerOptions.paths[key] && tsconfig.compilerOptions.paths[key].length > 0) {
                  var tspath = tsconfig.compilerOptions.paths[key][0];
                  var parts = tspath.split("/");
                  var lastPart = parts.pop();
                  while (lastPart === "*" || lastPart === "") {
                      lastPart = parts.pop();
                  }
                  tspath = parts.join("/") + "/" + lastPart;
                  var destpath = baseUrl + "/" + tspath.replace(/^\/*|\/*$/g, '');
                  // folder
                  if (lastPart.indexOf(".") === -1) {
                      destpath += "/";
                  }
                  else {
                      destpath = destpath.replace(/\.ts$/g, '.js');
                  }
                  //destpath = destpath.replace("/src/", "/lib/");
                  // Remove /* from key if needed
                  var destkey = key.replace(/^(.*)\/\*$/g, "$1");
                  config.resolve.alias[destkey] = path.resolve(__dirname, "..", destpath);;
              }
          }
      }
  }
}
// alias
