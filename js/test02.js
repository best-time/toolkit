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
var ii = _.findIndex(arr2, {
    'name': 'bb',
    'age': 24
})
console.log(ii)
