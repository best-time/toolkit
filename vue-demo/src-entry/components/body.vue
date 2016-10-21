<template>
    <div class="body-con">
        <h2>body-content</h2>
        <p>{{bodyDesc}}</p>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            bodyDesc: 'It is bodyDesc content'
        }
    }
}
</script>
<style scoped>
    .body-con {
        background: #fff;
    }
</style>