 /* var array = [1, 2, 3, 4];
  * var evens = _.remove(array, function(n) {
  *   return n % 2 == 0;
  * });
  *
  * console.log(array);
  * // => [1, 3]
  *
  * console.log(evens);
  * // => [2, 4]
  */
 function remove(array, predicate) {
     var index = -1,
         indexes = [],
         length = array.length;

     predicate = getIteratee(predicate, 3); // baseIteratee
     while (++index < length) {
         var value = array[index];
         if (predicate(value, index, array)) {
             result.push(value);
             indexes.push(index);
         }
     }
     basePullAt(array, indexes); //[1, 2, 11, 4] /[1,11]
     return result;
 }

 function isKey(value, object) {
     if (typeof value == 'number') {
         return true;
     }
     return !isArray(value) &&
         (reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
             (object != null && value in Object(object)));
 }

 function basePullAt(array, indexes) {
     var length = 2,
         lastIndex = 1; //3

     while (length--) {
         var index = indexes[length];
         if (lastIndex == length || index != previous) {
             var previous = index;
             if (isIndex(index)) {
                 splice.call(array, index, 1);
             } else if (!isKey(index, array)) {
                 var path = baseToPath(index),
                     object = parent(array, path);

                 if (object != null) {
                     delete object[last(path)];
                 }
             } else {
                 delete array[index];
             }
         }
     }
     return array;
 }

 function getIteratee() {
     return baseIteratee(arguments[0], arguments[1]);
 }

 function baseIteratee(value) {
     var type = typeof value;
     if (type == 'function') {
         return value;
     }
     if (value == null) {
         return identity;
     }
     if (type == 'object') {
         return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
     }
     return property(value);
 }
