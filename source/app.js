import clearUpPackage from './method/clearUpPackage'
import autoWaKuang from './method/autoWaKuang'

const cache = ValkyrieCache

const app = Vue.createApp({
  data() {
    return {
      widthValue: 0,
      showLeft: false,
      showRight: false,

      jy: 0, qn: 0,

      // 持久化选项
      options: {
        // 动态标签
        showDynamicTitle: true,
        // 面板显示开关
        showPanelScore: true,
        showPanelTask: true,
        // 频道显示开关
        showChannelCh: true,
        showChannelTm: true,
        showChannelFa: true,
        showChannelPt: true,
        showChannelEs: true,
        showChannelSy: true,
        showChannelRu: true,
      },

      // 聊天相关
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
      // 地图弹窗
      showRoomMapDialog: false,
    }
  },
  computed: {
    cache() {
      return ValkyrieCache
    },
    map() { return cache.map },
    room() { return cache.room },
    role() { return cache.role },
    score() { return cache.score },
    state() { return cache.state },
    seller() { return cache.seller },
    sellList() { return cache.sellList },
    packList() { return cache.packList },
    packLimit() { return cache.packLimit },
    equipList() { return cache.equipList },
    storeList() { return cache.storeList },
    skillList() { return cache.skillList },
    skillLimit() { return cache.skillLimit },
    storeLimit() { return cache.storeLimit },

    smCount() { return cache.smCount },
    smTotal() { return cache.smTotal },
    smTarget() { return cache.smTarget },
    ymCount() { return cache.ymCount },
    ymTotal() { return cache.ymTotal },
    ymTarget() { return cache.ymTarget },
    ymTargetX() { return cache.ymTargetX },
    ymTargetY() { return cache.ymTargetY },
    ybCount() { return cache.ybCount },
    ybTotal() { return cache.ybTotal },
    fbCount() { return cache.fbCount },
    wdCount() { return cache.wdCount },
    wdTotal() { return cache.wdTotal },
    wdValue() { return cache.wdValue },
    qaValue() { return cache.qaValue },
    xyValue() { return cache.xyValue },
    mpValue() { return cache.mpValue },

    lxCost() { return cache.lxCost },
    xxCost() { return cache.xxCost },
    hpPercentage() { return cache.hpPercentage },
    mpPercentage() { return cache.mpPercentage },

    packCount() { return this.packList.length },
    roomName() { return `${this.room.x} ${this.room.y}` },
    jyCache() { return Number(this.score.exp) || 0 },
    qnCache() { return Number(this.score.pot) || 0 },
    stateValue() { return this.state.value },
    stateText() { return `${this.state.text}${this.state.detail}` },
    id() { return this.role.id || `` },
    name() { return this.role.name || `` },
    server() { return this.role.server || `` },
    genderValue() { return ['女', '男'].findIndex(item => item === this.score.gender) },
    tabTitle() { return `${this.name} ${this.stateText} ${this.server}` },

    // energy() {
    //   this.score.jingli.match(/^(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+$/)
    //   const value = Number(RegExp.$1) || 0
    //   const limit = Number(RegExp.$2) || 0
    //   const today = Number(RegExp.$3) || 0
    //   return { value, limit, today }
    // },

    // 聊天
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
    chatListCount() {
      return this.chatList.length
    },
    // 宽度自适应
    isNotMobile() { return this.widthValue > 768 },
    showSidebarLeft() { return this.id && (this.isNotMobile || this.showLeft) },
    showSidebarRight() { return this.id && (this.isNotMobile || this.showRight) },
  },
  watch: {
    // 网页标签名称
    tabTitle(value) {
      document.title = value
    },
    // 数字动态递增：经验、潜能
    jyCache(value) {
      if (document.hidden) this.jy = value
      else Gsap.to(this.$data, { duration: 0.5, jy: value })
    },
    qnCache(value) {
      if (document.hidden) this.qn = value
      else Gsap.to(this.$data, { duration: 0.5, qn: value })
    },
    // 聊天滚动到底部
    async chatListCount() {
      await Vue.nextTick()
      document.querySelector('.v-channel-scroll').scrollIntoView({ behavior: 'smooth' })
    },
  },
  methods: {
    // 引入 ValkyrieWorker 的六个方法
    sendCommand(command) { ValkyrieWorker.sendCommand(command) },
    sendCommands(...args) { ValkyrieWorker.sendCommands(...args) },
    onData(data) { ValkyrieWorker.onData(data) },
    onText(text) { ValkyrieWorker.onText(text) },
    on(type, handler) { return ValkyrieWorker.on(type, handler.bind(this)) },
    off(id) { ValkyrieWorker.off(id) },

    wait(ms = 256) {
      return new Promise(resolve => setTimeout(() => resolve(), ms))
    },
    timeText() {
      return new Date().toLocaleTimeString('en-DE')
    },

    clickMapIcon() {
      this.showRoomMapDialog = !this.showRoomMapDialog
      if (this.showRoomMapDialog) this.sendCommand(`map`)
    },
    clickChatIcon() {
      const value = this.chatValue.trim()
      if (value) this.sendCommand(`${this.channelValue} ${value}`)
      this.chatValue = ''
    },

    // 刷新窗口宽度
    updateWindowWidth() {
      this.widthValue = document.body.clientWidth
    },
    // 刷新游戏工具栏位置
    updateToolBar() {
      if (document.querySelector('.content-bottom').offsetHeight === 0) {
        document.querySelector('[command=showcombat]').click()
      }
      if (document.querySelector('.right-bar').offsetWidth === 0) {
        document.querySelector('[command=showtool]').click()
      }
      setTimeout(() => {
        const h1 = document.querySelector('.content-bottom').clientHeight
        const h2 = document.querySelector('.tool-bar.bottom-bar').clientHeight
        document.querySelector('.right-bar').style.bottom = h1 + h2 + 'px'
      }, 1000)
    },

    actionXiuLian() {
      return new Promise((resolve, reject) => {
        this.sendCommands('stopstate,jh fam 0 start,go west,go west,go north,go enter,go west,xiulian')
      })
    },
    actionWuMiao() {
      return new Promise((resolve, reject) => {
        this.sendCommands('stopstate,jh fam 0 start,go north,go north,go west,dazuo')
      })
    },
    autoWaKuang,
    clearUpPackage,
  },
  mounted() {
    window.onresize = () => {
      this.updateWindowWidth()
      this.updateToolBar()
    }
    this.updateWindowWidth()
  },
})

app.use(Element3)

import SIDEBAR_LEFT from './html/sidebar-left.html'
import SIDEBAR_RIGHT from './html/sidebar-right.html'
import ROOM_TITLE from './html/game-room-title.html'

const head = document.head
const body = document.body
const appendElement = Util.appendElement
// Google Font
appendElement(head, 'link', { rel: 'preconnect', href: 'https://fonts.gstatic.com' })
appendElement(head, 'link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap' })
// Element3 CSS
appendElement(head, 'link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/element3@0.0.39/lib/theme-chalk/index.css' })
//
appendElement(body, 'div', { class: 'valkyrie' })
appendElement(body, 'div', { class: 'v-background' })
appendElement(body, 'div', { class: 'v-sidebar v-sidebar-left' })
appendElement(body, 'div', { class: 'v-sidebar v-sidebar-right' })
document.querySelector(`.room-title`).innerHTML = ``
document.querySelector(`.room-title`).className = `v-room-title v-header`
document.querySelector(`#role_panel > ul > li.panel_item.active`).className += ` v-header font-cursive`
document.querySelector(`.valkyrie`).innerHTML = SIDEBAR_LEFT + SIDEBAR_RIGHT + ROOM_TITLE

export default app
