import Valkyrie from '../../library/Valkyrie'
import { hasOwnProperty } from '../../library/Common'

/* 玩家各项属性 */
Valkyrie.on('score', function(data) {
  if (!hasOwnProperty(data, 'id')) return
  if (data.id !== this.id) return

  Object.keys(data).forEach(key => this.prop[key] = data[key])
})
