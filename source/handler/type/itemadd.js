import Valkyrie from '../../library/Valkyrie'
import RoomItem from '../../library/RoomItem'

Valkyrie.on('itemadd', function(data) {
  const item = new RoomItem(data)
  this.room.items.push(item)
})
