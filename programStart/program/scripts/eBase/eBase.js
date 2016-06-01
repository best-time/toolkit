compose.require('scripts/eBase/eBase.js',[
    'window.$',
    'scripts/lib/exp.js'
], function ($, Exp) {
    "use strict";
    var eBase = window.eBase = {
        version: '1.0.0',
        $: $,
        template: template,
        templater: function(html, data){
            return template.compile(html)(data);
        },
        isElement: function(obj) {
            return !!(obj && obj.nodeType === 1);
        },
        isArray: function(obj) {
            return toString.call(obj) === '[object Array]';
        },
        isObject: function(obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        },
        /*
         * 模块注册/获取
         * 包含set，get接口
         * */
        modules: (function () {
            var mod = {},
                methods = {
                    put:function (id, value) {
                        mod[id] = value;
                    },
                    get:function (id) {
                        return mod[id];
                    },
                    remove:function (id) {
                        delete mod[id];
                    }
                };
            return methods;
        })(),
        getMethod: function(name, type) {
            return name?type + name.replace(/^\w/, function(value){
                return value.toUpperCase();
            }): function(){};
        },
        /*
         * 延迟执行
         * @param {Function} func 回调
         * @param {number} millisecond 延迟时间(ms)
         * @param {Date} start 起始时间
         * */
        delay: function (func, millisecond, start) {
            var list = [], millisecond = millisecond || 0;
            function add(func, millisecond, start){
                list.push({
                    func: func,
                    getTime: function(){
                        var cur = new Date();
                        start = start || cur;
                        return millisecond + (start - cur);
                    }
                });
            }
            function exec(){
                var first = list.shift();
                if(first){
                    var millisecond = first.getTime();
                    millisecond = millisecond<0?0:millisecond;
                    setTimeout(function () {
                        first.func();
                        exec();
                    }, millisecond)
                }
            }
            add(func, millisecond, start);
            exec();
            return {
                delay: function(func, millisecond, start){
                    add(func, millisecond, start);
                }
            }
        },
        tip: function (msg, callback) {
            Exp.showAlert(msg, callback);
        },
        extends: function(orig, target, noDeep){
            var toStr = Object.prototype.toString,
                arrayFlag = "[object Array]";
            orig = orig || {};
            var targets = arguments,
                target;
            for(var h=1; h<targets.length; h++){
                target = targets[h];
                for (var i in target) {
                    if(target.hasOwnProperty(i)) {
                        if (toString.call(target[i]) === "[object Object]"
                            && typeof target[i] === "object"
                            && !noDeep) {
                            if(!orig[i]){
                                orig[i] = toStr.call(target[i]) === arrayFlag ? [] : {};
                            }
                            eBase.extends(orig[i], target[i]);
                        }
                        else {
                            orig[i] = target[i];
                        }
                    }
                    else orig[i] = target[i];
                }
            }
            return orig;
        },
        simulate: function(value, simulate, real){
            if(value){
                if(eBase.Config.simulate.timeout){
                    setTimeout(simulate, eBase.Config.simulate.timeout);
                }
                else{
                    simulate();
                }
            }
            else{
                if(real){
                    real();
                }
            }
        },
        /*
         * 继承父类
         * @param {Function} [parent] 父类
         * @param {Object} props 对象
         * @return {Function} 子类
         * */
        extend: function (parent, props){
            if(!eBase.isFunction(parent)){
                props = parent;
                parent = this;
            }
            function child(){
                this._super = parent.prototype;
                this._createArguments = arguments;
                parent.apply(this, arguments);
            }
            eBase.extends(child, parent);
            child.prototype = Object.create( parent.prototype);
            child.prototype.clone = function(){
                var args = this._createArguments;
                return new child(args[0], args[1]);
            };
            eBase.extends(child.prototype, props);
            child.prototype.constructor = child;
            return child;
        },
        /*
         * 移除zepto对象
         * @param {Zepto} el zepto对象
         * @param {Number} timer 延迟时间, 单位ms，默认1s执行
         * */
        off: function (el, timer){
            var drops = el.find('*');
            setTimeout(function () {
                drops.off();
            }, typeof timer=='number'? timer:1000);
        },
        /*
         * 获取当前页decode哈希值
         * */
        encodeHash: function (href) {
            return decodeURIComponent(href||window.location.hash);
        },
        /*
         * 获取当前页decode href值
         * */
        encodeHref: function (href) {
            return decodeURIComponent(href||window.location.href);
        },
        /*
         * 获取/设置参数值
         * */
        param: function(name, value, href){
            href = eBase.encodeHref(href);
            var reg = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                nullReg = new RegExp('[\?&]' + name + '=(?=&|$)', 'g'),
                href2;
            var results = href.match(reg);
            if(value === undefined){
                if (!results){
                    return '';
                }
                return results[1] || '';
            }
            else{
                if(results){
                    href2 = href.replace(reg, function(v1, v2) {
                        return v1.replace('='+v2, '='+value);
                    });
                }
                else{
                    href2= href + (href.indexOf('?')>0?'&':'?')+name+'='+value;
                }
                //处理参数值为空，去掉name值
                href2 = href2.replace(nullReg, function(match){
                    return match.indexOf('?')>=0 && href2.indexOf('&')>=0?'?':'';
                }).replace(/[\?,]$/, '').replace(/\?&/, '?');

                if(href != href2){
                    history.replaceState('', '', href2);
                }
            }
        },
        /*
         * 获取/设置hash值
         * */
        hash: function(hash, href){
            var href = eBase.encodeHref(href),
                url = href.replace(/#.*/, '');
            history.replaceState('', '', url + hash);
        },
        /*
         * 转换hash为param
         * */
        parseToParam: function(){
            var configRouter = eBase.Config.router,
                openPath = configRouter.openPath,
                pathName = configRouter.pathName,
                lastHash = this.parseToParam.hash || '',
                href = eBase.encodeHref(),
                hash = eBase.encodeHash(),
                path = this.param(pathName),
                doubleReg = /##/g,
                reset;
            if(!hash){
                var matches = hash.match(/(#*)$/);
                hash = matches ? matches[0] : eBase.encodeHash();
            }
            //处理根目录hash
            if(hash.match(/^##/)){
                hash = hash.replace(doubleReg, '#');
                href = href.replace(doubleReg, '#');
                reset = true;
            }
            if(this.exceptHash && hash && this.exceptHash.indexOf(hash+'#')>-1){
                this.hash('', href);
            }
            else if(openPath){
                hash = hash.replace(/\#/g, ',').replace(/^,/, '');
                if(!reset){
                    if(path === 'null'){
                        path = eBase.util.get('login-path') || '';
                    }
                    if(path){
                        hash = path +(hash?',' +hash:'');
                    }
                }
                this.param(pathName, hash, href.substring(0, href.indexOf('#')));
                this.hash('');
            }
            else{
                if(lastHash.indexOf(hash)>=0 || hash.indexOf(lastHash)>=0){
                    reset = true;
                }
                if(!reset){
                    hash = lastHash+hash;
                    this.hash(hash);
                }
                else{
                    this.hash(hash === '#'?'':hash);
                }
                this.parseToParam.hash = hash;
            }
        },
        /*
         * 获取fragment
         * */
        getFragment: function(href, isLast){
            var href = eBase.encodeHref(href || window.location.href),
                configRouter = eBase.Config.router,
                frag;
            if(configRouter.openPath){
                var path = this.param(configRouter.pathName) || '';
                frag = path.replace(/,/g, '#');
            }
            else{
                var minIndex = href.indexOf('#')||0;
                frag =  minIndex<0? '': href.substring(minIndex+1);
            }
            if(isLast){
                var frags = frag.split(/#/);
                frag = frags.pop();
            }
            return frag;
        }
    };
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(function(name) {
        eBase['is' + name] = function(obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });
    /*
     * 日志系统
     * @param {String} msg 消息
     * @param {String} [msg2] 消息2
     * */
    eBase.log = (function () {
        function log(msg, css, force) {
            if(eBase.Config.debug || force){
                console.log('%c'+msg, css);
            }
        }
        eBase.extends(log, {
            info: function (msg, force) {
                log(msg, 'color: #ccc;', force);
            },
            warn: function (msg, force) {
                log(msg, 'color: #8a6d3b;', force);
            },
            success: function (msg, force) {
                log(msg, 'color: #00A503;', force);
            },
            except: function (msg, force){
                log(msg, 'color: #a94442;', force);
            },
            error: function (msg,  force){
                console.error(msg);
            }
        });
        return log;
    })();

    var eventCounter = 0;
    eBase.Event = function(){
        var events = {
            _events:{},
            on: function(name, callback, forever){
                if(name){
                    if(!this._events[name]){
                        this._events[name] = [];
                    }
                    if(eBase.isString(callback)){
                        callback = this[callback];
                    }
                    if(!callback)return;
                    this._events[name].push({
                        name: name,
                        callback: callback,
                        counter:++eventCounter,
                        forever: !!forever
                    });
                }
                return this;
            },
            trigger: function(name){
                var eventers = this._events[name] || [],
                    eventer,
                    callback,
                    ret;
                if(!events)return;
                var length = eventers.length;
                while(length--){
                    eventer = eventers[length];
                    callback = eventer.callback;
                    if(callback){
                        ret = callback.apply(this, Array.prototype.slice.call(arguments, 1));
                        if(ret === true){
                            return ret;
                        }
                    }
                }
            },
            off: function(name, callback, forever){
                if(name){
                    var eventers = this._events[name],
                        eventer,
                        eventCallback;
                    if(eventers){
                        var length = eventers.length;
                        while(length--){
                            eventer = eventers[length];
                            eventCallback = eventer.callback;
                            if((callback === eventCallback || !callback) && !eventer.forever){
                                this._events[name] = eventers = eventers.slice(0, length).concat(eventers.slice(length+1));
                            }
                        }
                    }
                }
                else{
                    for(var name in this._events){
                        this.off(name);
                    }
                }
                return this;
            }
        }
        return events;
    }
    eBase.View = function(options){
        this.instance.apply(this, arguments);
    }
    eBase.extends(eBase.View,{
        extend: eBase.extend
    });
    eBase.extends(eBase.View.prototype, eBase.Event(), {
        instance: function(options){
            this.status = {};
            options = options || {};
            this.el = options.el;
            this.tagName = options.tagName || 'div';
            this.attrs = options.attrs || {};
            if(options.className){
                this.attrs.class = options.className;
            }
            this.setEl();
            this._status = eBase.extends({}, this.status);
            this.trigger('instance', options);
        },
        render: function(){
        },
        getStatus: function(prop){
            if(prop === undefined){
                return this.status;
            }
            return this.status[prop];
        },
        setStatus: function(props){
            if(eBase.isString(props)){
                this.status[props] = arguments[1];
            }
            else{
                eBase.extends(this.status, props);
            }
        },
        active: function(){
            this.setStatus({
                active: true,
                deactive: false,
                destory: false
            });
            this.trigger('active', status);
        },
        deactive: function(){
            this.setStatus({
                active: false,
                deactive: true,
                destory: false
            });
            this.trigger('deactive');
        },
        destroy: function(opts){
            var opts = opts || {};
            if(!opts.remainEl){
                this.el.remove();
            }
            this.setStatus({
                active: false,
                deactive: true,
                destory: true
            });
            this.trigger('destroy');
            this.off();
        },
        setRouteData: function(data){
            this.routeData = data;
        },
        setEl: function(){
            if(this.el){
                this.el = $(this.el);
            }
            else{
                this.el = $(document.createElement(this.tagName)).attr(this.attrs);
            }
        },
        setRouter: function(router){
            this.router = router;
        },
        getRouter: function(){
            return this.router;
        },
        setService: function(service){
            this.service = service;
        },
        getService: function(){
            return this.service;
        }
    });
    eBase.Router = function Router(options){
        this.instance.apply(this, arguments);
    }

    eBase.extends(eBase.Router, {
        constants:{
            NotraceOption:'notrace'
        },
        extend: eBase.extend,
        _routerConfigs:{
        },
        register: function(route, router){
            var callback;
            for(var name in route){
                callback = route[name];
                if(!this._routerConfigs[name]){
                    this._routerConfigs[name] = [];
                }
                this._routerConfigs[name].push({
                    callback: callback,
                    router: router,
                    name:name
                });
                this._analyse(name, this.getLastRouterConfig(name));
            }
        },
        start: function(){
            if(!this.startFlag){
                this.startFlag = true;
                this._analyse();
                this.onStart();
                this.addEvent();
                this.execRouter({type:'refresh'});
            }
            return this;
        },
        onStart: function(){
        },
        forward: function(router, event){
            router = router || '';
            if(this.checkRouter(router)){
                history.pushState('', '', router?"#"+router:'');
                this.execRouter(event || {type:'trigger'});
            }
        },
        change: function(event){
            var fragment = this.getFragment();
            this.forward(fragment, event);
        },
        add: function(name){
            this.go(name);
        },
        /*
         * 页面跳转
         * @param [String|Number] hash值或整数
         *
         * */
        go: function(name, operate, replaceString){
            var matches = ((name||'')+'').match(/[+-]\d+/);
            if(!operate && matches){
                window.history.go(name-0);
            }
            else if(operate === eBase.Router.constants.NotraceOption){
                replaceString = replaceString||'';
                var fragment=eBase.getFragment(),
                    replaceReg = new RegExp('(?:#|^)'+replaceString+'[^\/]*$');
                if(replaceString){
                    fragment = eBase.getFragment().replace(replaceReg,'');
                }
                fragment+='#'+name;
                if(eBase.Config.router.openPath){
                    eBase.param(eBase.Config.router.pathName, fragment);
                }
                else{
                    history.replaceState('', '', eBase.encodeHref()+'#'+name);
                }
                //history.replaceState('', '', eBase.encodeHref()+'#'+name);
                this.execRouter({
                    type:eBase.Router.constants.NotraceOption,
                    replace: replaceString
                });
            }
            else if(matches){
                if(matches[0]-0>=0){
                    window.history.go(matches[0]-0);
                }
                else{
                    var configRouter = eBase.Config.router,
                        openPath = configRouter.openPath,
                        pathName = configRouter.pathName,
                        hash = eBase.encodeHash();
                    if(openPath){
                        hash = '##' + eBase.param(pathName).replace(/,/g, '#');
                    }
                    var values = hash.split('#');
                    hash = values.slice(0, values.length +  (matches[0]-0));
                    hash = hash.join('#') || '#';
                    window.location.href = hash=='#'?'##':hash;
                }
            }
            else{
                //需要异步触发
                eBase.delay(function () {
                    window.location.href = '#' + name
                }, 1);
            }
        },
        back: function(){
            window.history.back();
        },
        getHash: function(){
            return eBase.getFragment();
        },
        getFragment: function(){
            return eBase.getFragment(window.location.href, true);
        },
        addEvent: function(){
            var addEventListener = window.addEventListener || function (eventName, listener) {
                return attachEvent('on' + eventName, listener);
            };
            addEventListener('popstate', this.execRouter.bind(this, {type:'click'}));
        },
        hasRouter: function(){
            var routers = this._routerConfigs,
                hash = this.getHash(),
                hasEqule = false,
                count = 0;
            for(var i in routers){
                if(i === hash || '#' + i === hash){
                    hasEqule =  true;
                }
                count++;
                if(count === 2){
                    return true;
                }
            }
            return hasEqule || !count?false:true;
        },
        checkRouter: function(fragment){
            var _routerConfigs = this._routerConfigs,
                item;
            for(var name in _routerConfigs){
                item = this.getRouterConfig(name);
                if(item && item.reg && fragment.match(item.reg)){
                    item.name = name;
                    item.router.setHash(eBase.Router.getHash());
                    return item;
                }
            }
        },
        /*
         * fragment或路由名称
         * */
        getRouter: function(name){
            var router = this.getRouterConfig(name)
            if(router){
                router = router.router;
            }
            return router;
        },
        /*
         * 获取路由配置
         * */
        getRouterConfig: function(name, isCreated){
            var routerConfig = this._routerConfigs[name], router;
            if(routerConfig && routerConfig.length>0){
                var hash = this.getHash(),
                    router = routerConfig[0],
                    name = router.name.match(/^[^\/]*/g)[0];
                if(router.configReg && eBase.Factory.hasDefined(name)){
                    var matches = hash.match(router.configReg)||[],
                        size = matches.length,
                        child;
                    if(matches && matches.length > routerConfig.length && size > 1){
                        var origins = routerConfig.slice(0);
                        for(var i=routerConfig.length; i<size&&routerConfig.length<=size; i++){
                            child = eBase.Factory.create(name);
                        }
                        //调整router顺序
                        this._routerConfigs[router.name] = routerConfig = origins.concat(routerConfig.slice(origins.length).reverse());
                    }
                    router = routerConfig[matches.length - 1];
                }

            }
            return router;
        },
        /*
         * 获取第一个路由配置
         * */
        getFirstRouterConfig: function(name){
            var routerConfig = this._routerConfigs[this.getRouterName(name)], router;
            if(routerConfig && routerConfig.length>0){
                return routerConfig[0];
            }
        },
        /*
         * 获取最后一个路由配置
         * */
        getLastRouterConfig: function(name){
            var routerConfig = this._routerConfigs[this.getRouterName(name)], router;
            if(routerConfig && routerConfig.length>0){
                return routerConfig[routerConfig.length-1];
            }
        },
        /*
         * 获取最后一个路由配置
         * */
        getRouterName: function(name){
            var configs = this._routerConfigs,
                alies = name+'/';
            for(var item in configs){
                if(item == name || item.indexOf(alies)==0){
                    return item;
                }
            }
        },
        execRouter: function(event){
            var ret = eBase.parseToParam();
            if(ret)return;
            var fragment = this.getFragment(),
                router = this.checkRouter(fragment),
                flag = false;
            this.event = event;
            if(router){
                var values = fragment.match(router.reg).map(function (item) {
                    if(item){
                        item = item.replace(/^\//, '');
                    }
                    return item;
                });
                router.callback.apply(router, values.slice(1));
                router.router.active();
                flag = true;
            }
            this.trigger('execRouter', {
                fragment: fragment,
                success: flag,
                routerName: router && router.name,
                type: event.type || 'trigger'
            });
        },
        _analyse: function(path, router){
            var _routerConfigs = this._routerConfigs,
                item;
            if(arguments.length){
                _routerConfigs = {};
                _routerConfigs[path] = router.callback;
            }
            for(var name in _routerConfigs){
                item = name;
                if(item){
                    item = item.replace(/\/\:([^/]+)/g, function (match) {
                        if(match && match.indexOf('|')>=0){
                            return '($|(?:\/)[^|#\/]+|(?:\/)[^\/]?)';
                        }
                        else{
                            return '((?:\/)[^|#\/]+|(?:\/)[^\/]?)';
                        }
                    });
                }
                var router = this._routerConfigs[name];
                router[router.length-1].reg = new RegExp((item?'^'+item:'^$') + '(?:\\?([\\s\\S]*))?$');
                router[router.length-1].configReg = new RegExp((item?'(?:^|#)'+item:'^$') + '(?:\\?([\\s\\S]*))?(?=#|$)', 'g');
            }
        },
        isOnline: function () {
            return window.navigator.onLine;
        },
        setExceptHash: function (hash) {
            eBase.exceptHash = hash+'#';
        }
    }, eBase.Event());

    eBase.extends(eBase.Router.prototype, eBase.Event(), {
        instance: function(options){
            this.options = options || {};
            this.setView(options.view);
            this.trigger('instance', options);
        },
        setView: function(view){
            this.view = view;
            this.view.setRouter(this);
        },
        getView: function(){
            return this.view;
        },
        setRouteData: function(){
            this.routeData = arguments;
            if(this.view){
                this.view.setRouteData(arguments);
            }
        },
        getRouteData: function(){
            return this.routeData;
        },
        register: function(){
            this.analyse();
            this.constructor.register(this.route, this);
        },
        analyse: function(){
            var route = this.route, callback, router = this;
            for(var name in route){
                callback = route[name];
                if(eBase.isString(callback)){
                    callback = this[callback];
                }
                callback = callback.bind(this);
                route[name] = function(){
                    var l = arguments.length- 1,
                        last = arguments[l];
                    var params = Array.prototype.slice.call(arguments, 0, last === undefined? l : l+1);
                    router.setRouteData.apply(router, params);
                    callback.apply(route, params);
                }
            }
        },
        getViewStatus: function(){
            return this.view && this.view.getStatus();
        },
        active: function(opts){
            if(this.view){
                this.view.active(opts);
            }
            this.trigger('active', opts);
        },
        deactive: function(opts){
            if(this.view){
                this.view.deactive(opts);
            }
            this.trigger('deactive', opts);
        },
        destroy: function(opts){
            if(this.view){
                this.view.destroy(opts);
            }
            this.trigger('destroy', opts);
            this.off();
        },
        setHash: function(hash){
            this.hash = hash;
        },
        getHash: function(){
            return this.hash;
        },
        getFragment: function(){
            return eBase.getFragment(window.location.href, true);
        }
    });

    eBase.Service = function(options){
        this.instance.apply(this, arguments);
    }
    eBase.extends(eBase.Service, eBase.Event(), {
        extend: eBase.extend
    });
    eBase.extends(eBase.Service.prototype, eBase.Event(), {
        instance: function(options){
            this.options = options || {};
            this.setView(options.view);
            this.trigger('instance', options);
        },
        setView: function(view){
            this.view = view;
            this.view.setService(this);
        },
        getView: function(){
            return this.view;
        }
    });
    return eBase;
});