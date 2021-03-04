import Valkyrie from '../../library/Valkyrie'

Valkyrie.on('score', function(data) {
  if (data.id === this.id) {
    Object.keys(data).forEach(key => this.prop[key] = data[key])
  }
})
