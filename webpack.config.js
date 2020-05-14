const path = require("path");
const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');
const DotenvFlow = require('dotenv-flow-webpack');
const CopyPlugin = require('copy-webpack-plugin');
require("babel-polyfill");

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js',
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.BannerPlugin({banner: 'require("source-map-support").install();', raw: true, entryOnly: false}),
        new DotenvFlow(),
        new CopyPlugin([
            { from: 'src/tf_models', to: 'tf_models' }
        ])
    ],
    devtool: 'source-map',
    mode: 'development'
};