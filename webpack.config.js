/* eslint-env node */

var path = require('path')
var webpack = require('webpack')
var CompressionPlugin = require('compression-webpack-plugin')

var port = process.env.PORT || 8080

var skipMomentLocales = new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/)

module.exports = {
  devServer: {
    port: port,
    contentBase: 'app/',
    publicPath: '/', // script src = {publicPath}/bundle.js
    hot: true,
    historyApiFallback: true
  },
  devtool: ifprod('source-map', 'source-map'),
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
  plugins: ifprod([
    skipMomentLocales,
    new webpack.DefinePlugin({
      '__DEV__': false,
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({}),
    new CompressionPlugin({
      asset: '[file].gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ], [
    skipMomentLocales,
    new webpack.DefinePlugin({
      '__DEV__': true,
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]),
  resolve: {
    extensions: ['', '.js', '.jsx', '.styl']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ifprod(['babel'], ['react-hot', 'babel']),
        include: [ 'app' ] // Base source files
          .concat([
            // Modules that must be parsed by Babel (whitelist)
            'react-tag-input'
          ].map(f => path.join('node_modules', f)) // node_modulesize paths
          ).map(f => path.resolve(__dirname, f)) // absolutize paths
      },
      {
        test: /\.styl$/,
        loaders: ['style', 'css', 'stylus']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  }
}

function ifprod (yes, nope) {
  return process.env.NODE_ENV === 'production' ? yes : nope
}
