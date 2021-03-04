import Valkyrie from '../../library/Valkyrie'

Valkyrie.on('exits', function(data) {
  /* 初始化 */
  if (!this.room.exits) this.room.exits = Object()
  /* 清空 */
  Object.keys(this.room.exits).forEach(key => delete this.room.exits[key])
  /* 赋值 */
  if (typeof data.items !== 'object') return
  Object.keys(data.items).forEach(key => {
    const dir = key
    const name = data.items[dir]
    const command = `go ${dir}`
    this.room.exits[name] = { dir, command }
  })
})
