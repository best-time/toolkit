compose.require('scripts/eBase/util.js',[
    'window.$',
    'scripts/eBase/eBase.js',
    "scripts/lib/exp.js"
], function ($, eBase, Exp) {
    eBase.util = {
        showLoading: function (msg) {
            return this.messageAlertBox = Exp.createLoading(msg);
        },
        hideLoading: function() {
            if (this.messageAlertBox) {
                this.messageAlertBox.reset();
            }
        },
        showAlert: function (message, callback) {
            Exp.showAlert(message, callback);
        },
        removeUndefined: function (data){
            if(data){
                for(var i in data){
                    if(data[i] == undefined || data[i] == "undefined"){
                        delete data[i];
                    }
                }
            }
        },
        /*
         * 执行
         * @param {Function} [executor] 添加执行因子
         * */
        execute: function (executor){
            var execs = this.execs = this.execs || [];
            if(executor){
                this.execs.push(executor);
            }
            else{
                var len = execs.length;
                while (len){
                    len--;
                    executor = execs.pop();
                    executor();
                }
            }
        },
        /*
         * 回收功能，实现 在页面非活动时事件自动屏蔽，页面销毁时事件自动销毁
         * view 视图或el元素
         * target 事件元素
         * eventName 事件名称
         * callback 事件回调
         * duration 大于0标识时间间隔的优化 默认200ms,值为0代表无优化
         * */
        recycle: function (view, target, eventName, callback, duration){
            duration = duration===0? 0: 200;
            if(!target.forEach){
                target = [target];
            }
            target.forEach(function (item) {
                var timer=0, wrapCallback;
                item.addEventListener(eventName, wrapCallback = function () {
                    if(view.getStatus && view.getStatus('active')
                        || view.css && view.css('display') !== 'none'){
                        var self = this;
                        if(duration===0){
                            timeCallback();
                        }
                        else{
                            clearTimeout(timer);
                            timer = setTimeout(timeCallback, duration);
                        }
                        function timeCallback() {
                            if(destory()){
                                return;
                            }
                            if(callback){
                                callback.apply(self, Array.prototype.slice.apply(arguments));
                            }
                        }
                    }
                });
                function destory(){
                    if(view.getStatus && view.getStatus('destory'
                        || parent.closest && !parent.closest('body').size())){
                        item.removeEventListener(eventName, wrapCallback);
                        return true;
                    }

                }
            });
        },
        /*
         * 顶部进度条
         * @param {Element} [el] 进度条元素
         * */
        setPageLoadingbar: function (el){
        },
        sessionStorage:{},
        /*
         * 使用sessionStorage存数据，如果失败放入util.sessionStorage
         * */
        put: function (key, value, isPersist){
            if(value && eBase.isObject(value) &&!(eBase.isFunction(value)
                ||eBase.isArray(value)
                ||eBase.isString(value)
                ||eBase.isNumber(value))){
                value = JSON.stringify(value);
            }
            var storageName = isPersist?'localStorage':'sessionStorage',
                key = (compose._storageKey) + key;
            try{
                if(window[storageName] && compose._config.storage){
                    window[storageName].setItem(key, value);
                }
                else{
                    this.sessionStorage[key] = value;
                }
            }catch(e){
                this.sessionStorage[key] = value;
            }
        },
        /*
         * 使用sessionStorage取数据，如果失败从util.sessionStorage取
         * */
        get: function (key, isPersist){
            var value;
            try{
                var storageName = isPersist?'localStorage':'sessionStorage',
                    key = (compose._storageKey||'') + key;

                if(window[storageName] && compose._config.storage){
                    value = window[storageName].getItem(key);
                }
                if(!value){
                    value = this.sessionStorage[key];
                }
            }catch(e){
                value = this.sessionStorage[key];
            }
            if(value && /^\{[\s\S]*\}$/.test(value)){
                value = JSON.parse(value);
            }
            return value;
        },
        /*
         * 使用sessionStorage删除数据，如果失败从util.sessionStorage取
         * */
        remove: function (key){
            var value = this.get(key);
            try{
                if(window.sessionStorage){
                    window.sessionStorage.removeItem(key);
                }
            }catch(e){
                delete this.sessionStorage[key];
            }
            return value;
        },
        /*
         * 检测storage
         * */
        isSupport: (function () {
            var storage = window.sessionStorage;
            try{
                if(storage){
                    storage.setItem('t','t');
                    storage.removeItem('t');
                    return true;
                }
            }catch(e){
            }
            return false;
        })(),
        /*
         * 无效值跳转到指定hash,否则返回指定值
         * @param String [redirect] hash
         * */
        unvalideDirect: function (key, redirect){
            var value = this.get(key);
            if(!value){
                eBase.PageRouter.go('#'+redirect);
            }
            else{
                return value;
            }
        }
    };
    return eBase;
});