/*异步执行方法 start */
compose.require('scripts/common/header.js', [
    "scripts/lib/exp.js"
], function (Exp) {
    /*异步执行方法 start */
    var headerAsync = (function(){
        var callBacks = [],needAsync = true;
        return {
            add:function(callback){
                if(!callback)return;
                if(needAsync){
                    callBacks.push(callback);
                }else{
                    callback();
                }
            },
            cancelAsync:function(){
                needAsync = false;
            },
            exec:function(){
                for(var i = 0; i < callBacks.length; i++){
                    callBacks[i]();
                }
                callBacks = [];
            }
        }
    })();
    /*异步执行方法 end*/
    /*页头start*/
    var headerMenu = {
        init:function(){
            var self = this;
            document.body.addEventListener('scroll', function ( touchEvent ) {
                if(!$('header .menu').hasClass("hide")){
                    touchEvent.preventDefault();
                    return false;
                }
            }, false);
            if(self.checkApp()){
                self.showRightButton();
            }
        },
        checkApp: function (){
            return navigator.userAgent.match(/SNEBUY-APP;?/i) || navigator.userAgent.match(/SNYifubao;?/i)|| navigator.userAgent.match(/SNSTORE-APP;?/i);
        },
        setPageTitle: function(headerEl, title){
            var self = this;
            $('title').html(title);
            try{
                /*设置页面 title start*/
                var ua = navigator.userAgent;
                if(self.checkApp()){
                    $('header').remove();
                    if(window.SNNativeClient && window.SNNativeClient.updateTitle){
                        try{
                            window.SNNativeClient.updateTitle(title);
                        }catch(e){}
                    }
                    return;
                }
                headerEl.find('.title').html(title);
            }catch(e){}
        },
        showDropMenu: function  (parent) {
            var _$ = parent&&parent.find?parent.find.bind(parent) : $;
            var $point = _$('.points-wrap'),
                $menu = _$('.menu'),
                $mask = _$('.mask'),
                ua = navigator.userAgent;
            Exp.click($point,function(){
                $menu.removeClass('hide');
                $menu.toggleClass('menu-show');
                $menu.removeClass('menu-hide');
                $mask.toggleClass('hide');
            });
            Exp.click($mask, function(){
                $menu.removeClass('menu-show');
                $menu.addClass('menu-hide');
                setTimeout(function(){
                    $mask.addClass('hide');
                    $menu.addClass('hide');
                },300);
            });
            Exp.click(_$("header .menu li"),function(){
                var index = _$(this).index();
                setTimeout(function(){
                    $menu.addClass('hide');
                    $mask.addClass('hide');
                },500);
            });

            if(ua.indexOf('SNEBUY-APP')>0||ua.indexOf("SNYifubao")>0){
                var header = _$('.fix-header');
                if(header.length > 0){
                    header.removeClass('fix-header');
                    _$('.fix-content').removeClass('fix-content');
                }
            }
            _$("header .goback").click(function(){
                window.history.go(-1);
            });
        },
        showRightButton: function(btnType){
            var self = this;
            /*右上角添加我的理财按钮start*/
            var ua = navigator.userAgent, buttons = '';
            if(!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                if (window.SNNativeClient) {
                    onClientReady();
                } else {
                    document.addEventListener("SNNativeClientReady",onClientReady,false);
                }
            }else if(ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1){
                onClientReady();
            }
            //解决compose异步监控不到SNNativeClientReady事件，如果不是compose则继续用方法document.addEventListener("SNNativeClientReady",onClientReady,false)
            //client API are available
            function onClientReady() {
                var ua = navigator.userAgent,
                    YFBversion = ua.substring(ua.indexOf("SNYifubao")+10),
                    EBuyYFBversion = ua.substring(ua.indexOf("EBuy-SNYifubao")+15);
                if(btnType && btnType == 1){
                    var buttons = '[{"title":"我的理财","callBack":"callBackMyLicai","params":"100"}]';
                }else{
                    var buttons = '[{"title":"理财首页","callBack":"callBackLicai","params":"https://imgssl.suning.com/images/advertise/001/khd/lc.png"},{"title":"我的理财","callBack":"callBackMyLicai","params":"https://imgssl.suning.com/images/advertise/001/khd/wdlc.png"},{"title":"零钱宝","callBack":"callBackMyLqb","params":"https://imgssl.suning.com/images/advertise/001/khd/lqb.png"}]';
                }
                //在客户端右上方放置 我的理财 按钮
                if(ua.indexOf('SNEBUY-APP')>0){
                    if(ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1){
                        //易购安卓客户端
                        self.lazyLoadScript("https://sslres.suning.com/project/mvs/RES/common/script/android/sneapp.js",function(){
                            setTimeout(function(){
                                try{baseApi.showRightButtons(buttons);}catch(e){}
                                headerAsync.exec();
                                headerAsync.cancelAsync();
                            },1500);
                        });
                    }else{
                        try{window.SNNativeClient.showRightButtons(buttons);}catch(e){}
                    }
                }else if(ua.indexOf("SNYifubao")>0){
                    var exec = false;
                    if(YFBversion < '4.6.0' && ua.indexOf("EBuy-SNYifubao")<0
                        || EBuyYFBversion < '3.8.0' && ua.indexOf("EBuy-SNYifubao")>0){
                        buttons = '{"titles":["我的理财"], "callBacks":["callBackMyLicai"], "params":["100"]}';
                        try{
                            window.SNNativeClient.showRightButtons(buttons);
                        }catch(e){}
                    }else{
                        try{
                            window.SNNativeClient.showRightButtonMenu(buttons);
                        }catch(e){}
                    }
                }
            }
            /*右上角添加我的理财按钮end*/
        },
        lazyLoadScript:function(src, callback){
            var lazyScriptMap = {};
            if (!lazyScriptMap[src]) {
                lazyScriptMap[src] = callback;
                var scriptNode = document.createElement("script");
                if ('function' === typeof callback) {
                    if (!/msie/i.test(navigator.userAgent.toLowerCase())) {
                        scriptNode.onload = callback;
                    }
                    scriptNode.onreadystatechange = function() {
                        if ("loaded" == scriptNode.readyState || "complete" == scriptNode.readyState) {
                            callback();
                        }
                    }
                } else if (isArray(callback)) {
                    var callbackSequence = function() {
                        for (var i = 0; i < callback.length; i++) {
                            (callback[i])();
                        }
                    };
                    scriptNode.onload = callbackSequence;
                    scriptNode.onreadystatechange = function() {
                        if ("loaded" == scriptNode.readyState
                            || "complete" == scriptNode.readyState) {
                            callbackSequence();
                        }
                    }
                }
                scriptNode.type = "text/javascript";
                scriptNode.src = src;
                var scriptContainer = document.getElementsByTagName("head")[0];
                scriptContainer.appendChild(scriptNode);

            }
        }
    }
    headerMenu.init();
    // 客户端回调方法
    window.callBackMyLicai = function(){
        window.location.href = LC_PATH + '/lcportal/app/index.htm?path=lazy-index&'+appThemeNavType;
    }
    window.callBackLicai = function(){
        window.location.href = LC_PATH + '/lcportal/app/index.htm?'+appThemeNavType;
    }
    window.callBackMyLqb = function() {
        window.location.href = BOF_PATH + '/bof/app/hFiveBuy/myLqb.htm?'+appThemeNavType;
    }

    return headerMenu;
});