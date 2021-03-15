import { name, version, author } from './package.json'
import { string } from 'rollup-plugin-string'
import cleanup from 'rollup-plugin-cleanup'
import clear from 'rollup-plugin-clear'

const metadata = `// ==UserScript==
// @name         ${ name }
// @namespace    https://greasyfork.org/scripts/422519-valkyrie
// @version      ${ version }
// @author       ${ author }
// @modified     ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString('en-DE')}
// @description  文字游戏《武神传说》的浏览器脚本程序 | 界面拓展 | 功能增强
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/ValkyrieWorker/source/image/wakuang.png
// @supportURL   https://github.com/coderzhaoziwei/Valkyrie/issues
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/pay*
// @exclude      http://*.wsmud.com/dist*
// @exclude      http://*.wsmud.com/news*
// @license      MIT
// ==/UserScript==

/* eslint-env es6 */
/* global common:readonly gsap:readonly */
/* global Vue:readonly Element3:readonly */
/* global ValkyrieWorker:readonly  Valkyrie:readonly */
`

export default {
  input: 'source/index.js',
  output: {
    file: 'bundle/Valkyrie.user.js',
    format: 'iife',
    banner: metadata,
  },
  plugins: [
    cleanup(),
    string({
      include: [
        'source/html/*.html',
        'source/style/*.css',
      ],
    }),
    clear({
      targets: [
        'bundle/',
      ],
    }),
  ],
}
