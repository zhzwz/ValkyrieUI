import Valkyrie from '../../library/Valkyrie'

Valkyrie.on('itemremove', function(data) {
  if (typeof this.room.items instanceof Array) {
    const index = this.room.items.findIndex(item => item.id === data.id)
    if (index !== -1) {
      this.room.items.splice(index, 1)
    }
  }
})
