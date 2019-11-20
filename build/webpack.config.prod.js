'use strict';
const utils = require('./utils');
const webpack                  = require('webpack');
const merge                    = require('webpack-merge');
const OptimizeCSSAssetsPlugin  = require('optimize-css-assets-webpack-plugin');
const MiniCSSExtractPlugin     = require('mini-css-extract-plugin');
const UglifyJSPlugin           = require('uglifyjs-webpack-plugin');
const CompressionPlugin        = require('compression-webpack-plugin');
const helpers                  = require('./helpers');
const commonConfig             = require('./webpack.config.common');
const isProd                   = process.env.NODE_ENV === 'production';
const environment              = isProd ? require('./env/prod.env') : require('./env/staging.env');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const webpackConfig = merge(commonConfig, {
    mode: 'production',
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: 'js/[hash].js',
        chunkFilename: 'js/[name].[hash].chunk.js'
    },
    optimization: {
        runtimeChunk: 'single',
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: [ 'default', { discardComments: { removeAll: true } } ],
                }
            }),
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                sourceMap: !isProd
            })
        ],
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                
                // styles: {
                //     test: /\.css$/,
                //     name: 'styles',
                //     chunks: 'all',
                //     enforce: true
                // }
            }
        }
    },
    plugins: [
        new webpack.EnvironmentPlugin(environment),
        new MiniCSSExtractPlugin({
            filename: 'css/[name].[hash].css',
            chunkFilename: 'css/[name].[hash].css'
        }),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(js|css)$'),
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.HashedModuleIdsPlugin(),
        new MomentLocalesPlugin({
            localesToKeep: ['es-us'],
        }),
        new VuetifyLoaderPlugin(),
        new BundleAnalyzerPlugin()
    ]
});

if (!isProd) {
    webpackConfig.devtool = 'source-map';

    if (process.env.npm_config_report) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
    }
}

module.exports = webpackConfig;
