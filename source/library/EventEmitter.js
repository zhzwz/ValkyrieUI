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

export default EventEmitter
