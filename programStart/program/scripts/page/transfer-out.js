compose.require('scripts/page/transfer-out.js', [
    'window.$',
    "scripts/lib/exp.js",
    "scripts/eBase/eBase.js",
    "scripts/common/header.js"
], function($, Exp, eBase, headerMenu){
	var pageConfig = pageConfig = {
			route:{'transfer-out/:|type/:|selectedId': 'launch'},
			templateName: 'transfer-out',
			pageDataUrl: appConfig.transferOutPage
		},
		viewConfig = eBase.Config.view;
	var view = new eBase.PageView({
		tagName:'div',
		className: 'page'
	}, {
		requires:[{
			property:'templateHtml',
			times: viewConfig.requireTimes.once
		}, {
			getter: 'getPageData',
			setter: 'setPageData',
			times: viewConfig.requireTimes.always
		}],
		getPageData: function(){
			this.service.getPageData();
		},
		onInstance: function(){
            this.records = {};
		},
		render: function(params, status){
            var self = this,
                el = this.el,
                pageData = this.pageData,
                defaultCard = pageData.defaultCard,
                selectedId = params[1];
                recordValide = selectedId?
                    selectedId == defaultCard.selectedId ? defaultCard :
                        eBase.util.get('recordValide-'+selectedId) : null,
                currentRecord = pageData.recordValide,
                refresh = false;

            if(currentRecord && !recordValide || !currentRecord && recordValide || currentRecord && recordValide && currentRecord.selectedId != recordValide.selectedId){
                refresh = true;
            }
            if(selectedId && recordValide){
                //新生成记录
                currentRecord = pageData.recordValide = recordValide;
            }
            else{
                //新生成记录
                currentRecord = pageData.recordValide = Exp.extend({}, defaultCard);
            }
            currentRecord.realName = pageData.realName;
            var balance = currentRecord.balance,
                quickLimit = pageData.quickLimit,
                normalLimit = pageData.normalLimit,
                quickArrivalBalance = pageData.quickArrivalBalance;
            currentRecord.quickMax = this.minix(quickLimit-0, balance-0, quickArrivalBalance-0);
            currentRecord.normalMax = this.minix(balance-0, normalLimit-0);
            this.selectedTypeIndex = currentRecord.quickMax<=0||pageData.quickArrivalCount<=0?1: (this.routeData[0] || (pageData.arrivalMode - 1))-0;
            eBase.util.put('recordValide-' + currentRecord.selectedId, currentRecord);

			if(status.operate === 'add' || refresh){
				var app = eBase.modules.get('app');
                this.manualLoadingTo(app.el, function(pageData, template) {
                    return app.getHeaderHtml() + template(pageData);
                });
                this.setTemplateTag();

                /*************页面js start*************/
                if(el.css('display') == 'none'){
                    eBase.delay(function(){
                        self.addEvent();
                    }, eBase.Config.layout.noAnimate?0:150);
                }
                else{
                    self.addEvent();
                }
                if(pageData.defaultCard){
                    // 辅助功能-表单验证
                    setTimeout(function () {
                        $('.password').removeAttr('readonly');
                        self.validate();
                    }, 100);

                    // 跳转
                    Exp.stopClick(el.find('.fc-item'), function(){
                        eBase.PageRouter.go('bankcards/'+self.selectedTypeIndex+'/'+pageData.recordValide.selectedId);
                    });
                }
                eBase.util.createInputClears(el.find('.dl-phone input'));
                Exp.lazier({type:"image", parent:el}).start();

                /*************页面js end*************/
				Exp.clickActive(el);
				headerMenu.showDropMenu(el);
                eBase.PageRouter.prefetch('bank-detail');
			} else {}
			headerMenu.setPageTitle(el.find('header'), '转出');
		},
		addEvent: function(){
            var self = this,
                el = this.el,
                pageData = this.pageData,
                recordValide = pageData.recordValide;
			var sectionSlide = new Exp.sectionSlide(el.find('.content-box'), el.find('.caption ul'), el.find('.bg-on'),{
				loop: false,
				auto: false,
				pageFixed: true,
				pageFixedPx: 0,
				index: 0,
				callback : function(index){
                    eBase.PageRouter.go('#transfer-out/'+(index)+'/'+ self.pageData.recordValide.selectedId, eBase.Router.constants.NotraceOption);
                    self.selectedTypeIndex = index;
                    if(index === 0){
                        if(recordValide.quickMax<=0){
                            eBase.util.showAlert('今日零钱宝快速到账总额度已用完，请使用普通到账方式');
                        }
                        else if(pageData.quickArrivalCount<=0){
                            eBase.util.showAlert('您的快速到账机会已使用完，请选择普通到账或24点后再试');
                        }
                    }
				}
			});
            sectionSlide.goIndexDirect(self.selectedTypeIndex);
		},
        // 表单验证
        validate: function() {
            var self = this,
                el = self.el,
                amountValide = {
                    method: 'blur',
                    types: 'empty decimal',
                    property: "valideId",
                    msgs: ["请输入转出金额", "金额必须为数字"],
                    errorCallback: function (element) {
                        eBase.util.errorTip(element);
                    }
                },
                payPasswordValide = {
                    method: 'blur',
                    types: 'empty',
                    property: "valideId",
                    msgs: ["请输入易付宝支付密码"],
                    errorCallback: function (element) {
                        eBase.util.errorTip(element);
                    }
                };
            var $forms = el.find(".form"),
                btns = el.find('.fc-btn-blue'),
                pageData = this.pageData,
                recordValide = pageData.recordValide,
                $amounts = el.find('.amount'),
                $passwords = el.find('.password');
            $forms.forEach(function(form, index){
                form = $forms.eq(index);
                var $amount;
                if(index==0){
                    form.validate({
                        amount: amountValide,
                        payPassword: payPasswordValide
                    });
                    /*到账限制*/
                    $amount = el.find('#amount');
                }
                else{
                    form.validate({
                        amount2: amountValide,
                        payPassword2: payPasswordValide
                    });
                    /*普通到账限制*/
                    $amount = el.find('#amount2');

                }
                $amount.forEach(function (item) {
                    Exp.inputTrim({
                        element: $(item),
                        trimReg: /\w+(\.)?(\d{0,2})?/
                    });
                });
                $amount.on('input', function () {
                    var value = $amount.val(),
                        max = index==0?currentRecord.quickMax:currentRecord.normalMax;
                    value = (value||0)-0;
                    if(value>max-0){
                        $amount.val(max);
                        $amount.blur();
                        Exp.setTimeout(function () {
                            eBase.util.showAlert('本次到账每笔最高支持'+max+'元');
                        }, 200)
                    }
                });
                var startTime = new Date(), currentTime;
                new Exp.buttonChange({
                    button: btns.eq(index),
                    notClass: "btn-not",
                    yesClass: "btn-yes",
                    valideId: "valideId",
                    valideEl: form,
                    lisenerParent: form,
                    clickCallback: function(val){
                        $amounts.blur();
                        $passwords.blur();
                        if(val)return;
                        currentTime = new Date();
                        if(currentTime - startTime < 1000){
                            return;
                        }
                        startTime = currentTime;
                        var pageData = self.pageData,
                            record = self.pageData.recordValide;
                        //是否需要补充信息
                        eBase.util.put('bankInfo', record);
                        var paySubmitData = {
                            productId: eBase.param('productId'),
                            arrivalMode: index ? 2 : 1,
                            selectedId: record.selectedId,
                            share: $('#amount'+(index?'2':'')).val(),
                            secPassword: $('#payPassword'+(index?'2':'')).val(),
                            withdrawId: record.withdrawId
                        };
                        eBase.util.removeUndefined(paySubmitData);
                        eBase.util.put('paySubmitData', paySubmitData);
                        var type;
                        //银行卡 且 卡未补全 且 是提现卡 大于5w
                        if(record.isBankCard && !record.cardCompletion && paySubmitData.share-0 > pageData.quickLimit-0){
                            if(record.isWithdrawCard){
                                type = 5;
                            }
                            else{
                                if(record.cardNo){
                                    type=4
                                }
                                else{
                                    type=3
                                }
                            }
                            self.pop('completeTempl', {
                                msg: '普通到账方式超过'+pageData.quickLimit+'元需要补充银行卡信息，以确保您的资金安全',
                                confirmUrl: '#bank-detail/'+type+'/'+record.selectedId
                            });
                        }
                        //是快捷卡且为普通到账支付，跳转到补全资料 type值为3、4
                        else if(record.isBankCard && !record.isWithdrawCard && !record.cardCompletion){
                            //有卡号时（加密），不需要输入银行卡
                            if(index == 0){
                                //快速到账，又卡号为密文，否则为用户输入
                                if(record.cardNo){
                                    self.noNeedInput();
                                }
                                else{
                                    type=1
                                }
                            }
                            else if(index == 1){
                                //普通到账，有卡号为密文，否则为用户输入，且金额小于5w
                                if(paySubmitData.share-0 <= pageData.quickLimit-0){
                                    if(record.cardNo){
                                        self.noNeedInput();
                                    }
                                    else{
                                        type=1
                                    }
                                }
                                //金额大于5w
                                else{
                                    if(record.cardNo){
                                        type=4
                                    }
                                    else{
                                        type=3
                                    }
                                }
                            }
                            if(type){
                                self.pop('unbindTempl', {
                                    msg: '此卡已解绑，请补充必要信息以继续转出',
                                    confirmUrl: '#bank-detail/' + type + '/'+record.selectedId
                                });
                            }
                        }
                        else{
                            self.preparePay(paySubmitData, record);
                        }
                    }
                });
            });
        },
        pop: function(templateId, data, confirmCallback){
            var el = this.el;
            data = data || {};
            eBase.delay(function(){
                Exp.hideLoading();
                alertBox = Exp.openPopWindow(
                    el.find('#'+templateId),
                    data,
                    data.confirmUrl?function(){
                        window.location.href = data.confirmUrl;
                    }:confirmCallback?confirmCallback:null,
                    null,
                    {bgClickReset:false}
                );
                eBase.util.execute(function () {
                    alertBox.reset();
                })
            }, 200);
        }, 
        preparePay: function (data) {
            var self = this;
            service.pay(data, function(responseData){
                if(responseData.passwordError){
                    self.pop('pwdErrorTempl', {
                        msg: responseData.responseMsg,
                        confirmUrl: responseData.directUrl
                    });
                }
                else if(responseData.risking){
                    self.pop('riskTempl',{
                        msg: responseData.responseMsg,
                        confirmUrl: '##'
                    });
                }
                else if(responseData.realAuth){
                    self.pop('realAuthTempl',{
                        msg: responseData.responseMsg,
                        confirmUrl: responseData.directUrl
                    });
                }
                else if(responseData.responseMsg){
                    eBase.util.showAlert(responseData.responseMsg);
                }
                else{
                    eBase.PageRouter.prefetch('');
                    self.pop('successTempl', {
                        title: responseData.title,
                        title2: responseData.title2
                    }, function(){
                        var viewIndex = eBase.modules.get('view.fund');
                        if(viewIndex){
                            viewIndex.refresh(true);
                        }
                        Exp.setTimeout(function () {
                            eBase.PageRouter.go('#');
                        }, 500);
                    });
                }
            });
        },
        minix: function(){
            var list = Array.prototype.slice.apply(arguments),
                max = list[0];
            list.forEach(function (item) {
                if(max > item){
                    max = item;
                }
            });
            return max;
        },
        noNeedInput: function () {
            var self = this,
                bankDetailService = eBase.modules.get('service.bank-detail'),
                recordValide = self.pageData.recordValide;
            var params = {
                type: 2,
                selectedId: recordValide.selectedId,
                cardNo: recordValide.cardNo,
                isEncrypt: !!recordValide.cardNo
            };
            if(recordValide.withdrawId){
                params.withdrawId = recordValide.withdrawId;
            }
            bankDetailService.completeBankInfo(params, function(response){
                if(response.responseMsg){
                    eBase.util.showAlert(response.responseMsg);
                }
                else if (response.success) {
                    var paySubmitData = eBase.util.get('paySubmitData');
                    view.preparePay(eBase.extends({}, paySubmitData));
                }
            });
        }
	});

	var service = new eBase.PageService({
		view: view
	}, {
		onInstance: function(){
		},
		getTemplateHtml: function(){
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
                    if(data.defaultCard){
                        data.defaultCard.bankIcon = appConfig.lcresPath+'/bof/app/style/images/bankicon/' + data.defaultCard.bankCode+'.png';
                    }
                    view.setPageData(data);
                }
            });
        },
        pay: function(data, success) {
            this.authAjax({
                url: appConfig.transferOutSubmit,
                type: "POST",
                data: data,
                success: success
            });
        }
	});

	var router = new eBase.PageRouter({
		view: view
	}, {
		route: pageConfig.route,
		onInstance: function(){
		},
		launch: function(){
			this.view.render();
		}
	});
    (function(name) {
        eBase.modules.put('view.' + name, view);
        eBase.modules.put('service.' + name, service);
        eBase.modules.put('router.' + name, router);
    })(pageConfig.templateName);
});

