//屏蔽缓存易付宝和融合出现卡死
var userAgent = window.navigator.userAgent.toLowerCase();
//compose.config({storage: !(userAgent.match(/snyifubao|ebuy-snyifubao/) && userAgent.match(/android/))});
compose.config({storage:false});
compose.require('scripts/app.js',
    [
	'style/css/autopay_coin.css',
	"scripts/lib/exp.js",
	"scripts/common/header.js",
	"scripts/eBase/eBase.js",
	"scripts/eBase/config.js",
	"scripts/eBase/extend.js",
	"scripts/eBase/layout.js",
	"scripts/eBase/util.js",
    "scripts/eBase/factory.js",
    "scripts/common/validate.js"
], function(css, Exp, headerMenu, eBase){
	//设置资源获取的router配置
	eBase.PageRouter.addResource({
		'': ['scripts/page/fund'],// 首页
		'quickpay-agree': ['scripts/page/quickpay-agree'],//快捷协议
		'signcontract-agree': ['scripts/page/signcontract-agree'],//签约协议
		'income-list': ['scripts/page/income-list'],//收益列表
        'transfer-out': ['scripts/page/transfer-out'],//转出
        'bankcards': ['scripts/page/bankcards'],
        'bank-detail': ['scripts/page/bank-detail'],
        'detail-more': ['scripts/page/detail-more'],

		'style1': ['scripts/page/ui/style1'],
		'style2': ['scripts/page/ui/style2'],
		'style3': ['scripts/page/ui/style3'],
		'style4': ['scripts/page/ui/style4'],
		'style5': ['scripts/page/ui/style5'],
	});
	var app = new eBase.PageView({
		tagName:'section',
		className:'page-app',
		background:false
	}, {
		onInstance: function(){
			$('.header-common').removeClass('hide');
			this.el.appendTo($(document.body));
			var pageLoading = $('.page-loading-box');
			eBase.PageRouter.setPageLoading(pageLoading);
			eBase.util.setPageLoadingbar();

            eBase.PageRouter.on('deactive', function () {
                eBase.util.execute();
            });

			//错误统一处理
			eBase.PageService
					.on('templateJsonFilter', errorFilter)
					.on('dataJsonFilter', errorFilter);
			function errorFilter(data, require){
				if(data &&  require.valide !== false ){
					var error = false, isFail = data.success === false;
					if(isFail){
						error = true;
					}
					if(isFail && data.responseMsg){
						eBase.util.showAlert(data.responseMsg, function () {
							if(isFail && (eBase.PageView.static.templateAjax ==require.type || require.goBack)){
								eBase.PageRouter.go(-1);
							}
						});
					}
					return error;
				}
			}
			function getContext() {
				return (compose&&compose.getContext()?compose.getContext():"");
			}
			eBase.extends(eBase.util, {
				getContext: getContext,
				/*
				* input错误样式
				* */
				errorTip: function  (el) {
					el.addClass("red")
						.off("focus", this.inputFocus)
						.on("focus", this.inputFocus);
				},
				inputFocus: function(){
					$(this).removeClass("red");
				},
				/*
				* 移除param中值为undefined的属性
				* */
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
				* inputclear
				* */
				createInputClears: function(inputs, options){
					var seletor = "input[type=text],input[type=password],input[type=url]";
					//inputs参数为空
					if(!inputs || inputs.is("input")){
						inputs = inputs || $(seletor);
					}
					//inputs参数为非input标签，默认为父元素
					else{
						inputs = inputs.find(seletor);
					}

					inputs.each(function(i, input){
						input = $(input);
						if(input.hasClass('no-clear')){
							return;
						}
						var clearIcon = $('<div class="tip-icon clearIcon"><i class="cut"></i></div>').insertAfter(input);
						if(options && options.right){
							clearIcon.css({
								'right':options.right
							});
						}
						clearIcon.css({
							top: 2.6
						});
						input.on("input", resetByValue);
						resetByValue();
						Exp.click(clearIcon, function(){
							input.val('').focus();
							input.trigger('input');
							clearIcon.hide();
						});
						function resetByValue(){
							if(input.val() === '') return;
							clearIcon.show();
						}

					});
				}

			}, true);
		},
		getHeaderHtml: function (headerType) {
            if(headerMenu.checkApp()){
                return '';
            }
            var headerClass;
            if(headerType == 'common'){
                headerClass = 'header-common';
            }else{
                headerClass = 'header-common header-fixed';
            }
            return '<div class="placeholder"></div><header class="'+headerClass+'">'
                +'<section>'
                +'<div class="goback"><i></i></div>'
                +'<div class="title"></div>'
                +'<div class="gomenu">'
                +'<div class="points-wrap">'
                +'<i class="points"></i>'
                +'</div>'
                +'</div>'
                +'</section>'
                +'<ul class="menu hide">'
                	+'<li data-clickActive data-href="'+LC_PATH + '/lcportal/app/index.htm"><i class="triangle-up"></i><i class="icon icon1"></i><span>理财首页</span></li>'
					+'<li data-clickActive data-href="'+LC_PATH + '/lcportal/app/index.htm?path=lazy-index"><i class="icon icon2"></i><span>我的理财</span></li>'
					+'<li data-clickActive data-href="'+BOF_PATH  + '/bof/app/hFiveBuy/myLqb.htm"><i class="icon icon3"></i><span>零钱宝</span></li>'
                +'</ul>'
                +'<div class="mask hide"></div>'
                +'</header>';
		}
	});
	eBase.modules.put('app', app);
	eBase.PageRouter.start();
	eBase.PageRouter.setRoot(app.el);
	Exp.createLoading.svg = $('.svg-circle-request');
})
