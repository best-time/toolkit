!function(e){function t(i){if(s[i])return s[i].exports;var o=s[i]={exports:{},id:i,loaded:!1};return e[i].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var s={};return t.m=e,t.c=s,t.p="/dist/",t(0)}([function(e,t,s){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}var o=s(27),r=i(o);Vue.config.debug=!0,new Vue(r["default"])},function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var s=this[t];s[2]?e.push("@media "+s[2]+"{"+s[1]+"}"):e.push(s[1])}return e.join("")},e.i=function(t,s){"string"==typeof t&&(t=[[null,t,""]]);for(var i={},o=0;o<this.length;o++){var r=this[o][0];"number"==typeof r&&(i[r]=!0)}for(o=0;o<t.length;o++){var a=t[o];"number"==typeof a[0]&&i[a[0]]||(s&&!a[2]?a[2]=s:s&&(a[2]="("+a[2]+") and ("+s+")"),e.push(a))}},e}},function(e,t,s){function i(e,t){for(var s=0;s<e.length;s++){var i=e[s],o=d[i.id];if(o){o.refs++;for(var r=0;r<o.parts.length;r++)o.parts[r](i.parts[r]);for(;r<i.parts.length;r++)o.parts.push(n(i.parts[r],t))}else{for(var a=[],r=0;r<i.parts.length;r++)a.push(n(i.parts[r],t));d[i.id]={id:i.id,refs:1,parts:a}}}}function o(e){for(var t=[],s={},i=0;i<e.length;i++){var o=e[i],r=o[0],a=o[1],n=o[2],l=o[3],c={css:a,media:n,sourceMap:l};s[r]?s[r].parts.push(c):t.push(s[r]={id:r,parts:[c]})}return t}function r(){var e=document.createElement("style"),t=A();return e.type="text/css",t.appendChild(e),e}function a(){var e=document.createElement("link"),t=A();return e.rel="stylesheet",t.appendChild(e),e}function n(e,t){var s,i,o;if(t.singleton){var n=g++;s=m||(m=r()),i=l.bind(null,s,n,!1),o=l.bind(null,s,n,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(s=a(),i=u.bind(null,s),o=function(){s.parentNode.removeChild(s),s.href&&URL.revokeObjectURL(s.href)}):(s=r(),i=c.bind(null,s),o=function(){s.parentNode.removeChild(s)});return i(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;i(e=t)}else o()}}function l(e,t,s,i){var o=s?"":i.css;if(e.styleSheet)e.styleSheet.cssText=h(t,o);else{var r=document.createTextNode(o),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(r,a[t]):e.appendChild(r)}}function c(e,t){var s=t.css,i=t.media;t.sourceMap;if(i&&e.setAttribute("media",i),e.styleSheet)e.styleSheet.cssText=s;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(s))}}function u(e,t){var s=t.css,i=(t.media,t.sourceMap);i&&(s+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var o=new Blob([s],{type:"text/css"}),r=e.href;e.href=URL.createObjectURL(o),r&&URL.revokeObjectURL(r)}var d={},p=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},f=p(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),A=p(function(){return document.head||document.getElementsByTagName("head")[0]}),m=null,g=0;e.exports=function(e,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=f());var s=o(e);return i(s,t),function(e){for(var r=[],a=0;a<s.length;a++){var n=s[a],l=d[n.id];l.refs--,r.push(l)}if(e){var c=o(e);i(c,t)}for(var a=0;a<r.length;a++){var l=r[a];if(0===l.refs){for(var u=0;u<l.parts.length;u++)l.parts[u]();delete d[l.id]}}}};var h=function(){var e=[];return function(t,s){return e[t]=s,e.filter(Boolean).join("\n")}}()},function(e,t,s){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=s(8),r=i(o),a=s(28),n=i(a),l=s(29),c=i(l),u=s(31),d=i(u),p=s(30),f=i(p);t["default"]={el:"#chat",data:function(){var e=r["default"].fetch();return{user:e.user,userList:e.userList,sessionList:e.sessionList,search:"",sessionIndex:0}},computed:{session:function(){return this.sessionList[this.sessionIndex]}},watch:{sessionList:{deep:!0,handler:function(){r["default"].save({user:this.user,userList:this.userList,sessionList:this.sessionList})}}},components:{card:n["default"],list:c["default"],text:d["default"],message:f["default"]}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={props:["user","search"]}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={props:["userList","sessionIndex","session","search"],methods:{select:function(e){this.sessionIndex=this.userList.indexOf(e)}},filters:{search:function(e){var t=this;return e.filter(function(e){return e.name.indexOf(t.search)>-1})}}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={props:["session","user","userList"],computed:{sessionUser:function(){var e=this,t=this.userList.filter(function(t){return t.id===e.session.userId});return t[0]}},filters:{avatar:function(e){var t=e.self?this.user:this.sessionUser;return t&&t.img},time:function(e){return"string"==typeof e&&(e=new Date(e)),e.getHours()+":"+e.getMinutes()}},directives:{"scroll-bottom":function(){var e=this;Vue.nextTick(function(){e.el.scrollTop=e.el.scrollHeight-e.el.clientHeight})}}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={props:["session"],data:function(){return{text:""}},methods:{inputing:function(e){e.ctrlKey&&13===e.keyCode&&this.text.length&&(this.session.messages.push({text:this.text,date:new Date,self:!0}),this.text="")}}}},function(e,t,s){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=s(9),r=i(o),a="VUE-CHAT-v3";if(!localStorage.getItem(a)){var n=new Date,l={user:{id:1,name:"Coffce",img:"dist/images/1.jpg"},userList:[{id:2,name:"示例介绍",img:"dist/images/2.png"},{id:3,name:"webpack",img:"dist/images/3.jpg"}],sessionList:[{userId:2,messages:[{text:"Hello，这是一个基于Vue + Webpack构建的简单chat示例，聊天记录保存在localStorge。简单演示了Vue的基础特性和webpack配置。",date:n},{text:"项目地址: https://github.com/coffcer/vue-chat",date:n}]},{userId:3,messages:[]}]};localStorage.setItem(a,(0,r["default"])(l))}t["default"]={fetch:function(){return JSON.parse(localStorage.getItem(a))},save:function(e){localStorage.setItem(a,(0,r["default"])(e))}}},function(e,t,s){e.exports={"default":s(10),__esModule:!0}},function(e,t,s){var i=s(11);e.exports=function(e){return(i.JSON&&i.JSON.stringify||JSON.stringify).apply(JSON,arguments)}},function(e,t){var s=e.exports={version:"1.2.6"};"number"==typeof __e&&(__e=s)},function(e,t,s){t=e.exports=s(1)(),t.push([e.id,".m-card{padding:9pt;border-bottom:1px solid #24272c}.m-card footer{margin-top:10px}.m-card .avatar,.m-card .name{vertical-align:middle}.m-card .avatar{border-radius:2px}.m-card .name{display:inline-block;margin:0 0 0 15px;font-size:1pc}.m-card .search{padding:0 10px;width:100%;font-size:9pt;color:#fff;height:30px;line-height:30px;border:1px solid #3a3a3a;border-radius:4px;outline:0;background-color:#26292e}",""])},function(e,t,s){t=e.exports=s(1)(),t.push([e.id,'.m-message{padding:10px 15px;overflow-y:scroll}.m-message li{margin-bottom:15px}.m-message .time{margin:7px 0;text-align:center}.m-message .time>span{display:inline-block;padding:0 18px;font-size:9pt;color:#fff;border-radius:2px;background-color:#dcdcdc}.m-message .avatar{float:left;margin:0 10px 0 0;border-radius:3px}.m-message .text{display:inline-block;position:relative;padding:0 10px;max-width:calc(100% - 40px);min-height:30px;line-height:2.5;font-size:9pt;text-align:left;word-break:break-all;background-color:#fafafa;border-radius:4px}.m-message .text:before{content:" ";position:absolute;top:9px;right:100%;border:6px solid transparent;border-right-color:#fafafa}.m-message .self{text-align:right}.m-message .self .avatar{float:right;margin:0 0 0 10px}.m-message .self .text{background-color:#b2e281}.m-message .self .text:before{right:inherit;left:100%;border-right-color:transparent;border-left-color:#b2e281}',"",{version:3,sources:["/../../../../../../../vue-loader/lib/style-rewriter.js?id=_v-024148c0&file=message.vue!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/node_modules/less-loader/index.js!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/node_modules/vue-loader/lib/selector.js?type=style&index=0!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/src/components/message.vue.style"],names:[],mappings:"AAAA,WAAW,kBAAkB,iBAAiB,CAAC,cAAc,kBAAkB,CAAC,iBAAiB,aAAa,iBAAiB,CAAC,sBAAsB,qBAAqB,eAAe,cAAe,WAAW,kBAAkB,wBAAwB,CAAC,mBAAmB,WAAW,kBAAkB,iBAAiB,CAAC,iBAAiB,qBAAqB,kBAAkB,eAAe,4BAA4B,gBAAgB,gBAAgB,cAAe,gBAAgB,qBAAqB,yBAAyB,iBAAiB,CAAC,wBAAwB,YAAY,kBAAkB,QAAQ,WAAW,6BAA6B,0BAA0B,CAAC,iBAAiB,gBAAgB,CAAC,yBAAyB,YAAY,iBAAiB,CAAC,uBAAuB,wBAAwB,CAAC,8BAA8B,cAAc,UAAU,+BAA+B,yBAAyB,CAAC",file:"message.vue",sourcesContent:['.m-message{padding:10px 15px;overflow-y:scroll}.m-message li{margin-bottom:15px}.m-message .time{margin:7px 0;text-align:center}.m-message .time>span{display:inline-block;padding:0 18px;font-size:12px;color:#fff;border-radius:2px;background-color:#dcdcdc}.m-message .avatar{float:left;margin:0 10px 0 0;border-radius:3px}.m-message .text{display:inline-block;position:relative;padding:0 10px;max-width:calc(100% - 40px);min-height:30px;line-height:2.5;font-size:12px;text-align:left;word-break:break-all;background-color:#fafafa;border-radius:4px}.m-message .text:before{content:" ";position:absolute;top:9px;right:100%;border:6px solid transparent;border-right-color:#fafafa}.m-message .self{text-align:right}.m-message .self .avatar{float:right;margin:0 0 0 10px}.m-message .self .text{background-color:#b2e281}.m-message .self .text:before{right:inherit;left:100%;border-right-color:transparent;border-left-color:#b2e281}'],sourceRoot:"webpack://"}])},function(e,t,s){t=e.exports=s(1)(),t.push([e.id,"#chat{overflow:hidden;border-radius:3px}#chat .main,#chat .sidebar{height:100%}#chat .sidebar{float:left;width:200px;color:#f4f4f4;background-color:#2e3238}#chat .main{position:relative;overflow:hidden;background-color:#eee}#chat .m-text{position:absolute;width:100%;bottom:0;left:0}#chat .m-message{height:calc(100% - 10pc)}","",{version:3,sources:["/../../../../../../../vue-loader/lib/style-rewriter.js?id=_v-2bad1e5a&file=app.vue!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/node_modules/less-loader/index.js!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/node_modules/vue-loader/lib/selector.js?type=style&index=0!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/src/components/app.vue.style"],names:[],mappings:"AAAA,MAAM,gBAAgB,iBAAiB,CAAC,2BAA2B,WAAW,CAAC,eAAe,WAAW,YAAY,cAAc,wBAAwB,CAAC,YAAY,kBAAkB,gBAAgB,qBAAqB,CAAC,cAAc,kBAAkB,WAAW,SAAS,MAAM,CAAC,iBAAiB,wBAAyB,CAAC",file:"app.vue",sourcesContent:["#chat{overflow:hidden;border-radius:3px}#chat .sidebar,#chat .main{height:100%}#chat .sidebar{float:left;width:200px;color:#f4f4f4;background-color:#2e3238}#chat .main{position:relative;overflow:hidden;background-color:#eee}#chat .m-text{position:absolute;width:100%;bottom:0;left:0}#chat .m-message{height:calc(100% - 160px)}"],sourceRoot:"webpack://"}])},function(e,t,s){t=e.exports=s(1)(),t.push([e.id,".m-list li{padding:9pt 15px;border-bottom:1px solid #292c33;cursor:pointer;-webkit-transition:background-color .1s;transition:background-color .1s}.m-list li:hover{background-color:hsla(0,0%,100%,.03)}.m-list li.active{background-color:hsla(0,0%,100%,.1)}.m-list .avatar,.m-list .name{vertical-align:middle}.m-list .avatar{border-radius:2px}.m-list .name{display:inline-block;margin:0 0 0 15px}","",{version:3,sources:["/../../../../../../../vue-loader/lib/style-rewriter.js?id=_v-57303e35&file=list.vue!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/node_modules/less-loader/index.js!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/node_modules/vue-loader/lib/selector.js?type=style&index=0!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/src/components/list.vue.style"],names:[],mappings:"AAAA,WAAW,iBAAkB,gCAAgC,eAAe,wCAAA,+BAA+B,CAAC,iBAAiB,oCAAuC,CAAC,kBAAkB,mCAAsC,CAAC,8BAA8B,qBAAqB,CAAC,gBAAgB,iBAAiB,CAAC,cAAc,qBAAqB,iBAAiB,CAAC",file:"list.vue",sourcesContent:[".m-list li{padding:12px 15px;border-bottom:1px solid #292C33;cursor:pointer;transition:background-color .1s}.m-list li:hover{background-color:rgba(255,255,255,0.03)}.m-list li.active{background-color:rgba(255,255,255,0.1)}.m-list .avatar,.m-list .name{vertical-align:middle}.m-list .avatar{border-radius:2px}.m-list .name{display:inline-block;margin:0 0 0 15px}"],sourceRoot:"webpack://"}])},function(e,t,s){t=e.exports=s(1)(),t.push([e.id,".m-text{height:10pc;border-top:1px solid #ddd}.m-text textarea{padding:10px;height:100%;width:100%;border:none;outline:0;font-family:Micrsofot Yahei;resize:none}","",{version:3,sources:["/../../../../../../../vue-loader/lib/style-rewriter.js?id=_v-69ae1978&file=text.vue!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/node_modules/less-loader/index.js!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/node_modules/vue-loader/lib/selector.js?type=style&index=0!/Users/yinweiyi/myGit/toolkit/practice/about-vue/vue-chat/src/components/text.vue.style"],names:[],mappings:"AAAA,QAAQ,YAAa,yBAAyB,CAAC,iBAAiB,aAAa,YAAY,WAAW,YAAY,UAAa,4BAA8B,WAAW,CAAC",file:"text.vue",sourcesContent:['.m-text{height:160px;border-top:solid 1px #ddd}.m-text textarea{padding:10px;height:100%;width:100%;border:none;outline:none;font-family:"Micrsofot Yahei";resize:none}'],sourceRoot:"webpack://"}])},function(e,t,s){var i=s(12);"string"==typeof i&&(i=[[e.id,i,""]]);s(2)(i,{});i.locals&&(e.exports=i.locals)},function(e,t,s){var i=s(13);"string"==typeof i&&(i=[[e.id,i,""]]);s(2)(i,{});i.locals&&(e.exports=i.locals)},function(e,t,s){var i=s(14);"string"==typeof i&&(i=[[e.id,i,""]]);s(2)(i,{});i.locals&&(e.exports=i.locals)},function(e,t,s){var i=s(15);"string"==typeof i&&(i=[[e.id,i,""]]);s(2)(i,{});i.locals&&(e.exports=i.locals)},function(e,t,s){var i=s(16);"string"==typeof i&&(i=[[e.id,i,""]]);s(2)(i,{});i.locals&&(e.exports=i.locals)},function(e,t){e.exports=" <div> <div class=sidebar> <card :user=user :search.sync=search></card> <list :user-list=userList :session=session :session-index.sync=sessionIndex :search=search></list> </div> <div class=main> <message :session=session :user=user :user-list=userList></message> <text :session=session></text> </div> </div> "},function(e,t){e.exports=' <div class=m-card> <header> <img class=avatar width=40 height=40 :alt=user.name :src=user.img> <p class=name>{{user.name}}</p> </header> <footer> <input class=search type=text placeholder="search user..." v-model=search> </footer> </div> '},function(e,t){e.exports=' <div class=m-list> <ul> <li v-for="item in userList | search" :class="{ active: session.userId === item.id }" @click=select(item)> <img class=avatar width=30 height=30 :alt=item.name :src=item.img> <p class=name>{{item.name}}</p> </li> </ul> </div> '},function(e,t){e.exports=' <div class=m-message v-scroll-bottom=session.messages> <ul> <li v-for="item in session.messages"> <p class=time><span>{{item.date | time}}</span></p> <div class=main :class="{ self: item.self }"> <img class=avatar width=30 height=30 :src="item | avatar"/> <div class=text>{{item.text}}</div> </div> </li> </ul> </div> '},function(e,t){e.exports=' <div class=m-text> <textarea placeholder="按 Ctrl + Enter 发送" v-model=text @keyup=inputing></textarea> </div> '},function(e,t,s){var i,o;s(19),i=s(3),o=s(22),e.exports=i||{},e.exports.__esModule&&(e.exports=e.exports["default"]),o&&(("function"==typeof e.exports?e.exports.options:e.exports).template=o)},function(e,t,s){var i,o;s(17),i=s(4),o=s(23),e.exports=i||{},e.exports.__esModule&&(e.exports=e.exports["default"]),o&&(("function"==typeof e.exports?e.exports.options:e.exports).template=o)},function(e,t,s){var i,o;s(20),i=s(5),o=s(24),e.exports=i||{},e.exports.__esModule&&(e.exports=e.exports["default"]),o&&(("function"==typeof e.exports?e.exports.options:e.exports).template=o)},function(e,t,s){var i,o;s(18),i=s(6),o=s(25),e.exports=i||{},e.exports.__esModule&&(e.exports=e.exports["default"]),o&&(("function"==typeof e.exports?e.exports.options:e.exports).template=o)},function(e,t,s){var i,o;s(21),i=s(7),o=s(26),e.exports=i||{},e.exports.__esModule&&(e.exports=e.exports["default"]),o&&(("function"==typeof e.exports?e.exports.options:e.exports).template=o)}]);
//# sourceMappingURL=main.js.map