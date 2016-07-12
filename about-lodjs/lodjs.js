;
(function (win) {
    'use strict';

    var modMap = [];  // =>存在加载的js key 为js的路径, value 为{status: 'loading',oncomplete: []}
    var moduleMap = [];

    var toString = ({}).toString;
    var slice = [].slice;

    var doc = document;
    var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
    var docCharset = doc.charset;

    var docUrl = location.href.split('?')[0];//去除问号之后部分
    var baseUrl = getCurSrc() || docUrl;

    var gid = 0;
    var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
    var cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;

    var interactiveScript = null;
    var currentlyAddingScript = null;
    var curExecModName = null;

    var ts = +new Date; //(new Date).getTime();

    var o = {};

    function extendDeep(target, curObj) {
        var target = target || {};
        var arrs = slice.call(arguments, 1);
        var len = arrs.length;

        var copyIsArr;
        var clone;

        for (var i = 0; i < len; i++) {
            var arr = arrs[i];
            for (var name in arr) {
                var src = target[name];
                var copy = arr[name];

                //避免无限循环
                if (target === copy) {
                    continue;
                }

                if (
                    copy &&
                    (isObj(copy) || (copyIsArr = isArr(copy)))
                    ) {
                    if (copyIsArr) {
                        copyIsArr = false;
                        clone = src && isArr(src) ? src : [];
                    } else {
                        clone = src && isObj(src) ? src : {};
                    }
                    target[ name ] = extendDeep(clone, copy);

                } else if (typeof copy !== 'undefined') {
                    target[name] = copy;
                }
            }

        }

        return target;
    }


/*
        if (d.cache) {
            src += '?t=' + ts;
        }
        var node = doc.createElement('script');
        node.src = src;
        node.id = 'lodjs-js-' + count();
        node.charset = d.charset;

        if ('onload' in node) {
            node.onload = success;
            node.onerror = error;
        } else {
            node.onreadystatechange = function () {
                if (/loaded|complete/.test(node.readyState)) {
                    success();
                }
            }
        }
        currentlyAddingScript = node;
        head.appendChild(node);
        currentlyAddingScript = null;
    }
*/

    function getCurSrc() {
        if (doc.currentScript) {  // =>当前存在执行的script 则返回当前js的路径
            return doc.currentScript.src;
        }
        if (currentlyAddingScript) {  // =>当前正在添加的 script
            return currentlyAddingScript.src;
        }
        // For IE6-9 browsers, the script onload event may not fire right
        // after the script is evaluated. Kris Zyp found that it
        // could query the script nodes and the one that is in "interactive"
        // mode indicates the current script
        // ref: http://goo.gl/JHfFW
        if (
            interactiveScript &&
            interactiveScript.readyState === "interactive"
            ) {
            return interactiveScript.src;
        }

        var scripts = head.getElementsByTagName("script");
        var i = scripts.length - 1;
        for (; i >= 0; i--) {
            var script = scripts[i];
            if (script.readyState === "interactive") {
                interactiveScript = script;
                return interactiveScript.src;
            }
        }
        return null;
    }

    function getUrl(path, url) {
        //绝对网址
        if (isUrl(path)) {
            return fixUrl(path);
        }

        var rootUrl;
        //修复url
        if (rootUrl = url.match(/[^\/]*\/\/[^\/]*\//)) {
            //http://yanhaijing.com/abc
            url = url.slice(0, url.lastIndexOf('/') + 1);
            rootUrl = rootUrl[0];
        } else {
            //http://yanhaijing.com
            rootUrl = url = url + '/';
        }

        // /开头
        if (path.search(/^\//) !== -1) {
            return fixUrl(rootUrl + path);
        }

        // ../开头
        if (path.search(/^\.\.\//) !== -1) {
            while (path.search(/^\.\.\//) !== -1) {
                if (url.lastIndexOf('/', url.length - 2) !== -1) {
                    path = path.slice(3);
                    url = url.slice(0, url.lastIndexOf('/', url.length - 2) + 1);
                } else {
                    throw new Error('lodjs geturl error, cannot find path in url');
                }
            }

            return fixUrl(url + path);
        }
        // ./
        path = path.search(/^\.\//) !== -1 ? path.slice(2) : path;

        return fixUrl(url + path);
    }

    function fixSuffix(url, suffix) {
        var reg = new RegExp('\\.' + suffix + '$', 'i');
        return url.search(reg) !== -1 ? url : url + '.' + suffix;
    }

    function replacePath(id) {
        var ids = id.split('/');
        // id中不包含路径 或 查找路径失败
        if (ids.length < 2 || !(ids[0] in o.path)) {
            return id;
        }
        ids[0] = o.path[ids[0]];
        return ids.join('/');
    }

    function getDepUrl(id, url) {
        var pathId = replacePath(id);
        //找到path 基于baseUrl
        if (pathId !== id) {
            url = o.baseUrl;
        }
        return fixSuffix(getUrl(pathId, url || o.baseUrl), 'js');
    }

    function getIdUrl(id) {
        //没有id的情况
        if (!id) {
            return getCurSrc();
        }
        //id不能为相对路径,amd规定此处也不能带后缀，此处放宽限制。
        if (id.search(/^\./) !== -1) {
            throw new Error('lodjs define id' + id + 'must absolute');
        }
        return fixSuffix(getUrl(id, o.baseUrl), 'js');
    }

    //========================================================================================\\


    function require(id, url) {
        var url = getDepUrl(id, url || curExecModName);
        return moduleMap[url] && moduleMap[url].exports;
    }

    function config(option) {
        if (!isObj(option)) {  // 不是对象, 返回 {} o 集合
            return extendDeep({}, o);
        }

        //处理baseUrl
        if (option.baseUrl) {
            option.baseUrl = getUrl(option.baseUrl, docUrl);
        }

        //处理path
        if (isObj(option.path)) {
            for (var key in option.path) {
                option.path[key] = fixPath(option.path[key]);
            }
        }
        o = extendDeep(o, option);  //对象复制 赋值给 变量 a

        //fix keywords
        o.path.BASEURL = fixPath(option.baseUrl || o.baseUrl);
        o.path.DOCURL = fixPath(docUrl);

        return extendDeep({}, o);
    }

    function loadjs(src, success, error, option) {
        var d = extendDeep({
            charset: docCharset,
            cache: o.cache
        }, option);

        if (d.cache) {
            src += '?t=' + t;
        }
        var node = doc.createElement('script');
        node.src = src;
        node.id = 'lodjs-js-' + count();
        node.charset = d.charset;

        if ('onload' in node) {
            node.onload = success;
            node.onerror = error;
        } else {
            node.onreadystatechange = function () {
                if (/loaded|complete/.test(node.readyState)) {
                    success();
                }
            }
        }
        currentlyAddingScript = node;
        head.appendChild(node);
        currentlyAddingScript = null;
    }

    function execMod(modName, callback, params) {
        //判断定义的是函数还是非函数
        if (!params) {
            moduleMap[modName].exports = modMap[modName].callback;
        } else {
            curExecModName = modName;
            //commonjs
            var exp = modMap[modName].callback.apply(null, params); //define方法 回调的返回值
            curExecModName = null;
            //amd和返回值的commonjs
            if (exp) {
                moduleMap[modName].exports = exp; //define方法 回调的返回值
            }
        }
        //执行回调函数
        callback(moduleMap[modName].exports);

        //执行complete队列
        execComplete(modName);

    }

    function execComplete(modName) {
        //模块定义完毕 执行load函数,当加载失败时，会不存在module
        for (var i = 0; i < modMap[modName].oncomplete.length; i++) {
            modMap[modName].oncomplete[i](
                    moduleMap[modName] && moduleMap[modName].exports
            );
        }
        //释放内存
        modMap[modName].oncomplete = [];
    }

    function loadMod(id, callback, option) {
        //commonjs
        if (id === 'require') {
            callback(require);
            return -1;
        }
        if (id === 'exports') {
            var exports = moduleMap[option.baseUrl].exports = {};
            callback(exports);
            return -2;
        }
        if (id === 'module') {
            callback(moduleMap[option.baseUrl]);
            return -3;
        }
        var modName = getDepUrl(id, option.baseUrl);
        //未加载
        if (!modMap[modName]) {
            modMap[modName] = {
                status: 'loading',
                oncomplete: []
            };
            loadjs(
                modName,
                function () {  // => onload 回调
                    //如果define的不是函数
                    if (!isFn(modMap[modName].callback)) {
                        execMod(modName, callback);
                        return 0;
                    }

                    //define的是函数
                    use(
                        modMap[modName].deps,
                        function () {
                            execMod(modName, callback, slice.call(arguments, 0));
                        },
                        {baseUrl: modName}
                    );

                    return 1;
                },
                function () {  // => onerror 回调

                    modMap[modName].status === 'error';
                    callback();
                    execComplete(modName);//加载失败执行队列

                }
            );

            return 0;
        }

        //加载失败
        if (modMap[modName].status === 'error') {
            callback();
            return 1;
        }
        //正在加载
        if (modMap[modName].status === 'loading') {
            modMap[modName].oncomplete.push(callback);
            return 1;
        }

        //加载完成
        //尚未执行完成
        if (!moduleMap[modName].exports) {
            //如果define的不是函数
            if (!isFn(modMap[modName].callback)) {
                execMod(modName, callback);
                return 2;
            }

            //define的是函数
            use(modMap[modName].deps, function () {
                execMod(modName, callback, slice.call(arguments, 0));
            }, {baseUrl: modName});
            return 3;
        }

        //已经执行过
        callback(moduleMap[modName].exports);
        return 4;
    }

    function use(deps, callback, option) {

        if (arguments.length < 2) { // =>参数个数< 2
            throw new Error('lodjs.use arguments miss');
            return 0;
        }

        if (typeof deps === 'string') { // =>参数1是字符串 放到数组中
            deps = [deps];
        }

        if (!isArr(deps) || !isFn(callback)) {// => 参数1不是数组或参数2不是函数  抛错
            throw new Error('lodjs.use arguments type error');
            return 1;
        }
        //默认为当前脚本的路径或baseurl
        if (!isObj(option)) {   // => 参数3 不是对象, 则赋值 {}
            option = {};
        }
        option.baseUrl = option.baseUrl || o.baseUrl;

        if (deps.length === 0) {  // => 依赖为空,回调直接执行
            callback();
            return 2;
        }
        var depsCount = deps.length;
        var params = [];
        for (var i = 0; i < deps.length; i++) {

            (function (j) {
                loadMod(
                    deps[j],
                    function (param) {
                        depsCount--;
                        params[j] = param;
                        if (depsCount === 0) {
                            callback.apply(null, params);  // callback 指 调用use方法的回调
                        }
                    },
                    option
                );
            }(i));

        }

        return 3;
    }

    function define(name, deps, callback) {
        //省略模块名
        if (typeof name !== 'string') { //参数1不是字符串
            callback = deps;  //参数2赋值给参数3
            deps = name;        //参数1赋值给参数2
            name = null;        //参数1赋值为null
        }

        //无依赖
        if (!isArr(deps)) { //参数2 不是数组
            callback = deps;    //参数2赋值给参数3
            deps = [];      //参数2赋值为 []
        }

        //支持commonjs
        if (deps.length === 0 && isFn(callback) && callback.length) {
            callback.toString()
                .replace(commentRegExp, '')
                .replace(cjsRequireRegExp, function (match, dep) {
                    deps.push(dep);
                });
            var arr = ['require'];
            if (callback.length > 1) {
                arr.push('exports');
            }
            if (callback.length > 2) {
                arr.push('module');
            }
            deps = arr.concat(deps);
        }

        var modName = getIdUrl(name).split('?')[0];//fix 后缀

        modMap[modName] = modMap[modName] || {};
        modMap[modName].deps = deps;
        modMap[modName].callback = callback;
        modMap[modName].status = 'loaded';
        modMap[modName].oncomplete = modMap[modName].oncomplete || [];
        moduleMap[modName] = {};

        return 0;
    }

    define.amd = {
        from: 'lodjs'
    };
//========================================================================================\\

    //-------------------------------------------------------------------------------------------------------------

    function count() {  // => 计数器
        return gid++;
    }

    function isUrl(url) {
        return url.search(/^(http:\/\/|https:\/\/|\/\/)/) !== -1;
    }

    function fixUrl(url) { // => 去除多余 '/'
        return url.replace(/([^:])\/+/g, '$1/');  // 'a///' => 'a/'
    }

    function isArr(arr) {
        return Array.isArray ? Array.isArray(arr) : getType(arr) === 'array';
    }

    function isObj(obj) {
        return getType(obj) === 'object';
    }

    function isFn(fn) {
        return getType(fn) === 'function';
    }

    function getType(x) {
        if (x === null) {
            return 'null';
        }

        var t = typeof x;

        if (t !== 'object') {
            return t;
        }

        var c = toString.call(x).slice(8, -1).toLowerCase();
        if (c !== 'object') {
            return c;
        }

        if (x.constructor == Object) {
            return c;
        }

        return 'unknow';
    }

    function fixPath(path) {    //path是网址
        if (isUrl(path)) {
            return getUrl('./', path).slice(0, -1);
        }
        return path;
    }

    function debug() {
        console.log(modMap, moduleMap);
    }

    //--------------------------------------------------------------------------------------------------------------


    var lodjs = {
        use: use,
        loadjs: loadjs,
        config: config,
        define: define,
        require: require,
        debug: debug
    };

    //配置项
    lodjs.config({
        baseUrl: baseUrl,
        path: {},
        cache: false
    });

    win.define = define;
    win.lodjs = lodjs;

}(window));