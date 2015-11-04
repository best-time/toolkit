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
            console.log(bb.$data.picked)
        }
    }
})



new Vue({
    el: '#list',
    data: {
        items: [{
            text: 'one',
            done: true
        }, {
            text: 'two',
            done: false
        }]
    },
    methods: {
        toggle: function(item) {
            item.done = !item.done
        }
    }
})



// 指令使用
Vue.directive('demo-zhiling', {
    // bind: function() {
    //     this.el.style.color = '#fff'
    //     this.el.style.backgroundColor = this.arg
    // },

    update: function(value) {
        console.log(this.el) // == div 这个dom对象
        this.el.innerHTML =
            'name - ' + this.name + '<br>' // 指令名
            // 'raw - ' + this.raw + '<br>' + //原始表达式
            // 'expression - ' + this.expression + '<br>' + // 指令的表达式，不包括参数和过滤器
            // 'argument - ' + this.arg + '<br>' //指令的参数
            // 'value - ' + value
    },
    unbind: function() {
        alert(111)
    }
})
var demo = new Vue({
    el: '#demoo',
    data: {
        msg: 'hello!'
    }
})


Vue.directive('literal-dir', {
    isLiteral: true,
    bind: function() {
        alert(222)
        console.log(this.expression) // 'foo'
    }
})
new Vue({
    el: '#box'
})
