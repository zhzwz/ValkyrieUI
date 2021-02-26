export default class EventEmitter {
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
