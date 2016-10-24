<template>

<div class="home">
    <div class="bd">
        <div class="weui_tab">

            <ul class="weui_navbar">
                <li class="weui_navbar_item" v-for="(tab, index) in tabs" :class="{'weui_bar_item_on':index===selected}" @click="choose(index)">{{tab.tabName}}</li>
            </ul>

            <div class="weui_tab_bd">
                <component :is="currentView" transition="fade" transition-mode="out-in"></component>
            </div>

        </div>
    </div>     
    <p class="apple-icon"></p>

    <ul class="ex-list">
        <router-link 
            v-for="(item, index) of navList" 
            :to="{ name: item.name, query: item.query ? item.query : ''}" 
            tag="li">{{item.name}}
        </router-link>
        <!--<router-link :to="{ name: 'swipe2' }" tag="li">swipe2</router-link>
        <router-link :to="{ name: 'tips', query: {age:'ywy'} }" tag="li">tips</router-link>
        <router-link :to="{ name: 'popUp' }" tag="li">popUp</router-link>

        
        <router-link to="/lazyLoad" tag="li">lazyLoad</router-link>
        <router-link to="/header" tag="li">header</router-link>-->
<!--<router-link :to="{name: 'actionsheetBak'}" tag="li">actionsheetBak</router-link>-->
    </ul>
</div>

</template>
<script>
import  tab_1 from './tab/tab_1.vue';
import  tab_2 from './tab/tab_2.vue';

export default{
    data(){
        return{
            tabs:[
                {tabName:'Vuejs-1'},
                {tabName:'VueTab-2'}
            ],
            selected:0,
            currentView:'view_0',
            navList: [
                {
                    path: '',
                    name: 'header',
                    query: ''
                },
                {
                    path: '',
                    name: 'swipe2',
                    query: ''
                },{
                    path: '',
                    name: 'tips',
                    query: {name: 'ywyw'}
                },
                {
                    path: '',
                    name: 'popUp',
                    query: ''
                },
                {
                    path: '',
                    name: 'actionsheet2',
                    query: ''
                },
                {
                    path: '',
                    name: 'lazyLoad',
                    query: ''
                },
                {
                    path: '',
                    name: 'infiniteScroll',
                    query: ''
                },
                {
                    path: '',
                    name: 'alertBox',
                    query: ''
                },
                {
                    path: '',
                    name: 'indexList',
                    query: ''
                },
                {
                    path: '',
                    name: 'cellSwipe',
                    query: ''
                },
                {
                    path: '',
                    name: 'switchButton',
                    query: ''
                },
                {
                    path: '',
                    name: 'tabContainer',
                    query: ''
                },
                {
                    path: '',
                    name: 'loadMoreDown',
                    query: ''
                },
                {
                    path: '',
                    name: 'loadMoreUp',
                    query: ''
                }
                
            ]
        }
    },
    components:{
        'view_0':tab_1,
        'view_1':tab_2
    },
    methods:{
        choose(index) {
            this.selected=index;
            this.currentView='view_'+index;
        }
    },
    route:{
        data() {
            /*每次切换路由，在渲染出页面前都会执行*/
        }
    }
}
</script>
<style lang="sass">
    body {
        font-size: 14px;
       font-family: "Helvetica Neue", Helvetica, STHeiTi, Arial, sans-serif;
    }
    ul li {
        list-style: none;
    }
    .bd {
        height: 100%;
    }
    .apple-icon {
        margin-top: 10px;
        line-height: 2;
        background: #fff;
    }
    .ex-list {
        padding: 0 0 20px;
        margin-top: 20px;
        background: #fff;
        li {
            padding-left: 10px;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            color: #656b79;
            border-bottom: 1px solid #dcdcdc;
        }
    }


.page-swipe-desc {
        text-align: center;
        color: #666;
        margin-bottom: 5px;
      }

    .mint-swipe {
        height: 200px;
        color: #fff;
        font-size: 30px;
        text-align: center;
        margin-bottom: 20px;
      }

      .mint-swipe-item {
        line-height: 200px;
      }

      .slide1 {
        background-color: #0089dc;
        color: #fff;
      }

      .slide2 {
        background-color: #ffd705;
        color: #000;
      }

      .slide3 {
        background-color: #ff2d4b;
        color: #fff;
      }

</style>