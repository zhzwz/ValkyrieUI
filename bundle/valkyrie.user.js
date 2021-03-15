// ==UserScript==
// @name         Valkyrie
// @namespace    https://greasyfork.org/scripts/422519-valkyrie
// @version      0.0.354
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @modified     2021/3/15 14:14:48
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

  var rootCSS = "/* 16 32 64 96 128 192 256 */\n:root {\n  --bg: #202020;\n  --bg-dark: #181818;\n  --bg-darker: #101010;\n\n  --text: rgb(216, 216, 216);\n  --text-dark: #a8a8a8;\n  --text-darker: #888888;\n\n  --el-color-white: rgb(216, 216, 216);\n  --el-color-black: rgb(128, 128, 128);\n  --el-color-green: rgb(  0, 128,  64);\n\n  --el-bgcolor-dark-1: rgba(128, 128, 128, 0.75);\n  --el-bgcolor-dark-2: rgba( 64,  64,  64, 0.75);\n  --el-bgcolor-dark-3: rgba( 32,  32,  32, 0.75);\n}\n\n::selection {\n  color: rgb(0,160,0);\n  background-color: rgb(0,40,0);\n}\n::-moz-selection {\n  color: rgb(0,160,0);\n  background-color: rgb(0,40,0);\n}\n\n.v-font-cursive {\n  font-family: 'Ma Shan Zheng', cursive;\n}\n.v-cursor-pointer {\n  cursor: pointer;\n}\n.v-unselectable {\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\nbody {\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  font-family: \"Helvetica Neue\", Helvetica, \"PingFang SC\",\n    \"Hiragino Sans GB\", \"Microsoft YaHei\", \"微软雅黑\", Arial, sans-serif;\n  background-color: rgba(0, 0, 0, 0.75) !important;\n}\n\n.login-content {\n  order: 2;\n  flex: 1 0 auto;\n  width: 768px;\n}\n.login-content .content {\n  background-color: rgba(64, 64, 64, 0.25);\n}\n.login-content .panel_item {\n  color: rgb(216, 216, 216);\n  border-color: rgba(64, 64, 64) !important;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.login-content .panel_item:not(.active):hover {\n  color: rgb(216, 216, 216);\n  background-color: rgba(0, 128, 64, 0.25);\n}\n.login-content .bottom {\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.login-content iframe {\n  background-color: rgb(216, 216, 216);\n}\n.login-content .signinfo, .login-content .signinfo a {\n  color: rgb(216, 216, 216);\n}\n\n\n.container {\n  order: 2;\n  margin: 0;\n  width: 360px;\n  flex: 1 0 auto;\n  font-size: 1em !important;\n  /* border-left: #a8a8a8; */\n  border-left: 4px solid rgba(64, 64, 64, 0.5);\n  border-right: 4px solid rgba(64, 64, 64, 0.5);\n}\n\n\n\n.room_desc {\n  font-size: 0.75em;\n  text-indent: 2em;\n  line-height: 1.5em;\n}\n.room_exits {\n  display: flex;\n  justify-content: center; /* 居中 */\n}\n\n.room_exits > svg > rect,\n.room_exits > svg > text {\n  cursor: pointer;\n}\n\n";

  var elementCSS = ".el-popper[x-placement^=top] .popper__arrow,\n.el-popper[x-placement^=top] .popper__arrow::after {\n  border-top-color: rgba(64, 64, 64, 0.9);\n}\n.el-popper[x-placement^=bottom] .popper__arrow,\n.el-popper[x-placement^=bottom] .popper__arrow::after {\n  border-bottom-color: rgba(64, 64, 64, 0.9);\n}\n\n\n\n\n\n\n/* checkbox */\n.el-checkbox__input.is-checked + .el-checkbox__label {\n  color: var(--el-color-green);\n}\n.el-checkbox__input.is-checked .el-checkbox__inner,\n.el-checkbox__input.is-indeterminate .el-checkbox__inner {\n  border-color: var(--el-color-green);\n  background-color: var(--el-color-green);\n}\n.el-checkbox__label {\n  font-size: 0.75em;\n  padding-left: 1em;\n  line-height: 1.5em;\n}\n\n/* tooltip */\n.el-tooltip__popper.is-dark {\n  color: var(--el-color-white);\n  background: var(--el-bgcolor-dark-3);\n}\n.el-tooltip__popper[x-placement^=bottom] .popper__arrow,\n.el-tooltip__popper[x-placement^=bottom] .popper__arrow::after {\n  border-bottom-color: var(--el-bgcolor-dark-2);\n}\n\n\n\n\n\n/* input */\n.el-input__inner {\n  height: 24px;\n  font-size: 12px;\n  line-height: 24px;\n  color: rgb(216, 216, 216);\n  /* border-color: rgb(0, 128, 64); */\n  border-color: rgba(64, 64, 64);\n  background-color: rgba(64, 64, 64, 0.75);\n}\n.el-input__icon {\n  width: 24px;\n  line-height: 24px;\n}\n.el-textarea__inner {\n  color: rgb(216, 216, 216);\n  border-color: rgba(64, 64, 64, 0.75);\n  background-color: rgba(64, 64, 64, 0.75);\n}\n.el-textarea__inner:hover,\n.el-textarea__inner:focus {\n  border-color: rgba(0, 128, 64, 0.75);\n}\n\n\n/* select */\n.el-select-dropdown {\n  border: none;\n  background-color: rgba(64, 64, 64, 0.9);\n}\n\n.el-select-dropdown__item {\n  height: 2em;\n  font-size: 0.75em;\n  line-height: 2em;\n  color: rgb(216, 216, 216);\n}\n.el-select-dropdown__item.hover,\n.el-select-dropdown__item:hover {\n  background-color: rgba(0, 128, 64, 0.25);\n}\n.el-select-dropdown__item.selected {\n  font-weight: normal;\n  color: rgb(0, 128, 64);\n}\n.el-select .el-input__inner:focus {\n  border-color: rgb(0, 128, 64);\n}\n\n\n\n\n\n\n\n\n\n\n";

  var fontCSS = ".v-font {\n  font-family: 'Ma Shan Zheng', cursive;\n}\n";

  var scoreCSS = ".v-score {\n  display: flex;\n  flex-direction: column;\n  padding: 0.5em;\n}\n\n.v-score > .v-score-row {\n  display: flex;\n  flex-direction: row;\n\n  font-size: 1.5em;\n  height: 1.5em;\n  line-height: 1.5em;\n\n}\n.v-score > .v-score-row > .v-score-title {\n  flex: 0 0 auto;\n  padding: 0 1em;\n  text-align: center;\n}\n.v-score > .v-score-row > .v-score-value {\n  flex: 1 0 4em;\n  text-align: left;\n  font-family: monospace;\n}\n";

  var headerCSS = ".v-header {\n  padding: 0 0.5em;\n  font-size: 1.25em;\n  line-height: 1.75em;\n  height: 1.75em !important;\n\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: center;\n  flex-direction: row;\n  justify-content: space-between;\n\n  color: rgb(216, 216, 216) !important;\n  background-color: rgba(32, 32, 32, 0.75) !important;\n}\n";

  var sidebarCSS = ".v-sidebar {\n  margin: 0;\n  flex: 0 0 auto;\n  color: var(--text);\n}\n\n.v-sidebar-left {\n  order: 1;\n  /* width: 300px; */\n}\n\n.v-sidebar-right {\n  order: 3;\n  /* width: 300px; */\n}\n\n.v-sidebar > .v-sidebar-inner {\n  display: flex;\n  flex-wrap: nowrap;\n  overflow-y: scroll;\n  flex-direction: column;\n\n  height: 100%;\n  width: 300px;\n  position: relative;\n}\n";

  var channelCSS = ".v-channel-options {\n  flex: 0 0 auto;\n  padding: 0 0.75em 1em 0.75em;\n  top: 2em;\n  position: absolute;\n  background: rgba(64, 64, 64, 0.75);\n}\n.v-channel-options-title {\n  height: 2em;\n  line-height: 2em;\n  font-size: 0.75em;\n  margin-top: 0.5em;\n}\n.v-channel-options .el-input {\n  width: 6em;\n}\n\n\n\n/* 聊天展示列 */\n.v-channel-list {\n  flex: 1 1 auto;\n  margin: 0.5em 0;\n  overflow-y: auto;\n}\n\n.v-channel-item {\n  display: flex;\n  padding: 0 0.5em;\n  font-size: 0.75em;\n  flex-direction: column;\n}\n\n.v-channel-content {\n  width: fit-content;\n  padding: 0.25em 0.5em;\n  border-radius: 0.25em;\n\n  margin: 0 1.5em 0 0.5em;\n  background-color: rgba(64, 64, 64, 0.5);\n  word-break: break-word;\n}\n\n.v-channel-self > .v-channel-title {\n  align-self: flex-end;\n}\n.v-channel-self > .v-channel-content {\n  align-self: flex-end;\n  margin: 0 0.5em 0 1.5em;\n  background-color: rgba(96, 96, 96, 0.5);\n}\n\n.v-channel-time {\n  padding: 0 0.25em;\n  color: #404040;\n  font-family: monospace;\n}\n\n\n/* 频道选择器 */\n.v-channel-select {\n  width: 4.5em;\n  margin-left: 0.5em;\n}\n.v-channel-select .el-input__inner {\n  border-bottom-left-radius: unset;\n  border-bottom-right-radius: unset;\n  border-bottom-color: transparent;\n  background-color: rgba(32, 32, 32, 0.5);\n}\n\n/* 发言输入框 */\n.v-channel-input {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 0 0 0.5em 0.5em;\n}\n.v-channel-input textarea {\n  font-size: 0.75em;\n  border-top-left-radius: unset;\n  background-color: rgba(32, 32, 32, 0.5);\n}\n.v-channel-input .el-input__count {\n  background-color: rgba(0,0,0,0);\n}\n";

  var backgroundCSS = ".v-background {\n  width: 100%;\n  height: 100%;\n  z-index: -1;\n  position: absolute;\n  background-color: rgba(64, 64, 64, 1);\n  background-image: url(https://cdn.jsdelivr.net/gh/coderzhaoziwei/Valkyrie@main/source/image/yande%23726730.jpg);\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n";

  var LeftHTML = "<teleport to=\".v-sidebar-left\">\n  <div class=\"v-sidebar-inner\" v-show=\"showSidebarLeft\">\n    <!-- header -->\n    <div class=\"v-header\">\n      <div>\n        <span class=\"v-font-cursive\" v-text=\"name\"></span>\n        <i v-if=\"genderValue===0\" style=\"padding-left: 0.5em;\" class=\"el-icon-female\"></i>\n        <i v-if=\"genderValue===1\" style=\"padding-left: 0.5em;\" class=\"el-icon-male\"></i>\n      </div>\n\n\n      <i class=\"el-icon-menu\"></i>\n    </div>\n    <!-- score -->\n    <div class=\"v-score\">\n      <div class=\"v-score-row\">\n        <div class=\"v-score-title v-font\">经验</div>\n        <div class=\"v-score-value\">{{Number(jy.toFixed()).toLocaleString()}}</div>\n      </div>\n      <div class=\"v-score-row\">\n        <div class=\"v-score-title v-font\">潜能</div>\n        <div class=\"v-score-value\">{{Number(qn.toFixed()).toLocaleString()}}</div>\n      </div>\n    </div>\n\n  </div>\n</teleport>\n";

  var RightHTML = "<teleport to=\".v-sidebar-right\">\n  <div class=\"v-sidebar-inner\" v-show=\"showSidebarRight\">\n    <!-- header -->\n    <div class=\"v-header\">\n      <span class=\"v-font-cursive v-unselectable\">聊天频道</span>\n      <el-tooltip class=\"item\" effect=\"dark\" content=\"显示内容筛选\" placement=\"bottom\">\n        <i class=\"el-icon-more-outline v-cursor-pointer\" @click=\"showChannelOptions = !showChannelOptions\"></i>\n      </el-tooltip>\n    </div>\n    <!-- options -->\n    <el-collapse-transition>\n      <div v-show=\"showChannelOptions\" class=\"v-channel-options\">\n        <div class=\"v-channel-options-title\">显示选中频道的内容</div>\n        <el-checkbox v-model=\"options.showChannelCh\" label=\"世界\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelTm\" label=\"队伍\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelFa\" label=\"门派\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelPt\" label=\"帮会\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelEs\" label=\"全区\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelRu\" label=\"谣言\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelSy\" label=\"系统\"></el-checkbox>\n        <!-- <div class=\"v-channel-options-title\">你的聊天发送至频道</div>\n        <el-select v-model=\"channelValue\">\n          <el-option v-for=\"item in channelSelections\" :key=\"item.value\" :label=\"item.name\" :value=\"item.value\"></el-option>\n        </el-select> -->\n      </div>\n    </el-collapse-transition>\n    <!-- list -->\n    <div class=\"v-channel-list\">\n      <div v-for=\"item in channels\" :class=\"['v-channel-item', id===item.id ? 'v-channel-self' : '']\">\n        <div class=\"v-channel-title v-unselectable\">\n          <span v-if=\"item.isSelf===true\"  class=\"v-channel-time\" v-text=\"item.timeText\"></span>\n          <span\n            class=\"v-channel-name v-cursor-pointer\"\n            v-html=\"`<${item.tag}>【${item.titleText}】${item.name}</${item.tag}>`\"\n            @click=\"sendCommands(`look3 ${item.id},look3 body of ${item.id}`)\"\n          ></span>\n          <span v-if=\"item.isSelf===false\" class=\"v-channel-time\" v-text=\"item.timeText\"></span>\n        </div>\n        <div class=\"v-channel-content\" v-html=\"`<${item.tag}>${item.content}</${item.tag}>`\"></div>\n      </div>\n      <div class=\"v-channel-scroll\"></div>\n    </div>\n    <!-- select -->\n    <el-select class=\"v-channel-select\" v-model=\"channelValue\">\n      <el-option v-for=\"item in channelSelections\" :key=\"item.value\" :label=\"item.name\" :value=\"item.value\"></el-option>\n    </el-select>\n    <!-- input -->\n    <div class=\"v-channel-input\">\n      <el-input\n        type=\"textarea\"\n        v-model=\"chatValue\"\n        v-on:keyup.enter=\"sendChatValue()\"\n        :rows=\"2\" resize=\"none\"\n        maxlength=\"200\" show-word-limit\n      ></el-input>\n      <i class=\"el-icon-s-promotion v-unselectable v-cursor-pointer\" style=\"width: 2em; text-align: center;\" @click=\"sendChatValue()\"></i>\n    </div>\n  </div>\n</teleport>\n";

  var RoomTitleHTML = "<teleport to=\".v-room-title\">\n  <span class=\"v-room-name v-font-cursive v-unselectable\" v-text=\"roomName\"></span>\n  <i class=\"el-icon-map-location v-cursor-pointer\" @click=\"sendCommand(`map`)\"></i>\n</teleport>\n";

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

  const app = Vue.createApp({
    data() {
      return {
        widthValue: 0,
        showLeft: false,
        showRight: false,
        jy: 0,
        qn: 0,
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
      }
    },
    computed: {
      id() {
        return Valkyrie.score.id || ''
      },
      role() {
        return common.getValue(this.id) || {}
      },
      name() {
        return this.role.name || ''
      },
      server() {
        return this.role.server || ''
      },
      state() {
        return Valkyrie.state || {}
      },
      stateText() {
        return `${this.state.text1} ${this.state.text2}`
      },
      tabTitle() {
        return `${this.name} ${this.stateText} ${this.server}`
      },
      channels() {
        return Valkyrie.channel.list.filter(item =>
          (item.isCh && this.options.showChannelCh)
          || (item.isTm && this.options.showChannelTm)
          || (item.isFa && this.options.showChannelFa)
          || (item.isPt && this.options.showChannelPt)
          || (item.isEs && this.options.showChannelEs)
          || (item.isSy && this.options.showChannelSy)
          || (item.isRu && this.options.showChannelRu))
      },
      channelMessageCount() {
        return this.channels.length
      },
      room() {
        return Valkyrie.room
      },
      roomName() {
        return `${this.room.x} ${this.room.y}`
      },
      score() {
        return Valkyrie.score
      },
      jyCache() {
        return Number(this.score.exp) || 0
      },
      qnCache() {
        return Number(this.score.pot) || 0
      },
      genderValue() {
        return ['女', '男'].findIndex(item => item === this.score.gender)
      },
      isNotMobile() {
        return this.widthValue >= 768
      },
      showSidebarLeft() {
        return this.id && (this.isNotMobile || this.showLeft)
      },
      showSidebarRight() {
        return this.id && (this.isNotMobile || this.showRight)
      }
    },
    watch: {
      tabTitle(value) {
        document.title = value;
      },
      jyCache(value) {
        gsap.to(this.$data, { duration: 0.5, jy: value });
      },
      qnCache(value) {
        gsap.to(this.$data, { duration: 0.5, qn: value });
      },
      async channelMessageCount() {
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
      sendChatValue() {
        const value = this.chatValue.trim();
        if (value) this.sendCommand(`${this.channelValue} ${value}`);
        this.chatValue = '';
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
    },
    mounted() {
      const updateWidth = () => (this.widthValue = document.body.clientWidth);
      window.onresize = function() {
        updateWidth();
      };
      updateWidth();
    },
  });
  app.use(Element3);

  const valkyrie = app.mount('.valkyrie');
  valkyrie.on('login', data => (valkyrie.id = data.id));

}());
