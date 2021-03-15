import './init'
import app from './app'

const v = app.mount('.valkyrie')

valkyrie.on('login', async function(data) {
  await this.wait(256)

}.bind(valkyrie))

/* this.send(
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
  ) */
