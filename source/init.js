import rootCSS from './style/root.css'
import elementCSS from './style/element.css'

import fontCSS from './style/v-font.css'
import scoreCSS from './style/v-score.css'
import headerCSS from './style/v-header.css'
import sidebarCSS from './style/v-sidebar.css'
import channelCSS from './style/v-channel.css'
import backgroundCSS from './style/v-background.css'

import LeftHTML from './html/sidebar-left.html'
import RightHTML from './html/sidebar-right.html'
import RoomTitleHTML from './html/game-room-title.html'

const head = document.head
const body = document.body
const setAttribute = common.setAttribute
const appendElement = common.appendElement

/* HTML */
appendElement(body, 'div', { class: 'valkyrie' })
appendElement(body, 'div', { class: 'v-background' })
appendElement(body, 'div', { class: 'v-sidebar v-sidebar-left' })
appendElement(body, 'div', { class: 'v-sidebar v-sidebar-right' })

setAttribute('.room-title', { class: 'v-room-title v-header', innerHTML: '' })
setAttribute('li.panel_item.active', { class: 'panel_item active v-header v-font' })
setAttribute('.room_exits', { class: 'room_exits v-unselectable' })
// setAttribute('.content-bottom', { class: 'content-bottom v-unselectable' })


const ValkyrieHTML = LeftHTML + RightHTML + RoomTitleHTML
setAttribute('.valkyrie', { innerHTML: ValkyrieHTML })


appendElement(head, 'link', { rel: 'preconnect', href: 'https://fonts.gstatic.com' })
appendElement(head, 'link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap' })
appendElement(head, 'link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/element3@0.0.39/lib/theme-chalk/index.css' })


appendElement(head, 'style', { id: 'style-root', innerHTML: rootCSS })
appendElement(head, 'style', { id: 'style-element', innerHTML: elementCSS })

appendElement(head, 'style', { id: 'style-v-font', innerHTML: fontCSS })
appendElement(head, 'style', { id: 'style-v-score', innerHTML: scoreCSS })
appendElement(head, 'style', { id: 'style-v-header', innerHTML: headerCSS })
appendElement(head, 'style', { id: 'style-v-sidebar', innerHTML: sidebarCSS })
appendElement(head, 'style', { id: 'style-v-channel', innerHTML: channelCSS })
appendElement(head, 'style', { id: 'style-v-background', innerHTML: backgroundCSS })
