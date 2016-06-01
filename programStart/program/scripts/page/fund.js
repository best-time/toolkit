compose.require('scripts/page/fund.js', [
    'window.$',
    "scripts/lib/exp.js",
    "scripts/eBase/eBase.js",
    "scripts/common/header.js"
], function($, Exp, eBase, headerMenu){

    var objstr = ({}).toString,
        doc = document
        ;

    var pageConfig = {
            route: {
                '/:|index': 'launch'
            },
            templateName: 'fund',
            pageDataUrl: appConfig.fund
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
            }, {
                getter: 'getPageData',   //当前页面数据
                setter: 'setPageData',
                times: viewConfig.requireTimes.always
            }],
            getPageData: function () {
                this.service.getPageData();
            },
            setPageData: function (data) {
                this.pageData = data;
            },
            deactive: function () {
            },
            onInstance: function () {
            },
            render: function (params, status) {
                var tenThousandsIncome = +this.pageData.thousandsIncome;
                var el = this.el,
                    self = this,
                    that = this;

                var categoryData = this.pageData.category || [],
                    catLen = categoryData.length,
                    i = catLen
                    ;
                self.fetchNewRateAndTenThoundIncome(categoryData);
                self.fetchRateAndTenThoundIncome(categoryData);

                try{
                    eBase.util.put("categoryData", JSON.stringify(categoryData));
                }catch(e){
                    console.log(e.trace)
                }

                if (status.operate == 'add') {
                    var app = eBase.modules.get('app');

                    this.manualLoadingTo(app.el, function (pageData, template) {
                        return app.getHeaderHtml() + template(pageData);
                    });
                    Exp.clickActive();
                    var newUserCon = doc.getElementById("new-user-con"),
                        customerCon = doc.getElementById("customer-con");

                    if (!!newUserCon) {
                        Exp.inputTrim({
                            element: $("#coin-set-num"),
                            trimReg: /[1-9]\d*/ig
                        });
                        //transfer in
                        $("#transfer-in-but").on("click", function () {
                            window.location.href = basePath + 'bof/app/hFiveBuy/buyYinDao.htm';
                        });
                        self.setTransferMoney(tenThousandsIncome);
                    } else if (!!customerCon) {

                        if ($(".fund-switch-nav > li").length < 2) { //只买了一只，不展示nav
                            //$("#customer-con").css({paddingTop: ".2rem"})
                        }
                        if(+this.pageData.category[0].userAssets == 0) {
                            $(".set-button-out").removeAttr("id").find("span").addClass("no-out")
                        }
                        //select fund
                        $("#see-more-fund").on("click", function () {
                            window.location.href = basePath + "bof/app/hfive/showCytHodingLqbFund.htm";
                        });
                        //set balance
                        $("#set-fund-balance").on("click", function () {
                            window.location.href = basePath + "bof/app/bofConfig.htm";
                        });
                        if (!$(".fund-set-reserved-amount-0").hasClass("cur")) {
                            $(".fund-set-reserved-amount-0").prev(".line-30").hide();
                        }

                        Exp.stopClick($(".load-more"), function () {
                            var cid = $.trim($(this).data("cid"));
                            eBase.PageRouter.go("income-list/" + cid);
                        });

                        var navSlide = new Exp.sectionSlide('.cc-content', '.fund-switch-nav', '', {
                            pageFixed: true,
                            pageFixedPx: 1,
                            index: 0,
                            touchSlide: false,
                            callback: function (index) {

                                var $fundSet = $(".fund-set-reserved-amount-" + index);

                                if ($fundSet.hasClass("cur")) {
                                    $fundSet.show().siblings(".reserved-num").hide()
                                        .siblings(".line-30").show();
                                } else {
                                    $fundSet.siblings().hide()
                                }

                                var $canvas = $("#fund-trend-line-" + index).find("canvas");
                                //load only once
                                if (!($canvas && $canvas.length > 0)) {
                                    var seriesData = [], markPointData = {}, xAxisData = [],
                                        irArr = categoryData[index].interestRate || [],
                                        irLen = irArr.length,
                                        k = irLen
                                        ;
                                    while (k--) {
                                        seriesData.push(irArr[k].value);
                                        xAxisData.push(irArr[k].time.substr(5));
                                        markPointData = {
                                            value: irArr[0].time.substr(5),
                                            xAxis: irArr[0].time.substr(5),
                                            yAxis: irArr[0].value
                                        }
                                    }

                                    self.initLineChart("fund-trend-line-" + index,
                                        seriesData, markPointData, xAxisData, categoryData[index]);
                                }

                            }
                        });

                        while (i--) {
                            new Exp.sectionSlide('.content-trend-' + (catLen - i - 1),
                                '.switch-rate-profit-' + (catLen - i - 1), '',
                                {
                                    pageFixed: true,
                                    pageFixedPx: 100,
                                    index: 0,
                                    callback: function (index) {
                                    }
                                });
                        }

                        var productId = $(".fund-wrap").eq(0).data("cid");

                        //昨日收益
                        $("#about-pro-lists").on("click", function () {
                            window.location.href = basePath + 'bof/app/goToBofTrans.htm?' + appThemeNavType + '&productId=' + productId;
                        });
                        //资产列表
                        $("#pro-assets").on("click", function () {
                            window.location.href = basePath + 'bof/app/goToBofTrans.htm?' + appThemeNavType + '&productId=' + productId + '&buttonIndex=1';
                        });
                        //协议链接
                        $("#fund-treaty").on("click", function() {
                            window.location.href = basePath + 'bof/app/hFiveBuy/lqbJijin.htm?' + appThemeNavType + '&productId=' + productId;
                        });
                        //收益列表
                        $("#accu-income").on("click", function () {
                            window.location.href = basePath + 'bof/app/goToBofTrans.htm?' + appThemeNavType + '&productId=' + productId + '&buttonIndex=0';
                        });
                        //click the button about transfer money
                        $("#transfer-in-but").on("click", function () {
                            window.location.href = basePath + 'bof/app/hFiveBuy/buyToSg.htm?' + appThemeNavType + '&productId=' + productId;
                        });
                        $("#transfer-out-but").on("click", function () {
                            eBase.PageRouter.go('transfer-out&productId=' + productId);
                        });

                    }

                    //load the plugin of echarts
                    compose.require(['scripts/common/echarts.simple.min.js'], function (echarts) {
                        if (!!newUserCon) {
                            var initMoneyNum = +$("#coin-set-num").val();

                        } else if (!!customerCon) {

                            //show only the first line chart when the user enter the page first time
                            var seriesData = [], markPointData = {}, xAxisData = [],
                                irArr = categoryData[0].interestRate || [],
                                irLen = irArr.length,
                                k = irLen
                                ;
                            while (k--) {
                                seriesData.push(irArr[k].value);
                                xAxisData.push(irArr[k].time.substr(5));
                                markPointData = {
                                    value: irArr[0].time.substr(5),
                                    xAxis: irArr[0].time.substr(5),
                                    yAxis: irArr[0].value
                                }
                            }
                            self.initLineChart("fund-trend-line-0",
                                seriesData, markPointData, xAxisData, categoryData[0]);

                        }
                    });
                   // $(".switch-fund-cat").css("padding-top", '.1rem')
                    headerMenu.showDropMenu(this.el);
                } else {
                    console.log("no-add")
                }
                //router.on('active', function(){
                //    Exp.setTimeout(function () {
                //        foot.css('position', 'fixed');
                //    }, 3000)
                //});

                var foot = el.find(".fund-foot");
                if(foot.size()){
                    this.foot = foot;
                }
                else{
                    foot = this.foot;
                }
                router.on('deactive', function(){
                    foot&&foot.remove().removeClass('fund-foot-slideup');
                });
                if(foot && foot.size()){
                    Exp.setTimeout(function() {
                        el.append(foot);
                        Exp.setTimeout(function() {
                            foot.addClass('fund-foot-slideup');
                        });
                    }, 1000);
                }

                headerMenu.setPageTitle(this.el.find('header'), '零钱宝');
            },
            //line chart
            initLineChart: function (id, seriesData, markPointData, xAxisData, categoryData) {
                if (doc.getElementById(id)) {
                    echarts.dispose();
                    var initLine = echarts.init(document.getElementById(id));
                    initLine.setOption({
                        animationDuration: 1500,
                        series: [{
                            name: "七日年利率",
                            type: "line",
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    color: "#ccc"
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: "rgba(102,206,253, 0.4)"
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 2,
                                    color: "#64CEFE"
                                }
                            },
                            data: seriesData,
                            //[3.4820, 3.5325, 3.6120, 3.7820, 3.1526, 3.1820, 3.5820],
                            symbolSize: 0, //线上的小圆点
                            markPoint: {
                                symbol: "rect",
                                symbolSize: [45, 20],
                                symbolOffset: [0, -20],
//                        animation: true,
                                animationDuration: 3500,
                                itemStyle: {
                                    normal: {
                                        color: "#a9334c"
                                    }
                                },
                                data: [$.extend(true, {
                                    itemStyle: {
                                        normal: {
                                            color: "#459BF0",
                                            label: {
                                                textStyle: {
                                                    color: "#fff",
                                                    fontSize: "12"
                                                }
                                            }
                                        }
                                    }
                                }, markPointData)]
                            }
                        }],
                        xAxis: [{
                            type: "category",
                            splitLine: {
                                show: 0
                            },
                            axisLine: {
                                show: 1,
                                lineStyle: {
                                    color: "#ccc"
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            data: xAxisData,
                            //["04-18","04-19","04-20", "04-21","04-22","04-23","04-24"],
                            boundaryGap: false,
                            axisLabel: {
                                textStyle: {
                                    color: "#D1D1D1"
                                }
                            }
                        }],
                        yAxis: [{
                            type: "value",
                            show: !0,
                            min: (+categoryData.avgInterest - 0.5) < 0 ? 0 : (+categoryData.avgInterest - 0.5),
                            max: (+categoryData.avgInterest + 0.5),
                            splitNumber: 7,
                            //boundaryGap: [1, 2],
                            splitLine: {
                                show: 1,
                                lineStyle: {
                                    color: "#fff"
                                }
                            },
                            axisLabel: {
                                show: !0,
                                inside: !0,
                                formatter: function (v, a) {
                                    return v.toFixed(4);
                                },
                                textStyle: {
                                    color: "#CBCBCB"
                                }
                            },
                            axisTick: {
                                show: 0
                            },
                            axisLine: {
                                show: 0
                            }
                        }],
                        grid: {
                            borderWidth: 0,
                            x: 20, //左
                            y: 10,   //上
                            x2: 25, //右
                            y2: 40 // 下
                        }
                    });
                }
            },
            //some actions about money transfer
            setTransferMoney: function (tenThousandsIncome) {
                var timeoutId = null,
                    self = this,
                    oldVal = 10000,
                    $setNum = $("#coin-set-num");
                $setNum.val(10000);

                Exp.click($(".coin-add"), function () {
                    var oldVal, val;
                    val = oldVal = +$.trim($setNum.val());
                    val = val + 1000 > 1000000 ? 1000000 : val + 1000;
                    $setNum.val(val);
                    if (oldVal - val === 0) return;

                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                        $(".profit-num").text(((val / 10000) * tenThousandsIncome).toFixed(4));
                    }, 500);
                });

                Exp.click($(".coin-minus"), function () {
                    var oldVal, val;
                    val = oldVal = +$.trim($setNum.val());
                    val = val - 1000 <= 0 ? 0 : val - 1000;
                    $setNum.val(val);
                    if (oldVal - val === 0) return;

                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                        $(".profit-num").text(((val / 10000) * tenThousandsIncome).toFixed(4));
                    }, 500);
                });

                $setNum.on("blur", function () {
                    var $this = $(this),
                        val = +$.trim($this.val());
                    $this.val(val);

                    if (oldVal - val === 0) {
                        return;
                    } else {
                        oldVal = val;
                    }

                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                        $(".profit-num").text(((val / 10000) * tenThousandsIncome).toFixed(4));
                    }, 500);
                })
            },
            fetchNewRateAndTenThoundIncome: function (resData) {
                if (!objstr.call(resData) === '[object Array]') return;
                var len = resData.length,
                    i = -1;
                var rateSum, incomeSum, incomeListLen, interestRateLen, k, j;
                while (++i < len) {
                    resData[i].newIncome = (+resData[i].incomeList[0].value).toFixed(4);
                    resData[i].newRate = (+resData[i].interestRate[0].value).toFixed(4);
                }
            },
            //the average about Seven annual rate and 10 thousand accrual
            fetchRateAndTenThoundIncome: function (resData) {
                if (!objstr.call(resData) === '[object Array]') return;
                var len = resData.length;
                var i = -1;
                var rateSum, incomeSum, incomeListLen, interestRateLen, k, j;
                while (++i < len) {
                    rateSum = 0;
                    incomeSum = 0;
                    incomeListLen = resData[i].incomeList.length;
                    k = incomeListLen;
                    interestRateLen = resData[i].interestRate.length;
                    j = interestRateLen;
                    while (k--) {
                        incomeSum += +resData[i].incomeList[k].value;
                    }
                    resData[i].avgIncome = (incomeSum / incomeListLen).toFixed(4);
                    while (j--) {
                        rateSum += +resData[i].interestRate[j].value;
                    }
                    resData[i].avgInterest = (rateSum / interestRateLen).toFixed(4)
                }
            },
            //get string length
            getStrLength: function (str) {
                var cArr = (str + "").match(/[^\x00-\xff]/ig);
                return str.length + (cArr == null ? 0 : cArr.length);
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
                data: {type: 1},
                success: function (data) {
                    if (data.success) {
                        view.setPageData(data);
                    }
                },
                error: function () {

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
    };
});