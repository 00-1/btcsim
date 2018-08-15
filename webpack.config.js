// const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  // externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: 'dist/index.js',
    library: 'btcsim',
    libraryTarget: 'var',
    libraryExport: 'btcsim',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
