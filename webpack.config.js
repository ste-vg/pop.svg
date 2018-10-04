const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function(env, argv) {
    env = env || {};
    return {
        entry: {
            index: './src/index.ts',
        },
        output: {
            filename: env.production ? '[name].js' : '[name].js',
            path: path.resolve(__dirname, 'dist'),
            library: 'POP'
        },
        mode: env.production ? 'production' : 'development',
        module: {
            rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
           ]
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(process.env.npm_package_version),
            })
        ]
    };
};