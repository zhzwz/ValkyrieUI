import { getColorIndexWithName } from './Common'

class SkillItem {
  constructor(data) {
    this.id = data.id
    this.name = data.name

    this.level = Number(data.level)
    this.exp = Number(data.exp)
  }
  /* 技能颜色阶级 */
  get color() {
    return getColorIndexWithName(this.name)
  }
  /* 技能颜色系数 */
  get k() {
    return this.color * 2.5
  }

  get order() {
    if (this.color === 1) {

    }

    return this.color
  }
}

export default SkillItem
