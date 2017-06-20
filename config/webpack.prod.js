/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

/**
 * Webpack Constants
 */
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const METADATA = webpackMerge(commonConfig({
  env: ENV
}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: false
});

const packageConfig = require(helpers.root('package.json'));

const externals = Object.keys(packageConfig.dependencies);
externals.push('@angular/material');

module.exports = {
  entry: {
    'index': helpers.root('index.ts'),
    'vendor': [
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/core',
      '@angular/common',
      '@angular/forms',
      '@angular/http',
      '@angular/router',
      '@angularclass/hmr',
      '@angular/material',
      'rxjs',
      'zone.js'
    ]
  },

  externals: externals,

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [helpers.root('node_modules')],
    alias: {
      'ng2-qgrid/core': helpers.root('core'),
      'ng2-qgrid/theme': helpers.root('src/themes/material'),
      'ng2-qgrid': helpers.root('src')
    }
  },

  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',

    library: 'ng2-qgrid',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader'
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [/\.(spec|e2e)\.ts$/, /demo/]
      }, {
        //TODO: get rid of babel when core will be compiled
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.html$/,
        use: 'raw-loader',
        exclude: [helpers.root('demo/index.html')]
      }, {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
        exclude: [helpers.root('demo', 'styles')]
      }, {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
        exclude: [helpers.root('demo', 'styles')]
      },
    ],
  },

  plugins: [
    // new CommonsChunkPlugin({
    //   name: 'polyfills'
    // })
  ]
};

// module.exports = function (env) {
//   return webpackMerge(commonConfig({
//     env: ENV
//   }), {
//     entry: {
//       'index': helpers.root('index.ts'),
//       vendor: [
//         '@angular/platform-browser',
//         '@angular/platform-browser-dynamic',
//         '@angular/core',
//         '@angular/common',
//         '@angular/forms',
//         '@angular/http',
//         '@angular/router',
//         '@angularclass/hmr',
//         '@angular/material',
//         'rxjs',
//         'zone.js'
//       ]
//     },
//     /**
//      * Developer tool to enhance debugging
//      *
//      * See: http://webpack.github.io/docs/configuration.html#devtool
//      * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
//      */
//     devtool: 'source-map',
//
//     /**
//      * Options affecting the output of the compilation.
//      *
//      * See: http://webpack.github.io/docs/configuration.html#output
//      */
//     output: {
//
//       /**
//        * The output directory as absolute path (required).
//        *
//        * See: http://webpack.github.io/docs/configuration.html#output-path
//        */
//       path: helpers.root('dist'),
//
//       /**
//        * Specifies the name of each output file on disk.
//        * IMPORTANT: You must not specify an absolute path here!
//        *
//        * See: http://webpack.github.io/docs/configuration.html#output-filename
//        */
//       filename: '[name].js',
//
//       /**
//        * The filename of the SourceMaps for the JavaScript files.
//        * They are inside the output.path directory.
//        *
//        * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
//        */
//       sourceMapFilename: '[name].map',
//
//       /**
//        * The filename of non-entry chunks as relative path
//        * inside the output.path directory.
//        *
//        * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
//        */
//       chunkFilename: '[id].js',
//
//       library: 'qgrid',
//       libraryTarget: 'var'
//
//     },
//
//     module: {
//
//       rules: [
//
//         /*
//          * Extract CSS files from .src/styles directory to external CSS file
//          */
//         // {
//         //   test: /\.css$/,
//         //   loader: ExtractTextPlugin.extract({
//         //     fallback: 'style-loader',
//         //     use: 'css-loader'
//         //   }),
//         //   include: [helpers.root('src', 'styles')]
//         // },
//         //
//         // /*
//         //  * Extract and compile SCSS files from .src/styles directory to external CSS file
//         //  */
//         // {
//         //   test: /\.scss$/,
//         //   loader: ExtractTextPlugin.extract({
//         //     fallback: 'style-loader',
//         //     use: 'css-loader!sass-loader'
//         //   }),
//         //   include: [helpers.root('src', 'styles')]
//         // },
//
//       ]
//
//     },
//
//     /**
//      * Add additional plugins to the compiler.
//      *
//      * See: http://webpack.github.io/docs/configuration.html#plugins
//      */
//     plugins: [
//
//       /**
//        * Webpack plugin to optimize a JavaScript file for faster initial load
//        * by wrapping eagerly-invoked functions.
//        *
//        * See: https://github.com/vigneshshanmugam/optimize-js-plugin
//        */
//
//       new OptimizeJsPlugin({
//         sourceMap: false
//       }),
//
//       /**
//        * Plugin: ExtractTextPlugin
//        * Description: Extracts imported CSS files into external stylesheet
//        *
//        * See: https://github.com/webpack/extract-text-webpack-plugin
//        */
//       new ExtractTextPlugin('[name].[contenthash].css'),
//
//       /**
//        * Plugin: DefinePlugin
//        * Description: Define free variables.
//        * Useful for having development builds with debug logging or adding global constants.
//        *
//        * Environment helpers
//        *
//        * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
//        */
//       // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
//       new DefinePlugin({
//         'ENV': JSON.stringify(METADATA.ENV),
//         'HMR': METADATA.HMR,
//         'process.env': {
//           'ENV': JSON.stringify(METADATA.ENV),
//           'NODE_ENV': JSON.stringify(METADATA.ENV),
//           'HMR': METADATA.HMR,
//         }
//       }),
//
//       /**
//        * Plugin: UglifyJsPlugin
//        * Description: Minimize all JavaScript output of chunks.
//        * Loaders are switched into minimizing mode.
//        *
//        * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//        */
//       // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
//       // new UglifyJsPlugin({
//       //   beautify: true, //debug
//       //   mangle: false, //debug
//       //   dead_code: false, //debug
//       //   unused: false, //debug
//       //   deadCode: false, //debug
//       //   compress: {
//       //     screw_ie8: true,
//       //     keep_fnames: true,
//       //     drop_debugger: false,
//       //     dead_code: false,
//       //     unused: false
//       //   }, // debug
//       //   comments: true, //debug
//       //
//       //
//       //   // beautify: false, //prod
//       //   // output: {
//       //   //   comments: false
//       //   // }, //prod
//       //   // mangle: {
//       //   //   screw_ie8: true
//       //   // }, //prod
//       //   // compress: {
//       //   //   screw_ie8: true,
//       //   //   warnings: false,
//       //   //   conditionals: true,
//       //   //   unused: true,
//       //   //   comparisons: true,
//       //   //   sequences: true,
//       //   //   dead_code: true,
//       //   //   evaluate: true,
//       //   //   if_return: true,
//       //   //   join_vars: true,
//       //   //   negate_iife: false // we need this for lazy v8
//       //   // },
//       // }),
//
//       /**
//        * Plugin: NormalModuleReplacementPlugin
//        * Description: Replace resources that matches resourceRegExp with newResource
//        *
//        * See: http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
//        */
//
//       new NormalModuleReplacementPlugin(
//         /angular2-hmr/,
//         helpers.root('config/empty.js')
//       ),
//
//       new NormalModuleReplacementPlugin(
//         /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
//         helpers.root('config/empty.js')
//       ),
//
//
//       // AoT
//       // new NormalModuleReplacementPlugin(
//       //   /@angular(\\|\/)upgrade/,
//       //   helpers.root('config/empty.js')
//       // ),
//       // new NormalModuleReplacementPlugin(
//       //   /@angular(\\|\/)compiler/,
//       //   helpers.root('config/empty.js')
//       // ),
//       // new NormalModuleReplacementPlugin(
//       //   /@angular(\\|\/)platform-browser-dynamic/,
//       //   helpers.root('config/empty.js')
//       // ),
//       // new NormalModuleReplacementPlugin(
//       //   /dom(\\|\/)debug(\\|\/)ng_probe/,
//       //   helpers.root('config/empty.js')
//       // ),
//       // new NormalModuleReplacementPlugin(
//       //   /dom(\\|\/)debug(\\|\/)by/,
//       //   helpers.root('config/empty.js')
//       // ),
//       // new NormalModuleReplacementPlugin(
//       //   /src(\\|\/)debug(\\|\/)debug_node/,
//       //   helpers.root('config/empty.js')
//       // ),
//       // new NormalModuleReplacementPlugin(
//       //   /src(\\|\/)debug(\\|\/)debug_renderer/,
//       //   helpers.root('config/empty.js')
//       // ),
//
//       /**
//        * Plugin: CompressionPlugin
//        * Description: Prepares compressed versions of assets to serve
//        * them with Content-Encoding
//        *
//        * See: https://github.com/webpack/compression-webpack-plugin
//        */
//       //  install compression-webpack-plugin
//       // new CompressionPlugin({
//       //   regExp: /\.css$|\.html$|\.js$|\.map$/,
//       //   threshold: 2 * 1024
//       // })
//
//       /**
//        * Plugin LoaderOptionsPlugin (experimental)
//        *
//        * See: https://gist.github.com/sokra/27b24881210b56bbaff7
//        */
//       new LoaderOptionsPlugin({
//         minimize: true,
//         debug: false,
//         options: {
//
//           /**
//            * Html loader advanced options
//            *
//            * See: https://github.com/webpack/html-loader#advanced-options
//            */
//           // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
//           htmlLoader: {
//             minimize: true,
//             removeAttributeQuotes: false,
//             caseSensitive: true,
//             customAttrSurround: [
//               [/#/, /(?:)/],
//               [/\*/, /(?:)/],
//               [/\[?\(?/, /(?:)/]
//             ],
//             customAttrAssign: [/\)?\]?=/]
//           },
//
//         }
//       }),
//
//     new CommonsChunkPlugin({
//       name: 'vendor'
//     }),
//
//       /**
//        * Plugin: BundleAnalyzerPlugin
//        * Description: Webpack plugin and CLI utility that represents
//        * bundle content as convenient interactive zoomable treemap
//        *
//        * `npm run build:prod -- --env.analyze` to use
//        *
//        * See: https://github.com/th0r/webpack-bundle-analyzer
//        */
//
//     ],
//
//     /*
//      * Include polyfills or mocks for various node stuff
//      * Description: Node configuration
//      *
//      * See: https://webpack.github.io/docs/configuration.html#node
//      */
//     node: {
//       global: true,
//       crypto: 'empty',
//       process: false,
//       module: false,
//       clearImmediate: false,
//       setImmediate: false
//     }
//
//   });
// }
