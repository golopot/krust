var webpack = require('webpack')

module.exports = {
  entry: './src/entry.js',
  output: {
    filename : 'bundle.js',
    path : __dirname + '/../dist/js'
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
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
