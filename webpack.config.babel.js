const path = require('path')
const webpack = require('webpack')
const child_process = require('child_process')
const spawn = child_process.spawn

const port = process.env.PORT || 1212
const publicPath = `http://localhost:${port}/dist`

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  // https://webpack.docschina.org/configuration/target/
  target: 'electron-renderer',
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${port}/`,
    'webpack/hot/only-dev-server',
    require.resolve('./src/index.jsx'),
  ],
  output: {
    // path: path.resolve(__dirname, 'dist'),
    publicPath: `http://localhost:${port}/dist/`,
    filename: 'index.dev.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            // presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    port,
    publicPath,
    hot: true,
    contentBase: path.resolve(__dirname, 'dist'),
    before() {
      if (process.env.START_HOT) {
        console.log('Starting Main Process...')
        spawn('yarn', ['electron'], {
          shell: true,
          env: process.env,
          stdio: 'inherit',
        })
          .on('close', process.exit)
          .on('error', console.error)
      }
    },
  },
}
