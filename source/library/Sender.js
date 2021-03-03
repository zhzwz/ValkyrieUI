class Sender {
  constructor() {
    this.queue = []
    this.active = false
    this.action = undefined
  }
  push(args) {
    this.queue.push(...args)
    if (this.active === false) {
      this.active = true
      this.loop()
    }
  }
  loop() {
    const cmd = this.queue.splice(0, 1)[0]

    if (!this.active) {
      return
    } else if (!cmd) {
      this.active = false
      return
    } else if (!this.action) {
      console.log('Sender has been destroyed.')
      this.active = false
      this.queue.splice(0)
      return
    } else if (!isNaN(Number(cmd))) {
      console.log(`Sender will wait for ${ cmd }ms.`)
      setTimeout(() => this.loop(), Number(cmd))
      return
    } else if (typeof cmd === 'string') {
      console.log(`"${ cmd }"`)
    }

    this.action(cmd)
    setTimeout(() => this.loop(), 256)
  }
}

export default Sender
