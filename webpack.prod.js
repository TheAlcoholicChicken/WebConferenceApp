var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 25000
                    }
                }
            }
        ]
    }
};
