import WebSocket from './WebSocket'

const Valkyrie = new Vue({
  data: {
    websocket: new WebSocket(),
    roles: Object(),
    id: String(),
    state: String(),
    room: Object(),
    prop: Object(),
  },
  computed: {
    role() {
      const id = this.id
      const role = this.roles[id]
      const hasId = Boolean(id) && (typeof id === 'string')
      const hasRole = Boolean(role) && (typeof role === 'object')
      if (hasId && hasRole) return role
    },
    name() {
      return this.role ? this.role.name : GM_info.script.name
    },
    server() {
      return this.role ? this.role.server : GM_info.script.version
    },
    /* 网页标题同步角色状态 */
    documentTitle() {
      return `${this.name} ${this.state} ${this.server}`.trim()
    },
    npcs() {
      const list = Array()
      if (this.room.items instanceof Array) {
        this.room.items.forEach(item => item.isNpc && list.push(item))
      }
      return list
    },
    jy()   { return parseInt(this.prop.exp       ) || 0 },
    qn()   { return parseInt(this.prop.pot       ) || 0 },
    hp1()  { return parseInt(this.prop.hp        ) || 0 },
    hp2()  { return parseInt(this.prop.max_mp    ) || 0 },
    mp1()  { return parseInt(this.prop.mp        ) || 0 },
    mp2()  { return parseInt(this.prop.max_mp    ) || 0 },
    mp3()  { return parseInt(this.prop.limit_mp  ) || 0 },
    wx1()  { return parseInt(this.prop.int       ) || 0 },
    wx2()  { return parseInt(this.prop.int_add   ) || 0 },
    xxxl() { return parseInt(this.prop.study_per ) || 0 },
    lxxl() { return parseInt(this.prop.lianxi_per) || 0 },
  },
  watch: {
    documentTitle(value) {
      document.title = value
    },
  },
  methods: {
    on(type, handler) {
      return this.websocket.eventEmitter.on(type, handler.bind(this))
    },
    once(type, handler) {
      return this.websocket.eventEmitter.once(type, handler.bind(this))
    },
    off(id) {
      this.websocket.eventEmitter.off(id)
    },
    send(...args) {
      this.websocket.onSend(...args)
    },
    wait(ms) {
      return new Promise(_ => setTimeout(() => _(), ms))
    },
  },
})

export default Valkyrie

unsafeWindow.Valkyrie = Valkyrie
