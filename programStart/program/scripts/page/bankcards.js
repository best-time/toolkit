compose.require('scripts/page/bankcards.js', [
    'window.$',
    "scripts/lib/exp.js",
    "scripts/eBase/eBase.js",
    "scripts/common/header.js"
], function($, Exp, eBase, headerMenu){
	var pageConfig = {
			route: {
				'bankcards/:type/:selectedId': 'launch'
			},
			templateName: 'bankcards',
			pageDataUrl: appConfig.bankcardsUrl
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
		}, {
			getter: 'getPageData',
			times: viewConfig.requireTimes.always
		}],
		getPageData: function() {
			this.service.getPageData();
		},
		onInstance: function() {

        },
		render: function(params, status) {
			this.setTemplateTag();
			if (status.operate == 'add') {
				var app = eBase.modules.get('app');
				this.pageData.cardInfoList.map(function (item) {
					item.bankIcon = appConfig.lcresPath+'/bof/app/style/images/bankicon/' + item.bankCode+'.png';
					return item;
				});
				this.manualLoadingTo(app.el, function(pageData, template) {
					return app.getHeaderHtml() + template(pageData);
				});
				/*************页面js start*************/
				var self = this,
					el = self.el;
				// 2.选取
                var banks = el.find('.top');
				Exp.stopClick(el.find('.top'),function(){
                    var selected = $(this),
                        index = selected.data('index'),
                        selectRecord = self.pageData.cardInfoList[index];
                    if(!selected.hasClass('bank-cant-selected')){
                        banks.removeClass('bank-selected');
                        selected.addClass('bank-selected');
                        Exp.setTimeout(function () {
                            self.goHome(selectRecord);
                            $('.wave').remove();
                        }, Exp.getVersion().ios?300:-1);
                    }
				});
                Exp.lazier({type:"image", parent:el}).start();
				Exp.clickActive(this.el);
				headerMenu.showDropMenu(this.el);
				/*************页面js end*************/
			} else {
				// fixed bug
				var self = this,
					$btns = this.el.find('.fc-notes .fc-btns');
					$btns.css({
						'display': '-webkit-box',
						'position': 'absolute'
					});
				if ($btns.length > 0) {
					setTimeout(function() {
						console.log($btns.length);
						$btns.css({
							'position': 'fixed'
						});
					}, 1000);
				}
			}

			headerMenu.setPageTitle(this.el.find('header'), '转出到');
		},
		goHome:function(selectRecord){
			var home = eBase.modules.get('view.transfer-out');
			// 返回上页并且重新获取数据
			if(home){
                var selectedId = selectRecord.selectedId;
				if(selectRecord){
					eBase.util.put('recordValide-'+selectedId, selectRecord);
				}
                home.refresh();
				eBase.PageRouter.go('#transfer-out/'+this.routeData[0]+'/'+selectedId);
			}
			else{
				eBase.PageRouter.go(-1);
			}
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
				data: {
                    productId: eBase.param('productId'),
                    fundFlag: eBase.param('fundFlag')
                },
				success: function(data){
					var list = data.cardInfoList,
						l = data.cardInfoList.length,
                        selectedId = view.routeData[1],
						item;
					for(var i=0; i<l;i++){
						item = list[i];
                        if(item.selectedId == selectedId){
							item.checked = true;
						}
                        if(item.balance-0==0){
                            item.cantSelected = true;
                        }
					}
					view.setPageData(data);
				}
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
});