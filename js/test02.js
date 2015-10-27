// var arr = [1, 2];
//_.fill(arr, value, index, end) [index, end)  index和end可以为负值, 此时相当于从 index + arr.length 位置开始计算
// _.fill(arr, "yy");
// console.log(arr);

var arr2 = [{
    'name': 'yy',
    'age': 22
}, {
    'name': 'bb',
    'age': 24
}, {
    'name': 'aa',
    'age': 26
}];
// var ii = _.findIndex(arr2, {
//     'name': 'bb',
//     'age': 24
// })
// console.log(ii)
// var arr3 = [1, [
//         [2]
//     ],
//     [3]
// ]
// var res = _.flatten(arr3);
// console.log(res)

//二分查找 35
var arr4 = [1, 11, 21, 23, 35, 42, 56];

// function binarySearch(items, value) {
//     var startIndex = 0;
//     var stopIndex = items.length - 1;
//     var middle = (stopIndex + startIndex) >>> 1; //相当于 Math.floor(val/2)
//     while (items[middle] != value && startIndex < stopIndex) {

//         if (value < items[middle]) {
//             stopIndex = middle - 1; // 调整查找范围 
//         } else if (value > items[middle]) {
//             startIndex = middle + 1;
//         }

//         middle = (stopIndex + startIndex) >>> 1; //重新计算中项索引
//     }

//     return (items[middle] != value) ? -1 : middle;
// }
// var arr5 = _.intersection([1, 2], [2, 3], [2, 4]);
// console.log(arr5)
// outer:

//     for (var i = 0; i < 5; i++) {
//         if (i == 3) {
//             continue outer;
//         }
//         console.log(i); // 输出 : 0 1 2 4
//     }

var ar2 = [1, 2, 3, 4, 5]
_.pull(ar2, 2, 3);
// console.log(ar2); // [1, 4, 5]
// function calculate(number) {
//     return number / 3;
// }

// function getHalfOf(num1, num2, num3) {
//     function calculate(number) {
//         return number / 2;
//     }

//     var result = "";
//     result += calculate(num1) + " ";
//     result += calculate(num2) + " ";
//     result += calculate(num3);
//     return result;
// }
// var resultString = getHalfOf(10, 20, 30);
// alert(resultString); // 输出 "5 10 15"

// var cc = b(c);
// console.debug(cc(1, 2));

function c(arr, v) {
    var a = 3;
}

function b(par) {
    // alert(par)
    if (typeof par != 'function') {
        alert(1)
    }
    return function() {
        var args = arguments;
        console.log(args)
        return 2
    }
}

// var res = b(c)
// alert(res())
var array = [1, 2, 11, 4];
var evens = _.remove(array, function(n) {
    return n % 2 == 0;
});

console.log(array);
// => [1, 3]

console.log(evens);
// => [2, 4]
