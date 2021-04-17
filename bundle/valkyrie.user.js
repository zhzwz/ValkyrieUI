// ==UserScript==
// @name         Valkyrie
// @namespace    https://greasyfork.org/scripts/422519-valkyrie
// @version      0.0.602
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @modified     2021/4/17 16:22:55
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
/* global Vue:readonly */
/* global Element3:readonly */
/* global Gsap:readonly */
/* global Util:readonly */
/* global ValkyrieCache:readonly */
/* global ValkyrieWorker:readonly */

(function () {
  'use strict';

  function clearUpPackage() {
    return new Promise((resolve, reject) => {
      this.sendCommands(`stopstate,jh fam 0 start,go north,go west,pack,store`);
      const token = `${new Date().toLocaleTimeString('en-DE')} 整理背包`;
      const id1 = this.on('list', data => Util.hasOwn(data, 'stores') && (() => {
        this.off(id1);
        this.storeList.forEach(store => {
          const item = this.packList.find(pack => pack.name === store.name);
          if (item) this.sendCommands(`store ${item.count} ${item.id}`);
        });
        this.sendCommands(`jh fam 0 start,go south,go east,sell all,pack,1000,tm ${token}`);
      })());
      const id2 = this.on('msg', data => data.ch === 'tm' && data.content === token && (() => {
        this.off(id2);
        if (this.packCount < this.packLimit) {
          resolve();
          this.onText(`<hig>整理背包完毕。</hig><hic>[${this.packCount}/${this.packLimit}]</hic>`);
        } else {
          reject();
          this.onText(`<hig>整理背包完毕。</hig><hir>[${this.packCount}/${this.packLimit}]</hir>`);
        }
      })());
    })
  }

  function autoWaKuang() {
    return new Promise((resolve, reject) => {
      const token = `${new Date().toLocaleTimeString(`en-DE`)} 寻找铁镐`;
      this.sendCommands(`stopstate,jh fam 0 start,go north,go west,pack,store,tm ${token}`);
      const id1 = this.on(`msg`, data => data.ch === `tm` && data.content === token && (() => {
        this.off(id1);
        const eq0 = (this.equipList[0] || {}).name || ``;
        if (eq0.includes(`铁镐`)) {
          this.onText(`<hig>你已经装备了${eq0}。</hig>`);
          this.sendCommands(`stopstate,wakuang`);
          return resolve()
        }
        const item = this.packList.find(item => item.name.includes(`铁镐`));
        if (item) {
          this.onText(`<hig>你的背包中有${item.name}。</hig>`);
          this.sendCommands(`stopstate,wakuang`);
          return resolve()
        }
        const store = this.storeList.find(item => item.name.includes(`铁镐`));
        if (store) {
          this.onText(`<hig>你的仓库中有${store.name}。</hig>`);
          this.sendCommands(`stopstate,qu 1 ${store.id},wakuang`);
          return resolve()
        }
        this.clearUpPackage().then(() => {
          const token2 = `${new Date().toLocaleTimeString(`en-DE`)} 购买铁镐`;
          this.sendCommands(`stopstate,jh fam 0 start,go east,go east,go south,1000,list {npc:铁匠铺老板},tm ${token2}`);
          const id2 = this.on(`msg`, data => data.ch === `tm` && data.content === token2 && (() => {
            this.off(id2);
            const item = this.shopList.find(item => item.name.includes(`铁镐`));
            if (item) {
              this.sendCommands(`stopstate,buy 1 ${item.id} from ${this.shopId},wakuang`);
            }
          })());
        }).catch(() => {
          this.onText(`<hir>背包容量不足，无法购买铁镐。</hir>`);
          reject();
        });
      })());
    })
  }

  var SIDEBAR_LEFT = "<teleport to=\".v-sidebar-left\">\n  <div class=\"v-sidebar-inner unselectable\" v-show=\"showSidebarLeft\">\n    <!-- 角色 -->\n    <div class=\"v-header\">\n      <div>\n        <span class=\"font-cursive mr-2\" v-text=\"cache.role.name\"></span>\n        <i v-if=\"cache.genderValue===0\" class=\"el-icon-female\"></i>\n        <i v-else-if=\"cache.genderValue===1\" class=\"el-icon-male\"></i>\n        <i v-else class=\"el-icon-cherry\"></i>\n      </div>\n      <div>\n        <i class=\"el-icon-menu cursor-pointer mr-2\"></i>\n        <i\n          class=\"cursor-pointer\"\n          :class=\"options.showPanelScore ? `el-icon-caret-bottom` : `el-icon-caret-right`\"\n          @click=\"options.showPanelScore = !options.showPanelScore\"\n        ></i>\n      </div>\n    </div>\n    <transition name=\"show-panel\">\n      <div class=\"v-score\" v-show=\"options.showPanelScore\">\n        <!-- 境界 门派 -->\n        <div class=\"v-score-row\">\n          <div class=\"v-score-title font-cursive\" v-html=\"cache.score.level\"></div>\n          <div class=\"v-score-value font-cursive\" v-text=\"cache.score.family\"></div>\n        </div>\n        <!-- 气血 -->\n        <el-progress class=\"v-percentage v-percentage-hp\" :text-inside=\"true\" :stroke-width=\"16\" :percentage=\"cache.hpPercentage\"\n        ></el-progress>\n        <!-- 内力 -->\n        <el-progress class=\"v-percentage v-percentage-mp\" :text-inside=\"true\" :stroke-width=\"16\" :percentage=\"cache.mpPercentage\"\n        ></el-progress>\n        <!-- 经验 -->\n        <div class=\"v-score-row\">\n          <div class=\"v-score-title font-cursive\">经验</div>\n          <div class=\"v-score-value\" v-text=\"Number(jy.toFixed()).toLocaleString()\"></div>\n        </div>\n        <!-- 潜能 -->\n        <div class=\"v-score-row\">\n          <div class=\"v-score-title font-cursive\">潜能</div>\n          <div class=\"v-score-value\" v-text=\"Number(qn.toFixed()).toLocaleString()\"></div>\n        </div>\n      </div>\n    </transition>\n\n    <!-- 任务 -->\n    <div class=\"v-header\">\n      <div>\n        <span class=\"font-cursive\">任务</span>\n      </div>\n      <div>\n        <i class=\"el-icon-setting cursor-pointer mr-2\" @click=\"showTaskDialog = true\"></i>\n        <i\n          class=\"cursor-pointer\"\n          :class=\"options.showPanelTask ? `el-icon-caret-bottom` : `el-icon-caret-right`\"\n          @click=\"options.showPanelTask = !options.showPanelTask\"\n        ></i>\n      </div>\n    </div>\n    <transition name=\"show-panel\">\n      <div class=\"v-task font-cursive\" v-show=\"options.showPanelTask\">\n        <!-- 请安 -->\n        <div class=\"d-flex\" :class=\"!cache.qaValue ? 'red-text' : 'green-text'\" v-show=\"!cache.qaValue\">\n          <div class=\"flex-0-0\">日常请安</div>\n          <div class=\"flex-1-0 text-align-right\" v-text=\"cache.qaValue ? '已完成' : '未完成'\"></div>\n        </div>\n        <!-- 师门 -->\n        <div class=\"d-flex\" :class=\"cache.smCount < 20 ? 'red-text' : 'green-text'\">\n          <div class=\"flex-0-0\">日常师门</div>\n          <div class=\"flex-1-0 font-monospace text-align-right\">{{cache.smCount}}/20/{{cache.smTotal}}</div>\n        </div>\n        <div class=\"d-flex\" :class=\"cache.smTarget ? 'red-text' : 'green-text'\" v-show=\"cache.smTarget\">\n          <div class=\"flex-0-0\">师门目标</div>\n          <div class=\"flex-1-0 text-align-right\" v-html=\"cache.smTarget\"></div>\n        </div>\n        <!-- 追捕 -->\n        <div class=\"d-flex\" :class=\"cache.ymCount < 20 ? 'red-text' : 'green-text'\">\n          <div class=\"flex-0-0\">日常追捕</div>\n          <div class=\"flex-1-0 font-monospace text-align-right\">{{cache.ymCount}}/20/{{cache.ymTotal}}</div>\n        </div>\n        <div class=\"d-flex\" :class=\"cache.ymTarget ? 'red-text' : 'green-text'\" v-show=\"cache.ymTarget\">\n          <div class=\"flex-0-0\">追捕目标</div>\n          <div class=\"flex-1-0 text-align-right\">\n            <span>{{cache.ymTargetX}} {{cache.ymTargetY}}</span>\n            <span class=\"yellow-text pl-2\">{{cache.ymTarget}}</span>\n          </div>\n        </div>\n        <!-- 副本 -->\n        <div class=\"d-flex\" :class=\"cache.fbCount < 20 ? 'red-text' : 'green-text'\">\n          <div class=\"flex-0-0\">日常副本</div>\n          <div class=\"flex-1-0 font-monospace text-align-right\">{{cache.fbCount}}/20</div>\n        </div>\n        <!-- 武道塔 -->\n        <div class=\"d-flex\" :class=\"!cache.wdValue || cache.wdCount < cache.wdTotal ? 'red-text' : 'green-text'\">\n          <div class=\"flex-0-0\">日常武道</div>\n          <div class=\"flex-1-0 text-align-right\">\n            <span>{{cache.wdValue?'':'可重置'}}</span>\n            <span class=\"font-monospace pl-2\">{{cache.wdCount}}/{{cache.wdTotal}}</span>\n          </div>\n        </div>\n        <!-- 运镖 -->\n        <div class=\"d-flex\" :class=\"cache.ybCount < 20 ? 'red-text' : 'green-text'\">\n          <div class=\"flex-0-0\">周常运镖</div>\n          <div class=\"flex-1-0 font-monospace text-align-right\">{{cache.ybCount}}/20/{{cache.ybTotal}}</div>\n        </div>\n        <!-- 襄阳战 -->\n        <div class=\"d-flex\" :class=\"!cache.xyValue ? 'red-text' : 'green-text'\">\n          <div class=\"flex-0-0\">周常襄阳</div>\n          <div class=\"flex-1-0 text-align-right\" v-text=\"cache.xyValue ? '已完成' : '未完成'\"></div>\n        </div>\n        <!-- 门派 BOSS -->\n        <div class=\"d-flex\" :class=\"!cache.mpValue ? 'red-text' : 'green-text'\">\n          <div class=\"flex-0-0\">周常门派</div>\n          <div class=\"flex-1-0 text-align-right\" v-text=\"cache.mpValue ? '已完成' : '未完成'\"></div>\n        </div>\n\n        <!-- 按钮 -->\n        <div class=\"v-button\">开始日常</div>\n        <div class=\"d-flex\">\n          <span class=\"v-button flex-1-0\">襄阳战</span>\n          <span class=\"v-button flex-1-0\">运镖</span>\n        </div>\n        <!-- 弹窗 -->\n        <el-dialog\n          title=\"任务设置\" center destroy-on-close\n          :visible.sync=\"showTaskDialog\"\n          v-model:visible=\"showTaskDialog\"\n        >\n          <div class=\"font-monospace unselectable\">\n            <div>师门</div>\n            <el-checkbox label=\"自动师门\" v-model=\"options.canTaskSm\" ></el-checkbox>\n            <el-checkbox label=\"仓库物品\" :disabled=\"!options.canTaskSm\" v-model=\"options.canTaskSmStore\"></el-checkbox>\n            <el-checkbox label=\"师门令牌\" :disabled=\"!options.canTaskSm\" v-model=\"options.canTaskSmCard\"></el-checkbox>\n            <div>衙门追捕</div>\n            <el-checkbox label=\"自动追捕\" v-model=\"options.canTaskYm\"></el-checkbox>\n            <el-checkbox label=\"元宝扫荡\" :disabled=\"!options.canTaskYm\" v-model=\"options.canTaskYmSweep\"></el-checkbox>\n          </div>\n        </el-dialog>\n      </div>\n    </transition>\n\n    <!-- 快捷 -->\n    <div class=\"v-header\">\n      <div><span class=\"font-cursive\">快捷</span></div>\n      <div>\n        <i\n          class=\"cursor-pointer\"\n          :class=\"options.showPanelOnekey ? `el-icon-caret-bottom` : `el-icon-caret-right`\"\n          @click=\"options.showPanelOnekey = !options.showPanelOnekey\"\n        ></i>\n      </div>\n    </div>\n    <transition name=\"show-panel\">\n      <div class=\"v-onekey d-flex flex-wrap font-cursive\" v-show=\"options.showPanelOnekey\">\n        <span class=\"v-button flex-1-0\" @click=\"autoWaKuang()\">挖矿</span>\n        <span class=\"v-button flex-1-0\" @click=\"cache.xiulian()\">修炼</span>\n        <span class=\"v-button flex-1-0\" @click=\"actionWuMiao()\">武庙</span>\n        <span class=\"v-button flex-1-0\" @click=\"clearUpPackage()\">整理背包</span>\n        <!-- <span class=\"v-button flex-1-0 mx-1\">〇〇〇〇</span>\n        <span class=\"v-button flex-1-0 mx-1\">〇〇〇〇</span>\n        <span class=\"v-button flex-1-0 mx-1\">〇〇〇〇</span>\n        <span class=\"v-button flex-1-0 mx-1\">〇〇〇〇</span> -->\n      </div>\n    </transition>\n\n    <!-- 出招配置 -->\n  </div>\n</teleport>\n";

  var SIDEBAR_RIGHT = "<teleport to=\".v-sidebar-right\">\n  <div class=\"v-sidebar-inner\" v-show=\"showSidebarRight\">\n    <!-- header -->\n    <div class=\"v-header\">\n      <span class=\"font-cursive v-unselectable\">聊天</span>\n      <i class=\"el-icon-setting cursor-pointer\" @click=\"showChannelDialog = true\"></i>\n    </div>\n    <!-- options -->\n    <el-dialog\n      title=\"聊天频道筛选\" center destroy-on-close\n      :visible.sync=\"showChannelDialog\" v-model:visible=\"showChannelDialog\"\n    >\n      <div class=\"font-monospace unselectable\">\n        <el-checkbox v-model=\"options.showChannelCh\" label=\"世界\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelTm\" label=\"队伍\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelFa\" label=\"门派\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelPt\" label=\"帮会\"></el-checkbox>\n        <div></div>\n        <el-checkbox v-model=\"options.showChannelEs\" label=\"全区\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelRu\" label=\"谣言\"></el-checkbox>\n        <el-checkbox v-model=\"options.showChannelSy\" label=\"系统\"></el-checkbox>\n      </div>\n    </el-dialog>\n    <!-- list -->\n    <div class=\"v-channel-list\">\n      <div v-for=\"item in chatList\" :class=\"['v-channel-item', id===item.id ? 'v-channel-self' : '']\">\n        <div class=\"v-channel-title v-unselectable\">\n          <span v-if=\"item.isSelf===true\"  class=\"v-channel-time\" v-text=\"item.timeText\"></span>\n          <span\n            class=\"v-channel-name cursor-pointer\"\n            v-html=\"`<${item.tag}>【${item.titleText}】${item.name}</${item.tag}>`\"\n            @click=\"sendCommands(`look3 ${item.id},look3 body of ${item.id}`)\"\n          ></span>\n          <span v-if=\"item.isSelf===false\" class=\"v-channel-time\" v-text=\"item.timeText\"></span>\n        </div>\n        <div class=\"v-channel-content\" v-html=\"`<${item.tag}>${item.content}</${item.tag}>`\"></div>\n      </div>\n      <div class=\"v-channel-scroll\"></div>\n    </div>\n    <!-- select -->\n    <el-select class=\"v-channel-select\" v-model=\"channel\">\n      <el-option v-for=\"item in channelSelections\" :key=\"item.value\" :label=\"item.name\" :value=\"item.value\"></el-option>\n    </el-select>\n    <!-- input -->\n    <div class=\"v-channel-input\">\n      <el-input\n        type=\"textarea\"\n        v-model=\"chat\"\n        v-on:keyup.enter=\"clickChatIcon()\"\n        :rows=\"2\" resize=\"none\"\n        maxlength=\"200\" show-word-limit\n      ></el-input>\n      <i class=\"el-icon-s-promotion v-unselectable cursor-pointer\" style=\"width: 2em; text-align: center;\" @click=\"clickChatIcon()\"></i>\n    </div>\n  </div>\n</teleport>\n";

  var ROOM_TITLE = "<teleport to=\".v-room-title\">\n  <span class=\"v-room-name font-cursive unselectable\" v-text=\"cache.room.x + ' ' + cache.room.y\"></span>\n  <i class=\"el-icon-map-location cursor-pointer\" @click=\"clickMapIcon()\"></i>\n  <!-- 地图弹窗 -->\n  <el-dialog\n    :width=\"`${cache.map.width}px`\"\n    :title=\"cache.room.x\" center destroy-on-close\n    :visible.sync=\"showMapDialog\"\n    v-model:visible=\"showMapDialog\"\n  >\n    <div\n      class=\"v-room-map unselectable\"\n      :style=\"`max-width: ${cache.map.width}px; max-height: ${cache.map.height}px;`\"\n      v-html=\"cache.map.svg\"\n    ></div>\n  </el-dialog>\n</teleport>\n";

  const cache = ValkyrieCache;
  const app = Vue.createApp({
    data() {
      return {
        width: 0,
        showLeft: false,
        showRight: false,
        jy: 0,
        qn: 0,
        options: {
          showDynamicTitle: true,
          showPanelScore: true,
          showPanelTask: true,
          showPanelOnekey: true,
          showChannelCh: true,
          showChannelTm: true,
          showChannelFa: true,
          showChannelPt: true,
          showChannelEs: true,
          showChannelSy: true,
          showChannelRu: true,
          canTaskSm: true,
          canTaskSmCard: true,
          canTaskSmStore: true,
          canTaskYm: true,
          canTaskYmSweep: true,
        },
        chat: '',
        channel: 'chat',
        channelSelections: [
          { name: '世界', value: 'chat' },
          { name: '队伍', value: 'tm' },
          { name: '帮派', value: 'pty' },
          { name: '门派', value: 'fam' },
          { name: '全区', value: 'es' },
        ],
        showChannelDialog: false,
        showMapDialog: false,
        showTaskDialog: false,
      }
    },
    computed: {
      cache() {
        return ValkyrieCache
      },
      jyCache() {
        return Number(this.cache.score.exp) || 0
      },
      qnCache() {
        return Number(this.cache.score.pot) || 0
      },
      id() {
        return this.cache.role.id || ``
      },
      title() {
        const id = this.cache.role.id || ``;
        const name = this.cache.role.name || ``;
        const state = this.cache.state.text + this.cache.state.detail || ``;
        const server = this.cache.role.server || ``;
        return id ? `${name} ${state} ${server}` : ``
      },
      chatList() {
        return cache.chatList.filter(
          item => (item.isCh && this.options.showChannelCh)
          || (item.isTm && this.options.showChannelTm)
          || (item.isFa && this.options.showChannelFa)
          || (item.isPt && this.options.showChannelPt)
          || (item.isEs && this.options.showChannelEs)
          || (item.isSy && this.options.showChannelSy)
          || (item.isRu && this.options.showChannelRu)
        )
      },
      chatCount() {
        return this.chatList.length
      },
      isNotMobile() {
        return this.width > 768
      },
      showSidebarLeft() { return this.id && (this.isNotMobile || this.showLeft) },
      showSidebarRight() { return this.id && (this.isNotMobile || this.showRight) },
    },
    watch: {
      title(value) {
        document.title = value;
      },
      jyCache(value) {
        if (document.hidden) this.jy = value;
        else Gsap.to(this.$data, { duration: 0.5, jy: value });
      },
      qnCache(value) {
        if (document.hidden) this.qn = value;
        else Gsap.to(this.$data, { duration: 0.5, qn: value });
      },
      async chatCount() {
        await Vue.nextTick();
        document.querySelector('.v-channel-scroll').scrollIntoView({ behavior: 'smooth' });
      },
      options(value) {
        console.log(value);
      },
    },
    methods: {
      sendCommand(command) { ValkyrieWorker.sendCommand(command); },
      sendCommands(...args) { ValkyrieWorker.sendCommands(...args); },
      onData(data) { ValkyrieWorker.onData(data); },
      onText(text) { ValkyrieWorker.onText(text); },
      on(type, handler) { return ValkyrieWorker.on(type, handler.bind(this)) },
      off(id) { ValkyrieWorker.off(id); },
      wait(ms = 256) {
        return new Promise(resolve => setTimeout(() => resolve(), ms))
      },
      timeText() {
        return new Date().toLocaleTimeString('en-DE')
      },
      clickMapIcon() {
        this.showMapDialog = !this.showMapDialog;
        if (this.showMapDialog) this.sendCommand(`map`);
      },
      clickChatIcon() {
        const value = this.chat.trim();
        if (value) this.sendCommand(`${this.channel} ${value}`);
        this.chat = '';
      },
      updateWindowWidth() {
        this.width = document.body.clientWidth;
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
      actionXiuLian() {
        return new Promise((resolve, reject) => {
          this.sendCommands('stopstate,jh fam 0 start,go west,go west,go north,go enter,go west,xiulian');
        })
      },
      actionWuMiao() {
        return new Promise((resolve, reject) => {
          this.sendCommands('stopstate,jh fam 0 start,go north,go north,go west,dazuo');
        })
      },
      autoWaKuang,
      clearUpPackage,
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
  app.config.warnHandler = function(msg, vm, trace) {
  };
  const head = document.head;
  const body = document.body;
  const appendElement = Util.appendElement;
  appendElement(head, 'link', { rel: 'preconnect', href: 'https://fonts.gstatic.com' });
  appendElement(head, 'link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap' });
  appendElement(head, 'link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/element3@0.0.39/lib/theme-chalk/index.css' });
  appendElement(body, 'div', { class: 'valkyrie' });
  appendElement(body, 'div', { class: 'v-background' });
  appendElement(body, 'div', { class: 'v-sidebar v-sidebar-left' });
  appendElement(body, 'div', { class: 'v-sidebar v-sidebar-right' });
  document.querySelector(`.room-title`).innerHTML = ``;
  document.querySelector(`.room-title`).className = `v-room-title v-header`;
  document.querySelector(`#role_panel > ul > li.panel_item.active`).className += ` v-header font-cursive`;
  document.querySelector(`.valkyrie`).innerHTML = SIDEBAR_LEFT + SIDEBAR_RIGHT + ROOM_TITLE;

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;
    if (!css || typeof document === 'undefined') { return; }
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$g = ".el-input__inner{background-color:rgba(64,64,64,.75);border-color:#404040;color:#d8d8d8;font-size:.75rem;height:1.5rem;line-height:1.5rem}.el-input__icon{line-height:1.5rem;width:1.5rem}.el-textarea__inner{background-color:rgba(64,64,64,.75);border-color:rgba(64,64,64,.75);color:#d8d8d8}.el-textarea__inner:focus,.el-textarea__inner:hover{border-color:rgba(0,128,64,.75)}";
  styleInject(css_248z$g);

  var css_248z$f = ".el-popper[x-placement^=top] .popper__arrow,.el-popper[x-placement^=top] .popper__arrow:after{border-top-color:rgba(64,64,64,.9)}.el-popper[x-placement^=bottom] .popper__arrow,.el-popper[x-placement^=bottom] .popper__arrow:after{border-bottom-color:rgba(64,64,64,.9)}";
  styleInject(css_248z$f);

  var css_248z$e = ".el-select-dropdown{background-color:rgba(64,64,64,.9);border:none}.el-select-dropdown__item{color:#d8d8d8;font-size:.75em;height:2em;line-height:2em}.el-select-dropdown__item.hover,.el-select-dropdown__item:hover{background-color:rgba(0,128,64,.25)}.el-select-dropdown__item.selected{color:#008040;font-weight:400}.el-select .el-input__inner:focus{border-color:#008040}";
  styleInject(css_248z$e);

  var css_248z$d = ".el-tooltip__popper.is-dark{background:#202020;color:#d8d8d8}.el-tooltip__popper[x-placement^=top] .popper__arrow,.el-tooltip__popper[x-placement^=top] .popper__arrow:after{border-top-color:#202020}.el-tooltip__popper[x-placement^=right] .popper__arrow,.el-tooltip__popper[x-placement^=right] .popper__arrow:after{border-right-color:#202020}.el-tooltip__popper[x-placement^=bottom] .popper__arrow,.el-tooltip__popper[x-placement^=bottom] .popper__arrow:after{border-bottom-color:#202020}.el-tooltip__popper[x-placement^=left] .popper__arrow,.el-tooltip__popper[x-placement^=left] .popper__arrow:after{border-left-color:#202020}";
  styleInject(css_248z$d);

  var css_248z$c = ".el-checkbox{margin-right:1rem}.el-checkbox__inner,.el-checkbox__input.is-disabled .el-checkbox__inner,.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{background-color:rgba(64,64,64,.75);border-color:grey}.el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color:#008040;border-color:#008040}.el-checkbox__input+.el-checkbox__label{font-size:.75rem;line-height:1.5rem;padding-left:.25rem}.el-checkbox__input+.el-checkbox__label,.el-checkbox__input.is-disabled+span.el-checkbox__label{color:grey}.el-checkbox__input.is-checked+.el-checkbox__label{color:#008040}";
  styleInject(css_248z$c);

  var css_248z$b = ".el-dialog{background-color:rgba(32,32,32,.9);box-shadow:0 0 2px hsla(0,0%,100%,.5);margin:unset!important;padding:0 1rem 1rem;width:auto}.el-dialog__wrapper{align-items:center;display:flex;justify-content:center}.el-dialog__title{color:#d8d8d8;font-family:Ma Shan Zheng,cursive;font-size:1.25rem}.el-dialog__body{color:silver;display:flex;justify-content:center;padding:0!important}";
  styleInject(css_248z$b);

  var css_248z$a = ".v-task{font-size:1rem;line-height:1.25rem;overflow:hidden;padding:.5rem}.v-task .v-button{font-size:1rem;margin:.5rem .5rem 0}";
  styleInject(css_248z$a);

  var css_248z$9 = ".v-score{display:flex;flex-direction:column;overflow:hidden;padding:.5em}.v-score>.v-score-row{display:flex;flex-direction:row;font-size:1.25em;height:1.5em;line-height:1.5em}.v-score>.v-score-row>.v-score-title{flex:0 0 auto;padding:0 .5em;text-align:center}.v-score>.v-score-row>.v-score-value{flex:0 0 auto;font-family:monospace;text-align:left;width:9em}.v-percentage{padding:0 .5em}.v-percentage .el-progress-bar__outer{background-color:hsla(0,0%,50.2%,.5);border-radius:.25em}.v-percentage .el-progress-bar__inner{border-radius:.25em}.v-percentage .el-progress-bar__innerText{color:hsla(0,0%,84.7%,.9);display:flex;justify-content:space-between;line-height:16px;overflow:hidden}.v-percentage.v-percentage-mp{margin-bottom:.25em}.v-percentage.v-percentage-hp .el-progress-bar__inner{background-color:rgba(255,0,0,.5)}.v-percentage.v-percentage-mp .el-progress-bar__inner{background-color:rgba(0,0,255,.5)}.v-percentage.v-percentage-hp .el-progress-bar__innerText:before{content:\"气血 \"}.v-percentage.v-percentage-mp .el-progress-bar__innerText:before{content:\"内力 \"}";
  styleInject(css_248z$9);

  var css_248z$8 = ".dialog-header,.v-header{align-items:center;background-color:rgba(32,32,32,.75)!important;color:#d8d8d8!important;display:flex;flex-direction:row;flex-wrap:nowrap;font-size:1.25rem;height:2rem!important;justify-content:space-between;line-height:2rem;margin-bottom:.125rem;padding:0 .5rem}.dialog-header{border-bottom:1px solid #404040!important;display:flex}.dialog-icon{width:1.75rem}.dialog-icon,.dialog-title{color:#d8d8d8!important;height:1.75rem;line-height:1.75rem!important}.dialog-title{flex:1 0 auto;font-family:Ma Shan Zheng,cursive!important}.dialog-close{color:#d8d8d8!important;height:1.75rem;line-height:1.75rem!important;width:1.75rem}";
  styleInject(css_248z$8);

  var css_248z$7 = ".v-sidebar{color:#d8d8d8;flex:0 1 auto;margin:0;width:16em}.v-sidebar-left{order:1}.v-sidebar-right{order:3}.v-sidebar>.v-sidebar-inner{display:flex;flex-direction:column;flex-wrap:nowrap;height:100%;overflow-y:scroll;position:relative}";
  styleInject(css_248z$7);

  var css_248z$6 = ".v-channel-options{background:rgba(64,64,64,.95);flex:0 0 auto;padding:0 .75em 1em;position:absolute;top:2em}.v-channel-options-title{font-size:.75em;height:2em;line-height:2em;margin-top:.5em}.v-channel-options .el-input{width:6em}.v-channel-list{flex:1 1 auto;margin:.5em 0;overflow-y:auto}.v-channel-item{display:flex;flex-direction:column;font-size:.75em;padding:0 .5em}.v-channel-content{background-color:rgba(64,64,64,.5);border-radius:.25em;margin:0 1.5em 0 .5em;padding:.25em .5em;width:fit-content;word-break:break-word}.v-channel-self>.v-channel-title{align-self:flex-end}.v-channel-self>.v-channel-content{align-self:flex-end;background-color:rgba(96,96,96,.5);margin:0 .5em 0 1.5em}.v-channel-time{color:#404040;font-family:monospace;padding:0 .25em}.v-channel-select{margin-left:.5em;width:4.5em}.v-channel-select .el-input__inner{background-color:rgba(32,32,32,.5);border-bottom-color:transparent;border-bottom-left-radius:unset;border-bottom-right-radius:unset}.v-channel-input{align-items:center;display:flex;flex-direction:row;padding:0 0 .5em .5em}.v-channel-input textarea{background-color:rgba(32,32,32,.5);border-top-left-radius:unset;font-size:.75em}.v-channel-input .el-input__count{background-color:transparent}";
  styleInject(css_248z$6);

  var css_248z$5 = ".v-background{background-color:#404040;background-image:url(https://cdn.jsdelivr.net/gh/coderzhaoziwei/Valkyrie@main/source/image/yande%23726730.jpg);background-repeat:no-repeat;background-size:cover;height:100%;position:absolute;width:100%;z-index:-1}";
  styleInject(css_248z$5);

  var css_248z$4 = ".combat-commands>.pfm-item,.item-commands>span.disabled,.item-commands>span[cmd],.room-commands>.act-item,.v-button{background-color:rgba(0,0,0,.5);border:1px solid #404040;border-radius:.25rem;color:#d8d8d8;cursor:pointer;font-size:.75rem;line-height:1.5rem;margin:0 0 .25rem .5rem;min-width:1rem;padding:0 .5rem;text-align:center;user-select:none}.combat-commands>.pfm-item:hover,.item-commands>span[cmd]:hover,.room-commands>.act-item:hover,.v-button:hover{background-color:rgba(0,128,64,.25);color:#d8d8d8}.combat-commands>.pfm-item:active,.item-commands>span[cmd]:active,.room-commands>.act-item:active,.v-button:active{background-color:rgba(0,128,64,.5);color:#d8d8d8;transform:translateY(1px)}.item-commands{padding-bottom:.25rem}";
  styleInject(css_248z$4);

  var css_248z$3 = ".v-onekey{padding:.5rem}.v-onekey>.v-button{font-size:1rem}";
  styleInject(css_248z$3);

  var css_248z$2 = ".show-panel-enter-active,.show-panel-leave-active{transition:all .5s ease}.show-panel-enter-from,.show-panel-leave-to{margin:0;max-height:0;opacity:.1;padding:0}.show-panel-enter-to,.show-panel-leave-from{max-height:25rem;opacity:.9}";
  styleInject(css_248z$2);

  var css_248z$1 = ".content-bottom,.room_exits,.tool-bar{user-select:none}body{background-color:rgba(0,0,0,.8)!important;display:flex;flex-direction:row;flex-wrap:nowrap;font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Arial,sans-serif;justify-content:center;width:100%}.container,.login-content{border-left:4px solid rgba(64,64,64,.5);border-right:4px solid rgba(64,64,64,.5);flex:1 1 auto;font-size:1em!important;margin:0;max-width:768px;order:2;width:16em}.channel{display:none;font-size:.75em}@media screen and (max-width:768px){.container,.login-content{border:none!important;flex:1 0 auto;width:100%}.channel{display:block}}.login-content .content{background-color:rgba(64,64,64,.25)}.login-content .panel_item{background-color:rgba(0,0,0,.5);border-color:#404040!important;color:#d8d8d8}.login-content .panel_item:not(.active):hover{background-color:rgba(0,128,64,.25);color:#d8d8d8}.login-content .bottom{background-color:rgba(0,0,0,.5)}.login-content iframe{background-color:#d8d8d8}.login-content .signinfo,.login-content .signinfo a{color:#d8d8d8}.room_desc{font-size:.75rem;line-height:1rem;text-indent:1.25rem}.room_exits{display:flex;justify-content:center}.room_exits>svg>rect,.room_exits>svg>text{cursor:pointer}.v-room-title .v-room-map{height:100%;width:100%}.v-room-title svg{cursor:grabbing}.combat-commands,.room-commands{padding-left:.75rem;position:relative;white-space:pre-wrap}.combat-commands:before,.room-commands:before{background-color:rgba(0,0,0,.5);border-color:#404040;color:#d8d8d8;height:100%;left:0;position:absolute;top:0}body{font-size:16px}.content-bottom,.dialog,.room_items,.task-desc,pre{font-size:.75rem}.state-bar>.title{font-size:.75rem;line-height:2rem;padding-left:1rem}.dialog .obj-money,.dialog .skill-level,.dialog .stats-span,.dialog .top-sc{font-family:monospace}.setting-item[for=backcolor],.setting-item[for=fontcolor],.setting-item[for=fontsize]{display:none!important}.content-message>pre{font-size:.75rem;padding:0 2.25rem 0 .5rem}.room_items>.item-commands{margin-left:.5rem}.room-item>.item-name{margin-left:1rem}.tool-bar>.tool-item{background-color:rgba(0,0,0,.25);border-color:#404040;color:hsla(0,0%,100%,.5);font-size:.75rem;height:2.25rem;margin:0 .25rem .25rem 0;width:2.25rem}.tool-bar>.tool-item>span.tool-icon{line-height:1rem}.tool-bar>.tool-item>span.tool-text,.tool-bar>.tool-item>span[cass=tool-text]{font-weight:400;line-height:1.5rem}.tool-bar.right-bar{right:0}.tool-item[command=showtool]{line-height:2.25rem}";
  styleInject(css_248z$1);

  var css_248z = ".font-cursive{font-family:Ma Shan Zheng,cursive!important}.font-monospace{font-family:monospace!important}.red-text{color:#fa6464}.green-text{color:#329632}.yellow-text{color:#fafa64}.unselectable{user-select:none}.selectable{user-select:text}.cursor-pointer{cursor:pointer}.line-h-3{line-height:12px}.line-h-4{line-height:16px}.line-h-5{line-height:20px}.line-h-6{line-height:24px}.line-h-7{line-height:28px}.line-h-8{line-height:32px}.line-h-9{line-height:36px}.line-h-10{line-height:40px}.line-h-11{line-height:44px}.line-h-12{line-height:48px}.line-h-13{line-height:52px}.line-h-14{line-height:56px}.line-h-15{line-height:60px}.line-h-16{line-height:64px}.font-3{font-size:12px}.font-4{font-size:16px}.font-5{font-size:20px}.font-6{font-size:24px}.font-7{font-size:28px}.font-8{font-size:32px}.font-9{font-size:36px}.font-10{font-size:40px}.font-11{font-size:44px}.font-12{font-size:48px}.font-13{font-size:52px}.font-14{font-size:56px}.font-15{font-size:60px}.font-16{font-size:64px}.text-align-left{text-align:left}.text-align-right{text-align:right}.text-align-center{text-align:center}.d-inline{display:inline}.d-block{display:block}.d-inline-block{display:inline-block}.d-none{display:none}.d-flex{display:flex}.flex-row{flex-direction:row}.flex-row-reverse{flex-direction:row-reverse}.flex-column{flex-direction:column}.flex-column-reverse{flex-direction:column-reverse}.flex-nowrap{flex-wrap:nowrap}.flex-wrap{flex-wrap:wrap}.flex-wrap-reverse{flex-wrap:wrap-reverse}.justify-start{justify-content:start}.jusify-end{justify-content:end}.justify-center{justify-content:center}.justify-space-between{justify-content:space-between}.justify-space-around{justify-content:space-around}.align-start{align-items:start}.align-end{align-items:end}.align-center{align-items:center}.align-baseline{align-items:baseline}.align-stretch{align-items:stretch}.flex-0-0{flex:0 0 auto}.flex-1-0{flex:1 0 auto}.flex-0-1{flex:0 1 auto}.flex-1-1{flex:1 1 auto}.ma-0{margin:0}.ma-1{margin:4px}.ma-2{margin:8px}.ma-3{margin:12px}.ma-4{margin:16px}.ma-5{margin:20px}.ma-6{margin:24px}.ma-7{margin:28px}.ma-8{margin:32px}.ma-9{margin:36px}.ma-10{margin:40px}.ma-11{margin:44px}.ma-12{margin:48px}.ma-13{margin:52px}.ma-14{margin:56px}.ma-15{margin:60px}.ma-16{margin:64px}.ma-auto{margin:auto}.mx-0{margin-left:0;margin-right:0}.mx-1{margin-left:4px;margin-right:4px}.mx-2{margin-left:8px;margin-right:8px}.mx-3{margin-left:12px;margin-right:12px}.mx-4{margin-left:16px;margin-right:16px}.mx-5{margin-left:20px;margin-right:20px}.mx-6{margin-left:24px;margin-right:24px}.mx-7{margin-left:28px;margin-right:28px}.mx-8{margin-left:32px;margin-right:32px}.mx-9{margin-left:36px;margin-right:36px}.mx-10{margin-left:40px;margin-right:40px}.mx-11{margin-left:44px;margin-right:44px}.mx-12{margin-left:48px;margin-right:48px}.mx-13{margin-left:52px;margin-right:52px}.mx-14{margin-left:56px;margin-right:56px}.mx-15{margin-left:60px;margin-right:60px}.mx-16{margin-left:64px;margin-right:64px}.mx-auto{margin-left:auto;margin-right:auto}.my-0{margin-bottom:0;margin-top:0}.my-1{margin-bottom:4px;margin-top:4px}.my-2{margin-bottom:8px;margin-top:8px}.my-3{margin-bottom:12px;margin-top:12px}.my-4{margin-bottom:16px;margin-top:16px}.my-5{margin-bottom:20px;margin-top:20px}.my-6{margin-bottom:24px;margin-top:24px}.my-7{margin-bottom:28px;margin-top:28px}.my-8{margin-bottom:32px;margin-top:32px}.my-9{margin-bottom:36px;margin-top:36px}.my-10{margin-bottom:40px;margin-top:40px}.my-11{margin-bottom:44px;margin-top:44px}.my-12{margin-bottom:48px;margin-top:48px}.my-13{margin-bottom:52px;margin-top:52px}.my-14{margin-bottom:56px;margin-top:56px}.my-15{margin-bottom:60px;margin-top:60px}.my-16{margin-bottom:64px;margin-top:64px}.my-auto{margin-bottom:auto;margin-top:auto}.mt-0{margin-top:0}.mt-1{margin-top:4px}.mt-2{margin-top:8px}.mt-3{margin-top:12px}.mt-4{margin-top:16px}.mt-5{margin-top:20px}.mt-6{margin-top:24px}.mt-7{margin-top:28px}.mt-8{margin-top:32px}.mt-9{margin-top:36px}.mt-10{margin-top:40px}.mt-11{margin-top:44px}.mt-12{margin-top:48px}.mt-13{margin-top:52px}.mt-14{margin-top:56px}.mt-15{margin-top:60px}.mt-16{margin-top:64px}.mt-auto{margin-top:auto}.mr-0{margin-right:0}.mr-1{margin-right:4px}.mr-2{margin-right:8px}.mr-3{margin-right:12px}.mr-4{margin-right:16px}.mr-5{margin-right:20px}.mr-6{margin-right:24px}.mr-7{margin-right:28px}.mr-8{margin-right:32px}.mr-9{margin-right:36px}.mr-10{margin-right:40px}.mr-11{margin-right:44px}.mr-12{margin-right:48px}.mr-13{margin-right:52px}.mr-14{margin-right:56px}.mr-15{margin-right:60px}.mr-16{margin-right:64px}.mr-auto{margin-right:auto}.mb-0{margin-bottom:0}.mb-1{margin-bottom:4px}.mb-2{margin-bottom:8px}.mb-3{margin-bottom:12px}.mb-4{margin-bottom:16px}.mb-5{margin-bottom:20px}.mb-6{margin-bottom:24px}.mb-7{margin-bottom:28px}.mb-8{margin-bottom:32px}.mb-9{margin-bottom:36px}.mb-10{margin-bottom:40px}.mb-11{margin-bottom:44px}.mb-12{margin-bottom:48px}.mb-13{margin-bottom:52px}.mb-14{margin-bottom:56px}.mb-15{margin-bottom:60px}.mb-16{margin-bottom:64px}.mb-auto{margin-bottom:auto}.ml-0{margin-left:0}.ml-1{margin-left:4px}.ml-2{margin-left:8px}.ml-3{margin-left:12px}.ml-4{margin-left:16px}.ml-5{margin-left:20px}.ml-6{margin-left:24px}.ml-7{margin-left:28px}.ml-8{margin-left:32px}.ml-9{margin-left:36px}.ml-10{margin-left:40px}.ml-11{margin-left:44px}.ml-12{margin-left:48px}.ml-13{margin-left:52px}.ml-14{margin-left:56px}.ml-15{margin-left:60px}.ml-16{margin-left:64px}.ml-auto{margin-left:auto}.ma-n1{margin:-4px}.ma-n2{margin:-8px}.ma-n3{margin:-12px}.ma-n4{margin:-16px}.ma-n5{margin:-20px}.ma-n6{margin:-24px}.ma-n7{margin:-28px}.ma-n8{margin:-32px}.ma-n9{margin:-36px}.ma-n10{margin:-40px}.ma-n11{margin:-44px}.ma-n12{margin:-48px}.ma-n13{margin:-52px}.ma-n14{margin:-56px}.ma-n15{margin:-60px}.ma-n16{margin:-64px}.mx-n1{margin-left:-4px;margin-right:-4px}.mx-n2{margin-left:-8px;margin-right:-8px}.mx-n3{margin-left:-12px;margin-right:-12px}.mx-n4{margin-left:-16px;margin-right:-16px}.mx-n5{margin-left:-20px;margin-right:-20px}.mx-n6{margin-left:-24px;margin-right:-24px}.mx-n7{margin-left:-28px;margin-right:-28px}.mx-n8{margin-left:-32px;margin-right:-32px}.mx-n9{margin-left:-36px;margin-right:-36px}.mx-n10{margin-left:-40px;margin-right:-40px}.mx-n11{margin-left:-44px;margin-right:-44px}.mx-n12{margin-left:-48px;margin-right:-48px}.mx-n13{margin-left:-52px;margin-right:-52px}.mx-n14{margin-left:-56px;margin-right:-56px}.mx-n15{margin-left:-60px;margin-right:-60px}.mx-n16{margin-left:-64px;margin-right:-64px}.my-n1{margin-bottom:-4px;margin-top:-4px}.my-n2{margin-bottom:-8px;margin-top:-8px}.my-n3{margin-bottom:-12px;margin-top:-12px}.my-n4{margin-bottom:-16px;margin-top:-16px}.my-n5{margin-bottom:-20px;margin-top:-20px}.my-n6{margin-bottom:-24px;margin-top:-24px}.my-n7{margin-bottom:-28px;margin-top:-28px}.my-n8{margin-bottom:-32px;margin-top:-32px}.my-n9{margin-bottom:-36px;margin-top:-36px}.my-n10{margin-bottom:-40px;margin-top:-40px}.my-n11{margin-bottom:-44px;margin-top:-44px}.my-n12{margin-bottom:-48px;margin-top:-48px}.my-n13{margin-bottom:-52px;margin-top:-52px}.my-n14{margin-bottom:-56px;margin-top:-56px}.my-n15{margin-bottom:-60px;margin-top:-60px}.my-n16{margin-bottom:-64px;margin-top:-64px}.mt-n1{margin-top:-4px}.mt-n2{margin-top:-8px}.mt-n3{margin-top:-12px}.mt-n4{margin-top:-16px}.mt-n5{margin-top:-20px}.mt-n6{margin-top:-24px}.mt-n7{margin-top:-28px}.mt-n8{margin-top:-32px}.mt-n9{margin-top:-36px}.mt-n10{margin-top:-40px}.mt-n11{margin-top:-44px}.mt-n12{margin-top:-48px}.mt-n13{margin-top:-52px}.mt-n14{margin-top:-56px}.mt-n15{margin-top:-60px}.mt-n16{margin-top:-64px}.mr-n1{margin-right:-4px}.mr-n2{margin-right:-8px}.mr-n3{margin-right:-12px}.mr-n4{margin-right:-16px}.mr-n5{margin-right:-20px}.mr-n6{margin-right:-24px}.mr-n7{margin-right:-28px}.mr-n8{margin-right:-32px}.mr-n9{margin-right:-36px}.mr-n10{margin-right:-40px}.mr-n11{margin-right:-44px}.mr-n12{margin-right:-48px}.mr-n13{margin-right:-52px}.mr-n14{margin-right:-56px}.mr-n15{margin-right:-60px}.mr-n16{margin-right:-64px}.mb-n1{margin-bottom:-4px}.mb-n2{margin-bottom:-8px}.mb-n3{margin-bottom:-12px}.mb-n4{margin-bottom:-16px}.mb-n5{margin-bottom:-20px}.mb-n6{margin-bottom:-24px}.mb-n7{margin-bottom:-28px}.mb-n8{margin-bottom:-32px}.mb-n9{margin-bottom:-36px}.mb-n10{margin-bottom:-40px}.mb-n11{margin-bottom:-44px}.mb-n12{margin-bottom:-48px}.mb-n13{margin-bottom:-52px}.mb-n14{margin-bottom:-56px}.mb-n15{margin-bottom:-60px}.mb-n16{margin-bottom:-64px}.ml-n1{margin-left:-4px}.ml-n2{margin-left:-8px}.ml-n3{margin-left:-12px}.ml-n4{margin-left:-16px}.ml-n5{margin-left:-20px}.ml-n6{margin-left:-24px}.ml-n7{margin-left:-28px}.ml-n8{margin-left:-32px}.ml-n9{margin-left:-36px}.ml-n10{margin-left:-40px}.ml-n11{margin-left:-44px}.ml-n12{margin-left:-48px}.ml-n13{margin-left:-52px}.ml-n14{margin-left:-56px}.ml-n15{margin-left:-60px}.ml-n16{margin-left:-64px}.pa-0{padding:0}.pa-1{padding:4px}.pa-2{padding:8px}.pa-3{padding:12px}.pa-4{padding:16px}.pa-5{padding:20px}.pa-6{padding:24px}.pa-7{padding:28px}.pa-8{padding:32px}.pa-9{padding:36px}.pa-10{padding:40px}.pa-11{padding:44px}.pa-12{padding:48px}.pa-13{padding:52px}.pa-14{padding:56px}.pa-15{padding:60px}.pa-16{padding:64px}.px-0{padding-left:0;padding-right:0}.px-1{padding-left:4px;padding-right:4px}.px-2{padding-left:8px;padding-right:8px}.px-3{padding-left:12px;padding-right:12px}.px-4{padding-left:16px;padding-right:16px}.px-5{padding-left:20px;padding-right:20px}.px-6{padding-left:24px;padding-right:24px}.px-7{padding-left:28px;padding-right:28px}.px-8{padding-left:32px;padding-right:32px}.px-9{padding-left:36px;padding-right:36px}.px-10{padding-left:40px;padding-right:40px}.px-11{padding-left:44px;padding-right:44px}.px-12{padding-left:48px;padding-right:48px}.px-13{padding-left:52px;padding-right:52px}.px-14{padding-left:56px;padding-right:56px}.px-15{padding-left:60px;padding-right:60px}.px-16{padding-left:64px;padding-right:64px}.py-0{padding-bottom:0;padding-top:0}.py-1{padding-bottom:4px;padding-top:4px}.py-2{padding-bottom:8px;padding-top:8px}.py-3{padding-bottom:12px;padding-top:12px}.py-4{padding-bottom:16px;padding-top:16px}.py-5{padding-bottom:20px;padding-top:20px}.py-6{padding-bottom:24px;padding-top:24px}.py-7{padding-bottom:28px;padding-top:28px}.py-8{padding-bottom:32px;padding-top:32px}.py-9{padding-bottom:36px;padding-top:36px}.py-10{padding-bottom:40px;padding-top:40px}.py-11{padding-bottom:44px;padding-top:44px}.py-12{padding-bottom:48px;padding-top:48px}.py-13{padding-bottom:52px;padding-top:52px}.py-14{padding-bottom:56px;padding-top:56px}.py-15{padding-bottom:60px;padding-top:60px}.py-16{padding-bottom:64px;padding-top:64px}.pt-0{padding-top:0}.pt-1{padding-top:4px}.pt-2{padding-top:8px}.pt-3{padding-top:12px}.pt-4{padding-top:16px}.pt-5{padding-top:20px}.pt-6{padding-top:24px}.pt-7{padding-top:28px}.pt-8{padding-top:32px}.pt-9{padding-top:36px}.pt-10{padding-top:40px}.pt-11{padding-top:44px}.pt-12{padding-top:48px}.pt-13{padding-top:52px}.pt-14{padding-top:56px}.pt-15{padding-top:60px}.pt-16{padding-top:64px}.pr-0{padding-right:0}.pr-1{padding-right:4px}.pr-2{padding-right:8px}.pr-3{padding-right:12px}.pr-4{padding-right:16px}.pr-5{padding-right:20px}.pr-6{padding-right:24px}.pr-7{padding-right:28px}.pr-8{padding-right:32px}.pr-9{padding-right:36px}.pr-10{padding-right:40px}.pr-11{padding-right:44px}.pr-12{padding-right:48px}.pr-13{padding-right:52px}.pr-14{padding-right:56px}.pr-15{padding-right:60px}.pr-16{padding-right:64px}.pb-0{padding-bottom:0}.pb-1{padding-bottom:4px}.pb-2{padding-bottom:8px}.pb-3{padding-bottom:12px}.pb-4{padding-bottom:16px}.pb-5{padding-bottom:20px}.pb-6{padding-bottom:24px}.pb-7{padding-bottom:28px}.pb-8{padding-bottom:32px}.pb-9{padding-bottom:36px}.pb-10{padding-bottom:40px}.pb-11{padding-bottom:44px}.pb-12{padding-bottom:48px}.pb-13{padding-bottom:52px}.pb-14{padding-bottom:56px}.pb-15{padding-bottom:60px}.pb-16{padding-bottom:64px}.pl-0{padding-left:0}.pl-1{padding-left:4px}.pl-2{padding-left:8px}.pl-3{padding-left:12px}.pl-4{padding-left:16px}.pl-5{padding-left:20px}.pl-6{padding-left:24px}.pl-7{padding-left:28px}.pl-8{padding-left:32px}.pl-9{padding-left:36px}.pl-10{padding-left:40px}.pl-11{padding-left:44px}.pl-12{padding-left:48px}.pl-13{padding-left:52px}.pl-14{padding-left:56px}.pl-15{padding-left:60px}.pl-16{padding-left:64px}";
  styleInject(css_248z);

  const valkyrie = app.mount('.valkyrie');
  valkyrie.on('login', async function(data) {
    this.sendCommands('pack,score2,score');
    await this.wait(1000);
    document.querySelector('[command=skills]').click();
    await this.wait(1000);
    document.querySelector('[command=tasks]').click();
    await this.wait(1000);
    document.querySelector('.dialog-close').click();
    this.updateToolBar();
  });
  valkyrie.on('map', data => delete data.type);

}());
