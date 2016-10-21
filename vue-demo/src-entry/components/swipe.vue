<template>

	<div class="coms-content">
        <h2>基础用法</h2>
		<mt-swipe :auto="4000">
			<mt-swipe-item class="slide1">1</mt-swipe-item>
			<mt-swipe-item class="slide2">2</mt-swipe-item>
			<mt-swipe-item class="slide3">3</mt-swipe-item>
		</mt-swipe>
        <h2>不带圆点</h2>
		<mt-swipe :show-indicators="false">
			<mt-swipe-item class="slide1">1</mt-swipe-item>
			<mt-swipe-item class="slide2">2</mt-swipe-item>
			<mt-swipe-item class="slide3">3</mt-swipe-item>
		</mt-swipe>
        <h2>取消自动播放</h2>
		<mt-swipe :auto="0">
			<mt-swipe-item class="slide1">1</mt-swipe-item>
			<mt-swipe-item class="slide2">2</mt-swipe-item>
			<mt-swipe-item class="slide3">3</mt-swipe-item>
		</mt-swipe>
	</div>

</template>

<script>

export default {
    
}

</script>

<style lang="sass" scoped>
    h2 {
        text-align: center;
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