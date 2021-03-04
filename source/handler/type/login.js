import Valkyrie from '../../library/Valkyrie'
import { getCookie } from '../../library/Cookie'

Valkyrie.once('login', function(data) {
  const id = data.id
  const u = getCookie('u')
  const p = getCookie('p')
  const s = getCookie('s')
  this.roles[id].cookie = { u, p, s }
  this.roles[id].server = ['一区', '二区', '三区', '四区', '测试'][s]
  console.log(Object.assign(Object(), this.roles))
})

Valkyrie.once('login', function(data) {
  this.send(
    '1000,pack,1000,score2,1000,score,1000',
    () => document.querySelector('[command=skills]').click(), 1000,
    () => document.querySelector('[command=tasks]').click(), 1000,
    () => {
      if (document.querySelector('.right-bar').offsetWidth === 0) {
        document.querySelector('[command=showtool]').click()
      }
    }, 1000,
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
