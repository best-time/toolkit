/*
_.takeRightWhile([1, 2, 3], function(n) {
  return n > 1;
});
// → [2, 3]
*/
function takeRightWhile(array, predicate) {
    return (array && array.length) ? baseWhile(array, function(n) {
        return n > 1;
    }, false, true) : [];
}


function baseWhile(array, predicate, isDrop, fromRight) {
    var length = array.length, //3 
        index = fromRight ? length : -1; //3

    while (
        (fromRight ? index-- : ++index < length) 
        &&
        predicate(array[index], index, array)
        ) {

}


    return isDrop ?
        baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length)) :
        baseSlice(array, 1, 3);
}

function baseSlice(array, start, end) {
    var index = -1,
        length = array.length; // 3

    start = start == null ? 0 : toInteger(start);
    1
    if (start < 0) {
        start = -start > length ? 0 : (length + start);
    }
    end = (end === undefined || end > length) ? length : toInteger(end); //3
    if (end < 0) {
        end += length;
    }
    length = start > end ? 0 : ((end - start) >>> 0); //2
    start >>>= 0; //1

    var result = Array(length);
    while (++index < length) {
        result[index] = array[index + start];
    }
    return result;
}
