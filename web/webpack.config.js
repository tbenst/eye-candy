const path = require('path');

const {
  DefinePlugin,
  ProgressPlugin,
  NoErrorsPlugin
} = require('webpack');

const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');


const paths = {
  src: path.join(__dirname, '/src/'),
  output: path.join(__dirname, '/static/js'),
  public: '/'
}

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: paths.output,
    publicPath: paths.public,
    pathinfo: true,
    filename: '[name].js',
  },
  plugins: [
    new ProgressPlugin(),
    // new DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    // }),
    new NamedModulesPlugin(),
  ],
  entry: [
    path.join(__dirname, 'src/client/main.js')
  ],
  resolve: {
    extensions: [ '.js', '.purs']
  },
  module: {
    rules: [
      {
        test: /\.purs$/,
        loader: 'purs-loader',
        exclude: /node_modules/,
        query: {
          psc: 'psa',
          src: ['bower_components/purescript-*/src/**/*.purs', 'src/**/*.purs'],
          ffi: ['bower_components/purescript-*/src/**/*.js', 'src/**/*.js'],
          noErrors: true
        }
      },
      // { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
      // { test: /\.useable\.css$/, loader: "style/useable!css" }
    ]
  },
  devServer: {
    contentBase: paths.src,
    port: 3000,
    host: 'localhost',
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    // compress: isProd,
    inline: true,
    stats: 'minimal',
  },
  node: {
    fs: "empty"
  }};