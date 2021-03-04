// ==UserScript==
// @name         Legend of Valkyrie
// @namespace    com.coderzhaoziwei.valkyrie
// @version      0.0.129
// @author       Coder Zhao
// @description  《武神传说》浏览器脚本程序 | Valkyrie
// @modified     2021/3/4 17:44:23
// @license      MIT
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/legend-of-valkyrie/source/image/wakuang.png#12.7kb
// @supportURL   https://github.com/coderzhaoziwei/legend-of-valkyrie/issues
// @updateURL    https://github.com/coderzhaoziwei/legend-of-valkyrie/raw/main/bundle/valkyrie.min.user.js
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
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

(() => {
	"use strict";
const TimeWorkerContent = ("self.onmessage = function(event) {\n  const { type, counter, timeout, id } = event.data\n  if (type === 'setTimeout' || type === 'setInterval') {\n    const id = type === 'setTimeout'\n      ? setTimeout (() => self.postMessage({ type: 'setTimeout',  counter }), timeout)\n      : setInterval(() => self.postMessage({ type: 'setInterval', counter }), timeout)\n    self.postMessage({ type: 'set', counter, id })\n  } else if (type === 'clearTimeout' || type === 'clearInterval') {\n    if (type === 'clearTimeout') clearTimeout(id)\n    else if (type === 'clearInterval') clearInterval(id)\n    self.postMessage({ type: 'clear', counter })\n  }\n}\n");
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
/* 替换全局的四个时间方法 */
const worker = new TimeWorker()
const fns = ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval']
fns.forEach(fn => unsafeWindow[fn] = worker[fn].bind(worker));
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
const library_Sender = (Sender);
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
};
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
const library_EventEmitter = (EventEmitter);
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
const library_WebSocket = (WebSocket);
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
};
const Valkyrie = new Vue({
  data: {
    websocket: new library_WebSocket(),
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
const library_Valkyrie = (Valkyrie);
unsafeWindow.Valkyrie = Valkyrie;
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
});
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
const Cookie = ({
  getCookie,
  setCookie,
  deleteCookie,
});
library_Valkyrie.once('login', function(data) {
  const id = data.id
  const u = getCookie('u')
  const p = getCookie('p')
  const s = getCookie('s')
  /* 当创建新角色首次进入游戏时 roles[id] 为空 */
  if (this.roles[id] === undefined) {
    this.roles[id] = Object()
  }
  this.roles[id].cookie = { u, p, s }
  this.roles[id].server = ['一区', '二区', '三区', '四区', '测试'][s]
  console.log(Object.assign(Object(), this.roles))
  console.log(`Script: ${ GM_info.script.name } ${ GM_info.script.version }`)
  console.log(`UserAgent: ${ navigator.userAgent }`)
})
library_Valkyrie.once('login', function(data) {
  this.send(
    'pack,score2,score',
    () => document.querySelector('[command=skills]').click(),
    () => document.querySelector('[command=tasks]').click(),
    () => {
      if (document.querySelector('.right-bar').offsetWidth === 0) {
        document.querySelector('[command=showtool]').click()
      }
    },
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
});
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
});
library_Valkyrie.on('combat', function(data) {
  this.state = (data.start === 1) ? '战斗' : (data.end === 1) ? '' : this.state
});
library_Valkyrie.on('die', function(data) {
  this.state = data.relive ? '' : '死亡'
});
library_Valkyrie.on('room', function(data) {
  let { name, path, desc, commands } = data
  /**
   * 新手教程中的椅子
   * desc: "房子中间有个桌子，几张<cmd cmd='look yizi'><hig>椅子</hig></cmd>。"
   * name: "新手-训练室"
   * path: "new/new1"
   */
  if (path === 'new/new1') {
    desc = desc.replace(`<cmd cmd='look yizi'><hig>椅子</hig></cmd>`, `<cmd cmd='look yizi,zuo2 yizi'>椅子</cmd>`)
  }
  /**
   * 兵营副本中的门
   * name: "兵营-兵营(副本区域)"
   * path: "yz/by/bingying"
   * desc: "南边有一个<CMD cmd='look men'>门(men)<CMD>。"
   */
  if (path === 'yz/by/bingying') {
    desc = desc.replace(`<CMD cmd='look men'>门(men)<CMD>`, `<cmd cmd="look men,open men">门</cmd>`)
  }
  /**
   * 古墓副本 画 古琴
   * name: "古墓派-卧室(副本区域)"
   * path: "gumu/woshi"
   * desc: "<cmd cmd='look chuang'>石床</cmd> <span cmd='look hua'>画</span>"
   *
   * name: "古墓派-琴室(副本区域)"
   * path: "gumu/qinshi"
   * desc: "<span cmd='look qin'>古琴</span>"
   */
  if (path === 'gumu/woshi' || path === 'gumu/qinshi') {
    desc = desc
      .replace(`<cmd cmd='look chuang'>石床</cmd>`, `<cmd cmd="look chuang,zuo chuang">石床</cmd>`)
      .replace(`<span cmd='look hua'>画</span>`, `<cmd cmd="look hua">画</cmd>`)
      .replace(`<span cmd='look qin'>古琴</span>`, `<cmd cmd="look qin,tan qin">古琴</cmd>`)
  }
  if (/cmd/.test(desc)) {
    console.log(desc)
    /* 统一用双引号 删除英文单词 */
    desc = desc.replace(/'/g, '"').replace(/\([A-Za-z]+?\)/g, '')
    const htmls = desc.match(/<cmd cmd="[^"]+?">[^<]+?<\/cmd>/g)
    htmls && htmls.forEach(html => {
      if (/<cmd cmd="([^"]+?)">([^<]+?)<\/cmd>/.test(html)) {
        commands.unshift({ cmd: RegExp.$1, name: `<hig>${ RegExp.$2 }</hig>` })
      }
    })
  }
  this.room = { name, path, desc, commands }
  data.desc = desc
  data.commands = commands
});
library_Valkyrie.on('exits', function(data) {
  /* 初始化 */
  if (!this.room.exits) this.room.exits = Object()
  /* 清空 */
  Object.keys(this.room.exits).forEach(key => delete this.room.exits[key])
  /* 赋值 */
  if (typeof data.items !== 'object') return
  Object.keys(data.items).forEach(key => {
    const dir = key
    const name = data.items[dir]
    const command = `go ${dir}`
    this.room.exits[name] = { dir, command }
  })
});
class RoomItem {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.hp = data.hp || 0
    this.mp = data.mp || 0
    this.max_hp = data.max_hp || 0
    this.max_mp = data.max_mp || 0
    this.status = data.status || Array()
    this.p = data.p || 0
    this.isSelf = data.isSelf
  }
  get isPlayer() {
    return this.p === 1
  }
  get isOffline() {
    return this.name.includes('<red>&lt;断线中&gt;</red>')
  }
  get isNpc() {
    return !this.isPlayer
  }
  get index() {
    return this.isSelf ? 0
         : this.isNpc ? (this.color + 100)
         : this.isOffline ? (this.color + 300) : (this.color + 200)
  }
  get color() {
    const regexps = [/^<hir>/i, /^<hio>/i, /^<hiz>/i, /^<hic>/i, /^<hiy>/i, /^<hig>/i, /^<wht>/i, /\S/]
    return regexps.findIndex(regexp => regexp.test(this.name)) + 1
  }
}
const library_RoomItem = (RoomItem);
library_Valkyrie.on('items', function(data) {
  if (!this.room.items) this.room.items = Array()
  this.room.items.splice(0)
  const list = Array()
  if (data.items && data.items instanceof Array) {
    data.items.forEach(item => {
      if (item === 0 || typeof item !== 'object') return
      item.isSelf = item.id === this.id
      list.push(new library_RoomItem(item))
    })
  }
  list.sort((a, b) => a.index - b.index)
  data.items = list
  this.room.items.push(...list)
});
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
})();
