var path = require('path')
var webpack = require('webpack')

var port = process.env.PORT || 8080

module.exports = {
  devServer: {
    port: port,
    contentBase: 'app/',
    publicPath: '/', // script src = {publicPath}/bundle.js
    hot: true,
    historyApiFallback: true
  },
  devtool: ifprod('source-map', 'cheap-eval-source-map'),
  entry: ifprod('./app/index', [
    // Enable hot-reload on "/"
    // Can be skipped if going to "/webpack-dev-server/"
    'webpack-dev-server/client?http://localhost:' + port,
    'webpack/hot/only-dev-server',
    // Main entry point
    './app/index'
  ]),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/' // script src = {publicPath}/bundle.js
  },
  plugins: ifprod([], [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]),
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ifprod(['babel'], ['react-hot', 'babel']),
      exclude: /node_modules/
    }]
  }
};



function ifprod (yes, nope) {
  return process.env.NODE_ENV === 'production' ? yes : nope
}
