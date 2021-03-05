import Valkyrie from '../../library/Valkyrie'
import { hasOwnProperty, isValidArray } from '../../library/Common'
import PackItem from '../../library/PackItem'

/* 金钱数值 */
Valkyrie.on('pack', function(data) {
  if (!hasOwnProperty(data, 'money')) return
  this.packMoney = Number(data.money) || 0
})

/* 背包上限 */
Valkyrie.on('pack', function(data) {
  if (!hasOwnProperty(data, 'max_item_count')) return
  this.packLimit = Number(data.max_item_count) || 0
})

/* 物品列表 */
Valkyrie.on('pack', function(data) {
  if (!hasOwnProperty(data, 'items')) return
  if (!isValidArray(data.items)) return

  const packList = Array()
  data.items.forEach(item => packList.push(new PackItem(item)))
  data.items = packList.sort((x, y) => y.order - x.order)

  this.packList.splice(0)
  this.packList.push(...packList)
  this.packCount = packList.length
})

/* 装备列表 */
Valkyrie.on('pack', function(data) {
  if (!hasOwnProperty(data, 'eqs')) return
  if (!isValidArray(data.eqs)) return

  this.equipList.splice(0)
  this.equipList.push(...data.eqs)
})

// {type: "dialog", dialog: "pack", id: "c7mj3f552d3", eq: 3}
