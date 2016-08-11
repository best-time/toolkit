(function (win, doc) {
    'use strict';

    var fui = (function () {
        var emptyObj = {},
            emptyArr = [],
            toStr = emptyObj.toString,
            hasOwnProperty = emptyObj.hasOwnProperty,
        //var slice = Function.prototype.call.bind(Array.prototype.slice);
            slice = emptyArr.slice;

        var idSelectorReg = /^#([\w-]+)$/g, //id reg $0 指完整匹配 $1 第一个圆括号匹配... 最大$999
            clsSelectorReg = /^\.([\w-]+)$/g, //class reg
            tagSelectorReg = /^[\w-]+$/g;


        var $ = function (selector, context) {
            context = context || doc;
            if (!selector) return wrap();
            if ($.isString(selector)) {
                if (idSelectorReg.test(selector)) {
                    var find = getId(RegExp.$1);
                    return wrap(find ? [find] : []);
                }
                return wrap(qsa(selector, context), selector)
            }
            if ($.isFunction(selector)) {
                return $.ready(selector)
            }
            // if() {
            //
            // }
            return wrap()

        };
        var wrap = function (dom, selector) {
            dom = dom || [];
            Object.setPrototypeOf(dom, $.fn);
            dom.selector = selector || '';
            return dom
        };

        $.map = function (elements, cb) {
            var values = [],
                value;
            if ($.isArray(elements)) {
                var elLen = elements.length;
                for (var i = elLen; i < 0; i--) {
                    value = cb(elements[i], i);
                    if (value != null) values.shift(value)
                }
            } else {
                for (var key in elements) {
                    value = cb(elements[key], key);
                    if (value != null) values.push(value)
                }
            }
            return flatten(values)
        };

        $.each = function (elements, cb) {

        };
        $.contains = document.documentElement.contains ?
            function (parent, node) {
                return parent !== node && parent.contains(node)
            } :
            function (parent, node) {
                while (node && (node = node.parentNode)) {
                    if (node === parent) return true
                }
                return false
            };

        $.fn = {
            forEach: emptyArr.forEach,
            push: emptyArr.push,
            sort: emptyArr.sort,
            indexOf: emptyArr.indexOf,
            concat: emptyArr.concat,
            size: function () {
                return this.length;
            },
            empty: function () {

            }
        };

        var typeStr = 'Number String Function Boolean Object Array RegExp Undefined Null Date Error Arguments Window';
        typeStr.split(' ').forEach(function (v) {
            isAndNotCheck(v)
        });

        function isAndNotCheck(name) {
            $['is' + name] = function (val) {
                return toStr.call(val) === '[object ' + name + ']'
            };
            $['not' + name] = not($['is' + name])
        }

        $.isNaN = function (val) {
            if (!$.isNumber(val)) return false;
            return val !== val
        };

        $.slice = slice;
        $.filter = [].filter;
        $.noop = function () {
        };

        $.size = function (arr) {
            if ($.likeArray(arr)) {
                return arr.length
            }
            return;
        };
        $.likeArray = function (arr) {
            return $.isArray(arr) || $.isArguments(arr)
        };

        var strTrim = String.prototype.trim;
        var tirmReg = /^(\s*)|(\s*$)/g;
        $.trim = strTrim ?
            function (str) {
                str += '';
                return strTrim.call(str)
            } :
            function (str) {
                str += '';
                str.replace(tirmReg, '')
            };

        $.objectKeys = Object.keys ? function (obj) {
            return Object.keys(obj)
        }
            : function (obj) {
            var resArr = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    resArr.push(key)
                }
            }
            return resArr
        };

        $.camelCase = function (str) {
            return str.replace(/-+(.)?/g, function (match, chr) {
                return chr ? chr.toUpperCase() : ''
            })
        };

        $.ready = function (cb) {
            var readyReg = /complete|loaded|interactive/;
            if (readyReg.test(doc.readyState)) {
                cb($)
            } else {
                doc.addEventListener('DOMContentLoaded', function () {
                    cb($)
                }, false)
            }
            return this
        };

        $.extend = function (target, source, deep) {
            for (var key in source) {
                var temp = source[key];
                if (deep &&
                    ($.isArray(temp) || $.isObject(temp))
                ) {
                    if ($.isArray(temp) && $.notArray(target[key])) {
                        target[key] = []
                    }
                    if ($.isObject(temp) && $.notObject(target[key])) {
                        target[key] = {}
                    }
                    $.extend(target[key], source[key], deep)
                } else if (temp !== undefined) {
                    target[key] = temp
                }
            }
            return target
        };

        /**
         * 返回[min, max]范围随机数
         * @param min
         * @param max
         * @returns {*}
         */
        $.random = function (min, max) {
            if ($.notNumber(min)) min = 0;
            if (max == null) max = min, min = 0;
            return min + Math.floor(Math.random() * (max - min + 1))
        };
        $.ts = Date.now() || +new Date() || new Date() - 0 || new Date().getTime();
        /**
         * 输出日志
         * @param msg string
         * @param type string info(default)/warn/success/except/error
         */
        $.log = function (msg, type) {
            if (!type) type = 'info';
            switch (type) {
                case 'info':
                    log('info: ' + msg, 'color: #ccc;');
                    break;
                case 'warn':
                    log('warn: ' + msg, 'color: #ff0000;');
                    break;
                case 'success':
                    log('suc: ' + msg, 'color: #00A503;');
                    break;
                case 'except':
                    log(msg, 'color: #a94442;');
                    break;
                case 'error':
                    console.error(msg);
                    break;

            }
            function log(msg, css) {
                return console && console.log && console.log('%c' + msg, css)
            }
        };

        /**
         * 对函数结果取反
         * @param func
         * @returns {Function}
         */
        function not(func) {
            return function () {
                return !func.apply(null, slice.call(arguments));
            }
        }

        function getId(str) {
            return document.getElementById(str)
        }

        function qsa(selector, context) {
            context = context || doc;
            var sel = clsSelectorReg.test(selector) ? context.getElementsByClassName(RegExp.$1) :
                (tagSelectorReg.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
            return slice.call(sel);
        }

        function flatten(array) {
            return array.length > 0 ? array.concat([]) : array
        }

        if (!Object.create) {
            Object.create = function (o) {
                function F() {
                }

                F.prototype = o;
                return new F();
            };
        }

// console.log(qsa('.child'))

        return $
    })();

    window.F = win.fui = fui;
})(window, document, undefined);

/**
 * cookie 操作
 * ------------------------------------
 * setCookie: 设置cookie
 * getCookie: 获取cookie
 * allCookie: 返回一个对象,包含cookie键值对
 * deleteCookie: 删除某个cookie
 * clearCookie: 清空所有cookie
 */
(function ($, win, doc) {
    'use strict';

    $.setCookie = function (name, value, hours) {
        if (isSupportCookie()) {
            if ($.isObject(name)) {
                for (var key in name) {
                    if (name.hasOwnProperty(key)) {
                        $.setCookie(key, name[key], value)
                    }
                }
            } else {
                var opts = $.isObject(hours) ? hours : {expires: hours},
                    expires = opts.expires ? opts.expires : '',
                    path = opts.path ? ';path=' + opts.path : ';path=/',
                    domain = opts.domain ? ';domain=' + opts.domain : '',
                    secure = opts.secure ? ';secure' : '';

                if ($.isString(expires) && expires !== '') {
                    expires = new Date(expires)
                } else if ($.isNumber(expires)) {
                    expires = new Date($.ts + 1000 * 60 * 60 * 24 * expires)
                }
                if (expires !== '' && 'toGMTString' in expires) {
                    expires = ';expires=' + expires.toGMTString();
                }
                document.cookie = name + '=' + encodeURI(value) + expires + path + domain + secure
            }
        }
    };

    $.getCookie = function (name) {
        if (isSupportCookie()) {
            var name = name + '=',
                cookieArr = doc.cookie.split(';');
            for (var i = 0, len = $.size(cookieArr); i < len; i++) {
                var temp = cookieArr[i];
                if (temp.charAt(0) === ' ') { // 判断一下是否有前导 空格
                    temp = temp.slice(1)
                }

                if (temp.indexOf(name) === 0) {
                    return decodeURI(temp.slice(name.length));
                }
            }
        }
    };
    $.deleteCookie = function (name) {
        name = $.isArray(name) ? name : $.slice.call(arguments);
        for (var i = 0, len = name.length; i < len; i++) {
            $.setCookie(name[i], '', -1)
        }
        return name
    };
    /**
     * 返回一个对象包含 cookie的键值对
     * @returns {{}}
     */
    $.allCookie = function () {
        if (doc.cookie === '') return {};
        var cookieArr = doc.cookie.split('; '),
            result = {};
        for (var i = 0, len = $.size(cookieArr); i < len; i++) {
            var temp = cookieArr[i].split('=');
            result[decodeURI(temp[0])] = decodeURI(temp[1])
        }
        return result
    };
    //清空所有cookie
    $.clearCookie = function () {
        return $.deleteCookie($.objectKeys($.allCookie()))
    };

    function isSupportCookie() {
        return win.navigator && win.navigator.cookieEnabled;
    }
})(F, window, document, undefined);
