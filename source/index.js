import app from "./app"

import "./style/el-input.css"
import "./style/el-popper.css"
import "./style/el-select.css"
import "./style/el-tooltip.css"
import "./style/el-checkbox.css"
import "./style/el-dialog.css"

import "./style/v-task.css"
import "./style/v-score.css"
import "./style/v-header.css"
import "./style/v-sidebar.css"
import "./style/v-channel.css"
import "./style/v-background.css"
import "./style/v-button.css"
import "./style/v-onekey.css"


import "./style/transition.css"

import "./style/game.css"
import "./style/init.css"

const valkyrie = app.mount('.valkyrie')

// 登录后获取角色数据，调整工具栏显示。
valkyrie.on('login', async function(data) {
  this.sendCommands('pack,score2,score')
  await this.wait(1000)
  document.querySelector('[command=skills]').click()
  await this.wait(1000)
  document.querySelector('[command=tasks]').click()
  await this.wait(1000)
  document.querySelector('.dialog-close').click()
  this.updateToolBar()
})

// 因为重写了地图弹窗，所以此处销毁地图数据。
valkyrie.on('map', data => delete data.type)
