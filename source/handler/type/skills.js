import Valkyrie from '../../library/Valkyrie'
import { hasOwnProperty, isValidArray } from '../../library/Common'
import SkillItem from '../../library/SkillItem'

/* 技能列表 */
Valkyrie.on('skills', function(data) {
  if (!hasOwnProperty(data, 'items')) return
  if (!isValidArray(data.items)) return

  const skillList = Array()
  data.items.forEach(item => skillList.push(new SkillItem(item)))
  data.items = skillList.sort((x, y) => y.order - x.order)

  this.skillList.splice(0)
  this.skillList.push(...skillList)
})

/* 技能等级上限 */
Valkyrie.on('skills', function(data) {
  if (!hasOwnProperty(data, 'limit')) return
  this.skillLimit = Number(data.limit)
})

/* 潜能值 */
Valkyrie.on('skills', function(data) {
  if (!hasOwnProperty(data, 'pot')) return
  this.prop.pot = data.pot
})

/* 新技能 */
Valkyrie.on('skills', function(data) {
  if (!hasOwnProperty(data, 'item')) return
  const skill = new SkillItem(data.item)
  this.skillList.push(skill)
})

/* 单个技能经验变动 */
Valkyrie.on('skills', function(data) {
  if (!hasOwnProperty(data, 'id')) return
  const skill = this.skillList.find(skill => skill.id === data.id)
  if (skill === undefined) return /* 未找到指定技能 */

  if (hasOwnProperty(data, 'level')) {
    skill.level = Number(data.level)
    this.onText(`你的技能${ skill.name }提升到了<hiw>${ skill.level }</hiw>级！`)
  }

  if (!hasOwnProperty(data, 'exp')) return
  skill.exp = data.exp

  /* 练习状态 */
  if (this.state.includes('练习')) {
    this.onText(`你练习${ skill.name }消耗了${ this.lxCost }点潜能。${ skill.exp }%`)
    /* 潜能消耗＝等级平方差×技能颜色系数 */
    // const qnCost = (Math.pow(this.skillLimit, 2) - Math.pow(skill.level, 2)) * skill.k
    /* 秒数消耗＝潜能/每一跳的潜能/(每分钟秒数/每分钟五次) */
    // const time = qnCost / this.lxCost / ( 60 / 5)
    // const timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time/60)}小时${parseInt(time%60)}分钟`
    // 还需要${ timeString }消耗${ qn }点潜能到${ this.skillLimit }级。
  } else if (this.state.includes('学习')) {
    this.onText(`你学习${ skill.name }消耗了${ this.xxCost }点潜能。${ skill.exp }%`)
  } else if (this.state.includes('炼药')) {
    this.onText(`你获得了炼药经验，${ skill.name }当前<hiw>${ skill.level }</hiw>级。${ skill.exp }%`)
  }
})

// if (data.hasOwnProperty('exp')) {
//   // const qn = (Math.pow(this.skillLimit, 2) - Math.pow(skill.level, 2)) * k // 需要的总潜能

//   if (this.state === '练习') {

//   } else if (this.state === '学习') {
//     // 学习每一跳的消耗公式＝（先天悟性＋后天悟性）×（1＋学习效率%－先天悟性%）× 3
//     const cost = (this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3
//     this.onData()
//   } else if (this.state === '炼药') {
//     this.onData(``)
//   }
// }
