// {{$index}}  指代索引   无论是对象还是数组


new Vue({
    el: '#demo',
    data: {
        title: 'todos',
        todos: [
            {
                done: true,
                content: 'Learn JavaScript'
            },
            {
                done: false,
                content: 'Learn vue.js'
            }
        ]
    }
})

new Vue({
    el: "#demo2",
    data: {
        parentMsg: 'hello',
        items: [
            {
                childMsg: 'Foo'
            },
            {
                childMsg: 'Bar'
            }
        ]
    }
})

//包含多个节点的循环, html代码需要添加<template>标签包裹
// new Vue({
//     el: "#demo3",
//     data: {
//         list: [{
//             msg: '第一个节点'
//         }, {
//             msg: '第二个节点'
//         }]
//     }
// })

//简单值数组数据 展示
new Vue({
    el: "#demo4",
    data: {
        tags: ["Javascript", "MVVM", "vue.js"]
    }
})

//使用别名
// new Vue({
//     el: "#demo5",
//     data: {
//         users: [{
//             name: 'FOO BAR',
//             email: 'foo@bar.plugins'
//         }, {
//             name: 'John Doh',
//             email: 'John@Doh.plugins'
//         }]
//     }
// })

//遍历对象
new Vue({
    el: "#demo6",
    data: {
        primitiveValues: {
            FirstName: 'John',
            _LastName: 'Doe',
            ______Age: 30
        },
        objectValues: {
            one: {
                msg: 'hello'
            },
            two: {
                msg: 'Bye'
            }
        }
    }
})

//迭代值域  v-repeat 值为整数
new Vue({
    el: "#demo7",
    data: {
        val: 3
    }
})

//事件监听
new Vue({
    el: '#demo8',
    data: {
        n: 0
    },
    methods: {
        onClick: function (e) { // DOM event作为第一个参数传入, 同时这个event会带有targetVM属性,指向触发该事件的响应的ViemModel
            console.log(e.target.tagName);
            console.debug(e.targetVM == this)
        }
    }
})

//执行表达式
new Vue({
    el: "#demo9",
    data: {
        items: [
            {
                text: 'one',
                done: true
            },
            {
                text: 'two',
                done: true
            }
        ]
    },
    methods: {
        toggle: function (item) {
            item.done = !item.done;
        }
    }
});


//键盘监听事件
new Vue({
    el: '#demo10',
    methods: {
        submit: function (e) {
            console.log(e.target.tagName)
        },
        submit2: function (e) {
            console.log("按了enter键")
        }
    }
})