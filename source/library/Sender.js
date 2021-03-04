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

export default Sender

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
