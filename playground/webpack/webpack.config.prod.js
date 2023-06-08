const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const baseConfigs = require('./webpack.base');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = merge(baseConfigs, {
  mode: 'production',
  //devtool: 'none',
  context: path.join(__dirname, '../../src'),
  entry: {
    index: './index.jsx',
  },
  output: {
    path: path.join(__dirname, '../../dist'),
    filename: 'index.js',
    publicPath: '/',
    libraryTarget: 'umd',
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'draft-js': 'draft-js',
    'draft-convert': 'draft-convert',
    'draftjs-utils': 'draftjs-utils',
    'braft-finder': 'braft-finder',
    'braft-utils': 'braft-utils',
    'braft-convert': 'braft-convert',
    immutable: 'immutable',
  },
  optimization: {
    minimize: false,
    minimizer: [
      new CssMinimizerPlugin({
        test: /.css$/,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  plugins: [
    new ESLintPlugin(),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    })
  ],
});
