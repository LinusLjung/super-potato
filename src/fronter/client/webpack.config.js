const path = require('path');
const GetAssetsPlugin = require('./webpack-plugins/get-assets');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new GetAssetsPlugin({
      outDir: path.join('../server/src'),
    }),
  ],
};
