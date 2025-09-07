const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: {
        background: path.resolve(__dirname, '../src/background.js'),
        content: path.resolve(__dirname, '../src/content.js'),
        popup: path.resolve(__dirname, '../src/popup.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.json', '.wasm'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.EXTENSION_API_KEY': JSON.stringify(
                process.env.EXTENSION_API_KEY
            ),
            'process.env.API_BASE_URL': JSON.stringify(
                process.env.API_BASE_URL || 'http://localhost:3000'
            ),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};

module.exports = () => {
    config.mode = isProduction ? 'production' : 'development';
    return config;
};
