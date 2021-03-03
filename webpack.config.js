const mode = 'production'
const entry = './source/index.js'
const path = require('path').resolve(__dirname, '')
const rules = [
  { test: /TimeWorkerContent\.js$/, use: './source/loader/text.loader.js' },
  { test: /\.css$/, use: './source/loader/text.loader.js' },
  { test: /\.html$/, use: './source/loader/text.loader.js' },
]

module.exports = [
  {
    mode, entry,
    output: { path, filename: 'bundle/valkyrie.js' },
    module: { rules },
    optimization: { minimize: true, minimizer: [] },
  },
  {
    mode, entry,
    output: { path, filename: 'bundle/valkyrie.min.js' },
    module: { rules },
  },
]
