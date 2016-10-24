<template>
  <div>

    <div class="nav">
      
      <button class="mint-button mint-button--default mint-button--small" 
          @click.prevent="active = 'tab-container1'" 
          :class="active == 'tab-container1' ? 'active' : ''">tab 1</button>
      <button class="mint-button mint-button--default mint-button--small"
           @click.prevent="active = 'tab-container2'"
           :class="active == 'tab-container2' ? 'active' : ''">tab 2</button>
      <button class="mint-button mint-button--default mint-button--small"
           @click.prevent="active = 'tab-container3'"
           :class="active == 'tab-container3' ? 'active' : ''">tab 3</button>

    </div>

    <div class="page-tab-container">
      <mt-tab-container class="page-tabbar-tab-container" v-model="active" swipeable>

         <mt-tab-container-item id="tab-container1">
          <p class="swipe-p" v-for="n in 10">{{n}}</p>
         </mt-tab-container-item>

        <mt-tab-container-item id="tab-container2">
          <mt-cell v-for="n in 5" title="tab-container 2"></mt-cell>
        </mt-tab-container-item>

        <mt-tab-container-item id="tab-container3">
          <mt-cell v-for="n in 7" title="tab-container 3"></mt-cell>
        </mt-tab-container-item>

      </mt-tab-container>
    </div>
  </div>

</template>

<script>
export default {
  name: 'page-tab-container',
  data() {
    return {
      active: 'tab-container1'
    };
  },
  computed: {
    isActive: function() {
      
    }
  }
};
</script>

<style lang="sass" scoped>
  .item {
    display: inline-block;
  }

  .nav {
    padding: 10px;
  }

  .link {
    color: inherit;
    padding: 20px;
    display: block;
  }
  .active {
    background: #eee;
  }
  .swipe-p {
    position: relative;
    padding-left: 20px;
    height: 44px;
    background: #fff;
    line-height: 44px;
    &:before {
        content: " ";
        bottom: 0;
        left: 0;
        color: #d9d9d9;
        position: absolute;
        width: 100%;
        height: 1;
        border-bottom: 1px solid;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
    }
    @media screen and (-webkit-min-device-pixel-ratio: 2) {
        &:before {
          -webkit-transform: scaleY(.5);
                transform: scaleY(.5);
        }
    }
  }

</style>
