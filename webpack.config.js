const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function(env, argv) {
    env = env || {};
    return {
        entry: {
            index: './src/index.ts',
            // another: './src/another-module.ts'
        },
        output: {
            filename: env.production ? '[name].[chunkhash].js' : '[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },
        devtool: 'inline-source-map',
        mode: env.production ? 'production' : 'development',
        module: {
            rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,  
                use: [{
                    loader: 'url-loader',
                    options: { 
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    } 
                }]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }]
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(process.env.npm_package_version),
            })
        ],
        devServer: {
            port: 3000,
            inline: true
        }
    };
};