/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./source/library/TimeWorkerContent.js
/* harmony default export */ const TimeWorkerContent = ("self.onmessage = function(event) {\n  const { type, counter, timeout, id } = event.data\n  if (type === 'setTimeout' || type === 'setInterval') {\n    const id = type === 'setTimeout'\n      ? setTimeout (() => self.postMessage({ type: 'setTimeout',  counter }), timeout)\n      : setInterval(() => self.postMessage({ type: 'setInterval', counter }), timeout)\n    self.postMessage({ type: 'set', counter, id })\n  } else if (type === 'clearTimeout' || type === 'clearInterval') {\n    if (type === 'clearTimeout') clearTimeout(id)\n    else if (type === 'clearInterval') clearInterval(id)\n    self.postMessage({ type: 'clear', counter })\n  }\n}\n");
;// CONCATENATED MODULE: ./source/library/TimeWorker.js


class TimeWorker {
  constructor() {
    this.counter = Number()
    this.container = Object()
    this.worker = new Worker(URL.createObjectURL(new Blob([TimeWorkerContent])))
    this.worker.onmessage = this.onmessage.bind(this)
  }
  onmessage(event) {
    const { type, counter, id } = event.data
    if (type === 'set') this.container[counter].id = id
    else if (type === 'clear') delete this.container[counter]
    else if (type === 'setTimeout' || type === 'setInterval') {
      if (this.container[counter]) {
        const callback = this.container[counter].callback
        const args = this.container[counter].args
        callback(...args)
        if (type === 'setTimeout') delete this.container[counter]
      }
    }
  }
  setTimeout(callback, timeout, ...args) {
    return this.setTimeWorker('setTimeout', callback, timeout, ...args)
  }
  clearTimeout(counter) {
    this.clearTimeWorker('clearTimeout', counter)
  }
  setInterval(callback, timeout, ...args) {
    return this.setTimeWorker('setInterval', callback, timeout, ...args)
  }
  clearInterval(counter) {
    this.clearTimeWorker('clearInterval', counter)
  }
  setTimeWorker(type, callback, timeout, ...args) {
    const counter = ++ this.counter
    this.container[counter] = Object()
    this.container[counter].callback = callback
    this.container[counter].args = args
    this.worker.postMessage({ type, counter, timeout })
    return counter
  }
  clearTimeWorker(type, counter) {
    if (this.container[counter]) {
      const id = this.container[counter].id
      this.worker.postMessage({ type, counter, id })
    }
  }
}

/* harmony default export */ const library_TimeWorker = ((/* unused pure expression or super */ null && (TimeWorker)));

const initUnsafeWindowTimeWorker = function() {
  const timeWorker = new TimeWorker()
  unsafeWindow.setTimeout = timeWorker.setTimeout.bind(timeWorker)
  unsafeWindow.setInterval = timeWorker.setInterval.bind(timeWorker)
  unsafeWindow.clearTimeout = timeWorker.clearTimeout.bind(timeWorker)
  unsafeWindow.clearInterval = timeWorker.clearInterval.bind(timeWorker)
}

;// CONCATENATED MODULE: ./source/library/Sender.js
class Sender {
  constructor(handler) {
    this.readystate = Boolean()
    this.queue = Array()
    this.handler = handler
  }
  send(...args) {
    this.queue.push(...args)
    if (this.readystate === false) {
      this.readystate = true
      this.loop()
    }
  }
  async loop(ms = 256) {
    const command = this.queue.splice(0, 1)[0]

    if (this.readystate === false) {
      return
    } else if (this.handler === undefined) {
      console.log('Sender handler has been destroyed.')
      this.queue.splice(0)
      this.readystate = false
    } else if (command === undefined) {
      this.readystate = false
    } else if (isValidNumber(command)) {
      ms = Number(command)
      this.loop(ms)
    } else {
      await new Promise(resolve => setTimeout(() => resolve(), ms))
      if (isValidString(command)) {
        console.log(command)
        this.handler(command)
      } else if (isValidFunction(command)) {
        command()
      }
      this.loop()
    }
  }
}

/* harmony default export */ const library_Sender = (Sender);

function isValidNumber(any) {
  const element = Number(any)
  const isNumber = typeof element === 'number'
  const isNotNaN = isNaN(element) === false
  return isNumber && isNotNaN
}
function isValidString(any) {
  const isString = typeof any === 'string'
  const nonEmpty = any !== ''
  return isString && nonEmpty
}
function isValidFunction(any) {
  return typeof any === 'function'
}

;// CONCATENATED MODULE: ./source/library/EventEmitter.js
class EventEmitter {
  constructor() {
    this.counter = Number()
    this.container = Object()
    this.listeners = Array()
  }
  on(name, handler, once = false) {
    if (typeof name !== 'string') throw new TypeError()
    if (typeof handler !== 'function') throw new TypeError()

    const counter = ++ this.counter
    this.container[name] = this.container[name] || Array()
    this.container[name].push(counter)
    this.listeners[counter] = { counter, name, handler, once }
    return counter
  }
  once(name, handler) {
    return this.on(name, handler, true)
  }
  off(counter) {
    const listener = this.listeners[counter]
    const name = listener.name
    const index = this.container[name].indexOf(counter)
    delete this.container[name][index]
    delete this.listeners[counter]
  }
  emit(name, ...args) {
    const counters = this.container[name]
    if (counters instanceof Array) {
      counters.forEach(counter => {
        const { handler, once } = this.listeners[counter]
        if (typeof handler === 'function') handler(...args)
        if (once === true) this.off(counter)
      })
    }
  }
}

/* harmony default export */ const library_EventEmitter = (EventEmitter);

;// CONCATENATED MODULE: ./source/library/WebSocket.js



class WebSocket {
  constructor() {
    this.ws = undefined
    this.wsOnMessage = undefined
    this.sender = undefined
    this.eventEmitter = new library_EventEmitter()
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
          self.ws.onmessage = event =>  self.onMessage(event)
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
    this.eventEmitter.emit(data.type, data)

    const event = data2event(data)
    if (this.ws && this.wsOnMessage) this.wsOnMessage(event)
  }
  onSend(...args) {
    if (this.sender === undefined) {
      this.sender = new library_Sender(command => this.ws.send(command))
    }
    args.forEach((item, index) => {
      if (typeof item === 'string' && /^(?!setting)/.test(item) && /,/.test(item)) {
        args[index] = item.split(',')
      }
    })
    this.sender.send(...args.flat(Infinity))
  }
}

/* harmony default export */ const library_WebSocket = (WebSocket);

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

;// CONCATENATED MODULE: ./source/library/Valkyrie.js


const Valkyrie = new Vue({
  data: {
    websocket: new library_WebSocket(),
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

/* harmony default export */ const library_Valkyrie = (Valkyrie);

unsafeWindow.Valkyrie = Valkyrie

;// CONCATENATED MODULE: ./source/handler/type/roles.js


library_Valkyrie.on('roles', function(data) {
  if (data.roles instanceof Array) {
    data.roles.forEach(role => {
      const { name, title, id } = role
      this.roles[id] = this.roles[id] || Object()
      this.roles[id].name = name
      this.roles[id].title = title
    })
  }
  console.log(Object.assign(Object(), this.roles))
})

;// CONCATENATED MODULE: ./source/library/Cookie.js
const getCookie = function(name) {
  const cookies = document.cookie.split(';').reduce((cookies, cookieString) => {
    const i = cookieString.indexOf('=')
    const name = cookieString.substr(0, i).trim()
    const value = cookieString.substr(i + 1)
    cookies[name] = value
    return cookies
  }, {})
  return cookies[name]
}

const setCookie = function(name, value) {
  document.cookie = name + '=' + value
}

const deleteCookie = function(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

/* harmony default export */ const Cookie = ({
  getCookie,
  setCookie,
  deleteCookie,
});

;// CONCATENATED MODULE: ./source/handler/type/login.js



library_Valkyrie.once('login', function(data) {
  const id = data.id
  const u = getCookie('u')
  const p = getCookie('p')
  const s = getCookie('s')
  this.roles[id].cookie = { u, p, s }
  this.roles[id].server = ['一区', '二区', '三区', '四区', '测试'][s]
  console.log(Object.assign(Object(), this.roles))
})

library_Valkyrie.once('login', function(data) {
  this.send(
    '1000,pack,1000,score2,1000,score,1000',
    () => document.querySelector('[command=skills]').click(), 1000,
    () => document.querySelector('[command=tasks]').click(), 1000,
    () => {
      if (document.querySelector('.right-bar').offsetWidth === 0) {
        document.querySelector('[command=showtool]').click()
      }
    }, 1000,
    () => {
      if (document.querySelector('.content-bottom').offsetHeight === 0) {
        document.querySelector('[command=showcombat]').click()
      }
    },
    () => document.querySelector('.dialog-close').click(),
  )
})

library_Valkyrie.on('login', function(data) {
  if (data.id) this.id = data.id
})

;// CONCATENATED MODULE: ./source/handler/type/state.js


library_Valkyrie.on('state', function(data) {
  delete data.desc
})

library_Valkyrie.on('state', function(data) {
  if (typeof data.state === 'string') {
    data.state = data.state.replace(/^你正在/, '')
    data.state = data.state.replace(/挖矿中$/, '挖矿')
    this.state = data.state
  } else {
    this.state = ''
  }
})

;// CONCATENATED MODULE: ./source/handler/type/combat.js


library_Valkyrie.on('combat', function(data) {
  this.state = (data.start === 1) ? '战斗' : (data.end === 1) ? '' : this.state
})

;// CONCATENATED MODULE: ./source/handler/type/die.js


library_Valkyrie.on('die', function(data) {
  this.state = data.relive ? '' : '死亡'
})

;// CONCATENATED MODULE: ./source/index.js


initUnsafeWindowTimeWorker()

document.addEventListener('DOMContentLoaded', function() {
  const url = GM_info.script.icon
  const element = document.createElement('link')
  element.setAttribute('type', 'image/x-icon')
  element.setAttribute('rel', 'shortcut icon')
  element.setAttribute('href', url)
  document.head.appendChild(element)
}, false)

GM_registerMenuCommand('GreasyFork Index', function() {
  window.open('https://greasyfork.org/scripts/422519')
})
GM_registerMenuCommand('Github Repo', function() {
  window.open('https://github.com/coderzhaoziwei/legend-of-valkyrie')
})

;





/******/ })()
;