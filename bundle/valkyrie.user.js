// ==UserScript==
// @name         Legend of Valkyrie
// @namespace    com.coderzhaoziwei.valkyrie
// @version      0.0.71
// @author       Coder Zhao
// @description  《武神传说》浏览器脚本程序 | Valkyrie
// @modified     2021/3/3 17:18:34
// @license      MIT
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/legend-of-valkyrie/source/image/wakuang.png#12.7kb
// @homepage     https://greasyfork.org/scripts/422519
// @supportURL   https://github.com/coderzhaoziwei/legend-of-valkyrie/issues
// @updateURL    https://github.com/coderzhaoziwei/legend-of-valkyrie/raw/main/bundle/legend_of_valkyrie.user.js
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

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
    this.eventEmitter = new library_EventEmitter()
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

/* harmony default export */ const library_WebSocket = (WebSocket);

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
    send(command) {
      this.websocket.onSend(command)
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
  this.send('greet master')
  document.querySelector('[command=skills]').click()
})

library_Valkyrie.on('login', function(data) {
  if (data.id) this.id = data.id
})

/**
 * // this.send(["greet master", "pack", "score2", "score"]);//自动请安师傅

  // await this.wait(256)
  $('[command=skills]').click()
  // document.querySelector('[command=skills]').click()

  // await this.wait(256)
  // $('[command=tasks]').click()
  // if (!unsafeWindow.WG) {
  //   await this.wait(256)
  //   $('[command=showtool]').click()
  //   await this.wait(256)
  //   $('[command=showcombat]').click()
  // }
  // await this.wait(256)
  // $('.dialog-close').click()
 */

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






document.addEventListener('DOMContentLoaded', function() {
  const url = GM_info.script.icon
  const element = document.createElement('link')
  element.setAttribute('type', 'image/x-icon')
  element.setAttribute('rel', 'shortcut icon')
  element.setAttribute('href', url)
  document.head.appendChild(element)
}, false)

GM_registerMenuCommand('Greasy Fork', function() {
  window.open('https://greasyfork.org/scripts/422519')
})
GM_registerMenuCommand('Github ', function() {
  window.open('https://github.com/coderzhaoziwei/legend-of-valkyrie')
})

/******/ })()
;