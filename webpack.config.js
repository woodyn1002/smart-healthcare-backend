const path = require("path");
const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');
const DotenvFlow = require('dotenv-flow-webpack');
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
            },
            {
                test: /\.(json|bin)$/,
                loader: 'file-loader',
                type: 'javascript/auto'
            }
        ]
    },
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.BannerPlugin({banner: 'require("source-map-support").install();', raw: true, entryOnly: false}),
        new DotenvFlow()
    ],
    devtool: 'source-map',
    mode: 'development'
};