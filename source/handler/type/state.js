import Valkyrie from '../../library/Valkyrie'

Valkyrie.on('state', function(data) {
  delete data.desc
})

Valkyrie.on('state', function(data) {
  if (typeof data.state === 'string') {
    data.state = data.state.replace(/^你正在/, '')
    data.state = data.state.replace(/挖矿中$/, '挖矿')
    this.state = data.state
  } else {
    this.state = ''
  }
})
