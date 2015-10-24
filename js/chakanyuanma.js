/*
var arr2 = [
                {
                    'name': 'yy',
                    'age': 22
                }, 
                {
                    'name': 'bb',
                    'age': 24
                }, 
                {
                    'name': 'aa',
                    'age': 26
                }
            ];
    var ii = _.findIndex(arr2, {
        'name': 'bb',
        'age': 24
    })
*/
function findIndex(array, predicate) {
    return (array && array.length) ? baseFindIndex(array, getIteratee(predicate, 3)) : -1; // predicate = {name:bb,age:24}
}

function getIteratee() {
    var result = lodash.iteratee || iteratee;
    result = result === iteratee ? baseIteratee : result; // result = iteratee() {}
    return arguments.length /*2*/ ? result(arguments[0], arguments[1]) : result;
}

function iteratee(func) {
    return (isObjectLike(func) && !isArray(func)) ? matches(func) : baseIteratee(func);
}

function matches(source) { //source = {name:bb,age:24}
    return baseMatches(baseClone(source, true));
}

function baseClone(value, isDeep, customizer, key, object, stack) {
    var result;
    if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
        return result;
    }
    if (!isObject(value)) {
        return value;
    }
    var isArr = isArray(value);
    if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
            return copyArray(value, result);
        }
    } else {
        var tag = getTag(value),
            isFunc = tag == funcTag; //false

        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
            if (isHostObject(value)) {
                return object ? value : {};
            }
            result = initCloneObject(isFunc ? {} : value);
            if (!isDeep) {
                return baseAssign(result, value);
            }
        } else {
            return cloneableTags[tag] ? initCloneByTag(value, tag, isDeep) : (object ? value : {});
        }
    }
    // Check for circular references and return its corresponding clone.
    stack || (stack = new Stack);
    var stacked = stack.get(value);
    if (stacked) {
        return stacked;
    }
    stack.set(value, result);

    // Recursively populate clone (susceptible to call stack limits).
    (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        result[key] = baseClone(subValue, isDeep, customizer, key, value, stack);
    });
    return result;
}

function getTag(value) {
    return objToString.call(value);
}

function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
        try {
            result = !!(value + '');
        } catch (e) {}
    }
    return result;
}

function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
            value = matchData[0][1];

        return function(object) {
            if (object == null) {
                return false;
            }
            return object[key] === value &&
                (value !== undefined || (key in Object(object)));
        };
    }
    return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
    };
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

function baseMatchesProperty(path, srcValue) {
    return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue) ? hasIn(object, path) : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
    };
}

function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
            return index;
        }
    }
    return -1;
}
