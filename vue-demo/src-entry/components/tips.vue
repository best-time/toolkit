<template>
    <div class="tips-con">
        <button class="mint-button mint-button--default mint-button--large" @click="showTips1"> 
            <label class="mint-button-text">点击弹出 Indicator</label>
        </button>

        <button class="mint-button mint-button--default mint-button--large" @click="showTips2"> 
            <label class="mint-button-text">可配置spinner</label>
        </button>

        <button class="mint-button mint-button--default mint-button--large" @click="showTips3"> 
            <label class="mint-button-text">包含文字</label>
        </button>
    </div>
</template>

<script>
    // Indicator
    import { Indicator } from 'mint-ui';

    export default {
        methods: {
            showTips1() {
                Indicator.open();
                setTimeout(() => {
                    Indicator.close();
                }, 2000)
            },
            showTips2() {
                /*
                'snake' (default)
                'fading-circle'
                'double-bounce'
                'triple-bounce'
                */
                Indicator.open({ spinnerType: 'triple-bounce' });
                setTimeout(() => {
                    Indicator.close();
                }, 2000)
            },
            showTips3: function() {
                Indicator.open('加载中...');
                setTimeout(() => {
                    Indicator.close();
                }, 2000)
            }
        }
        

    }
</script>

<style lang="sass">
    .tips-con {
        margin-top: 30%;
        padding: 0 20px;
        button {
            margin-bottom: 20px;
        }
    }
</style>