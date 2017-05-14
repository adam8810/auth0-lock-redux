import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

var config = {
  format: 'umd',
  moduleName: 'auth0LockRedux',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
        screw_ie8: false
      },
      mangle: {
        screw_ie8: false
      },
      output: {
        screw_ie8: false
      }
    })
  )
}

export default config
