import Valkyrie from '../../library/Valkyrie'
import { getCookie } from '../../library/Cookie'

Valkyrie.once('login', function(data) {
  const id = data.id
  const u = getCookie('u')
  const p = getCookie('p')
  const s = getCookie('s')
  /* 当创建新角色首次进入游戏时 roles[id] 为空 */
  if (this.roles[id] === undefined) {
    this.roles[id] = Object()
  }
  this.roles[id].cookie = { u, p, s }
  this.roles[id].server = ['一区', '二区', '三区', '四区', '测试'][s]
  console.log(Object.assign(Object(), this.roles))
  console.log(`Script: ${ GM_info.script.name } ${ GM_info.script.version }`)
  console.log(`UserAgent: ${ navigator.userAgent }`)
})

Valkyrie.once('login', function(data) {
  this.send(
    'pack,score2,score',
    () => document.querySelector('[command=skills]').click(),
    () => document.querySelector('[command=tasks]').click(),
    () => {
      if (document.querySelector('.right-bar').offsetWidth === 0) {
        document.querySelector('[command=showtool]').click()
      }
    },
    () => {
      if (document.querySelector('.content-bottom').offsetHeight === 0) {
        document.querySelector('[command=showcombat]').click()
      }
    },
    () => document.querySelector('.dialog-close').click(),
  )
})

Valkyrie.on('login', function(data) {
  if (data.id) this.id = data.id
})
