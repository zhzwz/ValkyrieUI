// ==UserScript==
// @name         Valkyrie
// @namespace    https://greasyfork.org/scripts/422519-valkyrie
// @version      0.0.233
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @modified     2021/3/12 12:03:43
// @description  文字游戏《武神传说》的浏览器脚本程序 | 界面拓展 | 功能增强
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/ValkyrieWorker/source/image/wakuang.png
// @supportURL   https://github.com/coderzhaoziwei/Valkyrie/issues
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const on = (type, handler) => ValkyrieWorker.on(type, handler);
  Common.setValue;
  const getValue = Common.getValue;
  const addStyle = Common.addStyle;
  const addStyleByURL = Common.addStyleByURL;
  const appendElement = Common.appendElement;
  Common.removeElement;
  Common.hasOwn;
  Common.getCookie;
  Common.getColorSortByName;

  const app = Vue.createApp({
    data() {
      return {
        id: '',
        name: '',
        server: '',
        options: {
          activeTitle: true,
        },
      }
    },
    computed: {
      state() {
        return `${Valkyrie.state.text1} ${Valkyrie.state.text2}`
      },
      documentTitle() {
        return `${this.name} ${this.state} ${this.server}`
      },
      channels() {
        return Valkyrie.channel.list
      },
      channelMessageCount() {
        return this.channels.length
      },
    },
    watch: {
      id(value) {
        const role = getValue(value);
        this.name = role.name;
        this.server = role.server;
      },
      documentTitle(value) {
        document.title = value;
      },
      async channelMessageCount() {
        await Vue.nextTick();
        document.querySelector('.v-channel-scroll').scrollIntoView({ behavior: 'smooth' });
      },
    },
    methods: {
    },
  });

  var ValkyrieHTML = "<teleport to=\"#valkyrie-left\">\n  <div v-show=\"id\" class=\"v-channel\">\n    <div v-for=\"item in channels\" :class=\"['v-channel-item', id===item.id ? 'v-channel-self' : '']\">\n      <div class=\"v-channel-title\">\n        <span v-if=\"item.isSelf===true\"  class=\"v-channel-time\" v-text=\"item.timeText\"></span>\n        <span class=\"v-channel-name\" v-html=\"`<${item.tag}>【${item.titleText}】${item.name}</${item.tag}>`\"></span>\n        <span v-if=\"item.isSelf===false\" class=\"v-channel-time\" v-text=\"item.timeText\"></span>\n      </div>\n      <div class=\"v-channel-content\" v-html=\"`<${item.tag}>${item.content}</${item.tag}>`\"></div>\n    </div>\n    <div class=\"v-channel-scroll\"></div>\n  </div>\n</teleport>\n\n<teleport to=\"#valkyrie-right\">\n  <header>Valkyrie</header>\n\n  <!-- <el-card v-show=\"id\" class=\"box-card\">\n    <template v-slot:header>\n      <div class=\"clearfix\">\n        <span>{{name}}</span>\n        <el-button style=\"float: right; padding: 3px 0\" type=\"text\"\n          >切换账号</el-button\n        >\n      </div>\n    </template>\n    <div v-for=\"o in 4\" :key=\"o\" class=\"text item\">{{'列表内容 ' + o }}</div>\n  </el-card>\n\n  <el-button v-show=\"id\">默认按钮</el-button> -->\n\n</teleport>\n";

  var MainCSS = ":root {\n  --bg: #202020;\n  --bg-dark: #181818;\n  --bg-darker: #101010;\n\n  --text: #d8d8d8;\n  --text-dark: #a8a8a8;\n  --text-darker: #888888;\n}\n\nbody {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  font-family: \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"微软雅黑\", Arial, sans-serif;\n  width: 100%;\n}\n\n.login-content {\n  order: 0;\n  flex: 1 0 auto;\n  width: 100%;\n}\n.container {\n  order: 2;\n  flex: 1 0 auto;\n  width: 370px;\n  margin: 0;\n  background-color: var(--bg-darker);\n}\n\n\n.valkyrie-sidebar {\n  width: 360px;\n  height: 100%;\n  flex: 0 0 auto;\n  margin: 0;\n  color: var(--text);\n  background-color: var(--bg-dark);\n}\n.valkyrie-sidebar header {\n  font-size: 1em;\n  line-height: 2em;\n  height: 2em !important;\n\n  color: var(--text);\n  background-color: var(--bg);\n}\n\n#valkyrie-left {\n  order: 1;\n}\n#valkyrie-right {\n  order: 3;\n}\n\n.valkyrie-sidebar .el-card {\n  border: 1px solid #ebeef5;\n  background-color: var(--bg);\n  color: var(--text-dark);\n}\n\n";

  var ChannelCSS = ".v-channel {\n  height: 100%;\n  overflow-y: auto;\n}\n.v-channel-item {\n  display: flex;\n  padding: 0 0.25em;\n  font-size: 0.75em;\n  flex-direction: column;\n}\n.v-channel-content {\n  width: fit-content;\n  padding: 0.25em 0.5em;\n  border-radius: 0.25em;\n\n  margin: 0 1.5em 0 0.5em;\n  background: #202020;\n  border: #101010 0.05em solid;\n}\n.v-channel-self > div {\n  align-self: flex-end;\n}\n.v-channel-self > .v-channel-content {\n  margin: 0 0.5em 0 1.5em;\n  background-color: #204020;\n}\n\n/* time */\n.v-channel-title > span {\n  color: #505050;\n}\n";

  addStyleByURL('https://cdn.jsdelivr.net/npm/element3@0.0.39/lib/theme-chalk/index.css');
  addStyle(MainCSS);
  addStyle(ChannelCSS);
  appendElement(document.body, 'div', { id: 'valkyrie' });
  appendElement(document.body, 'div', { class: 'valkyrie-sidebar', id: 'valkyrie-left' });
  appendElement(document.body, 'div', { class: 'valkyrie-sidebar', id: 'valkyrie-right' });
  document.querySelector('#valkyrie').innerHTML = ValkyrieHTML;
  const valkyrie = app.use(Element3).mount('#valkyrie');
  on('login', data => (valkyrie.id = data.id));

}());
