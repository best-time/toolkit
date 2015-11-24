function map(arr, fn) {
    var res = [],
        i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}
// var res = map([1, 2, 3], function(value, index) {
//     return value * value
// })
// console.log(res)
var r1 = {
    name: "yuwy",
    age: 25,
    heigth: 172
};
for (var i in r1) {
    document.write("对象r1的索引: " + i + "  value值:" + r1[i] + "<br>")
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

// console.log(extend(r1, {
//     name: "yinweiyi",
//     b: 222
// }))

function aa() {
    return "aa";
}
aa.name = "yinwieyi"
// console.log(aa.name) // yinwieyi

document.write(moment().format() + "<br>");

// r1.aa = {};
// r1.aa.toString = function() {
//     return 2222
// }
// alert(r1.aa)

// (function(global, fa) {
//     fa();
// }(this, function() {
//     // console.log(this);
// }))

var arrs = [{
    name: "yy",
    age: 21
}, {
    name: "yy",
    age: 12
}, {
    name: "yy",
    age: 24
}, {
    name: "yy",
    age: 20.1
}]

function bb(arrs, age) {
    arrs.sort(function (a, b) {
        return a[age] > b[age];
    })
}
// bb(arrs, "age")
// console.log(arrs);
// arrs.reverse();
// console.log(arrs);


var aa = bb();

function bb() {
    var c = 1;
    return function () {
        var args = arguments.length;
        console.log(args)
        console.log(c * 10);
    }
}
aa([1, 2, 3]);