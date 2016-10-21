<template>
	<div class="page-actionsheet">
		<div class="page-actionsheet-wrapper">
			<button class="mint-button mint-button--default mint-button--large" 
        @click="sheetVisible = true">点击上拉 action sheet</button>
			<button class="mint-button mint-button--default mint-button--large" 
        @click="sheetVisible2 = true">不带取消按钮的 action sheet</button>
		</div>
		<mt-actionsheet :actions="actions" v-model="sheetVisible" :closeOnClickModal="false"></mt-actionsheet>
		<mt-actionsheet :actions="actions2" v-model="sheetVisible2" cancel-text=""></mt-actionsheet>
	</div>
</template>

<script>
    export default {
        data() {
            return {
                sheetVisible: false,
                sheetVisible2: false,
                actions: [],
                actions2: []
            }
        },
        methods: {
          takePhoto() {
            console.log('taking photo');
          },

          openAlbum() {
            console.log('opening album');
          },

          goBack() {
            history.go(-1);
          }
        },

        mounted() {
          
          this.actions = [{
            name: `拍照11111`,
            method: this.takePhoto
          }, {
            name: '从相册中选择222222',
            method: this.openAlbum
          }];

          this.actions2 = [{
            name: '确定'
          }, {
            name: '返回上一步',
            method: this.goBack
          }];
        }
    }
</script>

<style lang="sass">
	.page-actionsheet-wrapper {
		position: absolute;
		top: 50%;
		width: 100%;
		transform: translateY(-50%);
		button:first-child {
			margin-bottom: 20px;
		}
	}
</style>