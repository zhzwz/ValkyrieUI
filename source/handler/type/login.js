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
  this.send('greet master')
  document.querySelector('[command=skills]').click()
})

Valkyrie.on('login', function(data) {
  if (data.id) this.id = data.id
})

/**
 * // this.send(["greet master", "pack", "score2", "score"]);//自动请安师傅

  // await this.wait(256)
  $('[command=skills]').click()
  // document.querySelector('[command=skills]').click()

  // await this.wait(256)
  // $('[command=tasks]').click()
  // if (!unsafeWindow.WG) {
  //   await this.wait(256)
  //   $('[command=showtool]').click()
  //   await this.wait(256)
  //   $('[command=showcombat]').click()
  // }
  // await this.wait(256)
  // $('.dialog-close').click()
 */
