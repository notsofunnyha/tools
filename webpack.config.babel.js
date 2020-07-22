const path = require('path')
const webpack = require('webpack')
const child_process = require('child_process')
const spawn = child_process.spawn

const port = process.env.PORT || 1212
const publicPath = `http://localhost:${port}/dist`

module.exports = {
  devtool: 'inline-source-map',
  entry: ['react-hot-loader/patch', './src/index.jsx'],
  output: {
    filename: 'index.js',
    // path: path.resolve(__dirname, 'dist'),
    publicPath: publicPath + '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
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
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),

    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
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
          .on('close', (code) => process.exit(code))
          .on('error', (spawnError) => console.error(spawnError))
      }
    },
  },
}
