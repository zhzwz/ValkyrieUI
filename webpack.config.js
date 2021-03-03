const path = require('path')
const config = require('./package.json')
const { BannerPlugin } = require('webpack')

const banner = `// ==UserScript==
// @name         Legend of Valkyrie
// @namespace    com.coderzhaoziwei.valkyrie
// @version      ${config.version}
// @author       Coder Zhao
// @description  《武神传说》浏览器脚本程序 | Valkyrie
// @modified     ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString('en-DE')}
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/422519
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/legend-of-valkyrie/source/image/wakuang.png#12.7kb
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// ==/UserScript==`

module.exports = {
  mode: 'production',
  entry: './source/index.js',
  output: {
    path: path.resolve(__dirname, ''),
    filename: `bundle/legend_of_valkyrie.user.js`,
  },
  module: {
    rules: [
      { test: /\.css$/, use: './source/loader/text.loader.js' },
      { test: /\.html$/, use: './source/loader/text.loader.js' },
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
