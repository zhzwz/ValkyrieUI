import TimeWorkerContent from './TimeWorkerContent.js'

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
