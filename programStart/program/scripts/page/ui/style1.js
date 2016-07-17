compose.require('scripts/page/style1.js', [
	'style/css/my.css',
    'window.$',
    "scripts/lib/exp.js",
    "scripts/eBase/eBase.js",
    "scripts/common/header.js"
], function(css, $, Exp, eBase, headerMenu){
	var pageConfig = {
			route: {
				'style1': 'launch'
			},
			templateName: 'style1'
		},
		viewConfig = eBase.Config.view;

	// 视图层
	var view = new eBase.PageView({
		tagName: 'div',
		className: 'page '+pageConfig.templateName+'-page'
	}, {
		requires: [{
			property: 'templateHtml',
			times: viewConfig.requireTimes.once
		}],
		deactive: function() {},
		onInstance: function() {},
		render: function(params, status) {

			if (status.operate == 'add') {
				var app = eBase.modules.get('app');
				this.manualLoadingTo(app.el, function(pageData, template) {
					return app.getHeaderHtml() + template(pageData);
				});
				this.setTemplateTag();

				/*************页面js end*************/
				//Exp.clickActive(this.el);
				//headerMenu.showDropMenu(this.el);
			}
			headerMenu.setPageTitle(this.el.find('header'), '样式1');
		}
	});

	// 服务器层
	var service = new eBase.PageService({
		view: view
	}, {
		onInstance: function() {},
		getTemplateHtml: function() {
			this._getTemplateHtml({
				name: pageConfig.templateName
			});
		},
		getPageData: function(data) {
			this._getPageData({
				url: pageConfig.pageDataUrl,
				data: data
			});
		}
	});

	// 路由
	var router = new eBase.PageRouter({
		view: view
	}, {
		route: pageConfig.route,
		onInstance: function() {},
		launch: function() {
			this.view.render();
		}
	});
	(function(name) {
		eBase.modules.put('view.' + name, view);
		eBase.modules.put('service.' + name, service);
		eBase.modules.put('router.' + name, router);
	})(pageConfig.templateName);

	return {
		view: view,
		router: router,
		service: service
	};
});