import Valkyrie from '../../library/Valkyrie'
import RoomItem from '../../library/RoomItem'

Valkyrie.on('items', function(data) {
  if (!this.room.items) this.room.items = Array()
  this.room.items.splice(0)

  const list = Array()
  if (data.items && data.items instanceof Array) {
    data.items.forEach(item => {
      if (item === 0 || typeof item !== 'object') return
      item.isSelf = item.id === this.id
      list.push(new RoomItem(item))
    })
  }
  list.sort((a, b) => a.index - b.index)
  data.items = list
  this.room.items.push(...list)
})
