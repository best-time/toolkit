compose.require('scripts/page/income-list.js', [
    'window.$',
    "scripts/lib/exp.js",
    "scripts/eBase/eBase.js",
    "scripts/common/header.js"
], function($, Exp, eBase, headerMenu){

    var objpro = Object.prototype;
    var objstr = objpro.toString;

    var pageConfig = {
            route: {
                'income-list/:projectId': 'launch'
            },
            templateName: 'income-list',
            pageDataUrl: appConfig.incomeList
        },
        viewConfig = eBase.Config.view;

    // 视图层
    var view = new eBase.PageView(
        {
            tagName: 'div',
            className: 'page ' + pageConfig.templateName + '-page'
        },
        {
            requires: [{
                property: 'templateHtml',  //html模板
                times: viewConfig.requireTimes.once
            }],
            getPageData: function () {
                this.service.getPageData({
                    cid: this.routeData[0]
                });
            },
            setPageData: function (data) {
                this.pageData = data;
            },
            deactive: function () {
            },
            onInstance: function () {
            },
            render: function (params, status) {

                var self = this;

                var routeData = params[0];
                var viewData = JSON.parse(eBase.util.get("categoryData"));
                var viewDataLen = viewData.length;
                var i = -1;
                while (++i < viewDataLen) {
                    if (viewData[i].Id == routeData) {
                        viewData[i].avg = self.fetchItemAvg(viewData[i].incomeList, "value")
                        view.setPageData(viewData[i]);
                        break;
                    }
                }


                if (status.operate == 'add') {
                    var app = eBase.modules.get('app');
                    this.manualLoadingTo(app.el, function (pageData, template) {
                        return app.getHeaderHtml() + template(pageData);
                    });
                    /*************页面js end*************/
                    Exp.clickActive(this.el);
                    headerMenu.showDropMenu(this.el);
                }

                headerMenu.setPageTitle(this.el.find('header'), '每万份收益');
            },
            fetchItemAvg: function (data, item) {
                if (objstr.call(data) !== '[object Array]') return false;
                var len = data.length,
                    i = -1,
                    amount = 0
                    ;
                while (++i < len) {
                    amount += +data[i][item] || 0;
                }
                return (amount / len).toFixed(4);
            }
        });

    // 服务器层
    var service = new eBase.PageService({
        view: view
    }, {
        onInstance: function () {
        },
        getTemplateHtml: function () {
            this._getTemplateHtml({
                name: pageConfig.templateName
            });
        },
        //设置view.pageData
        getPageData: function (data) {
            this._getPageData({
                url: pageConfig.pageDataUrl,
                data: data,
                success: function (data) {
                }
            });
        }
    });

    // 路由
    var router = new eBase.PageRouter({
        view: view
    }, {
        route: pageConfig.route,
        onInstance: function () {
        },
        launch: function () {
            this.view.render();
        }
    });
    (function (name) {
        eBase.modules.put('view.' + name, view);
        eBase.modules.put('service.' + name, service);
        eBase.modules.put('router.' + name, router);
    })(pageConfig.templateName);

    return {
        view: view,
        router: router,
        service: service
    }

});