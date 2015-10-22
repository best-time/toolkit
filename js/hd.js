! function() {

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
     * 
     */

    // "use strict";
    var root = this;
    var previousHD = root._sole;

    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype;

    //快速获取原型上的方法
    var
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var _sole = function(obj) {
        if (obj instanceof _sole) return obj;
        if (!(this instanceof _sole)) return new _sole(obj);
        this._wrapped = obj;
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _sole;
        }
        exports.__ = _sole;
    } else {
        root.__ = _sole;
    }

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var optimizeCb = function(func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1:
                return function(value) {
                    return func.call(context, value);
                };
                // The 2-parameter case has been omitted only because no current consumers
                // made use of it.
            case 3:
                return function(value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function(accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function() {
            return func.apply(context, arguments);
        };
    };

    // A mostly-internal function to generate callbacks that can be applied
    // to each element in a collection, returning the desired result — either
    // `identity`, an arbitrary callback, a property matcher, or a property accessor.
    var cb = function(value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };

    // An internal function for creating a new object that inherits from another.
    var baseCreate = function(prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    var property = function(key) {
        return function(obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object.
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };


    _sole.each = function(obj, iteratee, context) {
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
    _sole.map = function(obj, iteratee, context) {
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

    /*---------------------------------------
    ===================================================
        工具
    */

    //返回当前时间的时间戳(毫秒)
    _sole.now = Date.now || function() {
        return new Date().getTime();
    };

    //返回min-max之间的一个随机整数, 包括min,不包括max值
    _sole.random = function(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    //判断对象上是否含有变量key这个属性
    _sole.has = function(obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    _sole.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array'], function(name) {
        _sole['is' + name] = function(obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    _sole.isFinite = function(obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    _sole.isNaN = function(obj) {
        return _.isNumber(obj) && isNaN(obj);
    };

    _sole.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    _sole.trim = function(str) {
        if (!this.isString(str)) return;
        return str.replace(/^(\s*)|(\s*$)/g, '')
    }

    //是否是闰年
    _sole.isLeapYear = function(year) {
        if (!this.isNumber(year)) return;
        return year % ((year % 100) ? 4 : 100) ? false : true;
    }

    //随机生成颜色代码
    _sole.getRandomColor = function() {
        return ('000000' + Math.floor(Math.random() * 0x1000000).toString(16)).slice(-6);
    }

    _sole.objToArray = function() {
        return Array.prototype.slice.call(arguments);
    }

    /*
        获取当前时间, 格式如: "2015-5-7 9:04:10"  "2015-7-12 1:10:41"
        temp.toLocaleDateString() 返回格式 2015/7/12
        temp.toLocaleTimeString() 返回格式 "下午1:12:18"
    */
    _sole.getFormatTime = function() {
        var temp = new Date();
        var regex = /\//g;
        return (temp.toLocaleDateString() + ' ' +
            temp.toLocaleTimeString().slice(2)).replace(regex, '-');
    }

    //数组去重(此方法高效,比其他方法占用更多内存)
    _sole.arrayUnique = function(arr) {
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
    }

    //随机打乱数组
    _sole.disturbArray = function(arr) {
        if (!this.isArray(arr)) return;
        var arr = arr.sort(function(a, b) {
            return Math.random() > .5 ? -1 : 1;
        })
        return arr;
    }


    //获取某年某月的总天数
    _sole.getDaysInYearAndMonth = function(year, month) {
        var year = parseInt(year, 10),
            month = parseInt(month, 10);

        if (year && month) {
            return new Date(year, month, 0).getDate();
        }
        return;
    }

    _sole.isPhone = function(str) {
        if (!this.isString(str) && !this.isNumber(str)) return;
        var regu = /^(13[0-9])|(147)|(15[0-3])|(15[6-9])|(18[0-3])|(18[5-9])\d{8}$/;
        return regu.test(str);
    }

    _sole.isEmail = function(str) {
        if (!this.isString(str)) return;
        var regu = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
        return regu.test(str);
    }

    _sole.isUrl = function(str) {
        if (!this.isString(str)) return;
        var regu = /^((http|https):\/\/)+(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/;
        return regu.test(str);
    }

    /*
      判断身份证号码格式函数 公民身份号码是特征组合码， 
      排列顺序从左至右依次为：六位数字地址码，
                              八位数字出生日期码，
                              三位数字顺序码
                              一位数字校验码
    */
    _sole.isChinaIDCard = function(StrNo) {
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
                    if (c != 1) { /*alert("身份证好号码校验位错:最后一位应该为:1");*/
                        return false;
                    }
                    break;
                case 1:
                    if (c != 0) { /*alert("身份证好号码校验位错:最后一位应该为:0");*/
                        return false;
                    }
                    break;
                case 2:
                    if (c != "X") { /*alert("身份证好号码校验位错:最后一位应该为:X");*/
                        return false;
                    }
                    break;
                case 3:
                    if (c != 9) { /*alert("身份证好号码校验位错:最后一位应该为:9");*/
                        return false;
                    }
                    break;
                case 4:
                    if (c != 8) { /*alert("身份证好号码校验位错:最后一位应该为:8");*/
                        return false;
                    }
                    break;
                case 5:
                    if (c != 7) { /*alert("身份证好号码校验位错:最后一位应该为:7");*/
                        return false;
                    }
                    break;
                case 6:
                    if (c != 6) { /*alert("身份证好号码校验位错:最后一位应该为:6");*/
                        return false;
                    }
                    break;
                case 7:
                    if (c != 5) { /*alert("身份证好号码校验位错:最后一位应该为:5");*/
                        return false;
                    }
                    break;
                case 8:
                    if (c != 4) { /*alert("身份证好号码校验位错:最后一位应该为:4");*/
                        return false;
                    }
                    break;
                case 9:
                    if (c != 3) { /*alert("身份证好号码校验位错:最后一位应该为:3");*/
                        return false;
                    }
                    break;
                case 10:
                    if (c != 2) { /*alert("身份证好号码校验位错:最后一位应该为:2");*/
                        return false;
                    }
            }
        } else { // 15位身份证号
            if (!isNumber(StrNo)) { /*alert("身份证号码错误,前15位不能含有英文字母！");*/
                return false;
            }
        }
        return true;
    }

    function isValidDate(iY, iM, iD) {
        if (iY > 2200 || iY < 1900 || !isNumber(iY)) {
            //alert("输入身份证号,年度"+iY+"非法！");
            return false;
        }
        if (iM > 12 || iM <= 0 || !isNumber(iM)) {
            //alert("输入身份证号,月份"+iM+"非法！");
            return false;
        }
        if (iD > 31 || iD <= 0 || !isNumber(iD)) {
            //alert("输入身份证号,日期"+iD+"非法！");
            return false;
        }
        return true;
    }

    //测试代码效率的函数
    _sole.getEfficiency = function(dateString, times, func) {
        var startTime = window.performance.now(); //此函数精度较高
        for (var i = 0; i < times; i++) {
            func(dateString);
        };
        var endTime = window.performance.now();
        var gapTime = endTime - startTime;
        console.log('一共耗时:' + gapTime + 'ms');
        return gapTime;
    }

    //避免_sole变量的冲突
    _sole.noConflict = function() {
        root._sole = previousHD;
        return this;
    };
}()