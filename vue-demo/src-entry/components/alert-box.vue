<template>
  <div class="page-msgbox">
    <h1 class="page-title">Message Box</h1>
    <div class="page-msgbox-wrapper">
      <button class="mint-button mint-button--default mint-button--large" 
      @click="openAlert">打开 alert 提示框</button>

      <button class="mint-button mint-button--default mint-button--large"
       @click="openConfirm">打开 confirm 提示框</button>

      <button class="mint-button mint-button--default mint-button--large"
       @click="openPrompt">打开 prompt 提示框</button>
    </div>
  </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';

    export default {
        methods: {
            
            openAlert() {
               MessageBox({
                title: '标题1',
                message: `<i>123321</i>确定执行此操作?`,
                confirmButtonText: 'confirm',
                showCancelButton: true
                });
            },

            openConfirm() {
                MessageBox.confirm('确定执行此操作?', '提示')
                .then((action)=>{
                    console.log(action)
                }).catch(function() {
                    console.log('cancell')
                });
            },

            openPrompt() {
                MessageBox.prompt(' ', '请输入姓名').then(({ value, action }) => {
                    if (value) {
                        console.log(action)
                        MessageBox.alert(`你的名字是 ${ value }`, '输入成功');
                    }
                }).catch(()=>{
                    console.log('您点击了取消')
                });
            }
        }
    };
</script>

<style lang="sass">
  .page-msgbox-wrapper {
        padding: 0 20px;
        position: absolute; 
        top:50%;
        width: 90%;
        transform: translateY(-50%);
        button:not(:last-child) {
          margin-bottom: 20px;
        }
      }
</style>