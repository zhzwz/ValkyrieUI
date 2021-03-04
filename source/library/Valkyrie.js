import WebSocket from './WebSocket'

const Valkyrie = new Vue({
  data: {
    websocket: new WebSocket(),
    roles: Object(),
    id: String(),
    state: String(),
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
    documentTitle() { /* 网页标题同步角色状态 */
      return `${this.name} ${this.state} ${this.server}`.trim()
    },
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
