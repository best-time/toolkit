//v-model 指令 创建双向数据绑定
var bb = new Vue({
    el: '#demo',
    data: {
        msg: 'hi!',
        checked: true,
        picked: 'one',
        selected: 'two',
        multiSelect: ['one', 'three']
    },
    methods: {
        aa: function(e) {
            console.log(bb.picked)
        }
    }
})