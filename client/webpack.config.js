var webpack = require('webpack')

module.exports = {
  entry: './src/entry.js',
  output: {
    filename : 'bundle.js',
    path : __dirname + '/../dist/js'
  },
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },

  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins: [
            ['transform-react-jsx', {'pragma': 'Preact.h'}]
          ]
        }
      }
    ]
  },
  devtool: 'source-map',
  plugins: [],
}
