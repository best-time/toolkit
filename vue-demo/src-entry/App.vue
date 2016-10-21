<template>

    <div id="app">
        <!--<div class="main">-->
            <transition name="fade" mode="out-in">
            <router-view
                    keep-alive
                    transition="fade"
                    transition-mode='out-in'></router-view>
                </transition>
        <!--</div>-->
    </div>
</template>

<script>
/*
    import First from './components/first.vue'
    import hederCon from './components/header.vue'
    import Bodycon from './components/body.vue'
    import Footercon from './components/footer.vue'

    export default {

      data: function() {
        return {
          msg: 'Hello Vue!',
            name: ''
        }
      },
        created: function() {
            this.$http.get('./src/data/data1.json').then(function(res) {
                console.info(res)
                this.name = res.data.msg
            })
        },

        methods: {
         say: function() {

             this.$http.get('./src/data/data1.json').then(function(res) {
                 console.log(res)
             })
         }
        },

        components: {
            First,
            hederCon,
            Bodycon,
            Footercon
        }
    }
*/
</script>

<style lang="sass">
    * {
        margin: 0;
        padding: 0;
    }
    body {
      font-family: Helvetica, sans-serif;
        background: #eee;
    }
    .img-bg {
        width: 200px;
        height: 100px;
        background: url("./assets/logo.png") no-repeat left center;
    }
    .p1 {
        p {
            color: maroon;
        }
    }
</style>
