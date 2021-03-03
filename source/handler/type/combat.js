import Valkyrie from '../../library/Valkyrie'

Valkyrie.on('combat', function(data) {
  this.state = (data.start === 1) ? '战斗' : (data.end === 1) ? '' : this.state
})
