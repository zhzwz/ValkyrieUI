// 整理背包
export default function clearUpPackage() {
  return new Promise((resolve, reject) => {

    this.sendCommands(`stopstate,jh fam 0 start,go north,go west,pack,store`)

    const token = `${new Date().toLocaleTimeString('en-DE')} 整理背包`

    // 仓库数据监控
    const id1 = this.on('list', data => this.hasOwn(data, 'stores') && (() => {
      this.off(id1)
      this.storeList.forEach(store => {
        const item = this.packList.find(pack => pack.name === store.name)
        if (item) this.sendCommands(`store ${item.count} ${item.id}`)
      })
      this.sendCommands(`jh fam 0 start,go south,go east,sell all,pack,1000,tm ${token}`)
    })())

    // 背包容量检测
    const id2 = this.on('msg', data => data.ch === 'tm' && data.content === token && (() => {
      this.off(id2)

      if (this.packCount < this.packLimit) {
        resolve()
        this.onText(`<hig>整理背包完毕。</hig><hic>[${this.packCount}/${this.packLimit}]</hic>`)
      } else {
        reject()
        this.onText(`<hig>整理背包完毕。</hig><hir>[${this.packCount}/${this.packLimit}]</hir>`)
      }
    })())

  })
}
