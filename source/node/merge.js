const fs = require('fs')

const header = fs.readFileSync('./bundle/header.js', 'utf8')
const main = fs.readFileSync('./bundle/valkyrie.js', 'utf8')
const min = fs.readFileSync('./bundle/valkyrie.min.js', 'utf8')

fs.writeFileSync('./bundle/valkyrie.user.js', header + main)
fs.writeFileSync('./bundle/valkyrie.min.user.js', header + min)
