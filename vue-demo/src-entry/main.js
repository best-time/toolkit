/**
 *  beforeCreate created
 *  beforeMount mounted
 *
 *  mounted (data-changes) beforeUpdate updated
 *
 *  beforeDestroy destroyed
 */

import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(Mint);

import App from './App.vue'
import List from './components/list.vue'
import Home from './components/home.vue'
import detail from './components/detail.vue'
import comDemo from './components/com_demo.vue'
import conditionRouter from './components/condition_router.vue'
import wechatImg from './components/wechatImg.vue'
import table from './components/table.vue'
import inputCheck from './components/inputCheck.vue'
import propsdata from './components/todolist.vue'
import routerdata from './components/routerdata.vue'
import form from './components/form.vue'
import dataBind from './components/dataBind.vue'

import tips from './components/tips.vue'
import swipe2 from './components/swipe.vue'
import popUp from './components/popUp.vue'
import actionsheet2 from './components/actionsheet.vue'
import lazyLoad from './components/LazyLoad.vue'
import header from './components/header.vue'
import infiniteScroll from './components/infinite-scroll.vue'
import alertBox from './components/alert-box.vue'
import indexList from './components/index-list.vue'


import swipe from './coms/swipe.vue'
// import field from './coms/field.vue'
// import messageBox from './coms/message-box.vue'



// swipe
import {
    Swipe, SwipeItem,
    Popup,
    Actionsheet,
    Lazyload,
    Header,
    InfiniteScroll,
     IndexList, IndexSection 
} from 'mint-ui';

    Vue.component(Swipe.name, Swipe);
    Vue.component(SwipeItem.name, SwipeItem);

    Vue.component(Popup.name, Popup);
    Vue.component(Actionsheet.name, Actionsheet);

    Vue.use(Lazyload);
    Vue.component(Header.name, Header);
    Vue.use(InfiniteScroll);

    Vue.component(IndexList.name, IndexList);
    Vue.component(IndexSection.name, IndexSection);


var router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/home', component: Home },
        { path: '/list', component: List },
        { path: '/detail', component: detail },
        { path: '/comDemo', component: comDemo },
        { path: '/conditionRouter', component: conditionRouter },
        { path: '/wechatImg', component: wechatImg },
        { path: '/table', component: table },
        { path: '/inputCheck', component: inputCheck },
        { path: '/propsdata', component: propsdata },
        { path: '/routerdata', component: routerdata },
        { path: '/form', component: form },
        { path: '/dataBind', component: dataBind },

        { path: '/swipe', name: 'swipe', component: swipe },        
        { path: '/swipe2', name: 'swipe2', component: swipe2 },        
        // { path: '/field', name: 'field', component: field }, 
        // { path: '/messageBox', name: 'messageBox', component: messageBox }, 
        { path: '/tips', name: 'tips', component: tips }, 
        { path: '/popUp', name: 'popUp', component: popUp }, 
        { path: '/actionsheet2', name: 'actionsheet2', component: actionsheet2 }, 
        { path: '/lazyLoad', name: 'lazyLoad', component: lazyLoad }, 
        { path: '/header', name: 'header', component: header }, 
        { path: '/infiniteScroll', name: 'infiniteScroll', component: infiniteScroll }, 
        { path: '/alertBox', name: 'alertBox', component: alertBox }, 
        { path: '/indexList', name: 'indexList', component: indexList }, 



        { path: '*', redirect: '/' }



        /*
         { path: '/', component: Home,
         children: [
         { path: '', component: Default },
         { path: 'foo', component: Foo },
         { path: 'bar', component: Bar },
         { path: 'baz', name: 'baz', component: Baz },
         { path: 'with-params/:id', component: WithParams },
         // relative redirect to a sibling route
         { path: 'relative-redirect', redirect: 'foo' }
         ]
         },
         // absolute redirect
         { path: '/absolute-redirect', redirect: '/bar' },
         // named redirect
         { path: '/named-redirect', redirect: { name: 'baz' }},

         // redirect with params
         { path: '/redirect-with-params/:id', redirect: '/with-params/:id' },

        */
    ]
});


new Vue({
    router,
  render: h => h(App)
}).$mount('#app');
