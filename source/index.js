import './handler/type/roles'
import './handler/type/login'
import './handler/type/state'
import './handler/type/combat'
import './handler/type/die'

document.addEventListener('DOMContentLoaded', function() {
  const url = GM_info.script.icon
  const element = document.createElement('link')
  element.setAttribute('type', 'image/x-icon')
  element.setAttribute('rel', 'shortcut icon')
  element.setAttribute('href', url)
  document.head.appendChild(element)
}, false)

GM_registerMenuCommand('Greasy Fork', function() {
  window.open('https://greasyfork.org/scripts/422519')
})
GM_registerMenuCommand('Github ', function() {
  window.open('https://github.com/coderzhaoziwei/legend-of-valkyrie')
})
