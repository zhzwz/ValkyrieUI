import Valkyrie from '../../library/Valkyrie'

/* 气血/内力的数值更新 */
Valkyrie.on('sc', function(data) {
  if (data.id === this.id) {
    this.prop.hp = data.hp || this.prop.hp
    this.prop.mp = data.mp || this.prop.mp
    this.prop.max_hp = data.max_hp || this.prop.max_hp
    this.prop.max_mp = data.max_mp || this.prop.max_mp
  }
  if (this.room.items instanceof Array) {
    const index = this.room.items.findIndex(item => item.id === data.id)
    if (index === -1) return
    if (Object.hasOwnProperty('hp').call(data)) this.room.items[index].hp = data.hp
    if (Object.hasOwnProperty('mp').call(data)) this.room.items[index].mp = data.mp
    if (Object.hasOwnProperty('max_hp').call(data)) this.room.items[index].max_hp = data.max_hp
    if (Object.hasOwnProperty('max_mp').call(data)) this.room.items[index].max_mp = data.max_mp
  }
})
