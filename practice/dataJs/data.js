/*!
 * data.js v0.2.1 (https://github.com/yanhaijing/data.js)
 * Copyright 2013 yanhaijing. All Rights Reserved
 * Licensed under MIT (https://github.com/yanhaijing/data.js/blob/master/MIT-LICENSE.txt)
 */
(function (root, factory) {
    var Data = factory(root); //返回Data构造函数

    if ( typeof define === 'function' && define.amd) {// AMD
        define('data', function() {
            return Data;
        });
    } else if ( typeof exports === 'object') {// Node.js
        module.exports = Data;
    } else {


        var _Data = root.Data;// Browser globals
        
        Data.noConflict = function () {
            if (root.Data === Data) {
                root.Data = _Data;
            }
            return Data;
        };
        root.Data = Data;
    }
}(this, function (root) {
    'use strict';
    var slice = [].slice;
    var obj = {};
    var toString = obj.toString;
    var hasOwn = obj.hasOwnProperty;
    var euid = 0;
    function isFun(fn) {
        return toString.call(fn) === "[object Function]";
    }
    function isObj(obj) {
        return toString.call(obj) === "[object Object]";
    }
    function isArr(arr) {
        return isFun(Array.isArray) ? Array.isArray(arr) :
                                        toString.call(arr) === '[object Array]';
    }
    function extendDeep() { //深复制对象 Data {a:1,b:2}
        var target = arguments[0] || {};    //取第一个参数
        var arrs = slice.call(arguments, 1); //取第2个参数, 并写入数组
        var len = arrs.length;              //数组长度
        var copyIsArr;
        var clone;

        for (var i = 0; i < len; i++) {
            var arr = arrs[i];
            for (var name in arr) {
                var src = target[name];     //获取第一个参数对象是否含有继承对象的属性
                var copy = arr[name];
                //避免无限循环
                if (target === copy) continue;
                
                if (copy && (isObj(copy) || (copyIsArr = isArr(copy)))) {
                    if (copyIsArr) {
                        copyIsArr = false;
                        clone = src && isArr(src) ? src : [];

                    } else {
                        clone = src && isObj(src) ? src : {};
                    }
                    target[ name ] = extendDeep(clone, copy);
                } else if (typeof copy !== 'undefined'){
                    target[name] = copy;  //把第一个参数之后的方法都复制到第一个参数上
                }
            }
        }
        return target;
    }
    
    function extendData(key, events, context, src) {
        var nkey;
        for (var name in src) {
            var ctx = context[name];
            var copy = src[name];
            var copyIsArr;
            //避免无限循环
            if (context === copy) continue;
            
            nkey = (typeof key === 'undefined' ? '' : (key + '.')) + name; // a
            
            pub(events, 'set', nkey, copy);
            
            if (typeof copy === 'undefined') {
                pub(events, 'delete', nkey, copy);
            } else if (typeof context[name] === 'undefined') {
                pub(events, 'add', nkey, copy);
            } else {
                pub(events, 'update', nkey, copy);
            }
            
            if (copy && (isObj(copy) || (copyIsArr = isArr(copy)))) {                
                if (copyIsArr) {
                    copyIsArr = false;
                    context[name] = ctx && isArr(ctx) ? ctx : [];

                } else {
                    context[name] = ctx && isObj(ctx) ? ctx : {};
                }
                context[name] = extendData(nkey, events, context[name], copy);
            } else {                
                context[name] = copy;
            }
        }
        return context;
    }
    
    function parseKey(key) {
        return key.split('.');
    }
    
    function cloneDeep(src) {
        if (isObj(src)) {
            return extendDeep({}, src);
        }
        
        if (isArr(src)){
            return extendDeep([], src);
        }
        
        return src;
    }
    function pub(events, event, key, data) { //(events, 'set', "a", 3)
        //debugger;
        events = events[event][key];
        
        if (isObj(events)) {
            for (var name in events) {
                if (events.hasOwnProperty(name)) {
                    events[name]({
                        type: event,
                        key: key,
                        data: data
                    });
                }
            }
        }
    }
    
    //Data构造函数
    var Data = function () {
        if (!(this instanceof Data)) {
            return new Data();
        }
        //this._init();   //初始化时,掉一次原型上的_init方法
        this._context = {};
        this._events = {
            'set': {},
            'delete': {},
            'add': {},
            'update': {}
        };
    };
    
    //扩展Data原型
    extendDeep(Data.prototype, {  //扩展Data原型上的方法
        _init: function () {
            //this._context = {};
            //this._events = {
            //    'set': {},
            //    'delete': {},
            //    'add': {},
            //    'update': {}
            //};
        },
        set: function (key, val) {
            var ctx = this._context;
            if (typeof key !== 'string') return false;  //第一个参数不是字符串 ,直接返回false
            
            var keys = parseKey(key);
            var len = keys.length;
            var i = 0; 
            var name; 
            var src;

            if (len < 2) {      //键值为 单个的情况
                src = {};
                src[key] = val;
                extendData(undefined, this._events, ctx, src);
                return true;
            } 
                        
            //切换到对应上下文
            for (; i < len - 1; i++) {
                name = keys[i];
                //若不存在对应上下文自动创建
                if (!isArr(ctx[name]) && !isObj(ctx[name])) {
                    //删除操作不存在对应值时，提前退出
                    if (typeof val === 'undefined') {
                        return false;
                    }
                    //若键值为数组则新建数组，否则新建对象
                    ctx[name] = isNaN(Number(name)) ? {} : [];               
                }
                ctx = ctx[name];
            }
            
            name = keys.pop();

            src = isArr(ctx) ? [] : {};

            src[name] = val;

            ctx = extendData(keys.join('.'), this._events, ctx, src);
            
            return true;
        },
        get: function (key) {
            //key不为字符串返回undefined
            if (typeof key !== 'string') return undefined;
            
            var keys = parseKey(key);
            var len = keys.length;
            var i = 0;
            var ctx = this._context;
            var name;
            
            for (; i < len; i++) {
                name = keys[i];
                ctx = ctx[name];
                
                if (typeof ctx === 'undefined' || ctx === null) {
                    return ctx;
                }
            }
            
            //返回数据的副本
            return cloneDeep(ctx);
        },
        has: function (key) {
            return typeof  this.get(key) === 'undefined' ? false : true;
        },
        sub: function (type, key, callback) {
            if (typeof type !== 'string' || typeof key !== 'string' || !isFun(callback)) {
                return -1;
            }
            
            var events = this._events[type] || {};
            
            events[key] = events[key] || {};
            
            events[key][euid++] = callback;
            
            return euid - 1;
        },
        unsub: function (type, key, id ) {            
            if (typeof type !== 'string' || typeof key !== 'string') {
                return false;
            }
            
            var events = this._events[type] || {};
            
            if (!isObj(events[key])) {
                return false;
            }
            
            if (typeof id !== 'number') {
                delete events[key];               
                return true;
            }
            
            delete events[key][id];
            
            return true;
        }
    });


    //新建默认数据中心
    var data = new Data();

    //扩展Data接口
    extendDeep(Data, {      //扩展构造函数Data    静态属性和方法
        version: '0.2.1',
        has: function (key) {
            return data.has(key);
        },
        get: function (key) {
            return data.get(key);
        },
        set: function (key, val) {
            return data.set(key, val);
        },
        sub: function (type, key, callback) {
            return data.sub(type, key, callback);
        },
        unsub: function (type, key, id) {
            return data.unsub(type, key, id);
        }
    });

    return Data;
}));