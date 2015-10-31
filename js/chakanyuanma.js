/*
var zipped = _.zip([1, 2], [10, 20], [100, 200]);
// → [[1, 10, 100], [2, 20, 200]]
 */
var zip = rest(unzip);

function rest(func, start) {

    start = 0;
    return function() {
        var args = arguments, //[1, 2], [10, 20], [100, 200]
            index = -1,
            length = 3
        array = Array(length);

        while (++index < length) {
            array[index] = args[start + index]; //[1, 2], [10, 20], [100, 200]
        }
        switch (start) {
            case 0:
                return func.call(this, array);
            case 1:
                return func.call(this, args[0], array);
            case 2:
                return func.call(this, args[0], args[1], array);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
            otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return func.apply(this, otherArgs);
    };
}
// [ [1, 2], [10, 20], [100, 200] ]
function unzip(array) {
    var length = 0;
    array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
            length = nativeMax(group.length, length);
            return true;
        }
    });

    return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
    });
}

function arrayFilter(array, predicate) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
            result[++resIndex] = value;
        }
    }
    return result;
}