const app = Vue.createApp({
  data() {
    return {
      width: 0,
      showLeft: false,
      showRight: false,

      jy: 0,
      qn: 0,

      // 持久化选项
      options: {
        // 动态标签
        showDynamicTitle: true,
        // 面板显示开关
        showPanelScore: true,
        showPanelTask: true,
        showPanelOnekey: true,
        // 频道显示开关
        showChannelCh: true,
        showChannelTm: true,
        showChannelFa: true,
        showChannelPt: true,
        showChannelEs: true,
        showChannelSy: true,
        showChannelRu: true,
        // 任务
        canTaskSm: true,
        canTaskSmCard: true,
        canTaskSmStore: true,
        canTaskYm: true,
        canTaskYmSweep: true,
      },

      // 聊天相关
      // showChannelOptions: false,
      chat: '',
      channel: 'chat',
      channelSelections: [
        { name: '世界', value: 'chat' },
        { name: '队伍', value: 'tm' },
        { name: '帮派', value: 'pty' },
        { name: '门派', value: 'fam' },
        { name: '全区', value: 'es' },
      ],
      // 弹窗
      showChannelDialog: false,
      showMapDialog: false,
      showTaskDialog: false,
    }
  },
  computed: {
    Valkyrie() {
      return Valkyrie
    },
    id() {
      return Valkyrie.role.id || ``
    },
    title() {
      const id = Valkyrie.role.id || ``
      const name = Valkyrie.role.name || ``
      const state = Valkyrie.state.text + Valkyrie.state.detail || ``
      const server = Valkyrie.role.server || ``
      return id ? `${name} ${state} ${server}` : ``
    },
    jyCache() {
      return Number(Valkyrie.score.exp) || 0
    },
    qnCache() {
      return Number(Valkyrie.score.pot) || 0
    },

    // energy() {
    //   this.score.jingli.match(/^(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+$/)
    //   const value = Number(RegExp.$1) || 0
    //   const limit = Number(RegExp.$2) || 0
    //   const today = Number(RegExp.$3) || 0
    //   return { value, limit, today }
    // },

    // 聊天
    chatList() {
      return Valkyrie.chatList.filter(
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
    // 宽度自适应
    // isMobile() {
    //   return this.width <= 768
    // },
    showSidebarLeft() {
      return this.id && (!this.isMobile || this.showLeft)
    },
    showSidebarRight() {
      return this.id && (!this.isMobile || this.showRight)
    },
  },
  watch: {
    // 网页标签名称
    title(value) {
      document.title = value
    },
    // 数字动态递增：经验、潜能
    jyCache(value) {
      if (document.hidden) this.jy = value
      else gsap.to(this.$data, { duration: 0.5, jy: value })
    },
    qnCache(value) {
      if (document.hidden) this.qn = value
      else gsap.to(this.$data, { duration: 0.5, qn: value })
    },
    // 聊天滚动到底部
    async chatCount() {
      await Vue.nextTick()
      document.querySelector('.v-channel-scroll').scrollIntoView({ behavior: 'smooth' })
    },
    options(value) {
      console.log(value)
    },
  },
  methods: {
    // 引入 Valkyrie 的六个方法
    sendCommand(command) {
      Valkyrie.sendCommand(command)
    },
    sendCommands(...args) {
      Valkyrie.sendCommands(...args)
    },
    timeText() {
      return new Date().toLocaleTimeString('en-DE')
    },

    clickMapIcon() {
      this.showMapDialog = !this.showMapDialog
      if (this.showMapDialog) this.sendCommand(`map`)
    },
    clickChatIcon() {
      const value = this.chat.trim()
      if (value) this.sendCommand(`${this.channel} ${value}`)
      this.chat = ''
    },

    // 刷新窗口宽度
    updateWidth() {
      this.width = document.body.clientWidth
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

    // actionXiuLian() {
    //   return new Promise((resolve, reject) => {
    //     this.sendCommands('stopstate,jh fam 0 start,go west,go west,go north,go enter,go west,xiulian')
    //   })
    // },
    // actionWuMiao() {
    //   return new Promise((resolve, reject) => {
    //     this.sendCommands('stopstate,jh fam 0 start,go north,go north,go west,dazuo')
    //   })
    // },
  },
  mounted() {
    window.onresize = () => {
      this.updateWidth()
      this.updateToolBar()
    }
    this.updateWidth()
  },
})

app.use(Element3)
app.config.warnHandler = function(msg, vm, trace) {
  // `trace` 是组件的继承关系追踪
}

const head = document.head
const body = document.body
// Google Font
Valkyrie.appendElement(head, `link`, { rel: `preconnect`, href: `https://fonts.gstatic.com` })
Valkyrie.appendElement(head, `link`, { rel: `stylesheet`, href: `https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap` })
// Element3 CSS
Valkyrie.appendElement(head, `link`, { rel: `stylesheet`, href: `https://cdn.jsdelivr.net/npm/element3@0.0.39/lib/theme-chalk/index.css` })
//
Valkyrie.appendElement(body, `div`, { class: `valkyrie` })
Valkyrie.appendElement(body, `div`, { class: `v-background` })
Valkyrie.appendElement(body, `div`, { class: `v-sidebar v-sidebar-left` })
Valkyrie.appendElement(body, `div`, { class: `v-sidebar v-sidebar-right` })

document.querySelector(`.room-title`).innerHTML = ``
document.querySelector(`.room-title`).className = `v-room-title v-header`
document.querySelector(`#role_panel > ul > li.panel_item.active`).className += ` v-header font-cursive`

import SIDEBAR_LEFT from "./html/sidebar-left.html"
import SIDEBAR_RIGHT from "./html/sidebar-right.html"
import ROOM_TITLE from "./html/game-room-title.html"

document.querySelector(`.valkyrie`).innerHTML = SIDEBAR_LEFT + SIDEBAR_RIGHT + ROOM_TITLE

export default app
