const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: {
        background: './src/background.js',
        content: './src/content.js',
        popup: './src/popup.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.json', '.wasm'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
        ],
    },
};

module.exports = () => {
    config.mode = isProduction ? 'production' : 'development';
    return config;
};
