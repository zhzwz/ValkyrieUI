// ==UserScript==
// @name         Legend of Valkyrie
// @namespace    com.coderzhaoziwei.valkyrie
// @version      0.0.72
// @author       Coder Zhao
// @description  《武神传说》浏览器脚本程序 | Valkyrie
// @modified     2021/3/3 17:26:45
// @license      MIT
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/legend-of-valkyrie/source/image/wakuang.png#12.7kb
// @homepage     https://greasyfork.org/scripts/422519
// @supportURL   https://github.com/coderzhaoziwei/legend-of-valkyrie/issues
// @updateURL    https://github.com/coderzhaoziwei/legend-of-valkyrie/raw/main/bundle/valkyrie.min.user.js
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// ==/UserScript==

(()=>{"use strict";const e=new Vue({data:{websocket:new class{constructor(){this.ws=void 0,this.wsOnMessage=void 0,this.eventEmitter=new class{constructor(){this.counter=Number(),this.container=Object(),this.listeners=Array()}on(e,t,n=!1){if("string"!=typeof e)throw new TypeError;if("function"!=typeof t)throw new TypeError;const o=++this.counter;return this.container[e]=this.container[e]||Array(),this.container[e].push(o),this.listeners[o]={counter:o,name:e,handler:t,once:n},o}once(e,t){return this.on(e,t,!0)}off(e){const t=this.listeners[e].name,n=this.container[t].indexOf(e);delete this.container[t][n],delete this.listeners[e]}emit(e,...t){const n=this.container[e];n instanceof Array&&n.forEach((e=>{const{handler:n,once:o}=this.listeners[e];"function"==typeof n&&n(...t),!0===o&&this.off(e)}))}},this.init()}init(){console.log("WebSocket: init");const e=this;if(!window.WebSocket)throw new Error("WebSocket is undefined.");unsafeWindow.WebSocket=function(t){e.ws=new window.WebSocket(t)},unsafeWindow.WebSocket.prototype={set onopen(t){console.log("WebSocket: set onopen"),e.ws.onopen=t},set onclose(t){console.log("WebSocket: set onclose"),e.ws.onclose=t},set onerror(t){console.log("WebSocket: set onerror"),e.ws.onerror=t},set onmessage(t){console.log("WebSocket: set onmessage"),e.wsOnMessage=t,e.ws.onmessage=t=>e.onMessage(t)},get readyState(){const t=e.ws.readyState;return 1!==t&&console.log(`WebSocket: get readyState => ${t}`),t},send:t=>e.onSend(t)}}onMessage(e){const t=function(e){const t=e.data;return"{"===t[0]?new Function(`return ${t};`)():{type:"text",text:t}}(e);this.onData(t)}onData(e){console.log(e),this.eventEmitter.emit(e.type,e);const t=function(e){return"text"===e.type&&"string"==typeof e.text?{data:e.text}:{data:JSON.stringify(e)}}(e);this.ws&&this.wsOnMessage&&this.wsOnMessage(t)}onSend(e){console.log(e),this.ws.send(e)}},roles:Object(),id:String(),state:String()},computed:{role(){const e=this.id,t=this.roles[e],n=Boolean(e)&&"string"==typeof e,o=Boolean(t)&&"object"==typeof t;if(n&&o)return t},name(){return this.role?this.role.name:GM_info.script.name},server(){return this.role?this.role.server:GM_info.script.version},documentTitle(){return`${this.name} ${this.state} ${this.server}`.trim()}},watch:{documentTitle(e){document.title=e}},methods:{on(e,t){return this.websocket.eventEmitter.on(e,t.bind(this))},once(e,t){return this.websocket.eventEmitter.once(e,t.bind(this))},off(e){this.websocket.eventEmitter.off(e)},send(e){this.websocket.onSend(e)},wait:e=>new Promise((t=>setTimeout((()=>t()),e)))}}),t=e;unsafeWindow.Valkyrie=e,t.on("roles",(function(e){e.roles instanceof Array&&e.roles.forEach((e=>{const{name:t,title:n,id:o}=e;this.roles[o]=this.roles[o]||Object(),this.roles[o].name=t,this.roles[o].title=n})),console.log(Object.assign(Object(),this.roles))}));const n=function(e){return document.cookie.split(";").reduce(((e,t)=>{const n=t.indexOf("="),o=t.substr(0,n).trim(),s=t.substr(n+1);return e[o]=s,e}),{})[e]};t.once("login",(function(e){const t=e.id,o=n("u"),s=n("p"),i=n("s");this.roles[t].cookie={u:o,p:s,s:i},this.roles[t].server=["一区","二区","三区","四区","测试"][i],console.log(Object.assign(Object(),this.roles))})),t.once("login",(function(e){this.send("greet master"),document.querySelector("[command=skills]").click()})),t.on("login",(function(e){e.id&&(this.id=e.id)})),t.on("state",(function(e){delete e.desc})),t.on("state",(function(e){"string"==typeof e.state?(e.state=e.state.replace(/^你正在/,""),e.state=e.state.replace(/挖矿中$/,"挖矿"),this.state=e.state):this.state=""})),t.on("combat",(function(e){this.state=1===e.start?"战斗":1===e.end?"":this.state})),t.on("die",(function(e){this.state=e.relive?"":"死亡"})),document.addEventListener("DOMContentLoaded",(function(){const e=GM_info.script.icon,t=document.createElement("link");t.setAttribute("type","image/x-icon"),t.setAttribute("rel","shortcut icon"),t.setAttribute("href",e),document.head.appendChild(t)}),!1),GM_registerMenuCommand("Greasy Fork",(function(){window.open("https://greasyfork.org/scripts/422519")})),GM_registerMenuCommand("Github ",(function(){window.open("https://github.com/coderzhaoziwei/legend-of-valkyrie")}))})();