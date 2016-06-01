compose.require('scripts/eBase/extend.js',[
    'window.$',
    'scripts/eBase/eBase.js',
    "scripts/lib/exp.js"
], function ($, eBase, Exp) {
    var PageView = window.eBase.PageView =  eBase.View.extend({
        instance: function(options, props){
            eBase.extends(this, props || {}, eBase.Event());
            this.addPageElement(options);
            this.wrapRender();
            this.on('satisfy', 'render', true);
            this.on('destroy', 'onDestroy', true);
            this.on('instance', 'onInstance', true);
            this._super.instance.call(this, options);
            this.setStatus({required: false});
            this._status.required = false;
        },
        addPageElement: function (options) {
            var blanker = PageRouter.getBlankElement(true);
            if(blanker){
                var el = blanker.el;
                if(options){
                    options.el = el;
                }
                else{
                    this.resetEl(el);
                }
                this.addBlankTime = blanker.time;
            }
            else{
                this.addBlankTime = null;
            }
        },
        onInstance: function(){
        },
        onDestroy: function(){
            var reqs = this.requires;
            reqs.startIndex = 0;
            if(reqs.ajax){
                reqs.ajax.abort();
            }
            if(this.render.timer){
                clearTimeout(this.render.timer);
                delete this.render.timer;
            }
            this.addBlankTime = null;
            /*this.hideLoadingBar();*/
            this.setStatus({
                operate: '',
                required: false
            });
        },
        active: function(){
            if(!this.getStatus('active')){
                this._super.active.apply(this);
            }
            if(!this.getStatus('required') || this.getStatus('destory')){
                this.satisfy();
            }
        },
        prefetch: function(){
            this.satisfy(PageView.static.prefetch);
        },
        resetEl: function(el){
            this.el = el;
            this.setEl();
        },
        render: function(){},
        wrapRender: function(){
            var render = this.render.bind(this);
            this.render = function(opts){
                var complete = this.hasCompleted(),
                    self = this,
                    router = this.getRouter();
                if(complete && !this.getStatus('destory')) {
                    if(opts && !opts.ajax){
                        if(PageRouter.isLoadingPage()){
                            PageRouter.addBlankPage(router.getFragment());
                        }
                    }
                    var status = this.getStatus(),
                        start = this.addBlankTime;
                    if(status.required && start){
                        self.render.timer = eBase.delay(callback, eBase.Config.view.loadingMinTime, start);
                    }
                    else{
                        callback();
                        eBase.util.hideLoading();
                    }
                }
                function callback(){
                    var hasAdded = self.getStatus('operate') === 'add' || self.getStatus('operate') === 'valide',
                        isPreparedPage = PageRouter.isPreparedPage();
                    if(status.required && !hasAdded){
                        var loading = PageRouter.pageLoading,
                            pLoading = PageRouter.getBlankElement(self.getRouter().getFragment());
                        if(loading){
                            if(pLoading){
                                loading.hide();
                            }
                        }
                        self.el.addClass(self.attrs.class);
                        self.setStatus({'operate': 'add'});
                        if(isPreparedPage){
                            self.el.addClass('page-ani');
                        }
                    }
                    else if(status.required){
                        self.setStatus({'operate': 'valide'});
                    }
                    else{
                        self.setStatus({'operate': 'reset'});
                    }
                    if(self.routeData){
                        self.pageData = self.pageData || {};
                        self.pageData.params = self.routeData;
                    }
                    self.setTemplateTag();
                    var renderStatus = eBase.extends({}, status);
                    render(self.routeData || [], renderStatus);

                    //self.el.css('position', '');
                    if(isPreparedPage && self.getStatus('operate') === 'add'){
                        PageRouter.addLayoutRouter(router);
                    }
                    //self.setStatus('required', false);
                }
            }
        },
        setTemplateTag: function(){
            eBase.template.config("openTag", "${");
            eBase.template.config("closeTag", "}");
        },
        resetTemplateTag: function(){
            eBase.template.config("openTag", "{{");
            eBase.template.config("closeTag", "}}");
        },
        requires:[
        ],
        /*
         *对requires多个需求进行请求，成功后返回设置
         * */
        satisfy: function(operate){
            var requires = this.requires,
                self = this;
            if(requires.startFetch)return;
            eBase.extends(requires, {
                startIndex: 0,
                ajaxCount: 0,
                completes: 0,
                startFetch: true
            });
            var prefetch = operate === PageView.static.prefetch;

            if(prefetch){
                requires.startFetch = false;
            }
            requires.forEach(function (require, i) {
                var property = require.property,
                    getter = require.getter || eBase.getMethod(property, 'get'),
                    setter = require.setter || eBase.getMethod(property, 'set');
                if(eBase.isString(getter)){
                    getter = require.getter = self[getter].bind(self);
                }
                if(eBase.isString(setter)){
                    setter = require.setter = self[setter].bind(self);
                }
                require.invoke = function(data){
                    requires.completes++;
                    setter(data);
                    require.data = data;
                    require.required = true;
                    if(!prefetch && requires.completes === requires.length ){
                        self.setStatus('required', true);
                        requires.startFetch = false;
                        if(self.router.hash.match(/[^#]*$/)[0] == eBase.PageRouter.getFragment()){
                            self.trigger('satisfy',{
                                ajax: !!requires.ajaxCount
                            });
                        }
                    }
                }
                require.handle = function(count){
                    if(this.required && this.times === eBase.Config.view.requireTimes.once){
                        this.invoke(this.data);
                    }else{
                        if(!prefetch || prefetch && this.times === eBase.Config.view.requireTimes.once){
                            requires.ajaxCount++;
                            this.getter(this);
                        }

                    }
                    requires.startIndex++;
                }
                require.handle();
            })
            if(requires.length === 0){
                self.trigger('satisfy');
            }
        },
        resetPageData: function(){
            var requires = this.requires,
                completes = 0;
            requires.some(function (item, index) {
                if(item.times === eBase.Config.view.requireTimes.always){
                    requires.startIndex = index;
                    requires.completes = completes;
                    return true;
                }
                else{
                    completes++;
                }
            })
        },
        /*
         * 刷新页面
         * @param [Boolean] fetchData 是否重新获取数据
         * */
        refresh: function(fetchData){
            this.setStatus('operate', 'reset');
            eBase.off(this.el, 0);
            if(fetchData){
                this.resetPageData();
                this.getPageData();
                this.el.removeClass('page-hidden');
            }
        },
        hasCompleted: function(){
            if(this.requires.completes === this.requires.length || this.requires.length === 0){
                return true
            }
            return false;
        },
        getTemplateHtml: function(require){
            this.service.getTemplateHtml(require);
        },
        setTemplateHtml: function(template){
            this.resetTemplateTag();
            this.templateHtml = template;
            this.template = eBase.template.compile(this.templateHtml);
            this.setTemplateTag();
        },
        template: function(data){
            return '';
        },
        setPageData: function(data){
            this.pageData = data;
        },
        getPageData: function(){
            return this.pageData;
        },
        /*
        * 渲染页面内容
        * */
        addContent: function (parent, handleHtml, manual) {
            var el = this.el;
            PageRouter.hidePageLoading();
            var html;
            if(manual){
                html = manual(this.pageData, this.template);
            }
            else{
                html = this.template(this.pageData || {});
                if(handleHtml){
                    html = html.replace('{Template Error}','');
                    html = handleHtml(html);
                }
            }
            el.html(html);
            if(!el.parent().size()){
                el.appendTo(parent);
            }
            this.stopClickQuick();
        },
        addLoadingTo: function (parent, handleHtml, manual) {
            this.addContent(parent, handleHtml, manual);
        },
        /*
        * 阻止连续点击快捷设置
        * */
        stopClickQuick:function(){
            Exp.stopClickQuick(this.el);
        },
        stopClick:function(){
            Exp.stopClickQuick(this.el);
        },
        manualLoadingTo: function (parent, handle) {
            if(handle){
                this.addContent(parent, null, handle);
            }
        },
        compileHtml: function(tpl, obj) {
            this.setTemplateTag();
            var render = template.compile(tpl),
                html = render(obj);
            return html;
        }
    });

    eBase.extends(PageView,
        {
            static:{
                templateAjax: 'template',
                commonAjax: 'common',
                prefetch: 'prefetch'
            }
        });
    var PageRouter = window.eBase.PageRouter = eBase.Router.extend({
        instance: function(options, props){
            eBase.extends(this, props || {}, eBase.Event());
            this._super.instance.call(this, options);
            this.register();
            this.onInstance(options);
            this.on('deactive', '_onDeactive', true);
        },
        onInit: function(){
        },
        onInstance: function(){
        },
        launch: function(){
        },
        _onDeactive: function(){
            //this.removeLayout();
        },
        /*
        * 加入布局标识
        * *//*
        addLayout: function(){
            this.inLayout = true;
        },
        *//*
         * 移除布局
         * *//*
        removeLayout: function(){
            this.inLayout = false;
        },
        *//*
        *  是否加入布局
        * *//*
        hasLayout: function () {
            return this.inLayout;
        },*/
        setScrollTop: function(scrollTop){
            this.scrollTop = scrollTop;
        },
        getScrollTop: function(){
            return this.scrollTop || 0;
        }
    });
    eBase.extends(PageRouter, {
        events:{
        },
        //资源配置
        resources: eBase.extends({}, eBase.Config.router.resources),
        //加载策略
        loadStrategies:{},
        loadStrategy: {
            preparedPage: 'preparedPage',
            loadingPage: 'loadingPage'
        },
        //页面配置
        pageConfig: {},
        resStatus:{
            init:0,
            start:1,
            success:2,
            fail:3
        },
        _handledRes:{
        },
        onStart: function(){
            this.analyseResource();
            this.setLayout(new eBase.DislocationLayout());
            this.on('execRouter', 'execute', true);
        },
        /*
         * 添加router资源加载路径
         * */
        addResource: function (resources) {
            resources && eBase.extends(this.resources, resources);
        },
        /*
        * 添加加载策略
        * */
        addLoadStrategy: function (strategies) {
            strategies && eBase.extends(this.loadStrategies, strategies);
        },
        /*
         * 获取router的加载方式
         * */
        getLoadStrategyByRouter: function () {
            var fragment = PageRouter.getFragment(),
                pathFrag = fragment.match(/[^\/]*/)[0];
            return this.loadStrategies[pathFrag];
        },
        /*
         * 是否为预加载页面
         * */
        isPreparedPage: function () {
            var strategy = this.loadStrategy.preparedPage;
            return (this.getLoadStrategyByRouter()||strategy) == strategy
                    && !this.layout.isAddFirstPage();
        },
        /*
         * 是否为loading加载页面
         * */
        isLoadingPage: function () {
            var strategy = this.loadStrategy.loadingPage;
            return this.getLoadStrategyByRouter() == strategy
                || this.layout.isAddFirstPage();
        },
        /*
         * 是否加载第一个页面
         * */
        isAddFirstPage: function () {
            return this.layout.isAddFirstPage();
        },
        /*
         * 处理router资源加载
         * */
        requireResource: function(router, callback, type){
            var resources = this.resources,
                res,
                cb = callback.bind(this, 'reqsuccess'),
                self = this,
                status;
            this.checkResource(router, function(ret){
                res = ret.route;
                status = res.status;
                res.cb = cb;
                if(status === self.resStatus.success){
                    res.cb();
                }
                else{
                    if(status === self.resStatus.init || status === self.resStatus.fail){
                        self.trigger('requireResource');
                        resources = eBase.extends([], res.path);
                        res.status = self.resStatus.start;
                        eBase.simulate(eBase.Config.simulate.reqResFail, function () {
                            fail(res, resources, type);
                        }, function () {
                            compose.require(resources, function(){
                                if(typeof self.success === 'undefined' || self.success){
                                    eBase.log.success('PageRouter.requireResource: 路由['+router+']-->['+resources.join(',')
                                        +']资源'+(type==='prefetch'?'预取':'获取')+'成功！');
                                    res.status = self.resStatus.success;
                                    res.cb();
                                }
                                else{
                                    fail(res, resources, type);
                                }
                            }, function () {
                                res.status = self.resStatus.fail;
                                fail(res, resources, type);
                            });
                        });
                    }
                }
                return true;
            });
            function fail(res, resources, prefetch){
                if(!prefetch){
                    eBase.util.hideLoading();
                }
                res.status = self.resStatus.fail;
                eBase.log.error('PageRouter.requireResource: 路由['+router+']-->['+resources.join(',')
                    +']资源获取失败！');
                if(!prefetch){
                    self.back(true);
                }
            }
        },
        /*
         * 分析router资源配置
         * */
        analyseResource: function(){
            var resources = this.resources,
                item,
                regstr;
            for(var name in resources){
                item = resources[name];
                if(eBase.isArray(item)){
                    regstr = name?'(^'+name+'$)':'(^$)';
                    resources[name] = {
                        reg: new RegExp(regstr),
                        path: item,
                        status: this.resStatus.init
                    };
                }
            }
        },
        /*
        * 设置布局管理器
        * */
        setLayout: function(layout){
            this.layout =  layout;
        },
        getLayout: function(layout){
            return this.layout;
        },
        getPreRouter: function(){
            var hash = this.getHash(),
                fragment = '';
            if(hash){
                var mats = hash.match(/\#[\s\S^#]+/);
                if(mats.length>1){
                    fragment = mats[mats.length-2];
                }
            }
            return this.getRouter(fragment)
        },
        execute: function(event){
            var valide = eBase.util.get('login-path-valide');
            if(valide && event && event.fragment != valide.fragment){
                eBase.util.remove('login-path-valide');
            }
            if(event.success){
                var router = this.getRouter(event.routerName),
                    status = router.view.getStatus();
                if(!status.required){
                    this.change(event);
                }
                else{
                    this.addLayoutRouter(router, event);
                }
            }
            else{
                //请求资源处理
                this.change(event);
            }
        },
        change: function(event){
            if(eBase.PageRouter.isPreparedPage()){
                eBase.util.showLoading(true);
            }
            var fragment = this.getFragment(),
                ret = this.checkResource(fragment);
            if(ret){
                if(this.hasRouter() && PageRouter.isLoadingPage()){
                    this.addBlankPage(fragment);
                }
                this.forward(fragment, event);
            }
            else{
                this.handleError(this.handleError.noResourceByPageError);
                eBase.util.hideLoading();
                eBase.log.error('PageRouter.change: hash值['+fragment+']-->eBase.Config.router.resources配置不存在，请检查config.js配置');
            }
        },
        forward: function(fragment, event){
            fragment = fragment || '';
            var self = this;
            this.requireResource(fragment, function(type){
                var router = this.checkRouter(fragment);
                if(router){
                    if(event.type === 'trigger'){
                        window.history.pushState('', '', fragment?"#"+fragment:'');
                    }
                    event.type = 'resource';

                    var values = fragment.match(router.reg).map(function (item) {
                        if(item){
                            item = item.replace(/^\//, '');
                        }
                        return item;
                    });
                    router.callback.apply(router, values.slice(1));
                    router = router.router;

                    if(fragment == eBase.PageRouter.getFragment()){
                        router.active();
                        if(PageRouter.isLoadingPage()){
                            this.addLayoutRouter(router);
                        }
                    }
                }
                else if(type === 'reqsuccess'){
                    eBase.util.hideLoading();
                    eBase.log.error('PageRouter.forward: hash值['+fragment+']-->获取js成功，但还是找不到hash值['+fragment+']对应的路由,请确认该页面的js是否有异常或对应的pageConfig.route配置是否正确');
                }
            });
        },
        checkResource: function(fragment, callback){
            var resources = this.resources,
                item,
                fragment = fragment.split('/')[0];
            for(var name in resources){
                item = resources[name];
                if(fragment.match(resources[name].reg)){
                    var ret = {
                        name: fragment,
                        route: resources[name],
                        fragment: fragment
                    };
                    if(callback){
                        callback(ret);
                    }
                    return ret;
                }
            }
        },
        prefetch: function(fragment){
            if(eBase.Config.view.prefetch){
                var ret = this.checkResource(fragment);
                if(ret){
                    fragment = fragment || '';
                    this.requireResource(fragment, function(){
                        var config = PageRouter.getFirstRouterConfig(fragment);
                        config&&config.router.view.prefetch();
                    }, 'prefetch');
                }
            }
        },
        addLayoutRouter: function(router, event){
            if(this.layout){
                //router.addLayout();
                this.layout.add(router, event);
            }
        },
        addBlankPage: function (fragment) {
            var el = this.createBlankElement(fragment);
            this.layout.addBlankElement(el, this.event);
            var router = this.checkRouter(fragment);
            if(router){
                router.router.view.addPageElement();
            }
        },
        createBlankElement: function(fragment){
            var loadingClass = this.getPageConfig(fragment).loadingClass;
            var el = $('<div class="page page-ani'+(loadingClass?loadingClass+' ':'')+'"></div>').appendTo(this.rootEl),
                loading = this.getPageLoading();
            if(loading){
                el.append(loading);
                loading.show();
            }
            this.setBlankElement(el, fragment);
            return el;
        },
        setBlankElement: function(el, fragment){
            if(!this.blankElement){
                this.blankElement = {};
            }
            this.blankElement[fragment] = {
                el: el,
                time: new Date()
            };
        },
        getBlankElement: function(clear, frag){
            var fragment = frag || this.getFragment(),
                blank = this.blankElement,
                blanker;
            if(blank && blank[fragment]){
                blanker = blank[fragment];
                if(clear){
                    this.blankElement[fragment] = null;
                }
                return blanker;
            }
            return null;
        },
        setPageLoading: function(el){
            this.pageLoading = el;
        },
        hidePageLoading: function(){
            if(this.pageLoading){
                this.pageLoading.remove();
                this.pageLoading = null;
            }
        },
        /*hideLoadingBar: PageView.prototype.hideLoadingBar,*/
        setRoot: function(el){
            this.rootEl = el;
        },
        /*
         * 获取loading效果
         * @return {Element}
         * */
        getPageLoading: function(){
            var loadingBox = $('<div class="page-loading-box"><div class="page-loading"><div class="page-circle"></div></div></div>');
            var loading = loadingBox.find('.page-loading')[0];
            var svgHtml = '<svg class="svg-circle" width="' + 80 + '" height="' + 80 + '" viewBox="-1 -1 ' + 36 + " " + 36 + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>',
                logoHtml = '<path fill="#fff" d="M22.941,17.764h-1.133H13.73l0.336-0.734h6.703c2.875,0,3.609-1.805,3.609-3.029v-1.89 c0-1.041-0.643-1.408-1.529-1.408h-1.133h-8.262h-0.765h-2.05v6.334h0.857l-2.081,4.498h2.632l0.979-2.111h0.857l-2.02,4.591h2.509 l1.989-4.56h1.163l-1.989,4.56h2.478l1.991-4.56h1.836v1.988c0,0.674-0.611,1.102-1.377,1.102h-0.888l-0.643,1.5h2.113 c2.691,0,3.609-1.621,3.609-2.846v-1.775C24.625,18.285,23.828,17.764,22.941,17.764z M21.596,12.165v2.295 c0,0.673-0.521,1.163-1.316,1.163h-6.794v-0.948h7.039v-1.53h-7.039v-0.979H21.596z"></path>',
                orbitHtml = '<path opacity=".25" d="M17 0 A17 17 0 0 0 17 34 A17 17 0 0 0 34 17 A17 17 0 0 0 17 0" stroke="#fff" fill="rgba(0,0,0,0)" stroke-width="1px"/>',
                circleHtml = '<path class="svg-circle" d="M17 0 A17 17 0 0 0 17 34 A17 17 0 0 0 34 17" stroke-dasharray="78" stroke="#fff" fill="rgba(0,0,0,0)" stroke-width="1px"></path>',
                ani1Html = '<animateTransform attributeName="transform" type="rotate" values="0 17 17;50 17 17; 360 17 17" dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines=".5 0 .5 1;.5 0 .5 1"></animateTransform>',
                ani2Html = '<animateTransform attributeName="transform" type="rotate" values="0 17 17;360 17 17" dur="2.15s" repeatCount="indefinite" additive="sum"></animateTransform>',
                ani3Html = '<animate attributeName="stroke-dashoffset" dur="1.5s" values="0; 76; 0" repeatCount="indefinite" calcMode="spline" keySplines=".5 0 .5 1;.5 0 .5 1"></animate>';
            var svg=createElement(svgHtml,true),
                logo=createElement(logoHtml,true),
                orbit=createElement(orbitHtml,true),
                circle=createElement(circleHtml,true),
                ani1=createElement(ani1Html,true),
                ani2=createElement(ani2Html,true),
                ani3=createElement(ani3Html,true);
            svg.appendChild(logo);
            svg.appendChild(orbit);
            svg.appendChild(circle);
            loading.appendChild(svg);
            circle.appendChild(ani1);circle.appendChild(ani2);circle.appendChild(ani3);
            function createElement(html, isSVG){
                var matches = html.match(/(\w+)|(\s*[\w\-\:]*\s*=\s*"[^"]*")/g),el,tag=matches.shift(),attrs={};
                matches.pop();
                el = isSVG?document.createElementNS("http://www.w3.org/2000/svg", tag):document.createElement(tag);
                matches.forEach(function (item) {
                    var ret = item.trim().match(/([\w\-\:]*)\s*=\s*"([^"]*)"/);
                    attrs[ret[1]] = ret[2];
                })
                for(var name in attrs){
                    el.setAttribute(name, attrs[name]);
                }
                return el;
            }
            if(this.pageLoading){
                this.pageLoading.remove();
            }
            this.pageLoading = loadingBox;
            return loadingBox;
        },
        removeBlankElement: function(el){
            this.layout.removeBlankElement();
        },
        /*
         * 错误处理
         * @param {String} type 错误类型
         * */
        handleError: (function() {
            var handle = function (type) {
                var self = this;
                switch (type){
                    case handle.noResourceError:
                        break;
                    case handle.noResourceByPageError:
                        eBase.tip('您的请求路径不存在', function () {
                            self.back();
                        });
                        break;
                    case handle.noHtmlDataError:
                        break;
                }
            }
            eBase.extends(handle, {
                noResourceError: 'noRes',
                noResourceByPageError: 'noResByPage',
                noHtmlDataError: 'noHtmlOrData'
            })
            return handle;
        })(),
        back: function(tip){
            if(this.layout && this.layout.hasHistory()){
                if(this.isOnline()){
                    eBase.Router.back();
                }
                else{
                    setTimeout(function () {
                        eBase.Router.back();
                    }, 1000);
                }
            }
            if(tip){
                this.showNetworkTip(tip);
            }
        },
        showNetworkTip: function (tip) {
            if(typeof tip == 'boolean'){
                tip = '';
            }
            if(this.isOnline()){
                eBase.tip(tip || '网络不稳定，请稍后再试');
            }
            else{
                eBase.tip(tip || '未检测到网络');
            }
        },
        /*
         * 设置页面配置
         * */
        setPageConfig: function (configs) {
            var pageConfig = this.pageConfig;
            for(var fragment in configs){
                if(!pageConfig[fragment]){
                    pageConfig[fragment] = {};
                }
                eBase.extends(pageConfig[fragment], configs[fragment]);
            }
        },
        /*
         * 获取页面配置
         * */
        getPageConfig: function (fragment) {
            var header = fragment.match(/^[^\/#]*/)[0];
            return this.pageConfig[header]||{loadingClass:''};
        }
    });

    var PageService = window.eBase.PageService =  eBase.Service.extend({
        instance: function(options, props){
            this._super.instance.call(this, options);
            eBase.extends(this, props || {}, eBase.Event());
            this.onInstance(this.options);
        },
        onInit: function(){
        },
        onInstance: function(){
        },
        /*
         * 获取值
         * @param {Ojbect} [params] 参数对象
         * @param {String/Function} success 成功回调
         * @param {String/Function} [fail] 失败回调
         * @return undefined
         * */
        getData: function(url, params, success, fail){
        },
        /*
         * 获取页面模板
         * */
        _getTemplateHtml: function(options){
            var name = options.name;
            this.handleRequire({
                dataType: 'text',
                url: eBase.Config.service.urls.templatePath+'/'+(/\.html$/.test(name)?name:name+'.html')
            });
        },
        _getPageData: function(options){
            this.handleRequire({
                dataType: 'json',
                data: options.data || {},
                url: options.url,
                success: options.success,
                error: options.error
            });
        },
        handleRequire: function(options){
            var self = this,
                requires = this.view.requires,
                require = requires[requires.startIndex],
                view = this.view,
                config = eBase.Config,
                invoke;
            if(require){
                invoke = require.invoke;
            }
            else{
                return;
            }
            switch (require.times){
                case config.view.requireTimes.once:
                    if(require.required){
                        require.setter(data);
                        return;
                    }
                case config.view.requireTimes.every:
                default :
            }
            if(this.counttime === undefined){
                this.counttime = 0;
            }
            var self = this,
                ajaxTime = new Date(),
                data = options.data,
                dataType;
            if(data){
                data.ts = ajaxTime.valueOf();
            }
            dataType = options.dataType || 'json';
            if(require.times == config.view.requireTimes.once){
                var template = PageService.getTemplateCache(options.url);
                if(template){
                    return success(template, 'cache');
                }
            }
            require.ajax = Exp.authAjax({
                url: options.url,
                data:options.data || {},
                type: options.type||"get",
                dataType: dataType,
                requireType: 'page',
                noloading:true,
                timeout: eBase.Config.service.timeout || 0,
                filter: function (data) {
                    var valide = eBase.PageService.trigger('templateJsonFilter', data||'',{
                        time: data.ts,
                        type: eBase.PageView.static.templateAjax
                    });
                    if(valide){
                        require.ajax = 'complete';
                        requires.startFetch = false;
                        eBase.util.hideLoading();
                    }
                    return valide;
                },
                success: success,
                error: function(event){
                    requires.startFetch = false;
                    eBase.util.hideLoading();
                    eBase.log.error('PageService.handleRequire: '+options.url+'数据获取失败！'
                        +((options.url||'').match(/\.html$/)?'请检查模板目录：'+eBase.Config.service.urls.templatePath+'下是否有该文件':'请检查url地址是否正确'));
                    require.ajax = 'complete';
                    if(view.getStatus('destory')){
                        return;
                    }
                    if(options.error){
                        options.error(event);
                    }
                    else{
                        if(event.type == 'needAuthor'){
                            eBase.delay(function () {
                                var valide = eBase.util.remove('login-path-valide');
                                if(valide && !valide.forbidBack){
                                    PageRouter.back('用户未登录');
                                }
                            }, 2000)
                        }
                        else{
                            eBase.delay(function () {
                                PageRouter.back();
                            }, 1500, ajaxTime)
                        }

                    }
                }
            });
            function success(data, cache){
                eBase.log.success('PageService.handleRequire:模板数据['+options.url+']数据获取成功！');
                if(view.getStatus('destory')){
                    requires.startFetch = false;
                    return;
                }
                if(require.times == config.view.requireTimes.once && cache != 'cache'){
                    PageService.setTemplateCache(options.url, data);
                }
                if(options.success){
                    options.success(data);
                }
                invoke(data, {required: require.required});
            }
        },
        authAjax: function (options) {
            var self = this,
                opt = $.extend(options,
                    {
                        noloading: options.noloading,
                        filter: function (data) {
                            return eBase.PageService.trigger('dataJsonFilter', data||'',
                                $.extend(options,
                                    {
                                        time: opt.data.ts,
                                        type:eBase.PageView.static.commonAjax
                                    })
                            );
                        }
                    });
            return Exp.authAjax(opt);
        }
    });
    eBase.extends(PageService, {
        /*
         * 设置模版缓存
         * */
        setTemplateCache: function (url, data) {
            eBase.util.put(url, data, true);
        },
        /*
         * 获取模版缓存
         * */
        getTemplateCache: function (url) {
            return eBase.util.get(url, true);;
        }
    });
    return eBase;
});