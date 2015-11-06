//循环展示数据
new Vue({
    el: '#app',
    data: {
        todos: [{
            text: 'Learn JavaScript'
        }, {
            text: 'Learn Vue.js'
        }, {
            text: 'Build Something Awesome'
        }]
    }
})

//处理用户输入
new Vue({
    el: '#user',
    data: {
        message: 'Hello Vue.js!'
    },
    methods: {
        reverseMessage: function() {
            this.$data.message = this.$data.message.split('').reverse().join('')
        }
    }
})


var vm = new Vue({
    el: "#tt",
    data: {
        a: 1
    },
    methods: {
        bb: function() {
            console.log("bb的方法")
        }
    },
    ready: function() {
        console.log("ready");
        console.log(this)
        this.bb();
    },
    compile: function() {
        cosole.log("compile")
    },
    created: function() { // created 钩子在实例创建后调用
        // `this` 指向 vm 实例
        console.log('a is: ' + this.a)
    }
})
