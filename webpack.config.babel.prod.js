const path = require('path')

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  // https://webpack.docschina.org/configuration/target/
  target: 'electron-renderer',
  entry: [require.resolve('./src/index.jsx')],
  output: {
    path: path.resolve(__dirname, 'output/app-win32-x64/resources/app'),
    filename: 'index.prod.js',
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
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // 将 JS 字符串生成为 style 节点
          },
          {
            loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader', // 将 Sass 编译成 CSS
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    serialport: 'commonjs serialport',
  },
}
