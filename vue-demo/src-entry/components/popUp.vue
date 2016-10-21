<template>
	<div class="page-popup">

		<div class="page-popup-wrapper">
			<button class="mint-button mint-button--default mint-button--large" 
            @click="popupVisible2 = true"
            >顶部弹出</button>

            <button class="mint-button mint-button--default mint-button--large" 
            @click="popupVisible3 = true"
            >right弹出</button>

            <button class="mint-button mint-button--default mint-button--large" 
            @click="popupVisible4 = true"
            >底部弹出</button>

		</div>
        
        <mt-popup class="mint-popup-2" 
            v-model="popupVisible2" 
            position="top" 
            :modal="false">
            <p>更新成功</p>
        </mt-popup>

        <mt-popup class="mint-popup-3" v-model="popupVisible3" position="right" :modal="false">
            <button @click="closeRight">点击关闭 右侧滑块</button>
        </mt-popup>

        <section class="">
            <mt-popup class="mint-popup-4" v-model="popupVisible4" position="bottom" :modal="true">
                <p>底部滑块</p>
                <p>底部滑块</p>
                <p>底部滑块</p>
                <p>底部滑块</p>
                <p>底部滑块</p>
                <p>底部滑块</p>
                <p>底部滑块</p>
            </mt-popup></div>
        </section>

</template>

<script>
export default {
    data() {
        return {
            popupVisible2: false,
            popupVisible3: false,
            popupVisible4: false
        }
    },
    methods: {
        closeRight() {
            this.popupVisible3 = false;
        }
    },
    watch: {
      popupVisible2(val) {
        if (val) {
          setTimeout(() => {
            this.popupVisible2 = false;
          }, 2200);
        }
      }
    }
}
</script>

<style lang="sass">
	.page-popup-wrapper {
        top: 50%;
        position: absolute;
        width: 100%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        button {
            margin-bottom: 10px;
        }
    }
	
	.mint-popup-1 {
		width: 200px;
		border-radius: 8px;
		padding: 10px;
		transform: translate(-50%, 0);
		h1 {
			font-size: 20px;
			color: #26a2ff;
		}
		p {
			margin-bottom: 10px;
		}
	}
	
	.mint-popup-1::before {
		triangle: 10px top #fff;
		content: '';
		position: absolute;
		top: -20px;
		right: 50px;
	}
	
	.mint-popup-2 {
		width: 100%;
		height: 50px;
		text-align: center;
		background-color: rgba(0, 0, 0, .7);
		backface-visibility: hidden;
	}
	
	.mint-popup-2 p {
		line-height: 50px;
		color: #fff;
	}
	
	.mint-popup-3 {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	
	.mint-popup-3 .mint-button {
		position: absolute;
		width: 90%;
		top: 50%;
		left: 5%;
		transform: translateY(-50%);
	}
	
	.mint-popup-4 {
		width: 100%;
		.picker-slot-wrapper,
		.picker-item {
			backface-visibility: hidden;
		}
	}
</style>