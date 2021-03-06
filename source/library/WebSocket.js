import Sender from './Sender'
import EventEmitter from './EventEmitter'

class WebSocket {
  constructor() {
    this.ws = undefined
    this.wsOnMessage = undefined
    this.sender = undefined
    this.eventEmitter = new EventEmitter()
    this.init()
  }
  init() {
    console.log('WebSocket: init')
    const self = this
    if (window.WebSocket) {
      unsafeWindow.WebSocket = function(uri) {
        self.ws = new window.WebSocket(uri)
      }
      unsafeWindow.WebSocket.prototype = {
        set onopen(fn) {
          console.log('WebSocket: set onopen')
          self.ws.onopen = fn
        },
        set onclose(fn) {
          console.log('WebSocket: set onclose')
          self.ws.onclose = fn
        },
        set onerror(fn) {
          console.log('WebSocket: set onerror')
          self.ws.onerror = fn
        },
        set onmessage(fn) {
          console.log('WebSocket: set onmessage')
          self.wsOnMessage = fn
          self.ws.onmessage = event => self.onMessage(event)
        },
        get readyState() {
          const state = self.ws.readyState
          if (state !== 1) {
            console.log(`WebSocket: get readyState => ${state}`)
          }
          return state
        },
        send: command => self.onSend(command),
      }
    } else {
      throw new Error('WebSocket is undefined.')
    }
  }
  onMessage(event) {
    const data = event2data(event)
    this.onData(data)
  }
  onData(data) {
    console.log(data)
    this.eventEmitter.emit(data.dialog || data.type, data)

    const event = data2event(data)
    if (this.ws && this.wsOnMessage) this.wsOnMessage(event)
  }
  onSend(...args) {
    if (this.sender === undefined) {
      this.sender = new Sender(command => this.ws.send(command))
    }
    args.forEach((item, index) => {
      if (typeof item === 'string' && /^(?!setting)/.test(item) && /,/.test(item)) {
        args[index] = item.split(',')
      }
    })
    this.sender.send(...args.flat(Infinity))
  }
}

export default WebSocket

function event2data(event) {
  const data = event.data
  if (data[0] === '{') {
    return new Function(`return ${ data };`)()
  } else {
    return { 'type': 'text', 'text': data }
  }
}

function data2event(data) {
  if (data.type === 'text' && typeof data.text === 'string') {
    return { data: data.text }
  } else {
    return { data: JSON.stringify(data) }
  }
}
