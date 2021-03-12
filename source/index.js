import app from './app'
import { addStyleByURL, on } from './common'
import { addStyle, appendElement } from './common'
import ValkyrieHTML from './html/valkyrie.html'
import MainCSS from './style/main.css'
import ChannelCSS from './style/channel.css'

/* 初始化 CSS */
addStyleByURL('https://cdn.jsdelivr.net/npm/element3@0.0.39/lib/theme-chalk/index.css')
addStyle(MainCSS)
addStyle(ChannelCSS)
/* 初始化 HTML */
appendElement(document.body, 'div', { id: 'valkyrie' })
appendElement(document.body, 'div', { class: 'valkyrie-sidebar', id: 'valkyrie-left' })
appendElement(document.body, 'div', { class: 'valkyrie-sidebar', id: 'valkyrie-right' })


document.querySelector('#valkyrie').innerHTML = ValkyrieHTML

/* 挂载 */
const valkyrie = app.use(Element3).mount('#valkyrie')

/* 监听 */
on('login', data => (valkyrie.id = data.id))
