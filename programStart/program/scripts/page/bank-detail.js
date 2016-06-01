compose.require('scripts/page/bank-detail.js', [
    'window.$',
    'style/css/mobiscroll.custom-2.17.0.min.css',
    "scripts/lib/exp.js",
    "scripts/eBase/eBase.js",
    "scripts/common/header.js",
    'scripts/common/mobiscroll.custom-2.17.0.min.js'
], function($, css, Exp, eBase, headerMenu, mobiscroll){
	var pageConfig = {
			route: {
				'bank-detail/:type/:selectId': 'launch'
			},
			templateName: 'bank-detail'
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
                if(!eBase.modules.get('view.transfer-out')){
                    eBase.delay(function () {
                        eBase.PageRouter.go(-1);
                    }, 0);
                }
				service.setBankDetail();
                this.pageData.type = params[0];
				var app = eBase.modules.get('app');
				this.manualLoadingTo(app.el, function(pageData, template) {
					return app.getHeaderHtml() + template(pageData);
				});
				this.setTemplateTag();
				this.addValide();
                this.setAddress();
				/*************页面js end*************/
				Exp.clickActive(this.el);
				headerMenu.showDropMenu(this.el);

			}
			headerMenu.setPageTitle(this.el.find('header'), '补充卡信息');
		},
		addValide: function() {
			var self = this,
				$form = this.el.find("#inputForm"),
				bankInfo = this.pageData,
				$button = this.el.find(".confirm");
            var assressDetail = this.el.find('.address');
			$form.validate({
                'address': {
                    property: "valideId",
                    method: 'blur',
                    types: 'empty',
                    msgs: ['请选择省市'],
                    condition: function (value) {
                        var names = assressDetail.data('name');
                        var msg = '请选择省市';
                        if(value == 'undefined'){
                            return msg;
                        }
                        if(!names.match(/\S+,\S+/)){
                            return msg;
                        }
                    },
                    errorCallback: function () {}
                },
                cardNo: {
                    method: "blur",
                    types: "empty maxlength",
                    minlength: 18,
                    maxlength: 23,
                    property: "valideId",
                    msgs: ["请填写银行卡号", "请填写正确的银行卡号"],
                    condition: function (value) {
                        if (value) {
                            value = value.replace(/\s/g, '');
                            if (value && (!value.match(/^\d+$/) || value.length < 15)) {
                                return "银行卡号至少包含15位数字";
                            }
                        }
                    },
                    errorCallback: function (element) {
                        eBase.util.errorTip(element);
                    }
                },
				bankName: {
					method: "blur",
					types: "empty maxlength",
					maxlength: 50,
					property: "valideId",
					msgs: ["请填写支行全称"],
					errorCallback: function (element) {
						eBase.util.errorTip($(element));
					}
				},
                bankUnit: {
					method: 'blur',
					types: 'empty maxlength',
                    regs:[/\d{12}/],
                    maxlength: 12,
					property: "valideId",
					msgs: ["请填写支行联行号", "请填写正确的支行联行号", "请填写正确的支行联行号"],
					errorCallback: function (element) {
						eBase.util.errorTip(element);
					}
				}
			});
            var startTime = new Date(), currentTime;
			new Exp.buttonChange({
				button: $button,
				notClass: "btn-not",
				yesClass: "btn-yes",
				valideId: "valideId",
				errorClass: "red",
				valideEl: $form,
				lisenerParent: $form,
				clickCallback: function (val) {
                    if(val)return;
                    currentTime = new Date();
                    if(currentTime - startTime < 1000){
                        return;
                    }
                    startTime = currentTime;
                    self.toValidateCode();
                }
			});

			eBase.util.createInputClears(this.el.find('.input-box input:not(.address)'));
            $(this.el).find('#cardNo').on('input', function () {
                this.value =this.value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
            });


            Exp.stopClick(this.el.find('.cancel'), function () {
                eBase.PageRouter.go(-1);
            });
		},
		/*
		 * 切换到validateCode之前的验证和请求
		 **/
		toValidateCode: function () {
			var routeData = this.routeData,
                pageData = this.pageData,
                el = this.el,
                cardNo = el.find('#cardNo'),
                address = el.find('.address'),
                bankName = el.find('#bankName'),
                bankUnit = el.find('#bankUnit'),
                addressVal = address.data('name')?address.data('name').split(','):[];
			var inputs = pageData.inputs = {
                type: routeData[0],
                selectedId: routeData[1],
                withdrawId: pageData.withdrawId,
                cardNo: cardNo.size()?cardNo.val().replace(/\s/g,''):pageData.cardNo,
                isEncrypt: !!pageData.cardNo,
                province: addressVal[0],
                city: addressVal[1],
                branchInfo: bankName.val(),
                lineNumber: bankUnit.val()
			};
			eBase.util.removeUndefined(inputs);
			service.completeBankInfo(inputs, function(response){
				if(response.responseMsg){
					eBase.util.showAlert(response.responseMsg);
				}
                else if (response.success) {
                    var paySubmitData = eBase.util.get('paySubmitData'),
                        transferOutView = eBase.modules.get('view.transfer-out');
                    transferOutView.preparePay(eBase.extends({}, paySubmitData));
                }
            });
		},
        /*
         * 地址选择
         * */
        setAddress: function () {
            var self = this,
                $address = self.el.find('.address');
            if(!$address.size()){
                return;
            }
                var types = ['prov', 'city'],
                    typeIndex = 0,
                //存放地址集合
                    addresses = {},
                    texts= [],
                    codes = [],
                    values = [];

                var $address = self.el.find('.address').mobiscroll().select({
                    theme: "android-holo-light",
                    lang: "zh",
                    display:"bottom",
                    mode: "scroller",
                    minWidth: 200,
                    maxWidth: 750,
                    data: [],
                    dataText: 'name',
                    dataValue: 'code',
                    headerText:'选择省',
                    placeholder: '开户银行省份/城市',
                    onInit: function (inst) {
                        self.address = inst;
                        //inst.setVal([]);
                    },
                    buttons: [
                        'set'
                    ],
                    onShow: function (el, data, inst) {
                        eBase.util.execute(function () {
                            inst.hide();
                        })
                    },
                    onSelect : function(valueText, inst) {
                        var value = inst.getVal();
                        values[typeIndex] = value;
                        texts[typeIndex] = valueText;

                        texts = texts.slice(0, typeIndex+1);
                        codes = codes.slice(0, typeIndex+1);
                        //设置提交的值
                        inst.settings.data.some(function (item) {
                            if(item.code == value){
                                codes[typeIndex] = item.code;
                            }
                        });
                        $address.val(codes.join(','));
                        $address.data('name', texts.join(','));

                        //设置展示的值
                        typeIndex++;
                        inst.settings.anchor.val(texts.join(' '));
                        var startTime = new Date();
                        if(typeIndex>=2){
                            typeIndex = 0;
                            self.getData(types[typeIndex], 0, addresses);
                        }
                        else{
                            var data = inst.settings.data;
                            if(data){
                                var id = '';
                                data.some(function (item) {
                                    if(item.code === value){
                                        return id = item.id;
                                    }
                                });
                            }

                            self.getData(types[typeIndex], id, addresses, function(data){
                                eBase.delay(function() {
                                    if(data.length){
                                        inst.show();
                                    }
                                    else{
                                        typeIndex = 0;
                                    }
                                }, 1000, startTime);
                            });
                        }
                    }
                });
                self.getData(types[typeIndex], 0, addresses);
        },
        getData : function(type, id, addresses, callback) {
            var self = this;
            setTimeout(function() {
            if(addresses[id]){
                var data = addresses[id];
                self.setData(type, data);
                if(callback){
                    callback(data.data);
                }
            }
            else{
                var http = window.location.href.match(/\w+/)[0];
                $.ajax( {
                    url : http+'://www.suning.com/emall/SNAddressQueryCmd',
                    type : 'GET',
                    data : {
                        state : type,
                        selectId : id
                    },
                    dataType : 'jsonp',
                    jsonp : 'callback',
                    success : function(json) {
                        //对已有数据进行缓存
                        var data = json.data;
                        if(data && data.length){
                            addresses[id] = json;
                            self.setData(type, json);
                        }
                        if(callback){
                            callback(data);
                        }
                    },
                    error : function() {
                        setTimeout(function () {
                            self.getData(type, id, addresses, callback);
                        }, 1000);
                    }
                });
            }
            }, 100)
        },
        setData : function(type, json) {
            json = json.data;
            if(type == 'prov'){
                this.address.settings.headerText = '选择省';
            }
            else if(type == 'city'){
                this.address.settings.headerText = '选择市';
            }
            else if(type == 'area'){
                this.address.settings.headerText = '选择区';
            }
            //var json = JSON.stringify(json).replace(/id/g, 'value');
            //var json = JSON.parse(json);
            this.address.settings.data = json;
            this.address.settings.parseValue(json[0].code);
            this.address.refresh();
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
		setBankDetail: function(){
			var data = eBase.util.get('recordValide-' + view.routeData[1]);
			if (data) {
				view.setPageData(data);
			}
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
        completeBankInfo: function(data, success) {
            this.authAjax({
                url: appConfig.bankInfoSubmit,
                type: "POST",
                data: data,
                success: success
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