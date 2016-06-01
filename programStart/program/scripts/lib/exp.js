/*
 * 对exp通用的功能封装
 * @author mawei
 */
compose.require('scripts/lib/exp.js',[
    'window.$'
], function ($) {
    ;if(typeof template == 'undefined'){
        template = {};
    }
    /*frame兼容写法*/
    var win = window,
        requestAnimationFrame= window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame,
        cancelAnimationFrame= window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame
            || window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame,
        setTimeoutNative= window.setTimeout,
        clearTimeoutNative= window.clearTimeout,
        setIntervalNative= window.setInterval,
        clearIntervalNative= window.clearInterval;
    var Exp = (function($, template){
        var cache = {cssSupport:{}};
        var ua = navigator.userAgent,
            //uc伪装ios标识
            ucDisguise = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X.+(Safari.+UCBrowser)/),
            Sys = {
                ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X[^UCBrowser]/) && !ucDisguise,
                andorid: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1,
                ucDisguise: ucDisguise
            };
        var Exp = {
            mobile: !!ua.match(/AppleWebKit.*Mobile.*/)||typeof window.orientation !== 'undefined',
            /*
             *添加默认事件，阻止弹出层滑动
             *@param el HTMLElement 要阻止的元素
             */
            addDefaultsEvents: function(el){
                function eFilter(){return false;};
                var mobile = this.mobile;
                var events = ['mousewheel', 'DOMMouseScroll', mobile?'touchstart':'mousedown', mobile?'touchmove':'mousemove', mobile?'touchend':'mouseup'], i= events.length;
                while(i--){
                    el.on(events[i], eFilter);
                }
            },
            /*
             * 判断css属性是否支持
             */
            cssSupports : (function() {
                var support = cache.cssSupport;
                return function(prop) {
                    var div = document.createElement('div'),
                        vendors = 'khtml o moz webkit'.split(' '),
                        len = vendors.length, ret = false;
                    prop = prop.replace(/-[\w]/g, function(val) {
                        return val.toUpperCase().substring(1);
                    });
                    if(prop in support) return support[prop];

                    if ('-ms-' + prop in div.style) ret = '-ms-' + prop;
                    else{
                        prop = prop.replace(/^[a-z]/, function(val) {
                            return val.toUpperCase();
                        });
                        while(len=len-1){
                            if (vendors[len] + prop in div.style ){
                                ret = vendors[len] + prop;
                            };
                        }
                    }

                    return support[prop] = ret;
                }
            })(),
            /*
             * 设置css
             */
            css:  function(element, prop, val) {
                var getComputedStyle = document.defaultView.getComputedStyle;
                var ret = this.cssSupports(prop);
                if(val === undefined){
                    if(element.length){
                        element = element[0];
                    }
                    return (element && element.style[ret] || element && getComputedStyle(element, '').getPropertyValue(prop));
                }
                else{
                    if(element.length){
                        for(var i=0; i<element.length; i++){
                            element[i].style[ret] = val;
                        }
                    }
                    else if(element.style){
                        element.style[ret] = val;
                    }
                }
            },
            css3: function(el, prop){
                var reg = /\((?:[\s,]*([-\d\.]+)[px\s]*)?(?:[\s,]*([-\d\.]+)[px\s]*)?(?:[\s,]*([-\d\.]+)[px\s]*)?/g,
                    values = reg.exec(Exp.css(el, prop));
                if(values){
                    values.shift();
                }
                return values;
            },
            /*
             * 扩展对象属性
             * @param orig {Object} 源对象
             * @param target {Object} 目标对象
             * @param deep {Boolean} 是否深度copy
             */
            extend: function(orig, target, deep){
                var toStr = Object.prototype.toString,
                    arrayFlag = "[object Array]";
                orig = orig || {};
                for (var i in target) {
                    if(deep === true && target.hasOwnProperty(i)) {
                        if (typeof target[i] === "object") {
                            if(!orig[i]){
                                orig[i] = toStr.call(target[i]) === arrayFlag ? [] : {};
                            }
                            arguments.callee(orig[i], target[i], deep);
                        }
                        else {
                            orig[i] = target[i];
                        }
                    }
                    else orig[i] = target[i];
                }
                return orig;
            },
            /*
             * 获取页面元素的绝对top位置
             * @param e {HTMl} dom对象
             */
            getTop: function(e, deep){
                var offset = 0;
                if(e.offsetParent != null){
                    offset = e.offsetTop;
                    var parent = e.offsetParent;
                    if(deep){
                        offset += arguments.callee(e.offsetParent);
                    }
                    else if("relative absolute fixed".indexOf(parent.style.position) == -1){
                        offset += arguments.callee(e.offsetParent);
                    }
                }
                else if(e.offsetParent != null){
                }
                return offset;
            },
            /*
             * 获取页面元素的绝对left位置
             * @param e {HTMl} dom对象
             */
            getLeft: function(e, deep){
                var offset = 0;
                if(e.offsetParent != null/* && "relative absolute fixed".indexOf(a.css("position")) == -1*/){
                    offset = e.offsetLeft;
                    var parent = e.offsetParent;
                    if(deep){
                        offset += arguments.callee(e.offsetParent);
                    }
                    else if("relative absolute fixed".indexOf(parent.style.position) == -1){
                        offset += arguments.callee(e.offsetParent);
                    }
                }
                return offset;
            },
            /*
             * 获取浏览器版本号
             */
            getVersion:function(){
                return Sys;
            },
            checkDevice: {
                isMobile: function(){
                    return (ua.match(/Win/i)
                        || ua.match(/MacIntel/i)
                        || ua.match(/Linux/i)
                        ) ? false : true;
                }
            },
            position: {
                getHeight: function(){
                    var height = document.documentElement.offsetHeight || document.body.offsetHeight;
                    return height;
                },
                scrollTop: function(){
                    return document.documentElement.scrollTop || document.body.scrollTop;
                },
                scrollHeight: function(){
                    return document.body.scrollHeight || document.documentElement.scrollHeight;
                },
                clientHeight: function(){
                    return document.documentElement.clientHeight || document.body.clientHeight;
                }
            },
            remove: function(){
                if(this.parentNode){
                    this.parentNode.removeChild(this);
                    return;
                }
            },
            buttonChange: function(opts){//触发按钮可点击状态
                var opts = opts || {},
                    button = opts.button,
                    notClass = opts.notClass,
                    yesClass = opts.yesClass,
                    inputsId = opts.inputsId,
                    valideId = opts.valideId,
                    errorClass = opts.errorClass,
                    checkbox = opts.checkbox,
                    valideEl = opts.valideEl,
                    lisenerParent = opts.lisenerParent,
                    flag = false,
                    callBack = opts.callBack,
                    clickCallback = opts.clickCallback;
                function compare(){
                    if(valideEl.valide({hide:true, notRemote: true}) || flag == true){
                        button.removeClass(yesClass).addClass(notClass);
                        if(callBack){
                            callBack(true);
                        }
                    }else{
                        button.removeClass(notClass).addClass(yesClass);
                        if(callBack){
                            callBack(false);
                        }
                    }
                }
                $(lisenerParent || window).on("input", function(){
                    if(checkbox && checkbox.element.hasClass(checkbox.uncheckClass)){
                        return;
                    }
                    compare();
                });
                if(clickCallback){
                    Exp.click(button, function(){
                        if(valideEl.valide()){
                            button.removeClass(yesClass).addClass(notClass);
                            if(clickCallback){
                                clickCallback(true);
                            }
                        }else{
                            button.removeClass(notClass).addClass(yesClass);
                            if(clickCallback){
                                clickCallback(false);
                            }
                        }
                    });
                }
                if(checkbox){
                    Exp.click(checkbox.element, function(){
                        var el = $(this);
                        flag = el.hasClass(checkbox.uncheckClass) ? true : false;
                        compare();
                    });
                }
                compare();
            },
            pageList:function (options){
                var root = options.root,
                    pages = options.pages,
                    status = 0,
                    startPoint,
                    movePoint,
                    minInterval = options.minInterval || 500,
                    touchTime = new Date();
                options.currentIndex = options.currentIndex || 0;
                var slidePageBtns = options.slidePageBtns;
                pages.each(function(i, e){
                    var btn = slidePageBtns.eq(i), page = pages.eq(i);
                    page.on("transitionend", function(event){
                        if(options.transitionEndCall){
                            options.transitionEndCall({
                                target:page,
                                root:root,
                                pages:pages,
                                index:i,
                                elapsedTime:event.elapsedTime,
                                propertyName:event.propertyName,
                                type:"transitionend"
                            });
                        }
                    })
                });
                slidePageBtns.each(function(i, e){
                    var btn = slidePageBtns.eq(i), page = pages.eq(i);
                    btn.on("mousedown touchstart", function(event){
                        if(new Date() - touchTime < minInterval){
                            status = 0;
                            return false;
                        }
                        else touchTime = new Date();
                        status = 1;
                        var touch = event.touches?event.touches[0]:event;
                        startPoint= {
                            x: touch.clientX,
                            y: touch.clientY
                        };

                        if(options.touchStartCall){
                            options.touchStartCall({
                                start:startPoint,
                                target:event.target,
                                curPage:page,
                                root:root,
                                pages:pages,
                                index:i,
                                type:"touchstart"
                            });
                        }
                        var target = event.srcElement || event.target;
                        if(target.tagName.toUpperCase() !== "A"){
                            event.preventDefault();
                        }
                    }).on("mousemove touchmove", function(event){
                        if(status == 0 || status > 2 )return;
                        var first = false,
                            touch = event.touches?event.touches[0]:event,
                            movePoint = {
                                x: touch.clientX,
                                y: touch.clientY
                            },
                            subY = movePoint.y - startPoint.y,
                            subX = movePoint.x - startPoint.x;
                        if(subY>=0 && i == 0 && !first){
                            return;
                        }
                        else if(subY<=0 && i == pages.length - 1 && !first){
                            return;
                        }
                        if(status == 1){
                            status = 2;
                            first = true;
                        }
                        if(status == 2){
                            if(subY || subX){
                                if(options.touchMoveCall){
                                    options.touchMoveCall({
                                        start:startPoint,
                                        move:movePoint,
                                        target:event.target,
                                        curPage:page,
                                        root:root,
                                        pages:pages,
                                        index:i,
                                        type:"touchmove",
                                        first: first
                                    });
                                }
                            }
                        }
                        event.preventDefault();

                    }).on("mouseup touchend", function(event){
                        if(status == 0)return;
                        status = 3;
                        var touch = event.changedTouches?event.changedTouches[0]:event;
                        movePoint = {
                            x: touch.clientX,
                            y: touch.clientY
                        };

                        var subY = movePoint.y - startPoint.y,
                            subX = movePoint.x - startPoint.x;
                        if(subY>=0 && i == 0){
                            if((subY || subX) && options.firstPageEndCall){
                                options.firstPageEndCall({
                                    start:startPoint,
                                    move:movePoint,
                                    target:event.target,
                                    curPage:page,
                                    root:root,
                                    pages:pages,
                                    index:i,
                                    type:"touchend"
                                });
                            }
                            return;
                        }
                        else if(subY<=0 && i == pages.length - 1){
                            if((subY || subX) && options.lastPageEndCall){
                                options.lastPageEndCall({
                                    start:startPoint,
                                    move:movePoint,
                                    target:event.target,
                                    curPage:page,
                                    root:root,
                                    pages:pages,
                                    index:i,
                                    type:"touchend"
                                });
                            }
                            return;
                        }
                        if(subY || subX){
                            if(options.touchEndCall){
                                options.touchEndCall({
                                    start:startPoint,
                                    move:movePoint,
                                    target:event.target,
                                    curPage:page,
                                    root:root,
                                    pages:pages,
                                    index:i,
                                    type:"touchend"
                                });
                            }
                        }
                        event.preventDefault();
                    })
                });
            },
            alertBox: (function(){
                /**
                 * [弹窗]
                 * @return {[type]} [description]
                 * @Author: 12050231
                 * @Date:   2014-03-25 10:20:54
                 * @Last Modified by :   14020803
                 * @Last Modified time:   2014-03-25 14:20:54
                 */
                function AlertBox(opts){
                    this.opts = opts || {};
                    this.title = this.opts.title || '';
                    this.msg = this.opts.msg || '';
                    this.type = this.opts.type || 'default';
                    this.hasMask = (this.opts.hasMask === false) ? false : true;
                    this.confirm = this.opts.confirm || function(){};
                    this.cancel = this.opts.cancel || function(){};
                    var callBack = this.opts.callBack,self = this;
                    this.callBack = function(){
                        if(callBack){
                            callBack.call(self);
                        }
                        Exp.clickActive($(self.el));
                    };
                    this._event = Exp.checkDevice.isMobile() ? "tap" : "click";
                    if(!opts.animate && opts.animate !== false ){
                        opts.animate = 'alert-box-anim';
                    }
                    if(!opts.bgAnimate && opts.bgAnimate !== false ){
                        opts.bgAnimate = 'alert-bg-anim';
                    }
                    this.animate = opts.animate;
                    this.bgAnimate = opts.bgAnimate;
                    this.scrollerClass = opts.scrollerClass;
                    this.survivePeriod = opts.survivePeriod || false;
                    this.createTime = new Date();
                    this.delayRender = opts.delayRender===false || opts.delayRender? opts.delayRender : true;
                    this.upOffset = opts.upOffset || 0;
                    this.resetCallback = opts.resetCallback;
                    this.asyncResetCallback = opts.asyncResetCallback;
                    this.background = opts.background;
                    this.bgClickReset = opts.bgClickReset;
                    this.preventScroller = function (event) {
                        event.preventDefault();
                        return false;
                    }
                }
                AlertBox.prototype = {
                    init: function(){
                        var self = this;
                        switch(self.type) {
                            case "default":
                                var html = '<div class="alert-box"><div class="msg">{{msg}}</div><div class="wbox"><div class="wbox-col-a btn-b btn-cancel mr20"><a href="#">取消</a></div><div class="wbox-col-a btn-c btn-confirm"><a href="#">确定</a></div></div></div>';
                                break;
                            case "alert":
                                var html = '<div class="alert-box"><div class="msg">{{msg}}</div><div class="layout wbox"><div class="wbox-col-a btn-c btn-confirm"><a href="#">确定</a></div></div></div>';
                                break;
                            case "validate":
                                var html = '<div class="alert-box alert-box-valide"><div class="msg">{{msg}}</div></div>';
                                break;
                            case "custom":
                                var html = this.opts.html;
                                break;
                        }
                        var tpl = html.replace(/{{.*}}/g, self.msg);
                        //解决键盘消失后定位不准
                        if(self.delayRender){
                            Exp.setTimeout(function(){self.render(tpl);}, 50);
                        }
                        else{
                            self.render(tpl);
                        }
                        if(self.type == "validate" && self.opts.autoCancel){
                            Exp.setTimeout(function(){
                                if(self.cancel){
                                    self.cancel();
                                }
                                self.reset();
                            },1500);
                        }
                        return this;
                    },
                    render: function(_htmlTpl){
                        var self = this;
                        var body = document.body;
                        if(this.opts.contextAnimate){
                            var $body = $(body),
                                context = $body.find('.alert-context'),
                                siblings = $body.children(':not(.alert-context):not(script)');
                            if(!context.length){
                                context = $('<section class="alert-context"></section>').appendTo($body);
                            }
                            context.append(siblings);
                            this.context = context;
                        }
                        body.insertAdjacentHTML('beforeend', _htmlTpl);
                        var el = self.el = self.get(".alert-box");
                        self.hasMask && self.mask(body);
                        function setPos(event){
                            self.setMaskPos();
                            if(self.opts.setPos){
                                self.opts.setPos.call(self, event);
                            }
                            else{
                                self.setPos(event);
                            }
                        }
                        this.setPosProxy = setPos;
                        if(self.animate){
                            el.setAttribute("class", (el.getAttribute("class")||"") + " "+ self.animate);
                        }
                        if(self.context){
                            self.context.addClass('alert-back-in');
                        }
                        if(self.opts.renderTime){
                            Exp.setTimeout(function(){
                                (typeof self.callBack == "function") && self.callBack();
                                $(window).on("resize",setPos);
                                setPos();
                            }, self.opts.renderTime);
                        }
                        else if(typeof self.callBack == "function") {
                            self.callBack();
                            $(window).on("resize", setPos);
                        }
                        setPos();
                        self.addEvent();
                        document.addEventListener('touchmove', this.preventScroller);
                        if(!this.scrollerClass)return;
                        var scroller = $("." + this.scrollerClass);
                        scroller[0].addEventListener('touchstart', touchstart);
                        scroller[0].addEventListener('touchmove', touchmove);

                        var startY;
                        function touchstart(event) {
                            startY = event.touches[0].clientY;
                        }
                        function touchmove(event) {
                            var height = scroller.height(),
                                scrollTop = scroller[0].scrollTop,
                                scrollHeight = scroller[0].scrollHeight;
                            var eventY = event.touches[0].clientY;
                            var subY = startY - eventY;
                            if(scrollTop >= 0 && scrollTop + height < scrollHeight && subY > 0){
                                event.stopPropagation();
                            }
                            else if(scrollTop > 0 && scrollTop + height <= scrollHeight && subY < 0){
                                event.stopPropagation();
                            }
                            else{
                                event.preventDefault();
                            }
                            return false;
                        }
                    },
                    mask: function(body){
                        var self = this;
                        var alertBoxBg = document.createElement("div");
                        alertBoxBg.setAttribute("class", 'alert-box-bg' + ' alert-box-bg-'+self.type +(this.opts&&this.opts.rootClass?' '+this.opts.rootClass+'-bg':''));
                        this.bg = alertBoxBg;
                        if(this.background === false)return;
                        body.appendChild(alertBoxBg);
                        this.setMaskPos();

                        if(self.bgAnimate)alertBoxBg.setAttribute("class", (alertBoxBg.getAttribute("class")||"") + " "+ self.bgAnimate);
                        if(this.bgClickReset !== false){
                            Exp.click($(self.bg),function(){
                                if(!$(self.bg).hasClass('alert-box-bg-validate')){
                                    self.reset();
                                }
                            });
                        }
                    },
                    setMaskPos: function(){
                        var _height = Exp.position.scrollHeight();
                        this.bg.style.cssText += ";height:" + _height + "px;width:" + document.documentElement.scrollWidth + "px;";
                    },
                    setPos: function(){
                        var self = this, el = self.el, bg = self.bg;
                        var scrollTop = Exp.position.scrollTop(),
                            isfixed = Exp.css([el], 'position')==='fixed';
                        el.style.cssText += ";top:" + ((isfixed?0:scrollTop) + window.innerHeight/2 - el.offsetHeight/2 - this.upOffset) + "px;left:" + (document.documentElement.offsetWidth/2 - el.offsetWidth/2) + "px;";
                        if(self.type == "mini"){
                            bg.style.opacity = 0;
                            Exp.setTimeout(function(){
                                bg.fadeOut(500, function(){
                                    $(this).remove();
                                });
                                bg.fadeOut(500, function(){
                                    $(this).remove();
                                });
                            },2000);
                        }
                    },
                    addEvent: function(){
                        var self = this, el = self.el;
                        $(el.querySelector(".btn-confirm")).on(self._event, function(e){
                            self.confirm(el);
                            self.reset();
                            e.preventDefault();
                        });
                        if(self.type != "alert"){
                            $(el.querySelector(".btn-cancel")).on(self._event, function(e){
                                self.cancel(el);
                                self.reset();
                                e.preventDefault();
                            });
                        }
                    },
                    reset: function(noAnimate){
                        if(this.survivePeriod && new Date() - this.createTime < this.survivePeriod){
                            return;
                        }
                        var self = this,
                            context = self.context;
                        self.context = null;
                        //解决键盘消失后定位不准
                        if(noAnimate){
                            destory();
                        }
                        else{
                            Exp.setTimeout(destory,50);
                        }
                        function destory(){
                            var el = self.el, bg = self.bg,
                                $el = $(el), $bg = $(bg), opts = self.opts;
                            $el.removeClass(opts.animate).addClass(opts.animateOut || "alert-box-anim-out");
                            $bg.removeClass(opts.bgAnimate).addClass(opts.bgAnimateOut || "alert-bg-anim-out");
                            if(context){
                                context.addClass("alert-front-in").removeClass("alert-back-in");
                            }
                            if(noAnimate){
                                remove();
                            }
                            else{
                                Exp.setTimeout(remove, 390);
                            }
                            self.removeScrollerEvent();
                            if(self.asyncResetCallback){
                                self.asyncResetCallback.call(self);
                            }
                            function remove(){
                                if(bg){
                                    Exp.remove.call(bg);
                                }
                                Exp.remove.call(el);
                                if(self.resetCallback){
                                    self.resetCallback.call(self);
                                }
                                if(this.type != "mini"){
                                    self.die(el);
                                }
                                if(context){
                                    context.removeClass("alert-back-in alert-front-in");
                                }
                            }
                        }
                    },
                    show: function () {
                        this.el.style.display = 'block';
                        this.bg.style.display = 'block';
                    },
                    hide: function () {
                        this.el.style.display = 'none';
                        this.bg.style.display = 'none';
                        this.removeScrollerEvent();
                    },
                    removeScrollerEvent: function(){
                        document.removeEventListener('touchmove', this.preventScroller);
                        $(window).off('resize', this.setPosProxy);
                    },
                    die: function(){
                        var self = this, el = self.el;
                        $(el.querySelector(".btn-confirm")).off(self._event);
                        if(self.type != "alert"){
                            $(el.querySelector(".btn-cancel")).off(self._event);
                        }
                    },
                    get: function(selector){
                        var el = document.querySelectorAll(selector);
                        return el[el.length - 1];
                    }
                };
                return function(opts){
                    return new AlertBox(opts).init();
                };
            })(),
            /*
             * function 阻止连续如点击执行
             * @param  {[function]} callback [回调]
             * @param  {[options]} 配置信息 [事件名称]
             * @param  {[number]} interval [时间-毫秒]
             * author: mawei
             */
            stopper: function(callback, interval){
                interval = interval || 1000;
                var lastTime;
                return function(){
                    time = new Date();
                    if(!lastTime || time - lastTime > interval){
                        callback.call(this);
                        lastTime = time;
                    }
                }
            },
            /*
             * function 事件注册
             * @param  {[Element]} $el [触发对象]
             * @param  {[string]} eventName [事件名称]
             * @param  {[string]} selector [选择器]
             * @param  {[function]} handler [事件回调]
             * author: mawei
             */
            registerListener: function($el, eventName, selector, handler){
                if(!handler){
                    handler = selector;
                    selector = undefined;
                }
                var mobile = Exp.mobile,
                    eventNames = {
                        touchstart: {
                            name: mobile ? "touchstart" : "mousedown",
                            path: "touches"
                        },
                        touchmove: {
                            name: mobile ? "touchmove" : "mousemove",
                            path: "touches"
                        },
                        touchend: {
                            name: mobile ? "touchend" : "mouseup",
                            path: "changedTouches"
                        },
                        touchcancel: {
                            name: mobile ? "touchcancel" : "mouseup",
                            path: "touches"
                        }
                    },
                    config = eventNames[eventName],
                    newListener = function(event){
                        var evt = event[config.path]?event[config.path][0]:event, self = this;
                        if(handler){
                            return handler.call(self, evt, event);
                        }
                    },
                    args = [config.name, selector, newListener];
                if(!selector){
                    args = [config.name, newListener];
                }
                $el.on.apply($el, args);
            },
            /*
             * function 拖动开始事件
             * @param  {[Element]} $el [触发对象]
             * @param  {[string]} selector [选择器]
             * @param  {[function]} handler [事件回调]
             * author: mawei
             */
            touchstart: function($el, selector, handler){
                this.registerListener($el, "touchstart", selector, handler);
            },
            /*
             * function 拖动移动事件
             * @param  {[Element]} $el [触发对象]
             * @param  {[string]} selector [选择器]
             * @param  {[function]} handler [事件回调]
             * author: mawei
             */
            touchmove: function($el, selector, handler){
                this.registerListener($el, "touchmove", selector, handler);
            },
            /*
             * function 拖动结束事件
             * @param  {[Element]} $el [触发对象]
             * @param  {[string]} selector [选择器]
             * @param  {[function]} handler [事件回调]
             * author: mawei
             */
            touchend: function($el, selector, handler){
                this.registerListener($el, "touchend", selector, handler);
            },
            /*
             * function 拖动取消事件
             * @param  {[Element]} $el [触发对象]
             * @param  {[string]} selector [选择器]
             * @param  {[function]} handler [事件回调]
             * @param  {[object]} data [绑定数据]
             * author: mawei
             */
            touchcancel: function($el, selector, handler, data){
                this.registerListener($el, "touchcancel", selector, handler, data);
            },
            /*
             * function 点击事件
             * @param  {[Element]} $el [触发对象]
             * @param  {[string]} selector [选择器]
             * @param  {[function]} handler [事件回调]
             * @param  {[Boolean]} immediate [是否立即执行]
             * @author: mawei
             */
            click: function($el, selector, handler, immediate, data){
                var sub, touchstart, touchend;
                if(typeof arguments[1] == 'function'){
                    data = immediate;
                    immediate = handler;
                    handler = selector;
                    selector = undefined;
                    touchstart = data&&data.touchstart;
                    touchend = data&&data.touchend;
                }
                this.touchstart($el, selector, function(event){
                    if(touchstart){
                        touchstart.call(this, event, data);
                    }
                    if(sub)return;
                    sub = {x:event.clientX, y:event.clientY, target:this};
                });
                this.touchend($el, selector, function(event){
                    var self = this;
                    if(!sub || this != sub.target)return;
                    if(Math.abs(event.clientX - sub.x) <= 10 && Math.abs(event.clientY - sub.y) <= 10){
                        if(handler){
                            //使点击active有效
                            if(immediate === true){
                                sub = null;
                                return handler.call(this, event, data);
                            }else if((typeof immediate)  === 'number'){
                                Exp.setTimeout(function(){handler.call(self, event);}, immediate);
                            }else{
                                Exp.setTimeout(function(){
                                    handler.call(self, event, data);
                                }, 30);
                            }
                        }
                    }
                    if(touchend){
                        touchend.call(this, event, data);
                    }
                    sub = null;
                });
                this.touchcancel($el, selector, function(event){
                    sub = null;
                });
            },
            /*
             * function 阻止连续如点击
             * author: mawei
             */
            stopClick: function($el, selector, handler, immediate, data){
                var args  = Array.prototype.slice.apply(arguments);
                for(var i=1; i<=2; i++){
                    if(typeof args[i] === 'function'){
                        args[i] = this.stopper(args[i]);
                        break;
                    }
                }
                this.click.apply(this, args);
            },
            /*
             * 阻止连续点击
             * */
            stopClickQuick: function(ctx){
                var stops = (ctx || $(document.body)).find('[data-stop-href]');
                if(stops.size()){
                    stops.forEach(function (item) {
                        item = $(item);
                        var router = item.data('stop-href');
                        router&&Exp.stopClick(item,function(){
                            var matches = router.match(/^#(.*)/);
                            Exp.setTimeout(function(){
                                if(matches){
                                    eBase.PageRouter.go(matches[1]);
                                }
                                else{
                                    window.location.href = router;
                                }
                            },150);
                        });
                        item.removeAttr('data-stop-href');
                    });
                }
            },
            touch:function($target, touchstart, touchmove, touchend){
                var startPoint;
                Exp.touchstart($target, function(event){
                    var values = /translate3d\(([\d-+.]+)px?, ([\d-+.]+)px?, ([\d-+.]+)px?\)/gi.exec(Exp.css($target, 'transform'));
                    var startY = values?values[2]-0:0;
                    startPoint = {
                        x: event.clientX,
                        y: event.clientY,
                        startY: startY
                    }
                    if(touchstart){
                        return touchstart.call($target, event, startPoint);
                    }
                });
                Exp.touchmove($target, function(event){
                    if(!startPoint)return;
                    var point = {
                        x: event.clientX,
                        y: event.clientY,
                        subX: event.clientX - startPoint.x,
                        subY: event.clientY - startPoint.y
                    };
                    if(touchmove){
                        return touchmove.call($target, event, point);
                    }
                });
                Exp.touchend($target, function(event){
                    if(!startPoint)return;
                    var endPoint = {
                        x: event.clientX,
                        y: event.clientY,
                        subX: event.clientX - startPoint.clientX,
                        subY: event.clientY - startPoint.clientY
                    }
                    startPoint = null;
                    if(touchend){
                        return touchend.call($target, event, endPoint);
                    }
                });
            },
            /*
             * function 上下左右方位弹出层
             * @param  {[Object]} options [参数配置]
             * author: mawei
             */
            page: function(options){
                var htmlPre = '<div class="alert-box alert-page-box'+(options.rootClass?' '+options.rootClass:'')+'">',
                    htmlTail = '</div>',
                    Exp = this,
                    timer,
                    resize;
                var page = {
                    slideOut: function(options){
                        var self = this;
                        timer = Exp.setTimeout(function(){
                            //self.hide();
                        }, 400);
                        this.alertBox.slideOut(options);
                        return this;
                    },
                    slideIn: function(options){
                        if(timer){
                            Exp.clearTimeout(timer);
                            timer = 0;
                        }
                        //this.show();
                        this.alertBox.slideIn(options);
                        return this;
                    },
                    remove: function(){
                        this.alertBox.reset();
                        return this;
                    },
                    hide: function(){
                        this.alertBox.el.style.display = 'none';
                        this.alertBox.bg.style.display = 'none';
                        return this;
                    },
                    show: function(){
                        this.alertBox.el.style.display = 'block';
                        this.alertBox.bg.style.display = 'block';
                        return this;
                    },
                    resize: function(){
                        resize();
                        return this;
                    },
                    create: function(){
                        this.alertBox = Exp.alertBox({
                            delayRender: false,
                            type:"custom",
                            rootClass: options.rootClass,
                            html: htmlPre + (options && options.html?options.html:"") + htmlTail,
                            transition:{position: options.position || "bottom", to: options.to || "200px"},
                            resetCallback: options.resetCallback,
                            asyncResetCallback: options.asyncResetCallback,
                            bgClickReset: options.bgClickReset,
                            scrollerClass: options.scrollerClass,
                            background: options.background,
                            setPos: function(event){
                                var self = this,
                                    $el = $(this.el),
                                    $bg = $(this.bg),
                                    opts = this.opts,
                                    transition = opts.transition,
                                    toMatch = (transition.to+'').match(/(\d+)(.*)/),
                                    scrollTop = Exp.position.scrollTop();
                                this.addEvent = function(){}//覆盖原有默认事件
                                if(this.bgClickReset !== false){
                                    Exp.click($bg, function(){
                                        self.slideOut();
                                    });
                                }
                                initSize_Position(event);
                                resize = initSize_Position;
                                function initSize_Position(event){
                                    if(toMatch[2] == "%"){
                                        transition.to = ("top bottom".indexOf(transition.position)>-1?
                                            window.innerHeight:window.innerWidth)*(toMatch[1]/100);
                                    }
                                    else{
                                        transition.to = toMatch[1]-0;
                                    }
                                    var position = transition.position,
                                        x = 0,
                                        y = 0,
                                        width = window.innerWidth,
                                        height = window.innerHeight,
                                    //对el的position为absolute增加window.scrollY滚动增量
                                        positionScrollY = $el.css('position')==='fixed'||$el.hasClass('alert-page-keyboard')?0:window.scrollY;
                                    if(position == "top"){
                                        if(options.auto === true){
                                            height = $el.height();
                                            transition.to = height;
                                        }
                                        else {
                                            height = transition.to;
                                        }
                                        y = -transition.to+positionScrollY;
                                    }
                                    else if(position == "bottom"){
                                        y = height + window.scrollY;
                                        if(options.auto === true){
                                            height = $el.height();
                                            transition.to = height;
                                        }
                                        else {
                                            height = $el.height();
                                        }
                                    }
                                    else if(position == "left"){
                                        x = -transition.to;
                                        if(options.auto === true){
                                            width = $el.width();
                                            transition.to = width;
                                        }
                                        else {
                                            width = transition.to;
                                        }
                                    }
                                    else if(position == "right"){
                                        x = window.innerWidth;
                                        if(options.auto === true){
                                            width = $el.width();
                                            transition.to = width;
                                        }
                                        else {
                                            width = transition.to;
                                        }
                                    }
                                    $el.css({top: y, left: x, height: height, width: width, opacity:(event&&event.type=='resize'?1:0)})
                                }
                                this.slideIn = function (options){//为this添加滑入方法
                                    options = options || {}
                                    var position = transition.position,
                                        x = 0,
                                        y = 0;
                                    if(position == "top"){
                                        y = options.to || transition.to;
                                    }
                                    else if(position == "bottom"){
                                        y = -(options.to || transition.to);
                                    }
                                    else if(position == "left"){
                                        x = options.to || transition.to;
                                    }
                                    else if(position == "right"){
                                        x = -(options.to || transition.to);
                                    }
                                    Exp.setTimeout(function(){
                                        $el.addClass(options.slideAnimate||"page-slide-ani");
                                        Exp.css($el, 'transform', 'translate3d('+ x +'px,'+ y +'px,0px)');
                                        $el.css({opacity: 1});
                                    }, 10);
                                };
                                this.slideOut = function (options){//为this添加滑出方法
                                    var self = this, opts = this.opts;
                                    $el.addClass(opts.slideAnimate||"page-slide-ani");
                                    $bg.addClass(opts.bgAnimateOut || "alert-box-anim-out2").removeClass(opts.bgAnimate || "alert-bg-anim");
                                    //Exp.css($el, 'transform', 'translate3d(0px,0px,0px)');
                                    var position = transition.position,
                                        x = 0,
                                        y = 0;

                                    if(position == "top"){
                                        y = 0;
                                    }
                                    else if(position == "bottom"){
                                        y = 0;
                                    }
                                    else if(position == "left"){
                                        y = 0;
                                    }
                                    else if(position == "right"){
                                        y = 0;
                                    }
                                    Exp.css($el, 'transform', 'translate3d('+ x +'px,'+ y +'px,0px)');
                                    if(options && options.persistent === true){
                                        $el.css('opacity', 0);
                                        self.removeScrollerEvent();
                                        return;
                                    }
                                    page.remove();
                                    self.removeScrollerEvent();
                                    $(document.body).css('overflow-y','auto');
                                };
                                this.reset = function (){//覆盖原有reset
                                    $bg.css('opacity', 0);
                                    var self = this, el = this.el, bg = this.bg, opts = this.opts;
                                    Exp.setTimeout(function(){
                                        if(opts && opts.resetCallback){
                                            opts.resetCallback.call(self);
                                        }
                                        if(bg){
                                            Exp.remove.call(bg);
                                        }
                                        Exp.remove.call(el);
                                    }, options.slideTime||410);
                                    if(opts && opts.asyncResetCallback){
                                        opts.asyncResetCallback.call(this);
                                    }
                                };
                                if(options.resizeCallback){
                                    options.resizeCallback.call(this);
                                }
                            },
                            animate: options.animate || 'alert-page-anim',
                            bgAnimate: options.bgAnimate || "alert-bg-anim",
                            bgAnimateOut: "alert-bg-anim-out2",
                            autoCancel:true,
                            callBack: options.alertCallBack || function(){}
                        });
                        return this;
                    }
                };
                page.create();
                return page;
            },
            /**
             * 懒加载器
             */
            lazier: function(options){
                if(typeof options == 'undefined'){
                    options = {};
                }
                var type = options.type || 'class',
                    lasyProperty = options.property || 'data-lasy',
                    lasyPropertyType = options.type || 'data-lasytype',
                    values = [],
                    body= document.body,
                    $body=$(body),
                    parent = $(options.parent || body),
                    Exp = this,
                    //是否已添加事件
                    addListener = false,
                    lazyid = 0,
                    sequences = {};
                function handleSequences(id, error) {
                    var item, current = sequences[id];
                    current.load = function () {
                        handleClass(current.el, error);
                    };
                    for(var key in sequences){
                        item = sequences[key];
                        if(item.id != id && !item.load){
                            break;
                        }
                        else{
                            item.load();
                            delete sequences[item.id];
                        }
                    }
                }

                function handleClass(el, error) {
                    var name = 'lazy-seq-success';
                    if(error){
                        name= 'lazy-seq-error';
                    }
                    el.addClass(name);
                }
                return {
                    operate: function(type, el, value){
                        switch(type){
                            case 'class':
                                el.addClass(value);
                                break;
                            case 'image':
                                if(el.is('img')){
                                    var id = ++lazyid;
                                    el.attr('src', value);
                                    var seq = el.is('.lazy-seq');
                                    if(seq || el.is('.lazy-img')){
                                        el.on('load', function () {
                                            seq?handleSequences(id):handleClass(el);
                                        }).on('error', function () {
                                            seq?handleSequences(id, true):handleClass(el, true);
                                        });
                                        if(seq){
                                            sequences[id] = {
                                                id: id,
                                                el: el
                                            };
                                        }
                                    }
                                }
                                else{
                                    el.css('background-image', 'url("' + value + '")');
                                }
                                break;
                        }
                        return this;
                    },
                    /*
                     * 查找懒加载元素
                     * */
                    find: function(content){
                        var elements = (content || parent).find('['+lasyProperty+']');
                        elements.each(function(i, e){
                            var e = $(e), offset = e.offset();
                            values.push({
                                el: e,
                                value: e.attr(lasyProperty),
                                top: offset.top,
                                left: offset.left,
                                type: e.attr(lasyPropertyType) || type
                            });
                            e.removeAttr(lasyProperty);
                            Exp.setImageSize(e);
                        });
                        return this;
                    },
                    /*
                     * 滚动执行
                     * */
                    scrolled: function(){
                        var top = $body.prop('scrollTop'),
                            screenHeight = screen.availHeight || window.innerHeight,
                            maxTop = top + screenHeight,
                            operate = this.operate;
                        values = values.filter(function(obj){
                            if(obj.top <= maxTop){
                                operate(obj.type, obj.el, obj.value);
                                return false;
                            }
                            return true;
                        });
                        return this;
                    },
                    /*
                     * 开始
                     * @param parent [Element] 父元素
                     * */
                    start: function(){
                        var self = this;
                        if(!addListener){
                            var timer, duration = 200;
                            this._scrollListener = function(){
                                if(timer){
                                    Exp.clearTimeout(timer);
                                }
                                timer = Exp.setTimeout(callback, duration);
                            }
                            function callback(){
                                if(!parent.closest('body').size()){
                                    self.destory();
                                }
                                else if(parent.css('display') !== 'none'){
                                    self.scrolled();
                                }
                            }
                            window.addEventListener("scroll", this._scrollListener, false);
                            addListener = true;
                        }
                        this.find(parent).scrolled();
                        return this;
                    },
                    /*
                     * 移除事件
                     * */
                    destory: function(){
                        window.removeEventListener("scroll", this._scrollListener);
                    }
                }
            },
            /*
             * 设置图片宽高比例,以宽高的大值做计算
             * 可强制某个属性计算 max-size,值为width或height
             * */
            setImageSize: function($images, isSomeSize){
                var firstWidth, firstHeight;
                $images.each(function(index, element) {
                    var $el = $(this),
                        orginalWidth = $el.data("width"),
                        orginalHeight = $el.data("height"),
                        width = $el.width(),
                        height = $el.height(),
                        maxSize= $el.data("max-size"),
                        widthBigger = maxSize=='width' || maxSize !=='height' && width>=height?true:false;
                    if(isSomeSize && index > 0){
                        setSize($el, firstHeight, firstWidth);
                        return;
                    }

                    if(orginalWidth && orginalHeight){
                        if(widthBigger){
                            firstHeight = orginalHeight * width / orginalWidth;
                            firstWidth = width;
                        }
                        else{
                            firstWidth = orginalWidth * height/orginalHeight;
                            firstHeight = height;
                        }
                        $el.data('width',null).data('height',null);
                        setSize($el, firstHeight, firstWidth);
                    }
                    else{
                        firstWidth = width;
                        firstHeight = height;
                    }
                });
                function setSize($el, firstHeight, firstWidth){
                    var settings = {
                        width: firstWidth,
                        height: firstHeight
                    }
                    $el.css(settings);
                    $el.data('width',null).data('height',null);
                    var parent = $el.parent();
                    if(parent.is('.lazy-img-box')){
                        parent.css(settings);
                    }
                }
            },
            scrolledAjax: function (ajaxOptions){//滚动到底部获取数据
                var steps = ajaxOptions.steps||10,
                    maxRecords = ajaxOptions.maxRecords||150,
                    totalFlag = ajaxOptions.totalFlag||"total",
                    startFlag = ajaxOptions.startFlag||"startIndex",
                    endFlag = ajaxOptions.endFlag||"endIndex",
                    recordsFlag = ajaxOptions.recordsFlag||"list",
                    pageIndex = ajaxOptions.pageIndex || 'pageIndex',
                    pageSize = ajaxOptions.pageSize || 'pageSize',
                    timestamp = ajaxOptions.timestamp || 'timestamp',
                    status = 0,//获取数据状态 0为空闲， 1为在获取中
                    firstGet = true,
                    remainTimes = 3,
                    count = 0,
                    scrolledmin = 300,
                    autoGetData = ajaxOptions.autoGetData === false? false : true,
                    totalRecords = steps,//初始化值，设置的大一些以通过后续检测
                    parent = ajaxOptions.parent,
                    loader,
                    callingFlag = false,
                    startFetch = ajaxOptions.startFetch === undefined ? true : ajaxOptions.startFetch,
                    firstStatus = {list:[]},
                    lazier,
                    //第一次请求延迟最小时间
                    initAjaxMinTime = ajaxOptions.initAjaxMinTime,
                    self = this;
                if(ajaxOptions.lazier){
                    lazier = Exp.lazier({type:"image",parent:parent});
                }
                ajaxOptions.data = ajaxOptions.data||{};
                if(startFetch && autoGetData !== false)getData();
                function scrollListener(){
                    if(ajaxOptions.lazier){
                        lazier.scrolled();
                    }
                    //startFetch=false开始默认不取数据，直到页面滑到底部才动态加载数据
                    if(firstGet && startFetch && checkToBottom()){
                        getData();
                    }
                    else if(status || !startFetch)return;
                    else if(checkToBottom())getData();
                }
                if(autoGetData !== false){
                    window.addEventListener("scroll", scrollListener, false);
                }
                function checkToBottom(){
                    var de = document.documentElement,
                        bd = document.body,
                        clientHeight = de.clientHeight || bd.clientHeight,
                        scrollTop = bd.scrollTop || de.scrollTop,
                        scrollHeight = bd.scrollHeight || de.scrollHeight;
                    if(clientHeight + scrollTop + scrolledmin > scrollHeight){
                        return true
                    }
                    return false;
                }
                function loading(){
                    var root = parent.parent(), $elementObj = root.find('.scroll-loading'),
                        elementB = $elementObj.length === 0;
                    if(ajaxOptions.loader === false)return;
                    else if(ajaxOptions.loader) loader = ajaxOptions.loader;
                    else if(!loader){
                        loader = $('<div class="scroll-loading"><span class="mb3 loading-flag"/>&nbsp;加载中...</div>');
                        elementB ? loader: loader = '';
                        if(loader !== ''){
                            loader.insertAfter(parent);
                        }
                        root.css('position', 'relative');
                        clearLoading();
                    }
                    if(loader)loader.show();
                }
                function clearLoading(){
                    if(loader){
                        loader.hide();
                    }
                }
                function getData(){
                    if(callingFlag)return;
                    var options = ajaxOptions, data = options.data;
                    loading();
                    data[startFlag] = ++count;
                    if(totalRecords < data[startFlag]){//起始下标大于总数返回
                        clearLoading();
                        --count;
                        return;
                    }
                    data[pageSize] = steps;
                    data[pageIndex] = Math.ceil(count/steps);
                    data[endFlag] = (count+=steps-1);
                    var lastTime = data[timestamp] = new Date().getTime();
                    if(totalRecords < data[endFlag]){//总数小于结束下标
                        data[endFlag] = totalRecords;
                    }
                    callingFlag = true;
                    self.authAjax({
                        url:options.url,
                        type: options.type||"GET",
                        data: data ||{},
                        dataType: "json",
                        noloading: true,
                        success: function(data){
                            if(firstGet && initAjaxMinTime){
                                var remain = initAjaxMinTime - new Date() + lastTime;
                                remain<=0?
                                    handleSuccess(data):
                                    Exp.setTimeout(function () {
                                        handleSuccess(data);
                                    }, remain);
                            }
                            else handleSuccess(data);
                        },
                        error: function(){
                            if(remainTimes>0){
                                //限定获取失败次数
                                remainTimes--;
                                count -= steps;
                                callingFlag = false;
                                getData();
                            }
                            else{
                                callingFlag = false;
                                count -= steps;
                                clearLoading();
                            }
                        }
                    });
                }
                function handleSuccess(json){
                    firstGet = false;
                    if(json){
                        var elements = [];
                        if(totalRecords = (json[totalFlag] > maxRecords?maxRecords:json[totalFlag])){
                            var list = json[recordsFlag];
                            //保存第一次数据
                            if(count == steps){
                                firstStatus.list = list || [];
                            }
                            if(list && list.length>0){
                                if(ajaxOptions.template){
                                    for(var i=0,l=list.length; i<l; i++){
                                        var html = typeof ajaxOptions.template ==='string'?ajaxOptions.template:
                                                typeof ajaxOptions.template ==='function'?ajaxOptions.template(list[i], i):'';
                                        var record = list[i];
                                        if(html){//为了解决老版本的模板&{}取数据格式
                                            html = html.replace(/\&\{([\d\.\w\?\:\-]*)\}/g, '{{$1}}');
                                        }
                                        var tpl = template.compile(html)(ajaxOptions.handleData ? ajaxOptions.handleData(list[i], i) : list[i]);
                                        parent[0].insertAdjacentHTML('beforeend', tpl);
                                        var element = parent[0].lastElementChild;
                                        if(ajaxOptions.animate)element.setAttribute("class",(element.getAttribute("class")||"") + " " + ajaxOptions.animate);
                                        elements.push(element);
                                    }
                                    if(ajaxOptions.animate)Exp.setTimeout(function(){
                                        for(var i=0,l=elements.length; i<l; i++){
                                            elements[i].style.opacity = 1;
                                        }
                                    },10);
                                }
                                else{
                                    if(ajaxOptions.handleData){
                                        for(var i=0,l=list.length; i<l; i++){
                                            ajaxOptions.handleData(list[i], i);
                                        }
                                    }
                                    var html = template(ajaxOptions.templateId, json);
                                    parent.append(html);
                                    var children = parent.children(), size = children.size(), length = list.length;

                                    while(length--){
                                        (function(index){
                                            var element = children.get(index);
                                            elements.push(element);
                                            element.setAttribute("class",(element.getAttribute("class")||"") + " " + ajaxOptions.animate);
                                            if(ajaxOptions.animate){
                                                Exp.setTimeout(function(){
                                                    element.style.opacity = 1;
                                                },10);
                                            }
                                        })(size - length -1);
                                    }
                                }
                                if(ajaxOptions.success)ajaxOptions.success(json, ajaxOptions, elements);
                            }

                            if(totalRecords <= ajaxOptions.data[endFlag]){
                                if(ajaxOptions.endCallback) {
                                    var loadEndFlag = maxRecords && maxRecords <= json[totalFlag] && count >= maxRecords;
                                    ajaxOptions.endCallback(ajaxOptions,loadEndFlag);
                                }
                                clearLoading();
                            }
                        }
                        else if(ajaxOptions.zeroCallback){//0条数据回调ajaxOptions.zeroCallback方法
                            clearLoading();
                            ajaxOptions.zeroCallback(ajaxOptions, parent,json);
                            return;
                        }
                        Exp.clickActive(parent);
                        if(lazier){
                            lazier.start();
                        }
                    }
                    //一次获取数据没有满屏继续,此时需要1个延迟加载dom的时间
                    callingFlag = false;
                    if(checkToBottom() && autoGetData !== false)getData();
                }

                return {
                    start: function(){
                        startFetch = true;
                        $(window).trigger('scroll');
                    },
                    close: function(){
                        startFetch = false;
                    },
                    getData: function(){
                        getData();
                    },
                    isLoadingData:function(){
                        return callingFlag;
                    },
                    clearLoading: function(){
                        clearLoading();
                    },
                    destory:function(){
                        window.removeEventListener("scroll", scrollListener);
                        if(loader){
                            loader.remove();
                        }
                        if(this.pulldownRefresh){
                            this.pulldownRefresh.destory();
                        }
                    },
                    resetRemainTimes: function(){
                        remainTimes = 3;
                        firstGet = true;
                        totalRecords = steps;
                    },
                    abort:function(){
                        if(this.ajaxObject){
                            this.ajaxObject.abort();
                        };
                    },
                    createPulldownRefresh: function (options){
                        var element = options.element,
                            pullDownArea = options.pullDownArea || parent,
                            insertBeforeEl = options.insertBeforeEl,
                            endCallback = options.endCallback,
                            id = options.id,
                            ids = id?id.split(' '): [],
                            elementObj = parent.find('.ui-pulldown-refresh').length === 0;
                        if(!element){
                            var html = '<div class="ui-pulldown-refresh">'
                                + '<div style="bottom:'+(options.bottom||0)+';">'
                                + '<i></i>'
                                + '<span>下拉刷新</span>'
                                + '</div>'
                                + '</div>';
                            elementObj ? html: html = '';
                            insertBeforeEl = insertBeforeEl || pullDownArea;
                            element = $(html).insertBefore(insertBeforeEl);
                        }

                        var self = this;
                        //pulldown下拉刷新页面
                        this.pulldownRefresh = Exp.pulldownRefresh({
                            element: element,
                            pullDownArea: pullDownArea,
                            insertBeforeEl: insertBeforeEl,
                            endCallback: function (opt) {
                                //创建ajax
                                self.abort();
                                self.update(ids, opt);
                                if(!!endCallback){
                                    endCallback();
                                }
                            }
                        });
                    },
                    update: function(ids, opt){
                        var list = firstStatus.list,
                            options = ajaxOptions,
                            data = options.data,
                            length = ids.length;
                        function equalList(newFirstData, firstData, ids){
                            var idsLength = ids.length, length = newFirstData.length;
                            if(length != firstData.length){
                                return false;
                            }
                            var newObj, obj;
                            for(var j=0; j<length; j++){
                                newObj = newFirstData[j],
                                    obj = firstData[j];
                                for(var i=0; i<idsLength;i++){
                                    if(newObj[ids[i]] != obj[ids[i]]){
                                        return false;
                                    }
                                }
                            }
                            return true;

                        }
                        if(list){
                            var dataTemp = {};
                            dataTemp = $.extend(dataTemp, options.data||{});
                            dataTemp[startFlag] = 1;
                            dataTemp[pageSize] = steps;
                            dataTemp[pageIndex] = Math.ceil(1/steps);
                            dataTemp[endFlag] = steps;
                            dataTemp.timestamp = new Date().getTime();
                            this.ajaxObject = $.ajax({
                                url:options.url,
                                type: options.type||"GET",
                                data: dataTemp ||{},
                                dataType: "json",
                                success: function(json){
                                    var newList = json[recordsFlag] || [],
                                        firstData = list,
                                        newFirstData = newList,
                                        equal = true;
                                    if(newFirstData){
                                        if(!firstData || !length){
                                            equal = false
                                        }
                                        else{
                                            equal = equalList(newFirstData, firstData, ids);
                                        }
                                    }
                                    else if(newFirstData != firstData){
                                        equal = false;
                                    }
                                    if(!equal){
                                        count = 0;
                                        data[startFlag] = ++count;
                                        data[pageSize] = steps;
                                        data[pageIndex] = Math.ceil(count/steps);
                                        data[endFlag] = (count+=steps-1);

                                        parent.empty();
                                        opt.hide();
                                        handleSuccess(json);
                                    }
                                    else{
                                        opt.refreshNoData();
                                    }

                                    if(lazier){
                                        Exp.setTimeout(function(){
                                            lazier.start();
                                        },500);
                                    }
                                }
                            });
                        }
                    }
                }
            },
            /*
             * function tab页面滑动
             * @param  {[Element]} box [tab内容区域]
             * @param  {[Element]} tabs [tabs父元素]
             * @param  {[Element]} tabBg [tab焦点元素，用作动画效果]
             * @param  {[Object]} config [配置项]
             * @author: zhangweiwei
             */
            sectionSlide: function(box,tabs,tabBg,config){
                this.box = $(box);
                this.tabs = $(tabs);
                this.tabBg = $(tabBg);
                this.contents = this.box.children();
                this.tabBgMove = 0;//标题背景移动的距离
                this.config = $.extend({},config||{});
                this.width = this.config.width||this.box.width();//一次滚动的宽度
                this.size = this.config.size||this.box.children().length;
                this.loop = this.config.loop||false;//默认不能循环滚动
                this.auto = this.config.auto||false;//默认不能自动滚动
                this.auto_wait_time = this.config.auto_wait_time||3000;//轮播间隔
                this.scrollTime = 300;//滚动时长
                this.minleft = -this.width*(this.size-1);//最小left值，注意是负数[不循环情况下的值]
                this.maxleft =0;//最大left值[不循环情况下的值]
                this.nowLeft = 0;//初始位置信息[不循环情况下的值]
                this.pointX = null;//记录一个x坐标
                this.startX = null;
                this.startY = null;
                this.index = this.config.index;//初始化进入指定的tab
                this.touchSlide = this.config.touchSlide === false? false : true;
                this.terminalFix = this.config.terminalFix || false;
                this.busy = false;
                this.timer;
                this.boxRadius = this.config.boxRadius === false? false : true; //box是否有圆角
                this.slope = .8;//判断手指水平和垂直移动的比率，以区分水平和垂直 即30度正玄
                var on = this.tabs.find('li.on')
                if(!(typeof this.index == 'number') && on.size()){
                    this.index = this.tabs.find('li').index(on);
                }
                var content = $('head meta[name=viewport]').attr('content');
                this.times = 1/(content||'1').match(/initial\-scale\=([.\d]+)/)[1] || 1;

                var count = 0;
                this.init = function(){
                    var contentWidth = this.width;
                    this.contents.width(contentWidth);
                    this.bindEvent();
                    this.initWidth();
                    this.autoScroll();
                    if(this.index > 0){
                        this.goIndex(this.index, true);
                    }
                    this.fixPage(this.index);;
                };
                /*初始化页面宽度*/
                this.initWidth = function(){
                    this.box.css('width',this.width*this.size);
                    this.tabBg.css('width',(1/this.size*100) + '%');
                }
                this.bindEvent = function(){
                    var self = this,
                        curTouchValide = true,
                        lastPoints,
                        lastDirect;//记录第一次方向，后续touch方向必须相同
                    if(self.tabs.children().length > 0){
                        Exp.click(self.tabs.children() ,function(){
                            if(!self.busy){
                                var index = $(this).index();
                                self.tabsClick(index);
                            }
                        });
                    }
                    //touchSlide不设置的时候或者设置为true，允许滑动，设置false值就不运行左右滑
                    if(self.touchSlide == false){
                        return;
                    }
                    Exp.touch(self.box, function(e){
                        if(!self.busy){
                            self.startX = self.pointX = e.screenX;
                            self.startY = self.pointY = e.screenY;
                            isFirst = true;
                            curTouchValide = true;
                            lastPoints = {x:e.screenX, y:e.screenY};
                        }
                    }, function(e){
                        if(!self.busy){
                            if(!curTouchValide){
                                return false;
                            }
                            var ret = self.move(e.screenX, e.screenY);//这里根据返回值决定是否阻止默认touch事件
                            if(isFirst){
                                isFirst = false;
                                lastDirect = ret;
                            }
                            if(lastDirect === ret){
                                lastPoints = {x:e.screenX, y:e.screenY};
                                if(!ret)return ret;
                            }
                            else{
                                curTouchValide = false;
                                return false;
                            }
                        }
                    }, function(e){
                        count = 0;
                        if(curTouchValide){
                            !self.busy && self.movEnd(e.screenX, e.screenY);
                        }
                        else{
                            !self.busy && self.movEnd(lastPoints.x, lastPoints.y);
                        }

                    });



                };
                this.autoScroll = function(){//自动滚动
                    var self = this;
                    if(!self.loop || !self.auto)return;
                    Exp.clearTimeout(self.timer);
                    self.timer = Exp.setTimeout(function(){
                        self.goIndex((self.index+1)%self.size);
                    },self.auto_wait_time);
                };
                this.stop = function(){
                    this.auto = false;
                    Exp.clearTimeout(this.timer);
                };
                this.start = function(){
                    this.auto = true;
                    this.autoScroll();
                };
                this.tabsClick = function(index){//tab标题切换
                    var self = this, tabBgMove;

                    var taBgWidth = self.tabs.width()/this.contents.size();
                    var liElemements = self.tabs.children(),
                        li = liElemements.get(index);

                    /*解决IOS中tab切换差1px*/
                    if(liElemements.length > 0){
                        self.tabBgMove = liElemements.eq(index).position().left;
                        if(self.busy)return;
                        Exp.clearTimeout(self.timer);
                        self.goIndex(index);
                    }
                };
                this.goIndex = function(index,flag){//滚动到指定索引页面
                    var self = this,
                        nowLeft = self.nowLeft,
                        width = self.width,
                        size = self.size,
                        goNext = flag || false;//真正滚动到下一页时goNext = true
                    var liElemements = self.tabs.children(),
                        li = liElemements.get(index);
                    self.busy = true;
                    if(index<0)index = 0;
                    else if(index>=size)index = size-1;
                    if(index == -1 || index == size){//循环滚动边界
                        self.index = index==-1?(size-1):0;
                        self.nowLeft = index==-1?0:-width*(size+1);
                    }else{
                        if(self.index != index){
                            goNext = true;
                        }
                        self.index = index;
                        self.nowLeft = -(width*index);
                    }
                    self.tabsClick(index);
                    self.tabBg.css(this.getStyle(1, true)[1]);
                    liElemements.removeClass("on").eq(index).addClass("on");
                    self.box.css(this.getStyle(1, this.boxRadius)[0]);
                    Exp.setTimeout(function(){
                        self.complete(index,goNext);
                    },5);
                };
                this.goIndexDirect = function(index){
                    var scrollTime = this.scrollTime;
                    this.scrollTime = 0;
                    this.goIndex(index);
                    this.scrollTime = scrollTime;
                };
                this.complete = function(index,goNext){//动画完成回调
                    var self = this;
                    self.busy = false;
                    self.fixPage(index);
                    self.autoScroll();
                    if(goNext == false){
                        return;
                    }
                    self.config.callback && self.config.callback(self.index);
                };
                this.fixPage = function(index){
                    //对tab页面内容大于1页高度进行修剪
                    var self = this;
                    if(self.config.pageFixed){
                        if(self.index != index)window.scrollTo(0,0);
                        var pageHeight = document.documentElement.clientHeight + (self.config.pageFixedPx || 0);
                        this.contents.each(function(i, el){
                            var el = $(el);
                            if(i == index){
                                el.css('max-height', '');
                            }
                            else{
                                el.css('max-height', pageHeight);
                            }
                        });
                    }
                };
                this.next = function(){//下一页滚动
                    if(!this.busy){
                        this.goIndex(this.index+1);
                    }
                };
                this.prev = function(){//上一页滚动
                    if(!this.busy){
                        this.goIndex(this.index-1);
                    }
                };
                this.move = function(pointX,pointY){//滑动屏幕处理函数
                    var self = this;
                    var liElemements = self.tabs.children(),
                        li = liElemements.get(self.index);
                    var moveAmountX = pointX - (this.pointX===null?pointX:this.pointX),
                        moveAmountY = pointY - (this.pointY===null?pointY:this.pointY);
                    var isVerticleMove = Math.abs(pointX - this.startX)*self.slope <= Math.abs(pointY - this.startY);
                    if(isVerticleMove){
                        this.preventDefault = true;
                        return true;
                    }
                    if(self.terminalFix){
                        if(self.index == 0 && moveAmountX > 0){
                            this.preventDefault = true;
                            return true;
                        }
                        if(self.index == (self.size-1) && moveAmountX < 0){
                            this.preventDefault = true;
                            return true;
                        }
                    }
                    this.nowLeft = this.nowLeft + moveAmountX;
                    this.pointX = pointX;
                    this.box.css(this.getStyle(2)[0]);
                    this.tabBgMove = this.tabBgMove - moveAmountX/this.width*this.tabBg.width();
                    liElemements.removeClass("on").eq(self.index).addClass("on");
                    this.preventDefault = false;
                    return false;
                };
                this.movEnd = function(endX,endY){
                    var moveAmount = this.nowLeft = endX - (this.startX===null?endX:this.startX);
                    if(this.preventDefault === true){
                        index = this.index;
                    }
                    else if(moveAmount === 0)return;
                    else if(moveAmount < -70){
                        //向左滑动
                        index = this.index+1;
                    }else if(moveAmount > 70){
                        //向右滑动
                        index = this.index-1;
                    }else{
                        index = this.index;
                    }
                    this.pointX = null;
                    this.goIndex(index);
                };
                /*
                 获取动画样式，要兼容更多浏览器，可以扩展该方法
                 @int fig : 1 动画 2  没动画
                 */
                this.getStyle = function(fig, bordRadius){
                    var self = this;
                    var x = self.nowLeft ,
                        time = fig==1?self.scrollTime:0;
                    var tabX = self.tabBgMove;
                    var css = [{
                        '-webkit-transition':'-webkit-transform '+time+'ms',
                        '-webkit-transform':'translateX('+x+'px)',
                        '-webkit-backface-visibility': 'hidden',
                        'transition':'transform '+time+'ms',
                        'transform':'translateX('+x+'px)'
                    },{
                        '-webkit-transition':'-webkit-transform '+time+'ms',
                        '-webkit-transform':'translateX('+tabX+'px)',
                        '-webkit-backface-visibility': 'hidden',
                        'transition':'transform '+time+'ms',
                        'transform':'translateX('+tabX+'px)'
                    }];
                    if(bordRadius){
                        var radius = 5*this.times+'px';
                        if(this.index==0){
                            radius = {
                                'border-radius':'initial',
                                'border-top-left-radius': radius,
                                'border-bottom-left-radius': radius
                            }
                        }
                        else if(this.index==this.size-1){
                            radius = {
                                'border-radius':'initial',
                                'border-top-right-radius': radius,
                                'border-bottom-right-radius': radius
                            }
                        }
                        else{
                            radius = {
                                'border-radius':'initial'
                            }
                        }

                        Exp.extend(css[0], radius);
                        Exp.extend(css[1], radius);
                    }
                    return css;
                }
                this.init();
            },
            inputTrim: function(opt){//对input中的非法字符进行修剪
                function getValue(){
                    return opt.element.val() || opt.element.text();
                };
                //设置光标位置函数
                function setCursorPosition(ctrl, pos){
                    if(ctrl.setSelectionRange){
                        ctrl.focus();
                        ctrl.setSelectionRange(pos,pos);
                    }
                    else if (ctrl.createTextRange) {
                        var range = ctrl.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', pos);
                        range.moveStart('character', pos);
                        range.select();
                    }
                }
                //获取光标位置函数
                function getPositionForInput(ctrl){
                    var CaretPos = 0;
                    if (document.selection) { // IE Support
                        ctrl.focus();
                        var Sel = document.selection.createRange();
                        Sel.moveStart('character', -ctrl.value.length);
                        CaretPos = Sel.text.length;
                    }else if(ctrl.selectionStart || ctrl.selectionStart == '0'){// Firefox support
                        CaretPos = ctrl.selectionStart;
                    }
                    return (CaretPos);
                }
                var type = opt.element?opt.element.attr('type'):'';
                function trim(){
                    var el = opt.element, val = getValue(), tip = opt.tip, trimReg = opt.trimReg;
                    if(tip == val) val = "";
                    if(trimReg){
                        var arr = val.match(trimReg), value = arr ? arr.join("") : "";
                        //重复一次
                        arr = value.match(trimReg), value = arr ? arr[0] : "";
                        if(value != val){
                            //输入错误时不设置光标位置，否则type="number"时报错
                            if(type=='number'){
                                el.val(value);
                            }
                            else{
                                var pos = getPositionForInput(el[0]);
                                el.val(value);
                                setCursorPosition(el[0], pos-1);
                            }

                        }
                    }
                }
                opt.element.on("input",function(){
                    trim();
                });
            },
            pulldownRefresh: function(opt){//下拉刷新页面
                var insertBeforeEl = opt.insertBeforeEl,
                    element = opt.element,
                    destory = false,
                    noDie = opt.noDie,
                    tipEl = element.find('div');
                var startY, endY, subY, startX,  sMoveX, sMoveY, endX, scrollTop, bodyHeight,
                // 清空位移
                    moveX = 0,
                    moveY = 0;
                function hide(){
                    element.css({"height": "0"});
                }
                function animation(){
                    element.css({"-webkit-transition": "height 0.4s ease"});
                }
                function clearLick(){
                    element.css({"-webkit-transition": ""});
                }
                function refreshNoData(){
                    element.find("span").html("已是最新数据");
                    element.find("i").addClass("ui-hide");
                    //延时显示
                    Exp.setTimeout(function(){
                        hide();
                        element.css({"-webkit-transition": "height 0.5s liner"});
                    },1000);
                }
                Exp.touchstart(insertBeforeEl, function(event){
                    if(destory)return;
                    startX = event.screenX;
                    startY = event.screenY;
                    scrollTop = $(window).scrollTop();
                    $('.zc-title .title-list').css('opacity',0).hide();
                    bodyHeight = $("body").height();
                    clearLick();
                });
                Exp.touchmove(insertBeforeEl,function(event){
                    if(destory)return;
                    if (scrollTop > 0) {
                        return;
                    }
                    endX = event.screenX;
                    endY = event.screenY;
                    moveX = endX - startX;
                    moveY = endY - startY;
                    //过滤横向移动
                    sMoveX = moveX<0? -moveX:moveX;
                    sMoveY = (moveY<0? -moveY:moveY);


                    if(sMoveX*2 > sMoveY){
                        return true;
                    }

                    var maxDragY = 80;
                    var showRefreshTipY = 50;
                    if (moveY < 0) {
                        return;
                    }
                    element.find("i").removeClass("load");
                    //下拉代码
                    if (scrollTop == 0) {
                        subY = (moveY / bodyHeight * moveY);
                        subY = subY > maxDragY ? maxDragY : subY;
                        element.find("i").removeClass("ui-hide");

                        if (subY > showRefreshTipY && subY <= maxDragY) {
                            element.find("span").html("释放立即刷新");
                            element.find("i").addClass("up");
                        } else {
                            element.find("span").html("下拉刷新");
                            element.find("i").removeClass("up");
                        }
                        element.css({"height": subY + "px"});
                        tipEl.css({'margin-left':-tipEl.width()/2});
                        return false;
                    }
                });
                Exp.touchend(insertBeforeEl, function(event){
                    if(destory)return;

                    if(sMoveX > sMoveY){
                        return true;
                    }
                    var scrollTop = document.body.scrollTop;
                    if (element.find("i").hasClass("load") && scrollTop < 0){
                        element.find("i").removeClass("load");
                        opt.stopStaut = true;
                        opt.endCallback(opt);
                        if(scrollTop > 40){
                            document.body.scrollTop = 0;
                        }
                        hide();
                    }
                    if ((moveY < 0 || scrollTop !== 0) && element.find("i").hasClass("load"))return false;
                    if (moveY > 0) {
                        //加载代码
                        if (opt.endCallback && element.find("i").hasClass("up")) {
                            opt.stopStaut = false;
                            opt.hide = hide;
                            opt.refreshNoData = refreshNoData;
                            element.find("span").html("加载中...");
                            element.find("i").addClass("load");
                            element.css({"height": "36px"});
                            tipEl.css({'margin-left':-tipEl.width()/2});
                            opt.endCallback(opt);
                        }
                        else{
                            hide();
                        }
                    }
                    animation();
                    // 清空位移
                    moveX = 0;
                    moveY = 0;
                });

                return {
                    destory: function(){
                        if(!noDie){
                            element.remove();
                        }
                        destory = true;
                    }
                }
            },
            logger: function(msg){
                var msgs = '';
                for(var i=0; i<arguments.length; i++){
                    msgs += '-----'+arguments[i];
                }
                $.ajax({
                    url:'data/logger.json'+msgs+'-------------------------',
                    type: "get",
                    dataType: "json",
                    data:{},
                    success: function(){}
                })
            },
            /*
             * function 添加可点击active状态，通过检测data-clickactive属性，clickactive可自定义颜色值
             * @param  {[Element]} $el [父元素] 默认document.body
             * author: mawei
             */
            clickActive: function(parent){

                if(!parent){
                    parent = $(document.body)
                }

                function getBackgroundColor($dom) {
                    var bgColor = "";
                    while($dom[0].tagName.toLowerCase() != "html") {
                        bgColor = $dom.css("background-color");
                        if(bgColor != "rgba(0, 0, 0, 0)" && bgColor != "transparent") {
                            break;
                        }
                        $dom = $dom.parent();
                    }
                    return bgColor;
                }
                //色差推算
                function subColor(color){
                    var colors = color.match(/\d+/ig), value, ret='rgb(';
                    if(!colors || colors.length == 0 )return;
                    for(var i=0; i<3; i++){
                        value = Math.ceil(colors[i] - (256-colors[i])/8 - 21);
                        value = value<0?0:value;
                        ret += value;
                        if(i!=2){
                            ret += ',';
                        }
                    }
                    ret += ')';
                    return ret;

                }
                var Exp = this,
                    colorReg = /^(#\w+|change|rgba?\(\d+, *\d+, *\d+(, *[\d\.]+)?\))$/,
                    animateTimeReg = /^[.\d]+s$/,
                    methodReg = /^(normal|long|wave)$/;

                var waves = [],
                    position,
                    surviveTime = 2000,
                    stringNull = '',
                    //active动作效果分类
                    waveAction = 'wave',
                    normalAction = 'normal',
                    changeAction = 'change';

                function addRelative(el){
                    if('relative|absolute|fixed'.indexOf(el.css('position'))<0){
                        el.css('position', 'relative');
                    }
                    if('hidden'.indexOf(el.css('overflow'))<1){
                        el.css('overflow', 'hidden');
                    }
                }
                parent.find('[data-clickactive]').each(function(i, e){
                    var e = $(e),
                        point,
                        valid = false,
                        validLonger = 100,
                        timer,
                        data = e.data('clickactive'),
                        colors = data.match(colorReg)?[data]:data.split(','),
                        color,
                        animateTime,
                        method = normalAction,
                        href = e.data('href'),
                        change,
                        forbidden,
                        tempForbidden,
                        createWave,
                        clearWaveRely;
                    colors.forEach(function (c, i) {
                        if(c.match(colorReg)){
                            color = c
                            if(color == changeAction){
                                change = true;
                            }
                        }
                        else if(c.match(animateTimeReg)){
                            animateTime = c;
                        }
                        else if(c.match(methodReg)){
                            method = c;
                        }
                        else if(c == stringNull && Sys.ios){
                            method = waveAction;
                        }
                        else if(c == stringNull){
                            method = changeAction;
                        }
                    });
                    if(!color){
                        color = subColor(getBackgroundColor(e));
                    }

                    e.removeAttr('data-clickactive').removeAttr('data-href');
                    if(animateTime && ua.indexOf(/MQQBrowser/) === -1){
                        Exp.css(e, 'transition', 'background-color '+(animateTime ||'.1s'));
                    }
                    function setBackGround($target,event){
                        if(method ===waveAction)return;
                        if(valid){
                            e.addClass('click-active');
                            e.css('background-color', color);
                        }
                        else{
                            e.css('background-color', '');
                            e.removeClass('click-active');
                        }
                    }
                    Exp.touchstart(e, function(event){
                        if(timer)clearInterval(timer);
                        if(event.target && e.is('[data-clickforbidden]')){
                            tempForbidden = true;
                            return;
                        }
                        tempForbidden = false;
                        if(change){
                            forbidden = e.is('[data-clickforbidden]');
                            if(forbidden)return;
                        }
                        point = {
                            x:event.clientX,
                            y:event.clientY,
                            px:event.pageX,
                            py:event.pageY
                        };
                        valid = true;
                        if( method === waveAction ){
                            createWave = function (){
                                var width = 120/2,
                                    dotX = point.px - e.offset().left - width,
                                    dotY = point.py - e.offset().top - width,
                                    color = subColor(getBackgroundColor(e));
                                waves.push({
                                    el:$('<div class="wave" style="left:'+dotX+'px;top:'+dotY+'px;background-color:'+color+'"></div>').appendTo(e),
                                    timer: setTimeout(function () {
                                        remove();
                                    }, surviveTime)
                                });
                                pushTime = new Date();
                                clearTimeout(waveTimer);
                                timer = 0;
                            }
                            timer = setTimeout(createWave, validLonger);
                            //保持父元素相对定位
                            if('relative|absolute|fixed'.indexOf(e.css('position'))<0||'hidden'.indexOf(e.css('overflow'))<1){
                                addRelative(e);
                            }
                            clearTimeout(clearWaveRely);
                        }
                        else{
                            timer = setInterval(setBackGround, validLonger);
                            if(change){
                                color = subColor(getBackgroundColor(e))
                            };
                        }
                    });
                    Exp.touchmove(e, function(event){
                        if(change && forbidden || tempForbidden){
                            return;
                        }
                        valid = false;
                        clearInterval(timer);
                        setBackGround(e, event);
                        remove();
                    });
                    var stopTime = 1000, lastTime = new Date() - stopTime, currentTime;
                    Exp.touchend(e, function(event){
                        if(change && forbidden || tempForbidden){
                            return;
                        }
                        if(point){
                            var x = event.clientX, y = event.clientY;
                            if(Math.abs(point.x - x) <= 10 && Math.abs(point.y - y) <= 10){
                                setBackGround(e, event);
                                valid = false;
                                setTimeout(setBackGround, method=='long'? validLonger*10 : validLonger);
                                if(href){
                                    currentTime = new Date();
                                    if(currentTime - lastTime> stopTime){
                                        lastTime = currentTime;
                                        var matches = href.match(/^#(.*)|\/\/#(.*)/);
                                        setTimeout(function(){
                                            if(matches){
                                                eBase.PageRouter.go(matches[1]||matches[2]||'');
                                            }
                                            else{
                                                window.location.href = href;
                                            }
                                        }, validLonger + (matches?150:350));
                                    }
                                }
                                if(method === waveAction){
                                    if(timer){
                                        clearTimeout(timer);
                                        createWave();
                                    }
                                }
                            }
                            else{
                                valid = false;
                                setBackGround(e, event);
                            }
                            if(method === waveAction){
                                clearTimeout(timer);
                                remove(0);
                            }
                            else{
                                clearInterval(timer);
                            }

                        }
                        point = null;
                        valid = false;
                    });
                    e.on('touchcancel', function(event){
                        valid = false;
                        remove(3500);
                    });
                    var overflow = e.css('overflow'),
                        visible = overflow != 'hidden',
                    //禁止
                        canSet = false,
                        pushTime = new Date(),
                        waveTimer = 0;
                    function remove(time){
                        var wave = waves.shift();
                        if(wave){
                            wave.el.addClass('wave-large');
                            canSet = true;
                            window.requestAnimFrame = window.requestAnimationFrame||window.webkitRequestAnimationFrame;
                            clearTimeout(waveTimer);
                            setTimeout(function(){
                                wave.el.remove();
                                if(visible){
                                    clearTimeout(waveTimer);
                                    waveTimer = setTimeout(reset, 7000);
                                }
                            },time || 1000);
                        }
                        function reset(){
                            e.css('overflow', overflow);
                        }
                    }
                });
            },
            /*
             * 显示loading
             * msg为true,标识空文本
             * */
            createLoading: function(msg){
                var isBlank = msg===true;
                msg = isBlank?'': (msg|| '加载中');
                if(!this.createLoading.loading){
                    this.createLoading.loading = this.initLoading(msg);
                }
                var loading = this.createLoading.loading;
                if(msg || isBlank){
                    loading.el.querySelector('.loading-tip').innerText = msg;
                    loading.show();
                }
                loading.setPosProxy();
                return {
                    reset:function(){
                        loading.hide();
                    }
                };
            },
            /**
             *临时小提示
             */
            showAlert: function(message, callback, time) {
                if(typeof callback == 'number'){
                    var temp = time;
                    time = callback;
                    callback = temp;
                }
                return Exp.alertBox({
                    type: "validate",
                    animate:"alert-box-anim",
                    bgAnimate: "alert-bg-anim",
                    msg: message,
                    callBack: function () {
                        var that = this;
                        Exp.setTimeout(function () {
                            that.reset();
                            callback && callback();
                        }, time||2000);
                    }
                });
            },
            /**
             *用户确认取消提示框
             */
            openPopWindow: function(contentEl, data, confirmCallBack, cancelCallBack, options){
                if(typeof data == 'function'){
                    options = cancelCallBack;
                    cancelCallBack = confirmCallBack;
                    confirmCallBack = data;
                    data = {};
                }
                data = data || {};
                options = options || {};
                var htmlPre = '<div class="alert-box pop-window'+(options.rootClass?'  '+options.rootClass:' alert-box-anim-init pop-window-end')+'">',
                    htmlTail = '</div>';
                return Exp.alertBox({
                    type:"custom",
                    html: htmlPre + template.compile(typeof contentEl == 'string'?contentEl:contentEl.html())(data)+htmlTail,
                    contextAnimate:options.contextAnimate || false,
                    animate: options.animate|| "alert-box-anim" ,
                    bgAnimate: options.bgAnimate|| "alert-bg-anim",
                    animateOut: "alert-box-anim-out2",
                    bgAnimateOut: "alert-bg-anim-out2",
                    bgClickReset: options.bgClickReset,
                    upOffset: options.upOffset,
                    resetCallback: options.resetCallback,
                    asyncResetCallback: options.asyncResetCallback,
                    scrollerClass: options.scrollerClass,
                    callBack:function(){
                        var $el = $(this.el),
                            self = this;
                        if(options.callback){
                            options.callback.call(self);
                        }
                        Exp.clickActive();
                        Exp.stopClick($el.find(".close"),function(){
                            var ret;
                            if(cancelCallBack){
                                ret = cancelCallBack();
                            }
                            if(ret !== false)self.reset();
                        });
                        Exp.stopClick($el.find(".confirm"),function(){
                            var ret;
                            if(confirmCallBack){
                                ret = confirmCallBack();
                            }
                            if(ret !== false)self.reset();
                        });
                    }
                });
            },
            showLoading: function (opts) {
                this.messageAlertBox = this.createLoading(opts);
            },
            hideLoading: function() {
                if (this.messageAlertBox) {
                    this.messageAlertBox.reset();
                }
            },
            getContext: function() {
                return (compose&&compose.getContext()?compose.getContext():"");
            },
            getEvn: function() {
                var _hostName = document.location.hostname,
                    ego_pre = /^([\w\.]*)(pre)(\w*)(.cnsuning.com)$/,
                    ego_sit = /^([\w\.]*)(sit)(\w*)(.cnsuning.com)$/,
                    evn = '';
                if(_hostName.match(ego_pre)){
                    evn = 'pre';
                }
                else if(_hostName.match(ego_sit)){
                    evn = 'sit';
                }
                return evn;
            },
            getPayPassport: function() {
                var evn = this.getEvn();
                return 'https://'+evn+'paypassport.'+(evn?'cn':'')+'suning.com/ids/login?loginTheme=wap&service=';
            },
            getPassport: function() {
                var evn = this.getEvn();
                return 'https://'+evn+'passport.'+(evn?'cn':'')+'suning.com/ids/login?loginTheme=wap&service=';
            },
            authAjax: function (options) {
                var self = this;
                var opt = $.extend({
                        type: options.type || "get",
                        dataType: "json",
                        timeout: options.timeout || 15000,
                        handleLogin:true,//默认处理未登录，去登录
                        data:{}
                    }, options),
                    startTime = new Date();
                opt.data.ts = startTime.valueOf();
                if(!opt.noloading || opt.loading){
                    self.showLoading();
                }
                var success = opt.success;
                opt.success = function(data){
                    if(!opt.noloading || opt.loading){
                        self.hideLoading();
                    }
                    self.authorFiler(data, opt, options);
                };
                opt.error = function(data){
                    if(!opt.noloading || opt.loading){
                        self.hideLoading();
                    }
                    if(options.error){
                        options.error(data);
                    }
                    if(!opt.connectNoError){
                        self.showAlert("网络繁忙，请重试");
                    }
                };
                return $.ajax(opt);
            },
            authorFiler: function(data, opt, options) {
                var self = this;
                var dataType = opt.dataType, success = options.success;
                if(dataType == 'json'){
                    if(opt.handleLogin && data && (data.idsIntercepted || data.responseCode == "0999")){
                        if(options.error){
                            options.error({
                                type: 'needAuthor'
                            });
                        }
                        if(window.partMemberRequire){
                            self.loginSubmit(data, opt, options);
                        }
                        else{
                            self.showAlert("请登录", function(){
                                window.location.reload();
                            });
                        }
                    }
                    else if(success){
                        if(!opt.filter || opt.filter && !opt.filter(data)){
                            success(data);
                        }
                    }
                }
                else{
                    success(data);
                }
            },
            loginSubmit: function (data, opt, options){
                if(window.appConfig && window.appConfig.loginUrl){
                    var valide = eBase.util[options&&options.requireType?'get':'remove']('login-path-valide');

                    var param = options&&options.authorBackUrl || eBase.param('path');
                    if(!this.getAppInfo()){
                        if(valide && eBase.util.isSupport && options.requireType == "page"){
                            eBase.PageRouter.trigger('login-back', valide)
                            return;
                        }
                        eBase.util.put('login-path-valide', {
                            fragment: eBase.getFragment('', true),
                            //禁止返回前一步操作，默认返回前一步操作
                            forbidBack: !!(options&&options.forbidBack)
                        });
                        Exp.setTimeout(function(){
                            eBase.util.remove('login-path-valide');
                        }, 1000);
                        eBase.util.put('login-path', param);
                    }
                    
                    var form = $('<form method="post" action="'+(window.appConfig.loginUrl||"")+'?navigationType=LinkClicked&loginTheme=wap">'
                        +'<input type="hidden" name="path" value="'+ param +'"/>'
                        +'</form>')
                    Exp.setTimeout(function () {
                        form.submit();
                    }, 300);
                }
            },
            /*
             * 获取客户端信息 非客户端返回null
             * */
            getAppInfo: function(){
                var isYiFuBaoApp =  ua.indexOf("SNYifubao/") > 0 && ua.indexOf("EBuy-SNYifubao") < 0,
                    isYiGou = ua.indexOf("SNEBUY-APP")!=-1,
                    isYiGouRH = ua.indexOf("EBuy-SNYifubao")!=-1;

                return isYiFuBaoApp || isYiGou || isYiGouRH ?{
                    yifubao: isYiFuBaoApp,
                    yigou: isYiGou,
                    ronghe: isYiGouRH
                }:null;
            },
            /*
             *对返回后状态保存的页面进行reload操作
             * */
            direct: function (href) {
                window.location.href = href;
                Exp.setTimeout(function () {
                    window.location.reload();
                }, 800);
            },
            initLoading: function(opts){
                var msg = opts && opts.msg || '加载中';
                var hostname = window.location.hostname,
                    chain = hostname.match(/\.suning\.com/)?'.':'sit.cn',
                    html = '<div class="loading"><span class="loading-tip">'+msg+'</span><div class="req-circle"/></div></div>';
                return Exp.alertBox({
                    type:"validate",
                    msg: html,
                    animate:"alert-box-anim",
                    bgAnimate: "alert-bg-anim",
                    delayRender: false,
                    callBack:function(){
                        this.el.style.opacity = 1;
                        this.bg.style.display = 'none';
                    }
                });
            },
            delay:{
                types: {
                    frame: 'frame',
                    timeout: 'timeout',
                    interval: 'interval'
                },
                /*
                 * 时间处理
                 * */
                handle: function(func, delayTime, isTimeout){
                    if(!func)return;
                    var initTime = new Date(),
                        delayTime = delayTime || 1,
                        delay = Exp.delay,
                        frame = requestAnimationFrame,
                        types = delay.types,
                        func2;
                    if(frame){
                        try{
                            return isTimeout?handleFrame():handleIntervalFrame();
                        }
                        catch(e){
                            return handleNative(isTimeout);
                        }
                    }
                    else{
                        return handleNative(isTimeout);
                    }

                    var currentObject, nextObject;
                    function handleFrame(){
                        var currentTime = new Date();
                        if(currentTime - initTime > delayTime){
                            initTime = currentTime;
                            (func2||func)();
                        }
                        else{
                            nextObject = {
                                timer: frame(handleFrame),
                                type: types.frame
                            };
                            if(currentObject){
                                currentObject.timer = nextObject.timer;
                            }
                            else{
                                currentObject = nextObject;
                            }
                            return currentObject;
                        }
                    }

                    function handleNative(isTimeout){
                        return {
                            timer: isTimeout?(delayTime<0?func():setTimeoutNative(func, delayTime)):setIntervalNative(func, delayTime),
                            type: types.timeout
                        };
                    }
                    function handleIntervalFrame(){
                        if(!func2){
                            func2 = function () {
                                func();
                                if(currentObject.timer){
                                    handleIntervalFrame();
                                }
                            }
                        }
                        var nextObject = handleFrame();
                        if(currentObject){
                            currentObject.timer = nextObject.timer;
                        }
                        else{
                            currentObject = nextObject;
                        }
                        return nextObject;
                    }
                },
                clearDelayer:function(delayer){
                    var delay = Exp.delay,
                        types = delay.types;
                    if(delayer){
                        switch (delayer.type){
                            case types.frame:
                                cancelAnimationFrame(delayer.timer);
                                delayer.timer = 0;
                                break;
                            case types.timeout:
                                clearTimeoutNative(delayer.timer);
                                break;
                            case types.interval:
                                clearIntervalNative(delayer.timer);
                                break;
                        }
                    }
                },
                /*
                 * 延迟时间
                 * */
                setTimeout: function(func, delayTime, nodelay){
                    return Exp.delay.handle(func, delayTime, true, nodelay);
                },
                /*
                 * 清除
                 * */
                clearTimeout: function (object) {
                    return Exp.delay.clearDelayer(object);
                },
                /*
                 * 启用间隔时间
                 * */
                setInterval: function(func, delayTime){
                    return Exp.delay.handle(func, delayTime, false);
                },
                /*
                 * 清除
                 * */
                clearInterval: function (object) {
                    return Exp.delay.clearDelayer(object);
                },
                /*
                 * 覆盖全局操作
                 * */
                override: function(){
                    Exp.setTimeout = Exp.delay.setTimeout;
                    Exp.clearTimeout = Exp.delay.clearTimeout;
                    Exp.setInterval = Exp.delay.setInterval;
                    Exp.clearInterval = Exp.delay.clearInterval;
                }

            },

            init: function(){
                this.clickActive();
                this.delay.override();
            }
        }
        Exp.click($(document.body), function(){});//解决webkit不触发点击事件
        Exp.init();
        return Exp;
    })($, template);
    return Exp;
});
