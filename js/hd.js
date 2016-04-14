!function () {

    /**
     * note:
     * sort reverse() 直接在原始数组上排序或翻转,不需要第二个变量
     *
     * Date 和 new Date() 区别:
     * Date()直接返回当前时间字符串，不管参数是number还是任何string
     *
     *new Date()在参数正常的情况只会返回当前时间的字符串(且是当前时区的时间)
     new Date()在解析一个具体的时间的时候，对参数有较严格的格式要求，
     格式不正确的时候会直接返回Invalid Date，
     比如将number类的时间戳转换成string类的时候也会导致解析出错
     虽然new Date()的返回值是字符串，然而两个new Date()的结果字符串是可以直接相减的，
     结果为相差的毫秒数。
     *
     * 从计算效率上来说，
     * Date.prototype.getTime()≈Date.prototype.valueOf()>+Date≈Number(Date)>>Date.parse()
     *
     *
     //Fisher-Yates 随机算法
     function shuffle(array) {
        var copy = [],
            n = array.length,
            i;
        // 如果还剩有元素。。
        while (n) {
            // 随机选取一个元素
            i = Math.floor(Math.random() * n--);
            copy.push(array.splice(i, 1)[0]);
        }
        return copy;
     }
     */

    // "use strict";
    var root = this;
    var previousHD = root._;

    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype;

    var
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        //this._wrapped = obj;
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports.__ = _;
    } else {
        //console.log(_.prototype)
        root.__ = _;
    }

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other functions.
    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
            // The 2-parameter case has been omitted only because no current consumers
            // made use of it.
            case 3:
                return function (value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };

    // A mostly-internal function to generate callbacks that can be applied
    // to each element in a collection, returning the desired result — either
    // `identity`, an arbitrary callback, a property matcher, or a property accessor.
    var cb = function (value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };

    // An internal function for creating a new object that inherits from another.
    var baseCreate = function (prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    var property = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object.
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function (collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _.each = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };

    // Return the results of applying the iteratee to each element.
    _.map = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    _.identity = function (value) {
        return value;
    };


    /*-------------------------------------------------
     ===================================================
     工具
     -------------------------------------------------*/

    //返回当前时间的时间戳(毫秒)
    _.now = Date.now || function () {
            return +new Date() || new Date() - 0 || new Date().getTime();
        };

    //返回[min, max)之间的一个随机整数
    _.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    //判断对象上是否含有变量key这个属性
    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    /*
     摘自: javascript 语言精粹  P61
     var isArray = function(value) {
     return value &&
     typeof value === 'object' &&
     typeof value.length === 'number' &&
     typeof value.splice === 'function' && //区别arguments和array
     !(value.propertyIsEnumerable('length'));
     }
     //propertyIsEnumberable方法是Object类下的一个用来检测是否能用for in的一个方法，
     //返回布尔值。
     1. 排除假值
     2. object array null 都返回 object
     3. 数组的length总会得到true,对象则不一定
     4. 判断这个值是否包含splice方法, 数组会得到true
     5. length是否能通过 for in 遍历出来, 对于数组将得到true

     P115
     function isNumber(value) {
     return typeof value === 'number' && isFinite(value)
     }
     */
    _.is = {};
    // define interfaces
    _.is.not = {};
    _.is.all = {};
    _.is.any = {};
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    _.isFinite = function (obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    _.isNaN = function (obj) {
        return _.isNumber(obj) && isNaN(obj);
    };


    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    _.trim = function (str) {
        if (!this.isString(str)) return;
        return str.replace(/^(\s*)|(\s*$)/g, '')
    };

    //是否是闰年
    _.isLeapYear = function (year) {
        if (!this.isNumber(year)) return;
        return year % ((year % 100) ? 4 : 100) ? false : true;
    };


    /**
     *  判断参数是否是某个类型, 返回值 boolean
     */
    _.is.nan = function (value) { //NaN是一个数字,但它不等于它自己
        return value !== value;
    };

    _.is.number = function (value) {
        return _.is.not.nan(value) && toString.call(value) === '[object Number]';
    };
    _.is.null = function (value) {
        return value === null;
    };
    _.is.undefined = function (value) {
        return value === void 0;
    };
    _.is.function = function (func) {
        return toString.call(func) === '[object Function]' ||
            typeof func === 'function';
    };
    _.is.array = Array.isArray ||
        function (value) {
            return toString.call(value) === '[object Array]';
        };

    _.is.char = function (value) {
        return is.string(value) && value.length === 1;
    };

    _.is.arguments = function (value) {
        return _.is.not.null(value)
            &&
            (
                toString.call(value) === '[object Arguments]' ||
                (typeof value === 'object' && 'callee' in value)
            );
    };

    // 判断字符串中是否有 '空格'
    // horizontal tab 水平制表符: 9, line feed 换行符: 10, vertical tab 垂直制表符: 11,
    // form feed 换页: 12, carriage return 回车: 13, space 空格: 32
    _.is.space = function (value) {
        if (_.is.char(value)) {
            var characterCode = value.charCodeAt(0);
            return (characterCode > 8 && characterCode < 14) ||
                characterCode === 32;
        } else {
            return false;
        }
    };

    _.is.empty = function (value) { //可判断 Objects, arrays, strings 类型是否为空
        if (is.object(value)) {
            var num = Object.getOwnPropertyNames(value).length;
            if (num === 0 ||
                (num === 1 && _.is.array(value)) ||
                (num === 2 && _.is.arguments(value))
            ) {
                return true;
            }
            return false;
        } else {
            return value === '';
        }
    };
    _.is.sameType = function (value1, value2) {
        if (is.nan(value1) || is.nan(value2)) {
            return is.nan(value1) === is.nan(value2);
        }
        return toString.call(value1) === toString.call(value2);
    };
    // sameType method does not support 'all' and 'any' interfaces
    _.is.sameType.api = ['not'];

    //常用正则表达式
    var regexps = {
        url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
        ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
        ipv6: /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
        ip: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
    };

    // create regexp checks methods from 'regexp' object
    for (var regexp in regexps) {
        if (regexps.hasOwnProperty(regexp)) {
            regexpCheck(regexp, regexps);
        }
    }

    function regexpCheck(regexp, regexps) {
        _.is[regexp] = function (value) {
            return regexps[regexp].test(value);
        };
    }


    //把is对象上的方法, 复制到is.not  is.all  is.any 对象上
    function setInterfaces() {
        var options = _.is,
            option;
        for (option in options) {
            if (
                hasOwnProperty.call(options, option) &&
                is.function(options[option])
            ) {
                var interfaces = options[option].api || ['not', 'all', 'any'];
                for (var i = 0; i < interfaces.length; i++) {
                    if (interfaces[i] === 'not') {
                        _.is.not[option] = not(is[option]);
                    }
                    if (interfaces[i] === 'all') {
                        _.is.all[option] = all(is[option]);
                    }
                    if (interfaces[i] === 'any') {
                        _.is.any[option] = any(is[option]);
                    }
                }
            }
        }
    }

    setInterfaces();

    //随机生成颜色代码
    _.getRandomColor = function () {
        return ('000000' + Math.floor(Math.random() * 0x1000000).toString(16)).slice(-6);
    };

    _.objToArray = function () {
        return Array.prototype.slice.call(arguments);
    };

    /*
     获取当前时间, 格式如: "2015-5-7 9:04:10"  "2015-7-12 1:10:41"
     temp.toLocaleDateString() 返回格式 2015/7/12
     temp.toLocaleTimeString() 返回格式 "下午1:12:18"
     */
    _.getFormatTime = function () {
        var temp = new Date();
        var regex = /\//g;
        return (temp.toLocaleDateString() + ' ' +
        temp.toLocaleTimeString().slice(2)).replace(regex, '-');
    };

    //数组去重(此方法高效, 但比其他方法占用更多内存)
    _.arrayUnique = function (arr) {
        if (!this.isArray(arr)) return;
        var n = {},
            r = []; //n为hash表，r为临时数组
        for (var i = 0; i < arr.length; i++) {
            if (!n[arr[i]]) { //如果hash表中没有当前项
                n[arr[i]] = true; //存入hash表
                r.push(arr[i]); //把当前数组的当前项push到临时数组里面
            }
        }
        return r;
    };

    //随机打乱数组
    _.disturbArray = function (arr) {
        if (!this.isArray(arr)) return;
        var arr = arr.sort(function (a, b) {
            return Math.random() > .5 ? -1 : 1;
        });
        return arr;
    };


    //获取某年某月的总天数
    _.getDaysInYearAndMonth = function (year, month) {
        var year = parseInt(year, 10),
            month = parseInt(month, 10);

        if (year && month) {
            return new Date(year, month, 0).getDate();
        }
        return;
    };

    _.isPhoneNumber = function (str) {
        if (!this.isString(str) && !this.isNumber(str)) return;
        var regu = /^(13[0-9])|(147)|(15[0-3])|(15[6-9])|(18[0-3])|(18[5-9])\d{8}$/;
        return regu.test(str);
    };

    _.isEmail = function (str) {
        if (!this.isString(str)) return;
        var regu = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
        return regu.test(str);
    };

    _.isUrl = function (str) {
        if (!this.isString(str)) return;
        var regu = /^((http|https):\/\/)+(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/;
        return regu.test(str);
    };

    //实现对象拷贝,只拷贝了'第一层',如果第一层保存'第二层'数据的引用, 此方法存在问题
    // _.extend = function(target, source) {
    //     var i;
    //     for (i in source) {
    //         if (source.hasOwnProperty(i)) {
    //             target[p] = source[i];
    //         }
    //     }
    //     return target;
    // }

    //实现数组 对象深复制
    //slice和concat方法。这2个方法的确是最快的把数组成功复制，而不是引用。
    function getType(o) { // [object Array] [object Object] [object Null]
        var _t;
        return ((_t = typeof(o)) == "object" ?
        o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
    }

    _.extend = function (destination, source) {
        for (var p in source) {
            if (getType(source[p]) == "array" || getType(source[p]) == "object") {
                destination[p] = getType(source[p]) == "array" ? [] : {};
                arguments.callee(destination[p], source[p]);
            } else {
                destination[p] = source[p];
            }
        }
    };
    /**
     *    var dad = {
            counter: [1, 2, 3],
            reads: {paper: true}
        }
     var kkid = extendDeep(dad);
     */
    function extendDeep(parent, child) {
        var i,
            toStr = Object.prototype.toString,
            astr = "[object Array]";
        var child = child || {};
        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === "object") {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                    extendDeep(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
        }
        return child;
    }

    //设置cookie
    _.setCookie = function (name, value, hours) { //写cookie
        var exp = new Date();
        exp.setTime(exp.getTime() + hours * 60 * 60 * 1000);
        if (navigator.cookieEnabled) {
            document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString();
        }
    };

    //读取cookie
    _.getCookie = function (name) { //取cookie
        if (navigator.cookieEnabled) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return decodeURI(arr[2]);
        }
    };

    // 二分查找 items 必须是排序好的 数组
    _.binarySearch = function (items, value) {
        var startIndex = 0;
        var stopIndex = items.length - 1;
        var middle = (stopIndex + startIndex) >>> 1; //相当于 Math.floor(val/2)
        while (items[middle] != value && startIndex < stopIndex) {
            if (value < items[middle]) {
                stopIndex = middle - 1; // 调整查找范围 
            } else if (value > items[middle]) {
                startIndex = middle + 1;
            }
            middle = (stopIndex + startIndex) >>> 1; //重新计算中项索引
        }
        return (items[middle] != value) ? -1 : middle;
    };

    //阶乘
    _.factorial = function (num, parm) {
        if (!_.isNumber(num)) return;
        var res = parm || 1;
        if (num < 2) {
            return res;
        }
        return factorial(num - 1, res * num); //arguments.callee
    };
    /**
     * ie相关判断
     */
    isIE = function () {
        return !!window.ActiveXObject;
    };
    isIE6 = function () {
        return isIE() && !window.XMLHttpRequest;
    };
    isIE7 = function () {
        return isIE() && !isIE6() && !isIE8();
    };
    isIE8 = function () {
        return isIE() && !!document.documentMode;
    };

    /*
     判断身份证号码格式函数 公民身份号码是特征组合码，
     排列顺序从左至右依次为：六位数字地址码，
     八位数字出生日期码，
     三位数字顺序码
     一位数字校验码
     */
    _.isChinaIDCard = function (StrNo) {
        if (!this.isString(StrNo)) return;
        StrNo = StrNo.toString();
        if (StrNo.length == 15) {
            if (!isValidDate("19" + StrNo.substr(6, 2), StrNo.substr(8, 2), StrNo.substr(10, 2))) {
                return false;
            }
        } else if (StrNo.length == 18) {
            if (!isValidDate(StrNo.substr(6, 4), StrNo.substr(10, 2), StrNo.substr(12, 2))) {
                return false;
            }
        } else {
            // alert("输入的身份证号码必须为15位或者18位！");
            return false;
        }

        if (StrNo.length == 18) {
            var a, b, c;
            if (!isNumber(StrNo.substr(0, 17))) {
                //alert("身份证号码错误,前17位不能含有英文字母！");
                return false;
            }
            a = parseInt(StrNo.substr(0, 1)) * 7 + parseInt(StrNo.substr(1, 1)) * 9 + parseInt(StrNo.substr(2, 1)) * 10;
            a = a + parseInt(StrNo.substr(3, 1)) * 5 + parseInt(StrNo.substr(4, 1)) * 8 + parseInt(StrNo.substr(5, 1)) * 4;
            a = a + parseInt(StrNo.substr(6, 1)) * 2 + parseInt(StrNo.substr(7, 1)) * 1 + parseInt(StrNo.substr(8, 1)) * 6;
            a = a + parseInt(StrNo.substr(9, 1)) * 3 + parseInt(StrNo.substr(10, 1)) * 7 + parseInt(StrNo.substr(11, 1)) * 9;
            a = a + parseInt(StrNo.substr(12, 1)) * 10 + parseInt(StrNo.substr(13, 1)) * 5 + parseInt(StrNo.substr(14, 1)) * 8;
            a = a + parseInt(StrNo.substr(15, 1)) * 4 + parseInt(StrNo.substr(16, 1)) * 2;
            b = a % 11;
            if (b == 2) { // 最后一位为校验位
                c = StrNo.substr(17, 1).toUpperCase(); // 转为大写X
            } else {
                c = parseInt(StrNo.substr(17, 1));
            }
            switch (b) {
                case 0:
                    if (c != 1) {
                        return false;
                    }
                    break;
                case 1:
                    if (c != 0) {
                        return false;
                    }
                    break;
                case 2:
                    if (c != "X") {
                        return false;
                    }
                    break;
                case 3:
                    if (c != 9) {
                        return false;
                    }
                    break;
                case 4:
                    if (c != 8) {
                        return false;
                    }
                    break;
                case 5:
                    if (c != 7) {
                        return false;
                    }
                    break;
                case 6:
                    if (c != 6) {
                        return false;
                    }
                    break;
                case 7:
                    if (c != 5) {
                        return false;
                    }
                    break;
                case 8:
                    if (c != 4) {
                        return false;
                    }
                    break;
                case 9:
                    if (c != 3) {
                        return false;
                    }
                    break;
                case 10:
                    if (c != 2) {
                        return false;
                    }
            }
        } else { // 15位身份证号
            if (!isNumber(StrNo)) {
                return false;
            }
        }
        return true;
    };

    function isValidDate(iY, iM, iD) {
        if (iY > 2200 || iY < 1900 || !isNumber(iY)) {
            return false;
        }
        if (iM > 12 || iM <= 0 || !isNumber(iM)) {
            return false;
        }
        if (iD > 31 || iD <= 0 || !isNumber(iD)) {
            return false;
        }
        return true;
    }

    //测试代码效率的函数, 函数参数放在一个数组中
    _.getEfficiency = function (times, func, parm) {
        var startTime = window.performance.now(); //此函数精度较高
        for (var i = 0; i < times; i++) {
            func(parm.join(","));
        }
        var endTime = window.performance.now();
        var gapTime = endTime - startTime;
        console.log('一共耗时:' + gapTime + 'ms');
        return gapTime;
    };

    //判断一个值是否存在, javascript中有2个值表示不存在:null undefined
    function existy(value) {
        return value != null;
    }

    //判断一个值是否为true的同义词
    function truthy(value) {
        return existy(value) &&
            value !== false &&
            _.is.not.nan(value) &&
            value !== "" &&
            value !== 0;
    }

    //避免_变量的冲突
    _.noConflict = function () {
        root._ = previousHD;
        return this;
    };
    //反转函数结果
    function not(func) {
        return function () {
            return !func.apply(null, slice.call(arguments));
        }
    }

    //对传入的参数,传入函数,每一项都是true,才返回true
    function all(func) {
        return function () {
            var parameters = slice.call(arguments);
            var length = parameters.length;
            if (length === 1 && is.array(parameters[0])) {    // 只传入一个数组参数 support array
                parameters = parameters[0];
                length = parameters.length;
            }
            for (var i = 0; i < length; i++) {
                if (!func.call(null, parameters[i])) { //有一个是false, 则返回false
                    return false;
                }
            }
            return true;
        };
    }

    //对传入的参数,传入函数,有一项是true,就返回true
    function any(func) {
        return function () {
            var parameters = slice.call(arguments);
            var length = parameters.length;
            if (length === 1 && is.array(parameters[0])) {    // support array
                parameters = parameters[0];
                length = parameters.length;
            }
            for (var i = 0; i < length; i++) {
                if (func.call(null, parameters[i])) { //有一个是true,则返回true
                    return true;
                }
            }
            return false;
        };
    }

    /**
     * 获取字符串长度，中文算2个
     */
    function getStrLength(str) {
        var cArr = str.match(/[^\x00-\xff]/ig);
        return str.length + (cArr == null ? 0 : cArr.length);
    }

    //url 格式校验
    function isURL(str_url) {
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
            + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            + "|" // 允许IP和DOMAIN（域名）
            + "([0-9a-z_!~*'()-]+.)*" // 域名- www.
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
            + "[a-z]{2,6})" // first level domain- .com or .museum
            + "(:[0-9]{1,4})?" // 端口- :80
            + "((/?)|" // a slash isn't required if there is no file name
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        var re = new RegExp(strRegex);
        //re.test()
        if (re.test(str_url)) {
            return (true);
        } else {
            return (false);
        }
    }

    //汉字 字母 数字 reg
    var reg1 = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
    var reg2 = /^[-]{0,1}(\d+)[\.]+(\d+)$/; //小数



    //返回ie版本号 6/7/8/9
    var ie = (function () {
        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');

        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );

        return v > 4 ? v : undef;
    }());
}();
