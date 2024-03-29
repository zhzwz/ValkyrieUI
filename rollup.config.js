import { name, version, author } from './package.json'
import { string } from 'rollup-plugin-string'
import cleanup from 'rollup-plugin-cleanup'
import clear from 'rollup-plugin-clear'

import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'

const metadata = `// ==UserScript==
// @name         ${ name }
// @homepage     https://greasyfork.org/scripts/422519
// @namespace    https://greasyfork.org/scripts/422519
// @version      ${ version }
// @author       ${ author }
// @modified     ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString('en-DE')}
// @description  文字游戏《武神传说》的浏览器脚本程序 | 界面功能扩展 | UI 样式优化
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/Valkyrie/source/image/wakuang.png
// @supportURL   https://github.com/coderzhaoziwei/Valkyrie/issues
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/pay*
// @exclude      http://*.wsmud.com/dist*
// @exclude      http://*.wsmud.com/news*
// @license      MIT
// ==/UserScript==

/* eslint-env es6 */
/* global Vue:readonly */
/* global Element3:readonly */
/* global gsap:readonly */
/* global Valkyrie:readonly */
`

export default {
  input: `source/index.js`,
  output: {
    file: `bundle/valkyrieui.user.js`,
    format: `iife`,
    banner: metadata,
  },
  plugins: [
    cleanup(),
    postcss({
      plugins: [
        cssnano(), // CSS 压缩等功能
      ],
    }),
    string({
      include: [`source/html/*.html`],
    }),
    clear({
      targets: [`bundle/`],
    }),
  ],
}
