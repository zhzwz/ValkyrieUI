class RoomItem {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.hp = data.hp || 0
    this.mp = data.mp || 0
    this.max_hp = data.max_hp || 0
    this.max_mp = data.max_mp || 0

    this.status = data.status || Array()
    this.p = data.p || 0
    this.isSelf = data.isSelf
  }
  get isPlayer() {
    return this.p === 1
  }
  get isOffline() {
    return this.name.includes('<red>&lt;断线中&gt;</red>')
  }
  get isNpc() {
    return !this.isPlayer
  }
  get index() {
    return this.isSelf ? 0
         : this.isNpc ? (this.color + 100)
         : this.isOffline ? (this.color + 300) : (this.color + 200)
  }
  get color() {
    const regexps = [/^<hir>/i, /^<hio>/i, /^<hiz>/i, /^<hic>/i, /^<hiy>/i, /^<hig>/i, /^<wht>/i, /\S/]
    return regexps.findIndex(regexp => regexp.test(this.name)) + 1
  }
}

export default RoomItem
