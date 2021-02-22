const path = require('path')
const config = require('./package.json')
const { BannerPlugin } = require('webpack')

const banner = `// ==UserScript==
// @name         Valkyrie
// @namespace    com.coderzhao.valkyrie
// @version      ${config.version}
// @author       Coder Zhao
// @description  武神传说浏览器脚本程序
// @modified     ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString('en-DE')}
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/rxjs@6/bundles/rxjs.umd.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// ==/UserScript==`

module.exports = {
  mode: 'production',
  entry: './source/index.js',
  output: {
    path: path.resolve(__dirname, ''),
    filename: `valkyrie.user.js`,
  },
  module: {
    rules: [
      { test: /\.css$/, use: './css_text_loader.js' },
    ],
  },
  plugins: [
    new BannerPlugin({ banner, raw: true, entryOnly: true }),
  ],
  optimization: {
    minimize: true,
    minimizer: [],
  },
}
