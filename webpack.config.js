const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    bundle: './index.js'
  },

  output: {
    path: outputPath,
    publicPath: '/dist/',
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'eslint-loader',
          query: { cacheDirectory: true },
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ],
      },
    ],
  },

  devServer: {
    publicPath: '/dist/',
  },

  devtool: 'cheap-module-source-map',
};
