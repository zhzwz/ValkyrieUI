import './init'
import app from './app'

const valkyrie = app.mount('.valkyrie')

// 登陆刷新数据
valkyrie.on('login', async function(data) {
  valkyrie.sendCommands('pack,score2,score')
  await valkyrie.wait(1000)
  document.querySelector('[command=skills]').click()
  await valkyrie.wait(1000)
  document.querySelector('[command=tasks]').click()
  await valkyrie.wait(1000)
  document.querySelector('.dialog-close').click()
  valkyrie.updateToolBar()
})

// 更新状态信息 | 销毁循环描述
valkyrie.on('state', data => {
  if (data.state) data.state = valkyrie.stateText
  delete data.desc
})

// 覆盖技能数据
valkyrie.on('skills', data => {
  if (common.hasOwn(data, 'items')) {
    data.items = valkyrie.skillList
  }
})
// 提示技能进度 | 同步潜能变化
valkyrie.on('skills', data => {
  const skill = Valkyrie.skill.list.find(skill => skill.id === data.id)
  if (skill && common.hasOwn(data, 'level')) {
    ValkyrieWorker.onText(`你的技能${ skill.name }提升到了<hiw>${ skill.level }</hiw>级！`)
  }
  if (skill && common.hasOwn(data, 'exp')) {
    switch (Valkyrie.state.text1) {
      case '练习':
        ValkyrieWorker.onText(`你练习${ skill.name }消耗了${ valkyrie.lxCost }点潜能。${ data.exp }%`)
        Valkyrie.state.text2 = skill.nameText
        Valkyrie.score.pot -= valkyrie.lxCost
        break
      case '学习':
        ValkyrieWorker.onText(`你学习${ skill.name }消耗了${ valkyrie.xxCost }点潜能。${ data.exp }%`)
        Valkyrie.state.text2 = skill.nameText
        Valkyrie.score.pot -= valkyrie.lxCost
        break
      case '炼药':
        ValkyrieWorker.onText(`你获得了炼药经验，${ skill.name }当前<hiw>${ skill.level }</hiw>级。${ data.exp }%`)
        break
    }
  }
  /* 潜能消耗＝等级平方差×技能颜色系数 */
  // const qnCost = (Math.pow(this.skillLimit, 2) - Math.pow(skill.level, 2)) * skill.k
  /* 秒数消耗＝潜能/每一跳的潜能/(每分钟秒数/每分钟五次) */
  // const time = qnCost / this.lxCost / ( 60 / 5)
  // const timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time/60)}小时${parseInt(time%60)}分钟`
  // 还需要${ timeString }消耗${ qn }点潜能到${ this.skillLimit }级。
})



valkyrie.on('text', data => {
  if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
    data.text = data.text.replace(/<.+?>/g, '')
  }
})

valkyrie.on('text', data => {
  const regexp = [
    /^<hiy>你的[\s\S]+等级提升了！<\/hiy>$/,
  ].find(regexp => regexp.test(data.text))
  if (regexp) delete data.type
})




// 销毁地图数据
valkyrie.on('map', data => {
  delete data.type
})
