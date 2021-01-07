const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const NODE_MODE = process.env.NODE_ENV || 'development';
const isProduction = NODE_MODE === 'production';
const isDevelopment = !isProduction;

const filename = (ext) =>
  isDevelopment ? `bundle.${ext}` : `bundle.[hash].${ext}`;

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: NODE_MODE,
  entry: ['@babel/polyfill', path.resolve(__dirname, './src/index.ts')],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: filename('js'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devtool: isDevelopment ? 'source-map' : false,
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/assets/**/*'),
          to: path.resolve(__dirname, 'public'),
          transformPath(targetPath, absolutePath) {
            return targetPath.replace('src/assets', '');
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  devServer: {
    port: 9000,
    compress: true,
    hot: isDevelopment,
  },
};
