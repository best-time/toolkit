!function (e) {
    var t = {
        route: {"": "launch"},
        templateName: "index",
        pageDataUrl: appConfig.indexDataUrl
    }, a = e.Config.view, n = new e.PageView({tagName: "div", className: "page"}, {
        requires: [{
            property: "templateHtml",
            times: a.requireTimes.once
        }, {getter: "getPageData", setter: "setPageData", times: a.requireTimes.always}], getPageData: function () {
            this.service.getPageData()
        }, setPageData: function (e) {
            this.pageData = e
        }, onInstance: function () {
        }, render: function (t, a) {
            if ("add" == a.operate) {
                var n = e.modules.get("app");
                this.manualLoadingTo(n.el, function (e, t) {
                    return e.bofUrl = ROOT_BASE_PATH + "/bof", e.hotfund.length > 0 && e.hotfund.forEach(function (e, t) {
                        e.sevenDReturn && (e.sevenDReturn = (e.sevenDReturn - 0).toFixed(4))
                    }), e.mycollection.length > 0 && e.mycollection.forEach(function (e, t) {
                        e.sevenDReturn && (e.sevenDReturn = (e.sevenDReturn - 0).toFixed(4))
                    }), n.getHeaderHtml("common") + t(e)
                }), this.setTemplateTag();
                var i = this;
                i.el;
                Exp.clickActive(this.el), headerMenu.showDropMenu(this.el)
            } else this.refresh(!0);
            headerMenu.setPageTitle(this.el.find("header"), "基金")
        }
    });
    new e.PageService({view: n}, {
        onInstance: function () {
        }, getTemplateHtml: function () {
            this._getTemplateHtml({name: t.templateName})
        }, getPageData: function (e) {
            this._getPageData({url: t.pageDataUrl, data: e})
        }
    }), new e.PageRouter({view: n}, {
        route: t.route, onInstance: function () {
        }, launch: function () {
            this.view.render()
        }
    })
}(eBase);