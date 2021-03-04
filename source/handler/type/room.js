import Valkyrie from '../../library/Valkyrie'

Valkyrie.on('room', function(data) {
  let { name, path, desc, commands } = data
  /**
   * 新手教程中的椅子
   * desc: "房子中间有个桌子，几张<cmd cmd='look yizi'><hig>椅子</hig></cmd>。"
   * name: "新手-训练室"
   * path: "new/new1"
   */
  if (path === 'new/new1') {
    desc = desc.replace(`<cmd cmd='look yizi'><hig>椅子</hig></cmd>`, `<cmd cmd='look yizi,zuo2 yizi'>椅子</cmd>`)
  }
  /**
   * 兵营副本中的门
   * name: "兵营-兵营(副本区域)"
   * path: "yz/by/bingying"
   * desc: "南边有一个<CMD cmd='look men'>门(men)<CMD>。"
   */
  if (path === 'yz/by/bingying') {
    desc = desc.replace(`<CMD cmd='look men'>门(men)<CMD>`, `<cmd cmd="look men,open men">门</cmd>`)
  }
  /**
   * 古墓副本 画 古琴
   * name: "古墓派-卧室(副本区域)"
   * path: "gumu/woshi"
   * desc: "<cmd cmd='look chuang'>石床</cmd> <span cmd='look hua'>画</span>"
   *
   * name: "古墓派-琴室(副本区域)"
   * path: "gumu/qinshi"
   * desc: "<span cmd='look qin'>古琴</span>"
   */
  if (path === 'gumu/woshi' || path === 'gumu/qinshi') {
    desc = desc
      .replace(`<cmd cmd='look chuang'>石床</cmd>`, `<cmd cmd="look chuang,zuo chuang">石床</cmd>`)
      .replace(`<span cmd='look hua'>画</span>`, `<cmd cmd="look hua">画</cmd>`)
      .replace(`<span cmd='look qin'>古琴</span>`, `<cmd cmd="look qin,tan qin">古琴</cmd>`)
  }
  if (/cmd/.test(desc)) {
    console.log(desc)
    /* 统一用双引号 删除英文单词 */
    desc = desc.replace(/'/g, '"').replace(/\([A-Za-z]+?\)/g, '')

    const htmls = desc.match(/<cmd cmd="[^"]+?">[^<]+?<\/cmd>/g)
    htmls && htmls.forEach(html => {
      if (/<cmd cmd="([^"]+?)">([^<]+?)<\/cmd>/.test(html)) {
        commands.unshift({ cmd: RegExp.$1, name: `<hig>${ RegExp.$2 }</hig>` })
      }
    })
  }

  this.room = { name, path, desc, commands }
  data.desc = desc
  data.commands = commands
})


