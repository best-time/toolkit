<template>

<div class="tab_1">
    <div class="weui_panel weui_panel_access weui_cells_access">

        <div class="weui_panel_bd">

            <router-link to="/list">
                <a v-for="item_one in items_one" :to="{path:'list' , activeClass:'active'}" class="weui_media_box weui_media_appmsg weui_cells_access">
                <div class="weui_media_hd">
                    <img class="weui_media_appmsg_thumb" :src="item_one.src" alt="图片">
                </div>
                <div class="weui_media_bd">
                    <h4 class="weui_media_title">{{item_one.title}}</h4>
                    <p class="weui_media_desc">{{item_one.content}}</p>
                </div>
                <span class="weui_cell_ft"></span>
            </a>
            </router-link>

        </div>

    </div>
</div>

</template>

<script>
export default{
    data(){
        return{
            items_one:[
                {title:'Vuejs',src:'./static/logo.png',content:'XX数量（92222222）'},
                {title:'Angularjs',src:'./static/logo.png',content:'XX数量（66666）'}
            ]
        }
    }
}
</script>