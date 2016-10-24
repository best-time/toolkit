<template>
  <div class="page-loadmore">
    
    <h1 class="page-title">Pull down</h1>
    <p class="page-loadmore-desc">按住 - 下拉 - 释放可以获取更多数据</p>

    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore 
        :top-method="loadTop"
        :topDistance="80"
        @top-status-change="handleTopChange"
        :bottom-all-loaded="allLoaded"  
        ref="loadmore"
        >

        <!--可自定义加载模板-->
        <!--<div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'" 
          :class="{ 'is-rotate': topStatus === 'drop' }">
          ↓
          </span>

          topPullText="pulllllllllll"
        topDropText="droppppp"

          <span v-show="topStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>

        </div>-->

        <ul class="page-loadmore-list">
          <li v-for="item in list" class="page-loadmore-listitem">{{ item }}</li>
        </ul>

        

      </mt-loadmore>
    </div>

  </div>
</template>

<script>
  /**
  pull：组件已经被按下，但按下的距离未达到 topDistance，此时释放不会触发 top-method，列表会回到初始位置
  drop：按下的距离不小于 topDistance，此时释放会触发 top-method
  loading：组件已被释放，top-method 正在执行 每当组件的状态发生变化时，
    loadmore 都会触发 top-status-change 方法，参数为组件目前的状态。
    因此可以像本例一样，使用一个 handleTopChange 方法来处理组件状态的变化。
  */
  export default {
    data() {
      return {
        list: [],
        topStatus: '',
        wrapperHeight: 0,
        autoFill: true,
        allLoaded: true
      };
    },

    methods: {
      handleTopChange(status) {
        console.log(status); // drop pull loading
        this.topStatus = status;
      },

      loadTop(id) {
        
        setTimeout(() => {
          let firstValue = this.list[0];
          for (let i = 1; i <= 3; i++) {
            this.list.unshift(firstValue - i);
          }
          this.$refs.loadmore.onTopLoaded(id);
        }, 1500);
      }
    },

    created() {
      for (let i = 1; i <= 10; i++) {
        this.list.push(i);
      }
    },

    mounted() {
      let docClientH = document.documentElement.clientHeight,
        wrapperH = this.$refs.wrapper.getBoundingClientRect().top;
      this.wrapperHeight = docClientH - wrapperH;
    }
  };
</script>

<style lang="sass">
  .page-loadmore-desc {
        text-align: center;
        color: #666;
        padding-bottom: 5px;
        &:last-of-type {
          border-bottom: solid 1px #eee;
        }
      }

      .page-loadmore-listitem {
        height: 50px;
        line-height: 50px;
        border-bottom: solid 1px #eee;
        text-align: center;
        &:first-child {
          border-top: solid 1px #eee;
        }
      }

      .page-loadmore-wrapper {
        margin-top: -1px;
        overflow: scroll;
        background: #fff;
      }

      .mint-spinner {
        display: inline-block;
        vertical-align: middle;
      }

  .mint-loadmore-top {
    span {
      display: inline-block;
      transition: .2s linear;
      vertical-align: middle;

      
    }
  }
  .rotate {
        transform: rotate(180deg);
      }
</style>
