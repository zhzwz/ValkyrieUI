import { getColorIndexWithName } from './Common'


class PackItem {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.count = data.count

  }
  get order() {
    return this.color
  }
  get color() {
    return getColorIndexWithName(this.name)
  }
}

export default PackItem
