const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { name, version } = require('./package.json');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: `${name}-${version}.min.js`,
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            title: '',
            meta: {
                charset: 'utf-8',
            }
        }),
        new MiniCssExtractPlugin()
        ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
};