<template>
    <div class="page-lazyload">
        <ul class="page-lazyload-list">
            <li class="page-lazyload-listitem" 
                v-for="item in list">
                <img class="page-lazyload-image" v-lazy="item">
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list: [
                '../../src-entry/assets/1.jpg',
                '../../src-entry/assets/2.jpg',
                '../../src-entry/assets/3.jpg',
                '../../src-entry/assets/4.jpg',
                '../../src-entry/assets/5.jpg',
                '../../src-entry/assets/6.jpg',
                ]
            }
        }
    }
</script>

<style lang="sass">
    .page-lazyload-listitem {
        width: 300px;
        margin: 0 auto;
        margin-bottom: 10px;
        background-color: #ddd;
    }
    .page-lazyload-image {
        display: block;
        width: 100%;
    }
    img[lazy=loading] {
        width: 40px;
        height: 300px;
        margin: auto;
    }
</style>