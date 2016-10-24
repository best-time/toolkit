<template>
  <div class="page-cell">
    <h2 class="page-title">Cell Swipe</h2>

    <mt-cell-swipe
      v-for="n in 5"
      :left="rightButtons"
      icon="my-icon1"
      
      label="subtitle"
      title="title desc">
    </mt-cell-swipe>
<!-- icon 设置 className -->
  </div>

</template>

<script>
  export default {
    created() {
      this.rightButtons = [
        {
          content: '设为未读',
          style: { background: 'lightgray', color: '#fff' },
          handler: this.leftButtonHandler
          
        },
        {
          content: '<i>删除</i>',
          style: { background: 'red', color: '#fff' },
          handler: () => this.$messagebox.confirm('确定执行此操作?', '提示').then((action)=> {
                            console.log(2222)
                        }).catch(()=> console.log(33333333))
        }
      ];
    },

    methods: {
      leftButtonHandler() {
        console.log(123);
      }
    }
  };
</script>

<style lang="sass">

</style>