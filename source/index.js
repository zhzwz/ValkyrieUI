import './init'
import app from './app'

const valkyrie = app.mount('.valkyrie')

valkyrie.on('login', async function(data) {
  valkyrie.sendCommands('pack,score2,score')
  await valkyrie.wait(1000)
  document.querySelector('[command=skills]').click()
  await valkyrie.wait(1000)
  document.querySelector('[command=tasks]').click()
  await valkyrie.wait(1000)
  document.querySelector('.dialog-close').click()
  valkyrie.openToolBar()
})

// 替换状态文本
valkyrie.on('state', data => data.state && (data.state = valkyrie.stateText))
// 销毁地图数据
valkyrie.on('map', data => delete data.type)
