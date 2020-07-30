const developmentEnvironments = ['development', 'test']

const developmentPlugins = [require('react-hot-loader/babel')]

const productionPlugins = [
  require('babel-plugin-dev-expression'),

  // babel-preset-react-optimize
  require('@babel/plugin-transform-react-constant-elements'),
  require('@babel/plugin-transform-react-inline-elements'),
  require('babel-plugin-transform-react-remove-prop-types'),
]

module.exports = (api) => {
  // See docs about api at https://babeljs.io/docs/en/config-files#apicache

  const isDevelopment = api.env(developmentEnvironments)
  return {
    presets: [
      // require('@babel/preset-env'),
      [require('@babel/preset-react'), { isDevelopment }],
    ],
    plugins: [
      ...(isDevelopment ? developmentPlugins : productionPlugins),

      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
    ],
  }
}
