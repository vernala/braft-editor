const {merge} = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const baseConfigs = require('./webpack.base');

module.exports = merge(baseConfigs, {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    index: './playground/index.jsx',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new HtmlWebpackPlugin({
      template: './playground/index.html',
    }),

    new ESLintPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, './playground'),
    },
    port: 5998,
    hot: true,
  },
});
