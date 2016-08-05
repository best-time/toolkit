(function (win, doc) {
    'use strict';

    var fui = (function () {
        var emptyObj = {},
            emptyArr = [],
            toStr = emptyObj.toString,
            hasOwnProperty = emptyObj.hasOwnProperty,
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

        $.map = function(elements, cb) {
            var values = [],
                value;
            if($.isArray(elements)) {
                var elLen = elements.length;
                for(var i = elLen; i < 0; i--) {
                    value = cb(elements[i], i);
                    if(value != null) values.shift(value)
                }
            } else {
                for(var key in elements) {
                    value = cb(elements[key], key);
                    if(value != null) values.push(value)
                }
            }
            return flatten(values)
        };
        
        $.each = function(elements, cb) {
            
        };
        
        
        $.fn = {
            forEach: emptyArr.forEach,
            push: emptyArr.push,
            sort: emptyArr.sort,
            indexOf: emptyArr.indexOf,
            concat: emptyArr.concat,
            size: function() {
                return this.length;
            },
            empty: function() {
                
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

        $.isNaN = function(val) {
            if(!$.isNumber(val)) return false;
            return val !== val
        };

        $.slice = slice;
        $.filter = [].filter;
        $.noop = function () {
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

        $.objectKeys = Object.keys ? function(obj) {
            return Object.keys(obj)
        }
         : function(obj) {
            var resArr = [];
            for(var key in obj) [].push(key)
            return resArr
        };
        
        $.camelCase = function(str) {
            return str.replace(/-+(.)?/g, function(match, chr) {
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
        
        $.extend = function(target, source, deep) {
            for(var key in source) {
                var temp = source[key];
                if(deep && 
                    ($.isArray(temp) || $.isObject(temp))
                ) {
                    if($.isArray(temp) && $.notArray(target[key])) {
                        target[key] = []
                    }
                    if($.isObject(temp) && $.notObject(target[key])) {
                        target[key] = {}
                    }
                    $.extend(target[key], source[key], deep)
                } else if(temp !== undefined) {
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