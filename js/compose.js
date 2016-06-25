(function (window) {
    'use strict'
    /**
     * 属性覆盖
     */
    function extend(orig, target, deep) {
        var toStr = Object.prototype.toString,
            arrayFlag = "[object Array]";
        orig = orig || {};
        for (var i in target) {
            if (deep === true && target.hasOwnProperty(i)) {
                if (typeof target[i] === "object") {
                    if (!orig[i]) {
                        orig[i] = toStr.call(target[i]) === arrayFlag ? [] : {};
                    }
                    extend(orig[i], target[i]);
                }
                else {
                    orig[i] = target[i];
                }
            }
            else orig[i] = target[i];
        }
        return orig;
    }

    /**
     * 添加script事件
     */
    function addOnloadEvent(dom, callback, fail) {
        if (dom && typeof dom.onload !== 'undefined') {
            dom.onload = function () {
                this.onload = null;
                this.onerror = null;
                setTimeout(function () {
                    callback();
                }, 0);
            };
            dom.onerror = function () {
                this.onload = null;
                this.onerror = null;
                setTimeout(function () {
                    callback();
                }, 0);
            };
        }
        else if (dom) {
            dom.onreadystatechange = function (event) {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    this.onreadystatechange = null;
                    setTimeout(function () {
                        callback();
                    }, 0);
                }
            };
        }
    }

    function isArray(object) {
        return object && typeof object === 'object' &&
            Array == object.constructor;
    }

    //去除字符左右两侧 '空串'
    function trimUrl(str) {
        if (str) {
            var ret = str.match(/^\s*(\S*)\s*$/),
                retS;
            if (ret) {
                retS = ret[1].match(/(.*)\?+$/);
                if (retS) {
                    return retS[1];
                } else {
                    return ret[1];
                }
            }
        }
        return str;
    }

    function isNoStorage() {
        var userAgent = window.navigator.userAgent.toLowerCase();
        return !(
            userAgent.match(/snyifubao|ebuy-snyifubao/) &&
            userAgent.match(/android/)
            );
    }

    var compose = {
        /**
         * 配置信息
         */
        _config: {
            basePath: "",//基本路径
            contextPath: false,//上下文路径设置，字符串标示绝对路径，true标示从compose中获取
            paths: {},
            storage: false//isNoStorage()===false?false:true//缓存开关
        },
        /**
         * 需求列表状态相关信息
         */
        _process: [],
        /**
         * satisfyMap记录
         */
        _satisfies: [],
        /**
         * 完成的js文件路径集合
         */
        _completedPaths: {},
        /**
         * 发生onload后获取事件源
         */
        _onLoadEvents: [],
        /**
         * 缓存key值
         */
        _storageKey: 'storage-param-',
        isElement: function (obj) {
            return !!(obj && obj.nodeType === 1);
        },
        isArray: function (obj) {
            return toString.call(obj) === '[object Array]';
        },
        isObject: function (obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        },
        cacheStorage: {},
        /**
         * 延迟执行
         */
        _delayer: {
            time: 0,
            used: false,
            push: function (callback, time) {
                var self = this;
                this.used = true;
                this._callback = function () {
                    if (callback) {
                        callback();
                    }
                    self._timer = null;
                    self._callback = null;
                };
                this.time = time || 0;
                this._timer = setTimeout(this._callback, this.time);
            },
            delay: function (time) {
                if (this._timer) {
                    clearTimeout(this._timer);
                }
                if (this._callback) {
                    if (time !== undefined) {
                        this._timer = time;
                    }
                    this._timer = setTimeout(this._callback, this.time);
                }
            }
        },
        /**
         * 初始化
         */
        init: function () {
            this.initConfig();
            this.initLoad();
            this.initAndClearStorage();
        },
        /**
         * 添加script属性配置
         */
        initConfig: function () {
            var _config = this._config,
                scripts = document.getElementsByTagName('script'),
                l = scripts.length,
                script,
                contextPath,
                basePath,
                param,
                main;
            var i = 0;
            for (; i < l; i++) {
                script = scripts[i];
                contextPath = script.getAttribute('data-contextpath') || '';
                basePath = script.getAttribute('data-basepath') || '';
                param = script.getAttribute('data-param') || '';
                main = script.getAttribute('data-main') || '';
                if (contextPath || basePath || main) {
                    _config.contextPath = contextPath || "";
                    _config.basePath = basePath;
                    _config.param = param;
                    _config.main = main;
                    break;
                }
            }
        },
        /*
         *加载main入口文件
         * */
        initLoad: function () {
            var main = this._config.main;
            if (main) {
                this.require([main]);
            }
        },
        /**
         * 添加javascript配置
         */
        config: function (opt) {
            var _config = this._config;
            extend(_config, opt, true);
            _config.contextPath = _config.contextPath || "";
            _config.basePath = _config.basePath || "";
            _config.param = _config.param || "";
            if (opt.storage && isNoStorage() === false) {
                _config.storage = false;
            }
        },
        /**
         * 获取项目路径
         */
        getContext: function (opt) {
            return this._config.contextPath;
        },
        /**
         * 需求

         * param depend 判断此模块是否有依赖并需要提前获取该资源
         */
        require: function (pathId, requires, success, fail, existObjectNames) {
            this.req(pathId, requires, success, fail, existObjectNames);
        },
        /**
         * 异步请求资源
         */
        async: function (pathId, requires, success, fail, existObjectNames) {
            this.req(pathId, requires, success, fail, existObjectNames, {method: 'async'});
        },
        /**
         * 并发请求资源,建议加载css资源等
         */
        paral: function (pathId, requires, success, fail, existObjectNames) {
            this.req(pathId, requires, success, fail, existObjectNames, {method: 'paral'});
        },

        /**
         * 需求处理函数
         *
         */
        req: function (pathId, requires, callback, fail, existObjectNames, opts) {
            this._delayer.delay();
            if (isArray(pathId) || typeof pathId === 'function') {
                existObjectNames = fail;
                fail = callback;
                callback = requires;
                requires = pathId;
                pathId = null;
            }
            if (typeof requires === 'function') {
                existObjectNames = fail;
                fail = callback;
                callback = requires;
                requires = [];
            }
            if (!callback || typeof callback === 'string') {
                callback = function () {
                }
            }
            if (typeof fail !== 'function') {
                existObjectNames = fail;
                fail = function () {
                };
            }
            if (existObjectNames === true) {
                existObjectNames = null;
            }
            requires._opts = opts = opts || {};
            requires._existObjectNames = existObjectNames || [];
            if (pathId && !pathId.match(/\.css|\.js/)) {
                pathId += '.js';
            }
            requires.pathId = pathId;
            requires.callback = callback;
            requires.contextPath = this._config.contextPath;
            requires.param = this._config.param;
            requires.basePath = this._config.basePath;
            requires.fail = fail;
            requires.method = opts.method;
            var handlingRequire = this._handlingRequire,
                requireHandles;
            this.addCache(requires);
            if (opts.method === 'paral') {
                requireHandles = this.preHandleRequires(requires);
                return this.handleRequire(requireHandles[0]);
            } else if (handlingRequire) {
                if (!handlingRequire.completed) {
                    if (opts.method !== 'async' && handlingRequire.waiting) {
                        requires.parent = handlingRequire;
                    }
                    else {
                        requireHandles = this.preHandleRequires(requires);
                        return requireHandles;
                    }
                }
            }
            requireHandles = this.preHandleRequires(requires);
            if (this.handling) {
                return;
            }
            var self = this;
            this.handling = true;
            setTimeout(function () {
                self.handling = false;
                self._handlingRequire = requireHandles[0];
                self.handleRequire(requireHandles[0]);
            });
        },
        /**
         * 满足
         */
        satisfy: function (require) {
            if (require) {
                if (require.method != 'paral') {
                    var loadRequire = this._onLoadEvents.shift(),
                        handlingRequire = this._handlingRequire;
                    ;
                    if (loadRequire !== handlingRequire && (loadRequire && loadRequire._process.length)) {
                        return;
                    }
                }
                if (require.type == 'css') {
                    require.completed = true;
                }
                else {
                    if (!require.resourceObject) {
                        this.checkAndSetObjectByName(require);
                    }
                }
                if (require.method == 'paral') {
                    this.checkComplete(require);
                }
                else {
                    this.excCompleteAndExcNext(require);
                }
            }
        },
        /**
         * 满足
         */
        unsatisfy: function (require) {
            if (require.method != 'paral') {
                this._onLoadEvents.shift();
            }
            var requires = this.getRequires(require);
            if (requires.fail) {
                requires.fail();
                requires.failed = true;
                delete require.fail;
            }
            if (this._handlingRequire === require) {
                this._handlingRequire = null;
            }
            if (require.element) {
                require.element.remove();
            }
            this.deleteRequires(require);
        },
        /**
         * 预处理
         */
        preHandleRequires: function (requires) {
            var l = requires.length,
                callback = requires.callback,
                pathId = requires.pathId,
                existObjectNames = requires._existObjectNames,
                _process = requires.parent ? requires.parent._process : this._process,
                _satisfies = requires.parent ? requires.parent._satisfies : this._satisfies,
                i = _process.length,
                tailFileExp = /\.css|\.js/,
                path,
                _requires = [],
                count = 0,
                type,
                _satisfy,
                require,
                resourceObject,
                configPath;
            for (var i = 0; i < _process.length; i++) {
                count += _process[i].length;
            }
            for (var j = 0; j <= requires.length; j++) {
                path = requires[j];
                configPath = this._config.paths[path];
                type = (configPath || path) && (configPath || path).match(/\.css$/) ? 'css' : 'js';
                _satisfy = _satisfies[count + j];
                resourceObject = _satisfy && _satisfy.value;
                require = {
                    type: type,
                    completed: _satisfy ? true : false,
                    j: j,
                    i: i,
                    parent: requires.parent,
                    resourceObject: resourceObject,
                    resourceObjectPath: existObjectNames[j],
                    _process: [],
                    _satisfies: [],
                    method: requires.method
                };
                if (path) {
                    if (path && path.match(/^http[s]?:\/\//)) {
                        if (type == 'js' && !path.match(tailFileExp)) {
                            require.path = path + '.js';
                        } else {
                            require.path = path;
                        }
                    } else if (configPath) {
                        require.path = configPath && configPath.match(tailFileExp) ? configPath : configPath + '.js';
                        if (!require.resourceObjectPath) {
                            require.resourceObjectPath = path;
                        }
                    } else {
                        this.handleRequirePath(require, path, requires);
                    }
                }

                if (j == requires.length) {
                    require.callback = callback;
                    if (pathId) {
                        this.handleRequirePath(require, pathId, requires);
                    }
                }
                if (_satisfy) {
                    this._completedPaths[require.path] = require;
                }
                _requires.push(require);
            }
            if (pathId) {
                this.handleRequirePath(_requires, pathId, requires);
            }
            if (requires.fail) {
                _requires.fail = requires.fail;
            }
            _process.push(_requires);
            return _requires;
        },
        /**
         * 处理require path
         */
        handleRequirePath: function (require, pathId, requires) {
            var basePath = requires.basePath,
                contextPath = requires.contextPath,
                param = requires.param;
            require.path = this.handlePath(pathId, contextPath, basePath, param);
            if (pathId.match(/\.(?!js$|css$)/)) {
                require.resourceObjectPath = pathId;

            }
        },
        /**
         * 处理普通的path
         */
        handlePath: function (pathId, contextPath, basePath, param) {
            var path,
                tailFileExp = /\.css|\.js/;
            pathId = trimUrl(pathId);
            if (pathId.match(/\.css$/)) {
                path = contextPath ? contextPath + '/' + pathId : pathId;
            }
            else {
                var tpath = contextPath ? contextPath + '/' + basePath : basePath;
                path = (tpath ? tpath + '/' : '') + (pathId.match(tailFileExp) ? pathId : pathId + '.js');
            }
            if (param) {
                path += pathId.match(/\.js\?/) ? pathId.match(/\?$/) ? param : '&' + param : '?' + param;
            }
            path = path.replace(/\/+/g, '/').replace(/:\/+/, '://'); // '////' 替换成 '/'   '://///' 替换成 '://'
            return path;
        },
        /**
         * 处理单个require
         */
        handleRequire: function (require) {
            //对处理过的需求直接返回
            if (!require || !require.parent && require.completed) {
                return;
            }
            var paral = require.method == 'paral';
            if (!paral) {
                this._handlingRequire = require;
                this.checkAndSetObjectByName(require);
            }

            if (!require.completed && require.callback && !paral) {
                this.checkComplete(require);
            } else if (!paral && (!require.path || require.resourceObject || (require.completed == true && require.type === 'css'))) {
                this.excCompleteAndExcNext(require);
            } else {
                if (paral) {
                    var requires = this.getRequires(require);
                    for (var i = 0; i < requires.length; i++) {
                        require = requires[i];
                        this.checkAndSetObjectByName(require);
                        if (require.completed) {
                            this.checkComplete(require)
                        } else {
                            this.addEvent(require);
                        }
                    }
                } else {
                    require.waiting = false;
                    this.addEvent(require);
                }
            }
        },
        /**
         * 注册回调事件
         */
        addEvent: function (require, elementLoad) {
            var path = require.path;
            if (!elementLoad && this._config.storage && path && path.match(/\.css/)) {
                var self = this;
                this.getRemote(path, function (data) {
                    require.waiting = false;
                    self.satisfy(require);
                }, function () {
                    self.addEvent(require, true);
                })
                return;
            }
            else if (!elementLoad && this._config.storage && path) {
                var param;
                var storageObj = this.get(path.replace(/\?.*/, function (value) {
                    param = value;
                    return '';
                }), true);
                if (storageObj) {
                    if (require.method != 'paral') {
                        require.waiting = true;
                    }
                    var callback = storageObj.callback.replace(/^function\s*[\w\d_]*\(/, 'function anonymous(');
                    this.require(
                        storageObj.pathId,
                        storageObj.requires ? storageObj.requires.split(',') : [],
                        new Function(callback + ';return anonymous.apply(null, Array.prototype.slice.apply(arguments)) \n //@ sourceURL=' + storageObj.pathId)
                    );
                    return;
                }
            }

            if (
                this._onLoadEvents.some(function (item) {
                    if (item.path == require.path) {
                        return true;
                    }
                })
                ) {
                return;
            }
            var element = this.createElement(require.type, path),
                self = this;
            if (!element) {
                return;
            }

            addOnloadEvent(element, function () {
                require.waiting = false;
                self.satisfy(require);
            }, function () {
                require.waiting = false;
                self.unsatisfy(require);
            });
            require.element = element;

            var head = document.head || document.getElementsByTagName('head')[0];
            if (require.method != 'paral') {
                this._onLoadEvents.push(require);
                setTimeout(function () {
                    head.appendChild(element);
                    require.waiting = true;
                }, 0);
            }
            else {
                head.appendChild(element);
            }

        },
        /**
         * 完成当前complete并执行下一个需求
         */
        createElement: function (type, path) {
            if (!path) return;
            var element,
                config = this._config;
            if (type === 'css') {
                element = document.createElement("link");
                element.setAttribute('type', 'text/css');
                element.setAttribute('rel', 'stylesheet');
                element.setAttribute('href', path);
            }  else {
                element = document.createElement("script");
                element.setAttribute('type', 'text/javascript');
                element.setAttribute('src', path);
                element.setAttribute('data-basepath', config.basePath);
            }
            element.setAttribute('data-contextpath', config.contextPath);
            return element;
        },
        /**
         * 完成当前complete并执行下一个需求
         */
        excCompleteAndExcNext: function (require) {
            require.completed = true;
            var nextRequire = this.excCompleteAnGetNext(require);
            this.handleRequire(nextRequire);
        },
        /**
         * 获取下一个需求并判断当前是否需要执行回调
         */
        excCompleteAnGetNext: function (require) {
            this.checkComplete(require);
            return this.getNextRequire(require);
        },
        /**
         * 获取下一个需求
         */
        getNextRequire: function (require) {
            if (!require)return;
            if (require._process && require._process.length) {
                var _process = require._process, l = _process.length;
                for (var i = 0; i < l; i++) {
                    if (!_process[i]._called) {
                        return _process[i][0];
                    }
                }
            }
            var i = require.i,
                j = require.j,
                _process = require.parent && require.parent._process ? require.parent._process : this._process,
                requires = _process[require.i];
            if (!requires) {
                return require;
            }
            else if (j == requires.length - 1 || (j == 0 && requires.length == 0)) {
                i += 1;
                j = 0;
                requires = _process[i];
                if (!requires) {
                    if (require.parent) {
                        this.checkComplete(require.parent);
                        return this.getNextRequire(require.parent);
                    }
                }
            }
            else {
                j += 1;
            }
            var nextRequire = _process[i] && _process[i][j];
            return nextRequire;
        },
        /**
         * 是否需要执行回调
         */
        checkComplete: function (require) {
            if (!require)return;
            this._handling = true;
            var j = require.j,
                requires = this.getRequires(require),
                resources = [];
            if (require.method == 'paral') {
                var object;
                for (var i = 0; i < requires.length; i++) {
                    require = requires[i];
                    if (!require || !require.completed) {
                        break;
                    }
                    else {
                        object = require.resourceObject;
                        if (!object) {
                            object = this.checkAndSetObjectByName(requires[i]);
                        }
                        resources.push(object);
                    }
                }
                if (i == requires.length - 1) {
                    require.completed = true;
                    require.callback.apply(window, resources);
                    this.handleRequire(this.getNextRequire(require));
                }
            }
            else if (requires && (requires.length == 0 || j == requires.length - 1)) {
                if (require._process && require._process.length) {
                    var _process = require._process, l = _process.length;
                    for (var i = 0; i < l; i++) {
                        if (!_process[i]._called) {
                            return;
                        }
                    }
                }
                if (!requires._called) {
                    //先把状态置为true，防止重复
                    this.execCallback(require);
                    if (require !== this._handlingRequire) {
                        return;
                    }
                    if (require.parent) {
                        this.excCompleteAndExcNext(require.parent);
                    }
                    else {
                        this.handleRequire(this.getNextRequire(require));
                    }
                }
            }
        },
        execCallback: function (require) {
            var requires = this.getRequires(require),
                l = requires.length,
                object,
                resources = [];
            for (var i = 0; i < l - 1; i++) {
                object = requires[i].resourceObject;
                if (!object) {
                    object = this.checkAndSetObjectByName(requires[i]);
                }
                resources.push(object);
            }
            require.callbacking = true;
            var ret = require.callback.apply(window, resources);
            require.callbacking = false;
            require.resourceObject = ret;
            require.completed = true;
            if (requires.path) {
                this._completedPaths[require.path] = require;
            }
            if (require.parent) {
                require.parent.resourceObject = ret;
                require.parent.completed = true;

                (requires || require.parent._process[0])._called = true;
            }
            else {
                this._process[require.i]._called = true;
            }
            return ret;
        },
        /**
         * 获取requires
         */
        getRequires: function (require) {
            var i = require.i,
                j = require.j,
                _process = require.parent && require.parent._process ? require.parent._process : this._process,
                requires = _process[require.i];
            return requires;
        },
        /**
         * 删除requires
         */
        deleteRequires: function (require) {
            var i = require.i,
                j = require.j,
                parent = require.parent && require.parent._process ? require.parent : this,
                _process = parent._process,
                requires = _process[require.i];
            if (requires) {
                parent._process = _process.slice(0, i).concat(_process.slice(i + 1));
            }
        },
        /**
         * 判断当前对象是否存在，如存在，则不加载对应组的js文件
         */
        checkAndSetObjectByName: function (require) {
            var origRequire = this._completedPaths[require.path],
                resourceObjectPath = require.resourceObjectPath,
                resourceObject = resourceObject;
            if (require.type == 'css') {
                if (origRequire) {
                    require.completed = true;
                    require.resourceObject = true;
                    return true;
                }
                else if (require.completed) {
                    this._completedPaths[require.path] = true;
                    return require.resourceObject = true;
                }
                return;
            }
            if (require.resourceObject) {
                return require.resourceObject
            }
            if (origRequire) {
                resourceObject = origRequire.resourceObject;
                if (resourceObject) {
                    require.resourceObject = resourceObject;
                    require.completed = true;
                    return resourceObject;
                }
            } else if (!origRequire && require.path) {
                this._completedPaths[require.path] = require;
                /*if(require.callback){
                 this.execCallback(require);
                 }*/
            }

            if (!resourceObjectPath) {
                return;
            }
            if (require && require.callback) {
                return;
            }
            var names = resourceObjectPath.split('.'),
                namesLength = names.length,
                name,
                obj = window;
            for (var j = 0; j < namesLength; j++) {
                name = names[j];
                if (!(j == 0 && name == 'window')) {
                    obj = obj && obj[name];
                }
            }
            if (!obj) {
                return;
            }
            require.resourceObject = obj;
            require.completed = true;
            if (!this._completedPaths[require.path]) {
                this._completedPaths[require.path] = require;
            }
            return obj;
        },
        /*
         * 使用storage存数据
         * */
        put: function (key, value, noStorageKey) {
            if (!this._config.storage) {
                return;
            }
            if (value && this.isObject(value) && !(this.isFunction(value)
                || this.isArray(value)
                || this.isString(value)
                || this.isNumber(value))
                ) {
                value = JSON.stringify(value);
            }
            var key = noStorageKey ? key : (this._storageKey || '') + key,
                localStorage = window.localStorage;
            try {
                if (localStorage) {
                    localStorage.setItem(key, value);
                }
            } catch (e) {
            }
        },
        /*
         * 使用storage取数据，如果失败从this.sessionStorage取
         * */
        get: function (key) {
            var value = '', localStorage = window.localStorage;
            if (localStorage && !this._config.storage) {
                return value;
            }
            try {
                var key = (this._storageKey || '') + key;
                if (localStorage) {
                    value = localStorage.getItem(key);
                }
            } catch (e) {
            }
            if (value && /^\{[\s\S]*\}$/.test(value)) {
                value = JSON.parse(value);
            }
            if (value === 'undefined' || value === 'null') {
                value = '';
            }
            return value;
        },
        addCache: function (requires) {
            var pathId = requires.pathId;
            if (pathId) {
                pathId = this.handlePath(pathId, requires.contextPath, requires.basePath);
                if (
                    this._config.storage &&
                    pathId && !this.get(pathId)
                    ) {
                    this.put(pathId, {
                        pathId: pathId,
                        requires: requires.toString(),
                        callback: requires.callback.toString()
                    });
                }
            }
        },
        /*
         * 初始化storage版本设置和清空历史数据
         * */
        initAndClearStorage: function () {
            var localStorage = window.localStorage;
            if (localStorage && this._config.storage) {
                try {
                    var param = this._config.param,
                        _storageKey = this._storageKey,
                        lastParam = localStorage.getItem(_storageKey),
                        length = localStorage.length;
                    localStorage.setItem(_storageKey, param || '');
                    if (lastParam && lastParam != param) {
                        var matchReg = new RegExp('^' + _storageKey + '.+'),
                            key;
                        while (length--) {
                            key = localStorage.key(length);
                            if (key.match(matchReg)) {
                                localStorage.removeItem(key);
                            }
                        }
                    }
                } catch (e) {
                }
            }
        },
        ajax: function (options) {
            var xmlhttp = null;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (xmlhttp != null) {
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        if (xmlhttp.status == 200) {
                            if (options.success) {
                                options.success(xmlhttp.responseText, xmlhttp);
                            }
                        } else {
                            if (options.failed) {
                                options.failed(xmlhttp);
                            }
                        }
                    }
                };
                xmlhttp.open("GET", options.url || '', true);
                xmlhttp.send(null);
            }
        },
        handleCss: function (data, url) {
            var path = '',
                httpPreReg = /^https?:\/\//,
                handledData,
                tailReg = /[^\/]*$/,
                filePathReg = /[\:]/;

            if (url.match(httpPreReg)) {
                path = url.replace(tailReg, '');
            }
            else {
                path = (location.origin + location.pathname).replace(tailReg, '')
                    + url.replace(tailReg, '');
            }
            handledData = data.replace(/url\s*\(([^\s;\(\)]*)\)\s*/g, function (value, url) {
                if (url) {
                    if (url.match(httpPreReg) || url.match(filePathReg)) {
                        return value;
                    }
                    else {
                        var split = url.match(/^\s*(['"])?([^'"]*)/);
                        split[1] = split[1] || '';
                        return 'url(' + split[1] + path + split[2] + split[1] + ')';
                    }
                }
                else {
                    return value;
                }
            });
            return handledData;
        },
        getRemote: function (url, success, fail) {
            var self = this,
                pathId = url.replace(/\?.*/, ''),
                storageData = self.get(pathId);
            if (storageData) {
                append(storageData);
            }
            else {
                this.ajax({
                    url: url,
                    success: function (data, xmlhttp) {
                        if (pathId) {
                            self.put(pathId, data);
                        }
                        append(data);
                    },
                    failed: function (xmlhttp) {
                        fail && fail.call(this, xmlhttp);
                    }
                });
            }
            function append(data) {
                var el = document.createElement('style');
                el.setAttribute('type', 'text/css');
                el.innerHTML = self.handleCss(data, url);
                document.head.appendChild(el);
                success && success(data);
            }
        }

    };
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(function (name) {
        compose['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });
    window.compose = compose;
    compose.init();
})(window);