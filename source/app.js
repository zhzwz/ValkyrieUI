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
    // 属性
    score() { return Valkyrie.score },
    id() { return this.score.id || '' },
    jyCache() { return Number(this.score.exp) || 0 },
    qnCache() { return Number(this.score.pot) || 0 },
    genderValue() { return ['女', '男'].findIndex(item => item === this.score.gender) }, // 0=女 1=男 -1
    hpPercentage() { return parseInt((this.score.hp / this.score.max_hp) * 100) || 0 },
    mpPercentage() { return parseInt((this.score.mp / this.score.max_mp) * 100) || 0 },
    wx1() { return Number(this.score.int) || 0 },
    wx2() { return Number(this.score.int_add) || 0 },
    xxxl() { return parseInt(this.score.study_per ) || 0 },
    lxxl() { return parseInt(this.score.lianxi_per) || 0 },
    energy() {
      this.score.jingli.match(/^(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+$/)
      const value = Number(RegExp.$1) || 0
      const limit = Number(RegExp.$2) || 0
      const today = Number(RegExp.$3) || 0
      return { value, limit, today }
    },
    // 本地角色信息
    role() { return common.getValue(this.id) || {} },
    name() { return this.role.name || '' },
    server() { return this.role.server || '' },
    // 状态
    state() { return Valkyrie.state || {} },
    stateText() { return `${this.state.text1} ${this.state.text2}` },
    tabTitle() { return `${this.name} ${this.stateText} ${this.server}` },

    // 房间
    room() { return Valkyrie.room },
    roomName() { return `${this.room.x} ${this.room.y}` },
    map() { return Valkyrie.map },

    // 技能
    skill() {
      return Valkyrie.skill
    },
    skillList() {
      return this.skill.list
    },
    lxCost() { // 练习每一跳消耗＝(先天悟性＋后天悟性)×(1＋练习效率%－先天悟性%)
      return parseInt((this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100))
    },
    xxCost() { // 学习每一跳消耗＝(先天悟性＋后天悟性)×(1＋学习效率%－先天悟性%)×3
      return parseInt((this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3)
    },

    // 任务
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

    // 宽度自适应
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
    tabTitle(value) { document.title = value },
    jyCache(value) { gsap.to(this.$data, { duration: 0.5, jy: value }) },
    qnCache(value) { gsap.to(this.$data, { duration: 0.5, qn: value }) },
    async chatListCount() {
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

    actionWaKuang() {
      this.sendCommands('stopstate,wakuang')
    },
    actionXiuLian() {
      this.sendCommands('stopstate,jh fam 0 start,go west,go west,go north,go enter,go west,xiulian')
    },
    actionWuMiao() {
      this.sendCommands('stopstate,jh fam 0 start,go north,go north,go west,dazuo')
    },

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

export default app
