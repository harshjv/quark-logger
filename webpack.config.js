const path = require('path')

module.exports = {
  target: 'electron',
  devtool: 'source-map',
  entry: {
    electron: './src/electron.js',
    quark: './src/lib.js',
    react: './src/app/index.jsx'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.html$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  node: {
    __filename: false,
    __dirname: false
  },
  resolve: {
    modulesDirectories: [ 'node_modules' ],
    extensions: ['', '.js', '.jsx']
  }
}
