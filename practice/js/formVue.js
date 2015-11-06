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


//计算属性
// var vm = new Vue({
//     el: "#demo1",
//     data: {
//         firstName: 'Foo',
//         lastName: 'Bar',
//         fullName: 'Foo Barrrrrr'
//     },
//     methods: {
//         cc: function(e) {
//             vm.lastName += "ywy"
//         }
//     }
// })

// vm.$watch('firstName', function(val) {
//     this.fullName = val + ' ' + this.lastName
// })

// vm.$watch('lastName', function(val) {
//     this.fullName = this.firstName + ' ' + val
// })

//注释的代码是过程式的

//下面是计算式的实现
// new Vue({
//     el: "#demo1",
//     data: {
//         firstName: 'Foo',
//         lastName: 'Bar'
//     },
//     methods: {
//         cc: function(e) {
//             this.firstName += "---";
//         }
//     },
//     computed: {
//         fullName: function() {
//             return this.firstName + ' ' + this.lastName

//         }
//     }
// })


// new Vue({
//     el: '#list',
//     data: {
//         items: [{
//             text: 'one',
//             done: true
//         }, {
//             text: 'two',
//             done: false
//         }]
//     },
//     methods: {
//         toggle: function(item) {
//             item.done = !item.done
//         }
//     }
// })

//自定义指令
/**
 *  el: 指令绑定的元素
    vm: 拥有该指令的上下文 ViewModel
    expression: 指令的表达式，不包括参数和过滤器
    arg: 指令的参数
    raw: 未被解析的原始表达式
    name: 不带前缀的指令名

    例如:
    原始表达式: maroon : msg
    指令的参数 maroon
    表达式  msg
    不带前缀的指令名 demo

 */

// Vue.directive('demo', {
//     bind: function() {
//         this.el.style.color = '#fff'
//         this.el.style.backgroundColor = this.arg
//     },
//     update: function(value) {
//         this.el.innerHTML =
//             'name(不带前缀的指令名) : ' + this.name + '<br>' +
//             'raw(未被解析的原始表达式) : ' + this.raw + '<br>' +
//             'expression(指令的表达式，不包括参数和过滤器) : ' + this.expression + '<br>' +
//             'argument(参数) : ' + this.arg + '<br>' +
//             'value(属性值) : ' + value //属性值
//             /*
//                 name : demo
//                 raw : maroon : msg
//                 expression : msg
//                 argument : maroon
//                 value : hello!
//              */
//     }
// })

// var demo = new Vue({
//     el: '#demo2',
//     data: {
//         msg: 'hello!',
//         msg2: "hehe"
//     }
// })

// 指令使用
// Vue.directive('demo-zhiling', {
//         // bind: function() {
//         //     this.el.style.color = '#fff'
//         //     this.el.style.backgroundColor = this.arg
//         // },

//         update: function(value) {
//             console.log(this.el) // == div 这个dom对象
//             this.el.innerHTML =
//                 'name - ' + this.name + '<br>' // 指令名
//                 // 'raw - ' + this.raw + '<br>' + //原始表达式
//                 // 'expression - ' + this.expression + '<br>' + // 指令的表达式，不包括参数和过滤器
//                 // 'argument - ' + this.arg + '<br>' //指令的参数
//                 // 'value - ' + value
//         },
//         unbind: function() {
//             alert(111)
//         }
//     })
// var demo = new Vue({
//     el: '#demoo',
//     data: {
//         msg: 'hello!'
//     }
// })

// // 扩展 Vue 得到一个可复用的构造函数
// var MyComponent = Vue.extend({
//     template: '<p>A custom component!</p>'
// });




// // 把构造函数注册到 my-component 这个 id
// Vue.component('my-component', MyComponent);
// Vue.directive('literal-dir', {
//     isLiteral: true,
//     bind: function() {
//         alert(222)
//         console.log(this.expression) // 'foo'
//     }
// })
// new Vue({
//     el: '#box'
// })



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
