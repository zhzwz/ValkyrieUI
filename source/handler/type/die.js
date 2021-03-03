import Valkyrie from '../../library/Valkyrie'

Valkyrie.on('die', function(data) {
  this.state = data.relive ? '' : '死亡'
})
