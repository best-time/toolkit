<template>
    <div class="footer-con">
        <h2>footer -- {{footerCon}}</h2>
    </div>
</template>
<script>
export default {
    data () {
        return {
            footerCon: 'footerCon'
        }
    }
}
</script>

<style lang="sass">
    .footer-con {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #dcdcdc;
    }
</style>

<style scoped>
    .footer {
        font-size: 40px;
    }
</style>