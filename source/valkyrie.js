import WebSocketInstance from './websocket'

export default new Vue({
  data: {
    websocketInstance: new WebSocketInstance(),

  },
  computed: {

  },
  watch: {

  },
  methods: {
    on(type, handler) {
      this.websocketInstance.eventEmitter.on(type, handler.bind(this))
    },
    off(type, handler) {
      this.websocketInstance.eventEmitter.off(type, handler)
    },
  },
})
