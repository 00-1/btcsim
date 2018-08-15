const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: "node",
  externals: [nodeExternals()],        
  module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
  }      
}
