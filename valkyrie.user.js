// ==UserScript==
// @name         Legend of Valkyrie
// @namespace    com.coderzhaoziwei.valkyrie
// @version      0.0.17
// @author       Coder Zhao
// @description  《武神传说》脚本
// @modified     2021/2/26 16:06:37
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/000000
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/legend-of-valkyrie/source/images/icon.png#12.7kb
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
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./source/emitter.js
class EventEmitter {
  constructor() {
    this.handlers = Object()
  }
  on(type, handler) {
    if (!this.isRegistered(type)) this.handlers[type] = Array()
    this.handlers[type].push(handler)
  }
  off(type, handler) {
    if (this.isRegistered(type) && handler === undefined) {
      delete this.handlers[type]
    } else if (this.isRegistered(type)) {
      const index = this.handlers[type].findIndex(item => item === handler)
      if (index >= 0) this.handlers[type].splice(index, 1)
    }
  }
  emit(type, ...args) {
    if (this.isRegistered(type)) {
      this.handlers[type].forEach(handler => handler(...args))

      const count = this.handlers[type].length
      if (count === 0) this.off(type)
    }
  }
  isRegistered(type) {
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(this.handlers, type)
    const isArray = this.handlers[type] instanceof Array
    return hasOwnProperty && isArray
  }
}

;// CONCATENATED MODULE: ./source/websocket.js


class WebSocketInstance {
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

;// CONCATENATED MODULE: ./source/valkyrie.js


/* harmony default export */ const valkyrie = (new Vue({
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
}));

;// CONCATENATED MODULE: ./source/index.js


valkyrie.on('send', function(data) {
  console.log(data.command)
})

valkyrie.on('roles', function(data) {
  console.log(data)
})

/******/ })()
;