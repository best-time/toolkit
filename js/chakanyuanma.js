//var ar2 = [1, 2, 3, 4, 5]
//_.pull(ar2, 2, 3); // [1, 4, 5]
var pull = rest(pullAll);

function pullAll(array, values) {
    return (array && array.length && values && values.length) ? basePullAll(array, values) : array;
}

function rest(func, start) {
    if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
    return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
            array[index] = args[start + index];
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
