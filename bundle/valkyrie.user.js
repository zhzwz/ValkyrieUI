// ==UserScript==
// @name         Valkyrie
// @namespace    https://greasyfork.org/scripts/422519-valkyrie
// @version      0.0.477
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @modified     2021/3/18 13:35:45
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

(function () {
  'use strict';

  var rootCSS = "/* 16 32 64 96 128 192 256 */\n:root {\n  --bg: #202020;\n  --bg-dark: #181818;\n  --bg-darker: #101010;\n\n  --text: rgb(216, 216, 216);\n  --text-dark: #a8a8a8;\n  --text-darker: #888888;\n\n  --el-color-white: rgb(216, 216, 216);\n  --el-color-black: rgb(128, 128, 128);\n  --el-color-green: rgb(  0, 128,  64);\n\n  --el-bgcolor-dark-1: rgba(128, 128, 128, 0.75);\n  --el-bgcolor-dark-2: rgba( 64,  64,  64, 0.75);\n  --el-bgcolor-dark-3: rgba( 32,  32,  32, 0.75);\n}\n\n::selection {\n  color: rgb(0,160,0);\n  background-color: rgb(0,40,0);\n}\n::-moz-selection {\n  color: rgb(0,160,0);\n  background-color: rgb(0,40,0);\n}\n\n.v-font-cursive {\n  font-family: 'Ma Shan Zheng', cursive;\n}\n.v-cursor-pointer {\n  cursor: pointer;\n}\n\n\n.v-unselectable, .tool-bar, .content-bottom {\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\nbody {\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: center;\n\n  font-family: \"Helvetica Neue\", Helvetica, \"PingFang SC\",\n    \"Hiragino Sans GB\", \"Microsoft YaHei\", \"微软雅黑\", Arial, sans-serif;\n  background-color: rgba(0, 0, 0, 0.8) !important;\n}\n\n.login-content, .container {\n  order: 2;\n  flex: 1 1 auto;\n  width: 16em;\n  max-width: 768px;\n  font-size: 1em !important;\n  margin: 0;\n  border-left: 4px solid rgba(64, 64, 64, 0.5);\n  border-right: 4px solid rgba(64, 64, 64, 0.5);\n}\n.channel {\n  display: none;\n  font-size: 0.75em;\n}\n@media screen and (max-width: 768px) {\n  .login-content, .container {\n    flex: 1 0 auto;\n    width: 100%;\n    border: none !important;\n  }\n  .channel {\n    display: block;\n  }\n}\n\n\n.login-content .content {\n  background-color: rgba(64, 64, 64, 0.25);\n}\n.login-content .panel_item {\n  color: rgb(216, 216, 216);\n  border-color: rgba(64, 64, 64) !important;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.login-content .panel_item:not(.active):hover {\n  color: rgb(216, 216, 216);\n  background-color: rgba(0, 128, 64, 0.25);\n}\n.login-content .bottom {\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.login-content iframe {\n  background-color: rgb(216, 216, 216);\n}\n.login-content .signinfo, .login-content .signinfo a {\n  color: rgb(216, 216, 216);\n}\n\n.room_desc {\n  font-size: 0.75em;\n  text-indent: 2em;\n  line-height: 1.5em;\n}\n.room_exits {\n  display: flex;\n  justify-content: center; /* 居中 */\n}\n\n.room_exits > svg > rect,\n.room_exits > svg > text {\n  cursor: pointer;\n}\n\n\n.v-room-title .el-dialog__wrapper {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.v-room-title .el-dialog {\n  margin: unset !important;\n  background-color: rgba(32, 32, 32, 0.9);\n}\n.v-room-title .el-dialog__title {\n  color: rgb(216, 216, 216);\n  font-size: 1em;\n  font-family: 'Ma Shan Zheng', cursive;\n}\n.v-room-title .v-room-map {\n  width: 100%;\n  height: 100%;\n}\n.v-room-title svg {\n  cursor: grabbing;\n}\n.v-room-title .el-dialog__body {\n  padding: 0 !important;\n}\n.v-room-title .el-dialog__body {\n  display: flex;\n  justify-content: center;\n}\n\n\n\n.content-bottom {\n  font-size: 0.75em;\n}\n\n.room-commands,\n.combat-commands {\n  position: relative;\n  white-space: pre-wrap;\n  padding-left: 1em;\n}\n.room-commands::before,\n.combat-commands::before {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  height: 100%;\n  color: rgb(216, 216, 216);\n  border-color: rgba(64, 64, 64);\n  background-color: rgba(0, 0, 0, 0.5);\n}\n/* .combat-commands::before {\n\n  background-color: #232323;\n  color: gray;\n  display: inline-block;\n  border-bottom-right-radius: 0.25em;\n} */\n\n\n\n\n.tool-bar > .tool-item {\n  font-size: 0.75em;\n  height: 3em;\n  width: 3em;\n  margin: 0 0.25em 0.25em 0;\n\n  color: rgba(255, 255, 255, 0.5);\n  border-color: rgba(64, 64, 64);\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.tool-bar > .tool-item > span.tool-icon {\n  line-height: 1.25em;\n}\n.tool-bar > .tool-item > span.tool-text {\n  line-height: 1.5em;\n  font-weight: bold;\n  font-weight: normal;\n}\n.tool-bar.right-bar {\n  right: 0px;\n}\n.tool-item[command=\"showtool\"] {\n  line-height: 3em;\n}\n\n\n\n/* 原游戏角色状态文本 */\n.state-bar > .title {\n  font-size: 1em;\n  line-height: 3em;\n  padding-left: 1em;\n}\n\n/* 技能列表的等级数字对齐 */\n.skill-level{font-family:monospace}\n\n/* 原游戏的按钮样式优化 */\nspan.span-button,\ndiv.item-commands > span[cmd],\ndiv.room-commands > .act-item,\ndiv.combat-commands > .pfm-item {\n  font-size: 1em;\n  min-width: 1em;\n  line-height: 1.5em;\n  padding: 0 0.5em;\n  margin: 0 0 0.25em 0.5em;\n  border-radius: 0.25em;\n\n  color: rgb(216, 216, 216);\n  border: 1px solid rgba(64, 64, 64);\n  background-color: rgba(0, 0, 0, 0.5);\n\n  cursor: pointer;\n  text-align: center;\n}\nspan.span-button:hover,\ndiv.item-commands > span[cmd]:hover,\ndiv.room-commands > .act-item:hover,\ndiv.combat-commands > .pfm-item:hover {\n  color: rgb(216, 216, 216);\n  background-color: rgba(0, 128, 64, 0.25);\n}\nspan.span-button:active,\ndiv.item-commands > span[cmd]:active,\ndiv.room-commands > .act-item:active,\ndiv.combat-commands > .pfm-item:active {\n  transform: translateY(1px);\n\n  color: rgb(216, 216, 216);\n  background-color: rgba(0, 128, 64, 0.5);\n}\n";

  var elementCSS = ".el-popper[x-placement^=top] .popper__arrow,\n.el-popper[x-placement^=top] .popper__arrow::after {\n  border-top-color: rgba(64, 64, 64, 0.9);\n}\n.el-popper[x-placement^=bottom] .popper__arrow,\n.el-popper[x-placement^=bottom] .popper__arrow::after {\n  border-bottom-color: rgba(64, 64, 64, 0.9);\n}\n\n\n\n\n\n\n/* checkbox */\n.el-checkbox__input.is-checked + .el-checkbox__label {\n  color: var(--el-color-green);\n}\n.el-checkbox__input.is-checked .el-checkbox__inner,\n.el-checkbox__input.is-indeterminate .el-checkbox__inner {\n  border-color: var(--el-color-green);\n  background-color: var(--el-color-green);\n}\n.el-checkbox__label {\n  font-size: 0.75em;\n  padding-left: 1em;\n  line-height: 1.5em;\n}\n\n/* tooltip */\n.el-tooltip__popper.is-dark {\n  color: var(--el-color-white);\n  background: var(--el-bgcolor-dark-3);\n}\n.el-tooltip__popper[x-placement^=bottom] .popper__arrow,\n.el-tooltip__popper[x-placement^=bottom] .popper__arrow::after {\n  border-bottom-color: var(--el-bgcolor-dark-2);\n}\n\n\n\n\n\n/* input */\n.el-input__inner {\n  height: 24px;\n  font-size: 12px;\n  line-height: 24px;\n  color: rgb(216, 216, 216);\n  /* border-color: rgb(0, 128, 64); */\n  border-color: rgba(64, 64, 64);\n  background-color: rgba(64, 64, 64, 0.75);\n}\n.el-input__icon {\n  width: 24px;\n  line-height: 24px;\n}\n.el-textarea__inner {\n  color: rgb(216, 216, 216);\n  border-color: rgba(64, 64, 64, 0.75);\n  background-color: rgba(64, 64, 64, 0.75);\n}\n.el-textarea__inner:hover,\n.el-textarea__inner:focus {\n  border-color: rgba(0, 128, 64, 0.75);\n}\n\n\n/* select */\n.el-select-dropdown {\n  border: none;\n  background-color: rgba(64, 64, 64, 0.9);\n}\n\n.el-select-dropdown__item {\n  height: 2em;\n  font-size: 0.75em;\n  line-height: 2em;\n  color: rgb(216, 216, 216);\n}\n.el-select-dropdown__item.hover,\n.el-select-dropdown__item:hover {\n  background-color: rgba(0, 128, 64, 0.25);\n}\n.el-select-dropdown__item.selected {\n  font-weight: normal;\n  color: rgb(0, 128, 64);\n}\n.el-select .el-input__inner:focus {\n  border-color: rgb(0, 128, 64);\n}\n\n\n\n\n\n\n\n\n\n\n";

  var fontCSS = ".v-font {\n  font-family: 'Ma Shan Zheng', cursive !important;\n}\n";

  var scoreCSS = ".v-score {\n  display: flex;\n  flex-direction: column;\n  padding: 0.5em;\n}\n\n.v-score > .v-score-row {\n  display: flex;\n  flex-direction: row;\n\n  font-size: 1.25em;\n  height: 1.5em;\n  line-height: 1.5em;\n}\n.v-score > .v-score-row > .v-score-title {\n  flex: 0 0 auto;\n  padding: 0 0.5em;\n  text-align: center;\n}\n.v-score > .v-score-row > .v-score-value {\n  flex: 0 0 auto;\n  width: 9em;\n  text-align: left;\n  font-family: monospace;\n}\n\n.v-percentage {\n  padding: 0 0.5em;\n}\n.v-percentage .el-progress-bar__outer {\n  background-color: rgba(128, 128, 128, 0.5);\n  border-radius: 0.25em;\n}\n.v-percentage .el-progress-bar__inner {\n  border-radius: 0.25em;\n}\n.v-percentage .el-progress-bar__innerText {\n  display: flex;\n  justify-content: space-between;\n  overflow: hidden;\n  color: rgb(216, 216, 216, 0.9);\n  line-height: 16px;\n}\n.v-percentage.v-percentage-mp {\n  margin-bottom: 0.25em;\n}\n.v-percentage.v-percentage-hp .el-progress-bar__inner {\n  background-color: rgba(255, 0, 0, 0.5);\n}\n.v-percentage.v-percentage-mp .el-progress-bar__inner {\n  background-color: rgba(0, 0, 255, 0.5);\n}\n.v-percentage.v-percentage-hp .el-progress-bar__innerText::before {\n  content: '气血 ';\n}\n.v-percentage.v-percentage-mp .el-progress-bar__innerText::before {\n  content: '内力 ';\n}\n";

  var headerCSS = ".v-header {\n  padding: 0 0.5em;\n  font-size: 1.25em;\n  line-height: 1.75em;\n  height: 1.75em !important;\n\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: center;\n  flex-direction: row;\n  justify-content: space-between;\n\n  color: rgb(216, 216, 216) !important;\n  background-color: rgba(32, 32, 32, 0.75) !important;\n}\n";

  var sidebarCSS = ".v-sidebar {\n  margin: 0;\n  flex: 0 1 auto;\n  color: var(--text);\n  width: 16em;\n}\n\n.v-sidebar-left {\n  order: 1;\n}\n.v-sidebar-right {\n  order: 3;\n}\n\n.v-sidebar > .v-sidebar-inner {\n  display: flex;\n  flex-wrap: nowrap;\n  overflow-y: scroll;\n  flex-direction: column;\n\n  height: 100%;\n\n  position: relative;\n}\n";

  var channelCSS = ".v-channel-options {\n  flex: 0 0 auto;\n  padding: 0 0.75em 1em 0.75em;\n  top: 2em;\n  position: absolute;\n  background: rgba(64, 64, 64, 0.95);\n}\n.v-channel-options-title {\n  height: 2em;\n  line-height: 2em;\n  font-size: 0.75em;\n  margin-top: 0.5em;\n}\n.v-channel-options .el-input {\n  width: 6em;\n}\n\n\n\n/* 聊天展示列 */\n.v-channel-list {\n  flex: 1 1 auto;\n  margin: 0.5em 0;\n  overflow-y: auto;\n}\n\n.v-channel-item {\n  display: flex;\n  padding: 0 0.5em;\n  font-size: 0.75em;\n  flex-direction: column;\n}\n\n.v-channel-content {\n  width: fit-content;\n  padding: 0.25em 0.5em;\n  border-radius: 0.25em;\n\n  margin: 0 1.5em 0 0.5em;\n  background-color: rgba(64, 64, 64, 0.5);\n  word-break: break-word;\n}\n\n.v-channel-self > .v-channel-title {\n  align-self: flex-end;\n}\n.v-channel-self > .v-channel-content {\n  align-self: flex-end;\n  margin: 0 0.5em 0 1.5em;\n  background-color: rgba(96, 96, 96, 0.5);\n}\n\n.v-channel-time {\n  padding: 0 0.25em;\n  color: #404040;\n  font-family: monospace;\n}\n\n\n/* 频道选择器 */\n.v-channel-select {\n  width: 4.5em;\n  margin-left: 0.5em;\n}\n.v-channel-select .el-input__inner {\n  border-bottom-left-radius: unset;\n  border-bottom-right-radius: unset;\n  border-bottom-color: transparent;\n  background-color: rgba(32, 32, 32, 0.5);\n}\n\n/* 发言输入框 */\n.v-channel-input {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 0 0 0.5em 0.5em;\n}\n.v-channel-input textarea {\n  font-size: 0.75em;\n  border-top-left-radius: unset;\n  background-color: rgba(32, 32, 32, 0.5);\n}\n.v-channel-input .el-input__count {\n  background-color: rgba(0,0,0,0);\n}\n";

  var backgroundCSS = ".v-background {\n  width: 100%;\n  height: 100%;\n  z-index: -1;\n  position: absolute;\n  background-color: rgba(64, 64, 64, 1);\n  background-image: url(https://cdn.jsdelivr.net/gh/coderzhaoziwei/Valkyrie@main/source/image/yande%23726730.jpg);\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n";

  var valkyrieCSS = ".font-cursive {\n  font-family: 'Ma Shan Zheng', cursive !important;\n}\n.font-monospace {\n  font-family: monospace !important;\n}\n\n.red-text{color:rgb(250,100,100)}\n.green-text{color:rgb(50,150,50)}\n.yellow-text{color:rgb(250,250,100)}\n\n.unselectable {\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.selectable {\n  -moz-user-select: text;\n  -webkit-user-select: text;\n  -ms-user-select: text;\n  user-select: text;\n}\n\n.line-h-3{line-height:12px}\n.line-h-4{line-height:16px}\n.line-h-5{line-height:20px}\n.line-h-6{line-height:24px}\n.line-h-7{line-height:28px}\n.line-h-8{line-height:32px}\n.line-h-9{line-height:36px}\n.line-h-10{line-height:40px}\n.line-h-11{line-height:44px}\n.line-h-12{line-height:48px}\n.line-h-13{line-height:52px}\n.line-h-14{line-height:56px}\n.line-h-15{line-height:60px}\n.line-h-16{line-height:64px}\n\n.font-3{font-size:12px}\n.font-4{font-size:16px}\n.font-5{font-size:20px}\n.font-6{font-size:24px}\n.font-7{font-size:28px}\n.font-8{font-size:32px}\n.font-9{font-size:36px}\n.font-10{font-size:40px}\n.font-11{font-size:44px}\n.font-12{font-size:48px}\n.font-13{font-size:52px}\n.font-14{font-size:56px}\n.font-15{font-size:60px}\n.font-16{font-size:64px}\n\n.text-align-left{text-align:left}\n.text-align-right{text-align:right}\n.text-align-center{text-align:center}\n\n.d-inline{display:inline}\n.d-block{display:block}\n.d-inline-block{display:inline-block}\n.d-none{display:none}\n.d-flex{display:flex}\n\n.flex-row{flex-direction:row}\n.flex-row-reverse{flex-direction:row-reverse}\n.flex-column{flex-direction:column}\n.flex-column-reverse{flex-direction:column-reverse}\n\n.flex-nowrap{flex-wrap:nowrap}\n.flex-wrap{flex-wrap:wrap}\n.flex-wrap-reverse{flex-wrap:wrap-reverse}\n\n.justify-start{justify-content:start}\n.jusify-end{justify-content:end}\n.justify-center{justify-content:center}\n.justify-space-between{justify-content:space-between}\n.justify-space-around{justify-content:space-around}\n\n.align-start{align-items:start}\n.align-end{align-items:end}\n.align-center{align-items:center}\n.align-baseline{align-items:baseline}\n.align-stretch{align-items:stretch}\n\n.flex-0-0{flex:0 0 auto}\n.flex-1-0{flex:1 0 auto}\n.flex-0-1{flex:0 1 auto}\n.flex-1-1{flex:1 1 auto}\n\n.ma-0{margin:0}\n.ma-1{margin:4px}\n.ma-2{margin:8px}\n.ma-3{margin:12px}\n.ma-4{margin:16px}\n.ma-5{margin:20px}\n.ma-6{margin:24px}\n.ma-7{margin:28px}\n.ma-8{margin:32px}\n.ma-9{margin:36px}\n.ma-10{margin:40px}\n.ma-11{margin:44px}\n.ma-12{margin:48px}\n.ma-13{margin:52px}\n.ma-14{margin:56px}\n.ma-15{margin:60px}\n.ma-16{margin:64px}\n.ma-auto{margin:auto}\n\n.mx-0{margin-right:0;margin-left:0}\n.mx-1{margin-right:4px;margin-left:4px}\n.mx-2{margin-right:8px;margin-left:8px}\n.mx-3{margin-right:12px;margin-left:12px}\n.mx-4{margin-right:16px;margin-left:16px}\n.mx-5{margin-right:20px;margin-left:20px}\n.mx-6{margin-right:24px;margin-left:24px}\n.mx-7{margin-right:28px;margin-left:28px}\n.mx-8{margin-right:32px;margin-left:32px}\n.mx-9{margin-right:36px;margin-left:36px}\n.mx-10{margin-right:40px;margin-left:40px}\n.mx-11{margin-right:44px;margin-left:44px}\n.mx-12{margin-right:48px;margin-left:48px}\n.mx-13{margin-right:52px;margin-left:52px}\n.mx-14{margin-right:56px;margin-left:56px}\n.mx-15{margin-right:60px;margin-left:60px}\n.mx-16{margin-right:64px;margin-left:64px}\n.mx-auto{margin-right:auto;margin-left:auto}\n\n.my-0{margin-top:0;margin-bottom:0}\n.my-1{margin-top:4px;margin-bottom:4px}\n.my-2{margin-top:8px;margin-bottom:8px}\n.my-3{margin-top:12px;margin-bottom:12px}\n.my-4{margin-top:16px;margin-bottom:16px}\n.my-5{margin-top:20px;margin-bottom:20px}\n.my-6{margin-top:24px;margin-bottom:24px}\n.my-7{margin-top:28px;margin-bottom:28px}\n.my-8{margin-top:32px;margin-bottom:32px}\n.my-9{margin-top:36px;margin-bottom:36px}\n.my-10{margin-top:40px;margin-bottom:40px}\n.my-11{margin-top:44px;margin-bottom:44px}\n.my-12{margin-top:48px;margin-bottom:48px}\n.my-13{margin-top:52px;margin-bottom:52px}\n.my-14{margin-top:56px;margin-bottom:56px}\n.my-15{margin-top:60px;margin-bottom:60px}\n.my-16{margin-top:64px;margin-bottom:64px}\n.my-auto{margin-top:auto;margin-bottom:auto}\n\n.mt-0{margin-top:0}\n.mt-1{margin-top:4px}\n.mt-2{margin-top:8px}\n.mt-3{margin-top:12px}\n.mt-4{margin-top:16px}\n.mt-5{margin-top:20px}\n.mt-6{margin-top:24px}\n.mt-7{margin-top:28px}\n.mt-8{margin-top:32px}\n.mt-9{margin-top:36px}\n.mt-10{margin-top:40px}\n.mt-11{margin-top:44px}\n.mt-12{margin-top:48px}\n.mt-13{margin-top:52px}\n.mt-14{margin-top:56px}\n.mt-15{margin-top:60px}\n.mt-16{margin-top:64px}\n.mt-auto{margin-top:auto}\n\n.mr-0{margin-right:0}\n.mr-1{margin-right:4px}\n.mr-2{margin-right:8px}\n.mr-3{margin-right:12px}\n.mr-4{margin-right:16px}\n.mr-5{margin-right:20px}\n.mr-6{margin-right:24px}\n.mr-7{margin-right:28px}\n.mr-8{margin-right:32px}\n.mr-9{margin-right:36px}\n.mr-10{margin-right:40px}\n.mr-11{margin-right:44px}\n.mr-12{margin-right:48px}\n.mr-13{margin-right:52px}\n.mr-14{margin-right:56px}\n.mr-15{margin-right:60px}\n.mr-16{margin-right:64px}\n.mr-auto{margin-right:auto}\n\n.mb-0{margin-bottom:0}\n.mb-1{margin-bottom:4px}\n.mb-2{margin-bottom:8px}\n.mb-3{margin-bottom:12px}\n.mb-4{margin-bottom:16px}\n.mb-5{margin-bottom:20px}\n.mb-6{margin-bottom:24px}\n.mb-7{margin-bottom:28px}\n.mb-8{margin-bottom:32px}\n.mb-9{margin-bottom:36px}\n.mb-10{margin-bottom:40px}\n.mb-11{margin-bottom:44px}\n.mb-12{margin-bottom:48px}\n.mb-13{margin-bottom:52px}\n.mb-14{margin-bottom:56px}\n.mb-15{margin-bottom:60px}\n.mb-16{margin-bottom:64px}\n.mb-auto{margin-bottom:auto}\n\n.ml-0{margin-left:0}\n.ml-1{margin-left:4px}\n.ml-2{margin-left:8px}\n.ml-3{margin-left:12px}\n.ml-4{margin-left:16px}\n.ml-5{margin-left:20px}\n.ml-6{margin-left:24px}\n.ml-7{margin-left:28px}\n.ml-8{margin-left:32px}\n.ml-9{margin-left:36px}\n.ml-10{margin-left:40px}\n.ml-11{margin-left:44px}\n.ml-12{margin-left:48px}\n.ml-13{margin-left:52px}\n.ml-14{margin-left:56px}\n.ml-15{margin-left:60px}\n.ml-16{margin-left:64px}\n.ml-auto{margin-left:auto}\n\n.ma-n1{margin:-4px}\n.ma-n2{margin:-8px}\n.ma-n3{margin:-12px}\n.ma-n4{margin:-16px}\n.ma-n5{margin:-20px}\n.ma-n6{margin:-24px}\n.ma-n7{margin:-28px}\n.ma-n8{margin:-32px}\n.ma-n9{margin:-36px}\n.ma-n10{margin:-40px}\n.ma-n11{margin:-44px}\n.ma-n12{margin:-48px}\n.ma-n13{margin:-52px}\n.ma-n14{margin:-56px}\n.ma-n15{margin:-60px}\n.ma-n16{margin:-64px}\n\n.mx-n1{margin-right:-4px;margin-left:-4px}\n.mx-n2{margin-right:-8px;margin-left:-8px}\n.mx-n3{margin-right:-12px;margin-left:-12px}\n.mx-n4{margin-right:-16px;margin-left:-16px}\n.mx-n5{margin-right:-20px;margin-left:-20px}\n.mx-n6{margin-right:-24px;margin-left:-24px}\n.mx-n7{margin-right:-28px;margin-left:-28px}\n.mx-n8{margin-right:-32px;margin-left:-32px}\n.mx-n9{margin-right:-36px;margin-left:-36px}\n.mx-n10{margin-right:-40px;margin-left:-40px}\n.mx-n11{margin-right:-44px;margin-left:-44px}\n.mx-n12{margin-right:-48px;margin-left:-48px}\n.mx-n13{margin-right:-52px;margin-left:-52px}\n.mx-n14{margin-right:-56px;margin-left:-56px}\n.mx-n15{margin-right:-60px;margin-left:-60px}\n.mx-n16{margin-right:-64px;margin-left:-64px}\n\n.my-n1{margin-top:-4px;margin-bottom:-4px}\n.my-n2{margin-top:-8px;margin-bottom:-8px}\n.my-n3{margin-top:-12px;margin-bottom:-12px}\n.my-n4{margin-top:-16px;margin-bottom:-16px}\n.my-n5{margin-top:-20px;margin-bottom:-20px}\n.my-n6{margin-top:-24px;margin-bottom:-24px}\n.my-n7{margin-top:-28px;margin-bottom:-28px}\n.my-n8{margin-top:-32px;margin-bottom:-32px}\n.my-n9{margin-top:-36px;margin-bottom:-36px}\n.my-n10{margin-top:-40px;margin-bottom:-40px}\n.my-n11{margin-top:-44px;margin-bottom:-44px}\n.my-n12{margin-top:-48px;margin-bottom:-48px}\n.my-n13{margin-top:-52px;margin-bottom:-52px}\n.my-n14{margin-top:-56px;margin-bottom:-56px}\n.my-n15{margin-top:-60px;margin-bottom:-60px}\n.my-n16{margin-top:-64px;margin-bottom:-64px}\n\n.mt-n1{margin-top:-4px}\n.mt-n2{margin-top:-8px}\n.mt-n3{margin-top:-12px}\n.mt-n4{margin-top:-16px}\n.mt-n5{margin-top:-20px}\n.mt-n6{margin-top:-24px}\n.mt-n7{margin-top:-28px}\n.mt-n8{margin-top:-32px}\n.mt-n9{margin-top:-36px}\n.mt-n10{margin-top:-40px}\n.mt-n11{margin-top:-44px}\n.mt-n12{margin-top:-48px}\n.mt-n13{margin-top:-52px}\n.mt-n14{margin-top:-56px}\n.mt-n15{margin-top:-60px}\n.mt-n16{margin-top:-64px}\n\n.mr-n1{margin-right:-4px}\n.mr-n2{margin-right:-8px}\n.mr-n3{margin-right:-12px}\n.mr-n4{margin-right:-16px}\n.mr-n5{margin-right:-20px}\n.mr-n6{margin-right:-24px}\n.mr-n7{margin-right:-28px}\n.mr-n8{margin-right:-32px}\n.mr-n9{margin-right:-36px}\n.mr-n10{margin-right:-40px}\n.mr-n11{margin-right:-44px}\n.mr-n12{margin-right:-48px}\n.mr-n13{margin-right:-52px}\n.mr-n14{margin-right:-56px}\n.mr-n15{margin-right:-60px}\n.mr-n16{margin-right:-64px}\n\n.mb-n1{margin-bottom:-4px}\n.mb-n2{margin-bottom:-8px}\n.mb-n3{margin-bottom:-12px}\n.mb-n4{margin-bottom:-16px}\n.mb-n5{margin-bottom:-20px}\n.mb-n6{margin-bottom:-24px}\n.mb-n7{margin-bottom:-28px}\n.mb-n8{margin-bottom:-32px}\n.mb-n9{margin-bottom:-36px}\n.mb-n10{margin-bottom:-40px}\n.mb-n11{margin-bottom:-44px}\n.mb-n12{margin-bottom:-48px}\n.mb-n13{margin-bottom:-52px}\n.mb-n14{margin-bottom:-56px}\n.mb-n15{margin-bottom:-60px}\n.mb-n16{margin-bottom:-64px}\n\n.ml-n1{margin-left:-4px}\n.ml-n2{margin-left:-8px}\n.ml-n3{margin-left:-12px}\n.ml-n4{margin-left:-16px}\n.ml-n5{margin-left:-20px}\n.ml-n6{margin-left:-24px}\n.ml-n7{margin-left:-28px}\n.ml-n8{margin-left:-32px}\n.ml-n9{margin-left:-36px}\n.ml-n10{margin-left:-40px}\n.ml-n11{margin-left:-44px}\n.ml-n12{margin-left:-48px}\n.ml-n13{margin-left:-52px}\n.ml-n14{margin-left:-56px}\n.ml-n15{margin-left:-60px}\n.ml-n16{margin-left:-64px}\n\n.pa-0{padding:0}\n.pa-1{padding:4px}\n.pa-2{padding:8px}\n.pa-3{padding:12px}\n.pa-4{padding:16px}\n.pa-5{padding:20px}\n.pa-6{padding:24px}\n.pa-7{padding:28px}\n.pa-8{padding:32px}\n.pa-9{padding:36px}\n.pa-10{padding:40px}\n.pa-11{padding:44px}\n.pa-12{padding:48px}\n.pa-13{padding:52px}\n.pa-14{padding:56px}\n.pa-15{padding:60px}\n.pa-16{padding:64px}\n\n.px-0{padding-right:0;padding-left:0}\n.px-1{padding-right:4px;padding-left:4px}\n.px-2{padding-right:8px;padding-left:8px}\n.px-3{padding-right:12px;padding-left:12px}\n.px-4{padding-right:16px;padding-left:16px}\n.px-5{padding-right:20px;padding-left:20px}\n.px-6{padding-right:24px;padding-left:24px}\n.px-7{padding-right:28px;padding-left:28px}\n.px-8{padding-right:32px;padding-left:32px}\n.px-9{padding-right:36px;padding-left:36px}\n.px-10{padding-right:40px;padding-left:40px}\n.px-11{padding-right:44px;padding-left:44px}\n.px-12{padding-right:48px;padding-left:48px}\n.px-13{padding-right:52px;padding-left:52px}\n.px-14{padding-right:56px;padding-left:56px}\n.px-15{padding-right:60px;padding-left:60px}\n.px-16{padding-right:64px;padding-left:64px}\n\n.py-0{padding-top:0;padding-bottom:0}\n.py-1{padding-top:4px;padding-bottom:4px}\n.py-2{padding-top:8px;padding-bottom:8px}\n.py-3{padding-top:12px;padding-bottom:12px}\n.py-4{padding-top:16px;padding-bottom:16px}\n.py-5{padding-top:20px;padding-bottom:20px}\n.py-6{padding-top:24px;padding-bottom:24px}\n.py-7{padding-top:28px;padding-bottom:28px}\n.py-8{padding-top:32px;padding-bottom:32px}\n.py-9{padding-top:36px;padding-bottom:36px}\n.py-10{padding-top:40px;padding-bottom:40px}\n.py-11{padding-top:44px;padding-bottom:44px}\n.py-12{padding-top:48px;padding-bottom:48px}\n.py-13{padding-top:52px;padding-bottom:52px}\n.py-14{padding-top:56px;padding-bottom:56px}\n.py-15{padding-top:60px;padding-bottom:60px}\n.py-16{padding-top:64px;padding-bottom:64px}\n\n.pt-0{padding-top:0}\n.pt-1{padding-top:4px}\n.pt-2{padding-top:8px}\n.pt-3{padding-top:12px}\n.pt-4{padding-top:16px}\n.pt-5{padding-top:20px}\n.pt-6{padding-top:24px}\n.pt-7{padding-top:28px}\n.pt-8{padding-top:32px}\n.pt-9{padding-top:36px}\n.pt-10{padding-top:40px}\n.pt-11{padding-top:44px}\n.pt-12{padding-top:48px}\n.pt-13{padding-top:52px}\n.pt-14{padding-top:56px}\n.pt-15{padding-top:60px}\n.pt-16{padding-top:64px}\n\n.pr-0{padding-right:0}\n.pr-1{padding-right:4px}\n.pr-2{padding-right:8px}\n.pr-3{padding-right:12px}\n.pr-4{padding-right:16px}\n.pr-5{padding-right:20px}\n.pr-6{padding-right:24px}\n.pr-7{padding-right:28px}\n.pr-8{padding-right:32px}\n.pr-9{padding-right:36px}\n.pr-10{padding-right:40px}\n.pr-11{padding-right:44px}\n.pr-12{padding-right:48px}\n.pr-13{padding-right:52px}\n.pr-14{padding-right:56px}\n.pr-15{padding-right:60px}\n.pr-16{padding-right:64px}\n\n.pb-0{padding-bottom:0}\n.pb-1{padding-bottom:4px}\n.pb-2{padding-bottom:8px}\n.pb-3{padding-bottom:12px}\n.pb-4{padding-bottom:16px}\n.pb-5{padding-bottom:20px}\n.pb-6{padding-bottom:24px}\n.pb-7{padding-bottom:28px}\n.pb-8{padding-bottom:32px}\n.pb-9{padding-bottom:36px}\n.pb-10{padding-bottom:40px}\n.pb-11{padding-bottom:44px}\n.pb-12{padding-bottom:48px}\n.pb-13{padding-bottom:52px}\n.pb-14{padding-bottom:56px}\n.pb-15{padding-bottom:60px}\n.pb-16{padding-bottom:64px}\n\n.pl-0{padding-left:0}\n.pl-1{padding-left:4px}\n.pl-2{padding-left:8px}\n.pl-3{padding-left:12px}\n.pl-4{padding-left:16px}\n.pl-5{padding-left:20px}\n.pl-6{padding-left:24px}\n.pl-7{padding-left:28px}\n.pl-8{padding-left:32px}\n.pl-9{padding-left:36px}\n.pl-10{padding-left:40px}\n.pl-11{padding-left:44px}\n.pl-12{padding-left:48px}\n.pl-13{padding-left:52px}\n.pl-14{padding-left:56px}\n.pl-15{padding-left:60px}\n.pl-16{padding-left:64px}\n";

  var LeftHTML = "<teleport to=\".v-sidebar-left\">\n  <div class=\"v-sidebar-inner unselectable\" v-show=\"showSidebarLeft\">\n    <!-- header -->\n    <div class=\"v-header\">\n      <div>\n        <span class=\"v-font\" v-text=\"name\"></span>\n        <i v-if=\"genderValue===0\" style=\"padding-left: 0.5em;\" class=\"el-icon-female\"></i>\n        <i v-if=\"genderValue===1\" style=\"padding-left: 0.5em;\" class=\"el-icon-male\"></i>\n      </div>\n      <i class=\"el-icon-menu\"></i>\n    </div>\n    <!-- score -->\n    <div class=\"v-score\">\n      <div class=\"v-score-row\">\n        <div class=\"v-score-title v-font\" v-html=\"score.level\"></div>\n        <div class=\"v-score-value v-font\" v-text=\"score.family\"></div>\n      </div>\n\n      <el-progress class=\"v-percentage v-percentage-hp\" :text-inside=\"true\" :stroke-width=\"16\" :percentage=\"hpPercentage\"\n      ></el-progress>\n      <el-progress class=\"v-percentage v-percentage-mp\" :text-inside=\"true\" :stroke-width=\"16\" :percentage=\"mpPercentage\"\n      ></el-progress>\n\n      <div class=\"v-score-row\">\n        <div class=\"v-score-title v-font\">经验</div>\n        <div class=\"v-score-value\" v-text=\"Number(jy.toFixed()).toLocaleString()\"></div>\n      </div>\n      <div class=\"v-score-row\">\n        <div class=\"v-score-title v-font\">潜能</div>\n        <div class=\"v-score-value\" v-text=\"Number(qn.toFixed()).toLocaleString()\"></div>\n      </div>\n\n\n    </div>\n\n    <!-- 任务 -->\n    <div class=\"font-4 font-cursive line-h-4 px-4\">\n      <!-- 请安 -->\n      <div class=\"d-flex py-1\" :class=\"!qaValue ? 'red-text' : 'green-text'\" v-show=\"!qaValue\">\n        <div class=\"flex-0-0\">日常请安</div>\n        <div class=\"flex-1-0 text-align-right\" v-text=\"xyValue ? '已完成' : '未完成'\"></div>\n      </div>\n      <!-- 师门 -->\n      <div class=\"d-flex py-1\" :class=\"smCount < 20 ? 'red-text' : 'green-text'\">\n        <div class=\"flex-0-0\">日常师门</div>\n        <div class=\"flex-1-0 font-monospace text-align-right\">{{smCount}}/20/{{smTotal}}</div>\n      </div>\n      <div class=\"d-flex py-1\" :class=\"smTarget ? 'red-text' : 'green-text'\" v-show=\"smTarget\">\n        <div class=\"flex-0-0\">师门目标</div>\n        <div class=\"flex-1-0 text-align-right\" v-html=\"smTarget\"></div>\n      </div>\n      <!-- 追捕 -->\n      <div class=\"d-flex py-1\" :class=\"ymCount < 20 ? 'red-text' : 'green-text'\">\n        <div class=\"flex-0-0\">日常追捕</div>\n        <div class=\"flex-1-0 font-monospace text-align-right\">{{ymCount}}/20/{{ymTotal}}</div>\n      </div>\n      <div class=\"d-flex py-1\" :class=\"ymTarget ? 'red-text' : 'green-text'\" v-show=\"ymTarget\">\n        <div class=\"flex-0-0\">追捕目标</div>\n        <div class=\"flex-1-0 text-align-right\">\n          <span>{{ymTargetX}} {{ymTargetY}}</span>\n          <span class=\"yellow-text pl-2\">{{ymTarget}}</span>\n        </div>\n      </div>\n      <!-- 副本 -->\n      <div class=\"d-flex py-1\" :class=\"fbCount < 20 ? 'red-text' : 'green-text'\">\n        <div class=\"flex-0-0\">日常副本</div>\n        <div class=\"flex-1-0 font-monospace text-align-right\">{{fbCount}}/20</div>\n      </div>\n      <!-- 武道塔 -->\n      <div class=\"d-flex py-1\" :class=\"!wdValue || wdCount < wdTotal ? 'red-text' : 'green-text'\">\n        <div class=\"flex-0-0\">日常武道</div>\n        <div class=\"flex-1-0 text-align-right\">\n          <span>{{wdValue?'':'可重置'}}</span>\n          <span class=\"font-monospace pl-2\">{{wdCount}}/{{wdTotal}}</span>\n        </div>\n      </div>\n      <!-- 运镖 -->\n      <div class=\"d-flex py-1\" :class=\"ybCount < 20 ? 'red-text' : 'green-text'\">\n        <div class=\"flex-0-0\">周常运镖</div>\n        <div class=\"flex-1-0 font-monospace text-align-right\">{{ybCount}}/20/{{ybTotal}}</div>\n      </div>\n      <!-- 襄阳战 -->\n      <div class=\"d-flex py-1\" :class=\"!xyValue ? 'red-text' : 'green-text'\">\n        <div class=\"flex-0-0\">周常襄阳</div>\n        <div class=\"flex-1-0 text-align-right\" v-text=\"xyValue ? '已完成' : '未完成'\"></div>\n      </div>\n      <!-- 门派 BOSS -->\n      <div class=\"d-flex py-1\" :class=\"!mpValue ? 'red-text' : 'green-text'\">\n        <div class=\"flex-0-0\">周常门派</div>\n        <div class=\"flex-1-0 text-align-right\" v-text=\"mpValue ? '已完成' : '未完成'\"></div>\n      </div>\n    </div>\n    <!-- 功能 -->\n    <div class=\"d-flex flex-wrap font-4 font-cursive px-4 py-1\">\n      <span class=\"span-button flex-1-0 mx-1\" @click=\"actionWaKuang()\">挖矿</span>\n      <span class=\"span-button flex-1-0 mx-1\" @click=\"actionXiuLian()\">修炼</span>\n      <span class=\"span-button flex-1-0 mx-1\" @click=\"actionWuMiao()\">武庙</span>\n      <span class=\"span-button flex-1-0 mx-1\">〇〇〇〇</span>\n      <span class=\"span-button flex-1-0 mx-1\">〇〇〇〇</span>\n      <span class=\"span-button flex-1-0 mx-1\">〇〇〇〇</span>\n      <span class=\"span-button flex-1-0 mx-1\">〇〇〇〇</span>\n      <span class=\"span-button flex-1-0 mx-1\">〇〇〇〇</span>\n      <!-- 出招配置 -->\n    </div>\n\n  </div>\n</teleport>\n";

  var RightHTML = "<teleport to=\".v-sidebar-right\">\n  <div class=\"v-sidebar-inner\" v-show=\"showSidebarRight\">\n    <!-- header -->\n    <div class=\"v-header\">\n      <span class=\"v-font v-unselectable\">聊天频道</span>\n      <el-tooltip class=\"item\" effect=\"dark\" content=\"显示内容筛选\" placement=\"bottom\">\n        <i class=\"el-icon-more-outline v-cursor-pointer\" @click=\"showChannelOptions = !showChannelOptions\"></i>\n      </el-tooltip>\n    </div>\n    <!-- options -->\n    <el-collapse-transition>\n      <div v-show=\"showChannelOptions\" class=\"v-channel-options\">\n        <div class=\"v-channel-options-title\">显示选中频道的内容</div>\n        <el-checkbox v-model=\"options.showChannelCh\" label=\"世界\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelTm\" label=\"队伍\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelFa\" label=\"门派\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelPt\" label=\"帮会\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelEs\" label=\"全区\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelRu\" label=\"谣言\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelSy\" label=\"系统\"></el-checkbox>\n        <!-- <div class=\"v-channel-options-title\">你的聊天发送至频道</div>\n        <el-select v-model=\"channelValue\">\n          <el-option v-for=\"item in channelSelections\" :key=\"item.value\" :label=\"item.name\" :value=\"item.value\"></el-option>\n        </el-select> -->\n      </div>\n    </el-collapse-transition>\n    <!-- list -->\n    <div class=\"v-channel-list\">\n      <div v-for=\"item in chatList\" :class=\"['v-channel-item', id===item.id ? 'v-channel-self' : '']\">\n        <div class=\"v-channel-title v-unselectable\">\n          <span v-if=\"item.isSelf===true\"  class=\"v-channel-time\" v-text=\"item.timeText\"></span>\n          <span\n            class=\"v-channel-name v-cursor-pointer\"\n            v-html=\"`<${item.tag}>【${item.titleText}】${item.name}</${item.tag}>`\"\n            @click=\"sendCommands(`look3 ${item.id},look3 body of ${item.id}`)\"\n          ></span>\n          <span v-if=\"item.isSelf===false\" class=\"v-channel-time\" v-text=\"item.timeText\"></span>\n        </div>\n        <div class=\"v-channel-content\" v-html=\"`<${item.tag}>${item.content}</${item.tag}>`\"></div>\n      </div>\n      <div class=\"v-channel-scroll\"></div>\n    </div>\n    <!-- select -->\n    <el-select class=\"v-channel-select\" v-model=\"channelValue\">\n      <el-option v-for=\"item in channelSelections\" :key=\"item.value\" :label=\"item.name\" :value=\"item.value\"></el-option>\n    </el-select>\n    <!-- input -->\n    <div class=\"v-channel-input\">\n      <el-input\n        type=\"textarea\"\n        v-model=\"chatValue\"\n        v-on:keyup.enter=\"clickChatIcon()\"\n        :rows=\"2\" resize=\"none\"\n        maxlength=\"200\" show-word-limit\n      ></el-input>\n      <i class=\"el-icon-s-promotion v-unselectable v-cursor-pointer\" style=\"width: 2em; text-align: center;\" @click=\"clickChatIcon()\"></i>\n    </div>\n  </div>\n</teleport>\n";

  var RoomTitleHTML = "<teleport to=\".v-room-title\">\n  <span class=\"v-room-name v-font v-unselectable\" v-text=\"roomName\"></span>\n  <i class=\"el-icon-map-location v-cursor-pointer\" @click=\"clickMapIcon()\"></i>\n  <!-- 地图弹窗 -->\n  <el-dialog\n    :width=\"`${map.width}px`\"\n    :title=\"roomName\" center destroy-on-close\n    :visible.sync=\"showRoomMapDialog\"\n    v-model:visible=\"showRoomMapDialog\"\n  >\n    <div class=\"v-room-map v-unselectable\" :style=\"`max-width:${map.width}px;max-height:${map.height}px;`\" v-html=\"map.svg\"></div>\n  </el-dialog>\n</teleport>\n";

  const head = document.head;
  const body = document.body;
  const setAttribute = common.setAttribute;
  const appendElement = common.appendElement;
  appendElement(body, 'div', { class: 'valkyrie' });
  appendElement(body, 'div', { class: 'v-background' });
  appendElement(body, 'div', { class: 'v-sidebar v-sidebar-left' });
  appendElement(body, 'div', { class: 'v-sidebar v-sidebar-right' });
  setAttribute('.room-title', { class: 'v-room-title v-header', innerHTML: '' });
  setAttribute('li.panel_item.active', { class: 'panel_item active v-header v-font' });
  setAttribute('.room_exits', { class: 'room_exits v-unselectable' });
  const ValkyrieHTML = LeftHTML + RightHTML + RoomTitleHTML;
  setAttribute('.valkyrie', { innerHTML: ValkyrieHTML });
  appendElement(head, 'link', { rel: 'preconnect', href: 'https://fonts.gstatic.com' });
  appendElement(head, 'link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap' });
  appendElement(head, 'link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/element3@0.0.39/lib/theme-chalk/index.css' });
  appendElement(head, 'style', { id: 'style-root', innerHTML: rootCSS });
  appendElement(head, 'style', { id: 'style-element', innerHTML: elementCSS });
  appendElement(head, 'style', { id: 'style-v-font', innerHTML: fontCSS });
  appendElement(head, 'style', { id: 'style-v-score', innerHTML: scoreCSS });
  appendElement(head, 'style', { id: 'style-v-header', innerHTML: headerCSS });
  appendElement(head, 'style', { id: 'style-v-sidebar', innerHTML: sidebarCSS });
  appendElement(head, 'style', { id: 'style-v-channel', innerHTML: channelCSS });
  appendElement(head, 'style', { id: 'style-v-background', innerHTML: backgroundCSS });
  appendElement(head, 'style', { id: 'style-valkyrie', innerHTML: valkyrieCSS });

  const app = Vue.createApp({
    data() {
      return {
        widthValue: 0,
        showLeft: false,
        showRight: false,
        jy: 0, qn: 0,
        options: {
          activeTitle: true,
          showChannelCh: true,
          showChannelTm: true,
          showChannelFa: true,
          showChannelPt: true,
          showChannelEs: true,
          showChannelSy: true,
          showChannelRu: true,
        },
        showChannelOptions: false,
        chatValue: '',
        channelValue: 'chat',
        channelSelections: [
          { name: '世界', value: 'chat' },
          { name: '队伍', value: 'tm' },
          { name: '帮派', value: 'pty' },
          { name: '门派', value: 'fam' },
          { name: '全区', value: 'es' },
        ],
        showRoomMapDialog: false,
      }
    },
    computed: {
      score() { return Valkyrie.score },
      id() { return this.score.id || '' },
      jyCache() { return Number(this.score.exp) || 0 },
      qnCache() { return Number(this.score.pot) || 0 },
      genderValue() { return ['女', '男'].findIndex(item => item === this.score.gender) },
      hpPercentage() { return parseInt((this.score.hp / this.score.max_hp) * 100) || 0 },
      mpPercentage() { return parseInt((this.score.mp / this.score.max_mp) * 100) || 0 },
      wx1() { return Number(this.score.int) || 0 },
      wx2() { return Number(this.score.int_add) || 0 },
      xxxl() { return parseInt(this.score.study_per ) || 0 },
      lxxl() { return parseInt(this.score.lianxi_per) || 0 },
      energy() {
        this.score.jingli.match(/^(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+$/);
        const value = Number(RegExp.$1) || 0;
        const limit = Number(RegExp.$2) || 0;
        const today = Number(RegExp.$3) || 0;
        return { value, limit, today }
      },
      role() { return common.getValue(this.id) || {} },
      name() { return this.role.name || '' },
      server() { return this.role.server || '' },
      state() { return Valkyrie.state || {} },
      stateText() { return `${this.state.text1} ${this.state.text2}` },
      tabTitle() { return `${this.name} ${this.stateText} ${this.server}` },
      room() { return Valkyrie.room },
      roomName() { return `${this.room.x} ${this.room.y}` },
      map() { return Valkyrie.map },
      skill() {
        return Valkyrie.skill
      },
      skillList() {
        return this.skill.list
      },
      lxCost() {
        return parseInt((this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100))
      },
      xxCost() {
        return parseInt((this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3)
      },
      task() {
        return Valkyrie.task
      },
      smCount() {
        return this.task.smCount
      },
      smTotal() {
        return this.task.smTotal
      },
      smTarget() {
        return this.task.smTarget
      },
      ymCount() {
        return this.task.ymCount
      },
      ymTotal() {
        return this.task.ymTotal
      },
      ymTarget() {
        return this.task.ymTarget
      },
      ymTargetX() {
        return this.task.ymTargetX
      },
      ymTargetY() {
        return this.task.ymTargetY
      },
      ybCount() {
        return this.task.ybCount
      },
      ybTotal() {
        return this.task.ybTotal
      },
      fbCount() {
        return this.task.fbCount
      },
      wdCount() {
        return this.task.wdCount
      },
      wdTotal() {
        return this.task.wdTotal
      },
      wdValue() {
        return this.task.wdValue
      },
      qaValue() {
        return this.task.qaValue
      },
      xyValue() {
        return this.task.xyValue
      },
      mpValue() {
        return this.task.mpValue
      },
      isNotMobile() { return this.widthValue > 768 },
      showSidebarLeft() { return this.id && (this.isNotMobile || this.showLeft) },
      showSidebarRight() { return this.id && (this.isNotMobile || this.showRight) },
      chatList() {
        return Valkyrie.channel.list.filter(item =>
          (item.isCh && this.options.showChannelCh)
          || (item.isTm && this.options.showChannelTm)
          || (item.isFa && this.options.showChannelFa)
          || (item.isPt && this.options.showChannelPt)
          || (item.isEs && this.options.showChannelEs)
          || (item.isSy && this.options.showChannelSy)
          || (item.isRu && this.options.showChannelRu))
      },
      chatListCount() {
        return this.chatList.length
      },
    },
    watch: {
      tabTitle(value) { document.title = value; },
      jyCache(value) { gsap.to(this.$data, { duration: 0.5, jy: value }); },
      qnCache(value) { gsap.to(this.$data, { duration: 0.5, qn: value }); },
      async chatListCount() {
        await Vue.nextTick();
        document.querySelector('.v-channel-scroll').scrollIntoView({ behavior: 'smooth' });
      },
    },
    methods: {
      sendCommand(command) {
        ValkyrieWorker.sendCommand(command);
      },
      sendCommands(...args) {
        ValkyrieWorker.sendCommands(...args);
      },
      on(type, handler) {
        return ValkyrieWorker.on(type, handler)
      },
      once(type, handler) {
        return ValkyrieWorker.once(type, handler)
      },
      off(id) {
        ValkyrieWorker.off(id);
      },
      wait(ms = 256) {
        return new Promise(resolve => setTimeout(() => resolve(), ms))
      },
      clickMapIcon() {
        this.showRoomMapDialog = !this.showRoomMapDialog;
        if (this.showRoomMapDialog) this.sendCommand(`map`);
      },
      clickChatIcon() {
        const value = this.chatValue.trim();
        if (value) this.sendCommand(`${this.channelValue} ${value}`);
        this.chatValue = '';
      },
      updateWindowWidth() {
        this.widthValue = document.body.clientWidth;
      },
      updateToolBar() {
        if (document.querySelector('.content-bottom').offsetHeight === 0) {
          document.querySelector('[command=showcombat]').click();
        }
        if (document.querySelector('.right-bar').offsetWidth === 0) {
          document.querySelector('[command=showtool]').click();
        }
        setTimeout(() => {
          const h1 = document.querySelector('.content-bottom').clientHeight;
          const h2 = document.querySelector('.tool-bar.bottom-bar').clientHeight;
          document.querySelector('.right-bar').style.bottom = h1 + h2 + 'px';
        }, 1000);
      },
      actionWaKuang() {
        this.sendCommands('stopstate,wakuang');
      },
      actionXiuLian() {
        this.sendCommands('stopstate,jh fam 0 start,go west,go west,go north,go enter,go west,xiulian');
      },
      actionWuMiao() {
        this.sendCommands('stopstate,jh fam 0 start,go north,go north,go west,dazuo');
      },
    },
    mounted() {
      window.onresize = () => {
        this.updateWindowWidth();
        this.updateToolBar();
      };
      this.updateWindowWidth();
    },
  });
  app.use(Element3);

  const valkyrie = app.mount('.valkyrie');
  valkyrie.on('login', async function(data) {
    valkyrie.sendCommands('pack,score2,score');
    await valkyrie.wait(1000);
    document.querySelector('[command=skills]').click();
    await valkyrie.wait(1000);
    document.querySelector('[command=tasks]').click();
    await valkyrie.wait(1000);
    document.querySelector('.dialog-close').click();
    valkyrie.updateToolBar();
  });
  valkyrie.on('state', data => {
    if (data.state) data.state = valkyrie.stateText;
    delete data.desc;
  });
  valkyrie.on('skills', data => {
    if (common.hasOwn(data, 'items')) {
      data.items = valkyrie.skillList;
    }
  });
  valkyrie.on('skills', data => {
    const skill = Valkyrie.skill.list.find(skill => skill.id === data.id);
    if (skill && common.hasOwn(data, 'level')) {
      ValkyrieWorker.onText(`你的技能${ skill.name }提升到了<hiw>${ skill.level }</hiw>级！`);
    }
    if (skill && common.hasOwn(data, 'exp')) {
      switch (Valkyrie.state.text1) {
        case '练习':
          ValkyrieWorker.onText(`你练习${ skill.name }消耗了${ valkyrie.lxCost }点潜能。${ data.exp }%`);
          Valkyrie.state.text2 = skill.nameText;
          Valkyrie.score.pot -= valkyrie.lxCost;
          break
        case '学习':
          ValkyrieWorker.onText(`你学习${ skill.name }消耗了${ valkyrie.xxCost }点潜能。${ data.exp }%`);
          Valkyrie.state.text2 = skill.nameText;
          Valkyrie.score.pot -= valkyrie.lxCost;
          break
        case '炼药':
          ValkyrieWorker.onText(`你获得了炼药经验，${ skill.name }当前<hiw>${ skill.level }</hiw>级。${ data.exp }%`);
          break
      }
    }
  });
  valkyrie.on('text', data => {
    if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
      data.text = data.text.replace(/<.+?>/g, '');
    }
  });
  valkyrie.on('text', data => {
    const regexp = [
      /^<hiy>你的[\s\S]+等级提升了！<\/hiy>$/,
    ].find(regexp => regexp.test(data.text));
    if (regexp) delete data.type;
  });
  valkyrie.on('map', data => {
    delete data.type;
  });

}());
