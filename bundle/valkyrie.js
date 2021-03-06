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

/* 替换全局的四个时间方法 */
const worker = new TimeWorker()
const fns = ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval']
fns.forEach(fn => unsafeWindow[fn] = worker[fn].bind(worker))

;// CONCATENATED MODULE: ./source/html/main.html
/* harmony default export */ const main = ("<div>{{ name }}</div>\n\n<teleport to=\"#sidebar\">\n  <div>{{ server }}</div>\n</teleport>\n");
;// CONCATENATED MODULE: ./source/library/Common.js
const Common_hasOwnProperty = function(object, name) {
  return Object.prototype.hasOwnProperty.call(object, name)
}
const isArray = function(any) {
  return any instanceof Array
}
const isValidArray = function(any) {
  return isArray(any) && (any.length > 0)
}

function isValidString(any) {
  const isString = typeof any === 'string'
  const nonEmpty = any !== ''
  return isString && nonEmpty
}

const getColorIndexWithName = function(name) {
  const index = [
    /^<wht>/i,
    /^<hig>/i,
    /^<hiy>/i,
    /^<hic>/i,
    /^<hiz>/i,
    /^<hio>/i,
    /^<(hir|ord)>/i,
  ].findIndex(regexp => regexp.test(name))
  /* 以 <***> 开头但是判断不出颜色 */
  if (index === -1 && /^<...>/i.test(name)) {
    console.error(name)
  }
  return index + 1
}



const createDivById = function(id) {
  const element = document.createElement('div')
  element.setAttribute('id', id)
  return element
}

;// CONCATENATED MODULE: ./source/index.js







document.addEventListener('DOMContentLoaded', function() {
  /* 初始化 HTML 元素 */
  const mainDiv = createDivById('valkyrie')
  mainDiv.innerHTML = main
  document.body.append(mainDiv)

  const sidebarDiv = createDivById('sidebar')
  document.body.append(sidebarDiv)

  /* 挂载 Vue 实例 */
  const Valkyrie = app.mount('#valkyrie')
  unsafeWindow.Valkyrie = Valkyrie

  // import './handler/type/roles'
  // import './handler/type/login'
  // import './handler/type/text'
  // import './handler/type/state'
  // import './handler/type/combat'
  // import './handler/type/die'
  // import './handler/type/room'
  // import './handler/type/exits'
  // import './handler/type/items'
  // import './handler/type/itemadd'
  // import './handler/type/itemremove'
  // import './handler/type/score'
  // import './handler/type/sc'
  // import './handler/type/pack'
  // import './handler/type/skills'
}, false)

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

/******/ })()
;