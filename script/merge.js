const fs = require('fs')

const header = fs.readFileSync('./bundle/header.js', 'utf8') + '\n\n'
const main = fs.readFileSync('./bundle/valkyrie.js', 'utf8')
.replace(/[\n]{2,}/g, '\n')
.replace(/\n;\/\/[\s\S]+?\n/g, ';\n')
.replace(/\/\*\*\*\*\*\*\/ /g, '')
.replace(/\/\* harmony default export \*\/ /g, '')
.replace(' // webpackBootstrap', '')
.replace('\nvar __webpack_exports__ = {};', '')
.replace(/\n;|;;/g, ';')

const min = fs.readFileSync('./bundle/valkyrie.min.js', 'utf8') + '\n'

fs.writeFileSync('./bundle/valkyrie.user.js', header + main)
fs.writeFileSync('./bundle/valkyrie.min.user.js', header + min)
