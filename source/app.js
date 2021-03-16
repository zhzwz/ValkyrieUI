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
    map() {
      return Valkyrie.map
    },
    // mapSVG() {
    //   return Valkyrie.map.svg
    // },


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
      return ['女', '男'].findIndex(item => item === this.score.gender) // 0=女 1=男 -1
    },
    hpPercentage() {
      return parseInt((this.score.hp / this.score.max_hp) * 100) || 0
    },
    mpPercentage() {
      return parseInt((this.score.mp / this.score.max_mp) * 100) || 0
    },

    isNotMobile() {
      return this.widthValue > 768
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
      document.title = value
    },
    jyCache(value) {
      gsap.to(this.$data, { duration: 0.5, jy: value })
    },
    qnCache(value) {
      gsap.to(this.$data, { duration: 0.5, qn: value })
    },
    async channelMessageCount() {
      await Vue.nextTick()
      document.querySelector('.v-channel-scroll').scrollIntoView({ behavior: 'smooth' })
    },
  },
  methods: {
    sendCommand(command) {
      ValkyrieWorker.sendCommand(command)
    },
    sendCommands(...args) {
      ValkyrieWorker.sendCommands(...args)
    },

    on(type, handler) {
      return ValkyrieWorker.on(type, handler)
    },
    once(type, handler) {
      return ValkyrieWorker.once(type, handler)
    },
    off(id) {
      ValkyrieWorker.off(id)
    },
    wait(ms = 256) {
      return new Promise(resolve => setTimeout(() => resolve(), ms))
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
    async openToolBar() {
      if (document.querySelector('.content-bottom').offsetHeight === 0) {
        document.querySelector('[command=showcombat]').click()
      }
      if (document.querySelector('.right-bar').offsetWidth === 0) {
        document.querySelector('[command=showtool]').click()
      }
      await this.wait(1000)
      document.querySelector('.right-bar').style.bottom =
        document.querySelector('.content-bottom').clientHeight +
        document.querySelector('.tool-bar.bottom-bar').clientHeight + 'px'
    },
  },

  mounted() {
    const updateWidth = () => (this.widthValue = document.body.clientWidth)
    window.onresize = () => {
      updateWidth()
      this.openToolBar()
    }
    updateWidth()
  },
})

app.use(Element3)

export default app
