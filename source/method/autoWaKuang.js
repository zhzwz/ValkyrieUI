export default function autoWaKuang() {
  return new Promise((resolve, reject) => {
    const token = `${new Date().toLocaleTimeString(`en-DE`)} 寻找铁镐`
    this.sendCommands(`stopstate,jh fam 0 start,go north,go west,pack,store,tm ${token}`)

    const id1 = this.on(`msg`, data => data.ch === `tm` && data.content === token && (() => {
      this.off(id1)
      // 装备
      const eq0 = (this.equipList[0] || {}).name || ``
      if (eq0.includes(`铁镐`)) {
        this.onText(`<hig>你已经装备了${eq0}。</hig>`)
        this.sendCommands(`stopstate,wakuang`)
        return resolve()
      }
      // 背包
      const item = this.packList.find(item => item.name.includes(`铁镐`))
      if (item) {
        this.onText(`<hig>你的背包中有${item.name}。</hig>`)
        this.sendCommands(`stopstate,wakuang`)
        return resolve()
      }
      // 仓库
      const store = this.storeList.find(item => item.name.includes(`铁镐`))
      if (store) {
        this.onText(`<hig>你的仓库中有${store.name}。</hig>`)
        this.sendCommands(`stopstate,qu 1 ${store.id},wakuang`)
        return resolve()
      }
      // 商店
      this.clearUpPackage().then(() => {
        const token2 = `${new Date().toLocaleTimeString(`en-DE`)} 购买铁镐`
        this.sendCommands(`stopstate,jh fam 0 start,go east,go east,go south,1000,list {npc:铁匠铺老板},tm ${token2}`)
        const id2 = this.on(`msg`, data => data.ch === `tm` && data.content === token2 && (() => {
          this.off(id2)

          const item = this.shopList.find(item => item.name.includes(`铁镐`))
          if (item) {
            this.sendCommands(`stopstate,buy 1 ${item.id} from ${this.shopId},wakuang`)
          }

        })())
      }).catch(() => {
        this.onText(`<hir>背包容量不足，无法购买铁镐。</hir>`)
        reject()
      })

    })())
  })
}
