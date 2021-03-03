import EventEmitter from './EventEmitter'

class WebSocket {
  constructor() {
    this.ws = undefined
    this.wsOnMessage = undefined
    this.eventEmitter = new EventEmitter()
    this.init()
  }
  init() {
    console.log('WebSocket: init')
    const instance = this
    if (window.WebSocket) {
      unsafeWindow.WebSocket = function(uri) {
        instance.ws = new window.WebSocket(uri)
      }
      unsafeWindow.WebSocket.prototype = {
        set onopen(fn) {
          console.log('WebSocket: set onopen')
          instance.ws.onopen = fn
        },
        set onclose(fn) {
          console.log('WebSocket: set onclose')
          instance.ws.onclose = fn
        },
        set onerror(fn) {
          console.log('WebSocket: set onerror')
          instance.ws.onerror = fn
        },
        set onmessage(fn) {
          console.log('WebSocket: set onmessage')
          instance.wsOnMessage = fn
          instance.ws.onmessage = event =>  instance.onMessage(event)
        },
        get readyState() {
          const state = instance.ws.readyState
          if (state !== 1) {
            console.log(`WebSocket: get readyState => ${state}`)
          }
          return state
        },
        send: command => instance.onSend(command),
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
    this.eventEmitter.emit(data.type, data)

    const event = data2event(data)
    if (this.ws && this.wsOnMessage) this.wsOnMessage(event)
  }
  onSend(command) {
    console.log(command)
    this.ws.send(command)
  }
}

export default WebSocket

function event2data(event) {
  const data = event.data
  if (data[0] === '{')
    return new Function(`return ${ data };`)()
  else
    return { 'type': 'text', 'text': data }
}

function data2event(data) {
  if (data.type === 'text' && typeof data.text === 'string')
    return { data: data.text }
  else
    return { data: JSON.stringify(data) }
}
