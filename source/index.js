import './library/TimeWorker'

import './handler/type/roles'
import './handler/type/login'
import './handler/type/text'
import './handler/type/state'
import './handler/type/combat'
import './handler/type/die'
import './handler/type/room'
import './handler/type/exits'
import './handler/type/items'
import './handler/type/itemadd'
import './handler/type/itemremove'
import './handler/type/score'
import './handler/type/sc'
import './handler/type/pack'
import './handler/type/skills'


document.addEventListener('DOMContentLoaded', function() {
  const url = GM_info.script.icon
  const element = document.createElement('link')
  element.setAttribute('type', 'image/x-icon')
  element.setAttribute('rel', 'shortcut icon')
  element.setAttribute('href', url)
  document.head.appendChild(element)
}, false)

GM_registerMenuCommand('GreasyFork Index', function() {
  window.open('https://greasyfork.org/scripts/422519')
})
GM_registerMenuCommand('Github Repo', function() {
  window.open('https://github.com/coderzhaoziwei/legend-of-valkyrie')
})
