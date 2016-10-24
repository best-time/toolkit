<template>
  <div class="page-loadmore">
    <h1 class="page-title">Pull up</h1>

    <div class="page-loadmore-wrapper" ref="wrapper" 
      :style="{ height: wrapperHeight + 'px' }">
      
      <mt-loadmore 
      :bottom-method="loadBottom" 
      @bottom-status-change="handleBottomChange" 
      :bottom-all-loaded="allLoaded" 
      ref="loadmore">
        
        <ul class="page-loadmore-list">
          <li v-for="item in list" class="page-loadmore-listitem">{{ item }}</li>
        </ul>

        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
          <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
        </div>

      </mt-loadmore>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0
      };
    },

    methods: {
      handleBottomChange(status) {
        this.bottomStatus = status;
      },

      loadBottom(id) {
        this.$http.get('./src-entry/data/data1.json').then((response)=>{
          console.log(response)
        }, (response)=>{
          console.log(response)
        })
        setTimeout(() => {
          let listLen = this.list.length;
          if (listLen < 40) {
            for (let i = 1; i <= 5; i++) {
              this.list.push(i + ' - append');
            }
          } else {
            this.allLoaded = true;
          }
          this.$refs.loadmore.onBottomLoaded(id);
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
        overflow: scroll;
      }

      .mint-spinner {
        display: inline-block;
        vertical-align: middle;
      }

  .mint-loadmore-bottom {
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
