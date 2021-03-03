self.onmessage = function(event) {
  const { type, counter, timeout, id } = event.data
  if (type === 'setTimeout' || type === 'setInterval') {
    const id = type === 'setTimeout'
      ? setTimeout (() => self.postMessage({ type: 'setTimeout',  counter }), timeout)
      : setInterval(() => self.postMessage({ type: 'setInterval', counter }), timeout)
    self.postMessage({ type: 'set', counter, id })
  } else if (type === 'clearTimeout' || type === 'clearInterval') {
    if (type === 'clearTimeout') clearTimeout(id)
    else if (type === 'clearInterval') clearInterval(id)
    self.postMessage({ type: 'clear', counter })
  }
}
