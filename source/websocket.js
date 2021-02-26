import EventEmitter from './emitter'

export default class WebSocketInstance {
  constructor() {
    this.ws = undefined
    this.ws_onmessage_fn = undefined
    this.eventEmitter = new EventEmitter()
    this.init()
  }
  init() {
    console.log('WebSocketInstance: init')
    const instance = this
    if (WebSocket) {
      unsafeWindow.WebSocket = function(uri) {
        instance.ws = new WebSocket(uri)
      }
      unsafeWindow.WebSocket.prototype = {
        set onopen(fn) {
          console.log('WebSocketInstance: set onopen')
          instance.ws.onopen = fn
        },
        set onclose(fn) {
          console.log('WebSocketInstance: set onclose')
          instance.ws.onclose = fn
        },
        set onerror(fn) {
          console.log('WebSocketInstance: set onerror')
          instance.ws.onerror = fn
        },
        set onmessage(fn) {
          console.log('WebSocketInstance: set onmessage')
          instance.ws_onmessage_fn = fn
          instance.ws.onmessage = event =>  instance.onMessage(event)
        },
        get readyState() {
          const state = instance.ws.readyState
          if (state !== 1) {
            console.log(`WebSocketInstance: get readyState => ${state}`)
          }
          return state
        },
        send: command => instance.onSend(command),
      }
    } else {
      throw new Error('window.WebSocket is undefined.')
    }
  }
  onMessage(event) {
    const data = this.event2data(event)
    this.onData(data)
  }
  onData(data) {
    console.log(data)
    this.eventEmitter.emit(data.type, data)

    const event = this.data2event(data)
    if (this.ws && this.ws_onmessage_fn) this.ws_onmessage_fn(event)
  }
  onSend(command) {
    this.eventEmitter.emit('send', { type: 'send', command })
    this.ws.send(command)
  }
  event2data(event) {
    const data = event.data
    if (data[0] === '{')
      return new Function(`return ${ data };`)()
    else
      return { 'type': 'text', 'text': data }
  }
  data2event(data) {
    if (data.type === 'text' && typeof data.text === 'string')
      return { data: data.text }
    else
      return { data: JSON.stringify(data) }
  }
}
