compose.require('scripts/eBase/layout.js',[
    'window.$',
    'scripts/eBase/eBase.js',
    "scripts/lib/exp.js"
], function ($, eBase, Exp) {
    "use strict";
    eBase.Layout = function Layout(options){
        options = options || {};
        this.list = [];
        this.current = {};
        this.instance.apply(this, arguments);
        this.timeCaller = null;
        this.noAnimate = eBase.Config.layout.noAnimate;
        this.$body = $(document.body);
        if(this.noAnimate){
            this.$body.addClass('page-no-animate');
        }
        this.version = Exp.getVersion();
    }
    eBase.extends(eBase.Layout, {
        extend: eBase.extend,
        optionsAdd: 'add',
        optionsDel: 'del',
        optionsAddDel: 'addAndDel',
        optionsNoChange: 'noChange'
    });
    eBase.extends(eBase.Layout.prototype, eBase.Event(), {
        instance: function(){

        }
    });

    eBase.DislocationLayout = eBase.Layout.extend({
        current: {},
        instance: function(options){

        },
        active: function(){

        },
        add: function(router, event){
            var ret = this.handleRoute(router, event),
                list = this.list,
                current = this.current,
                prouter = current.router;


            if(!ret){
                list.push(router);
                var deactive = eBase.PageRouter.trigger('deactive', {
                    router: router,
                    prouter: prouter,
                    operate: eBase.Layout.optionsAdd
                });
                this.current = {
                    index: list.length - 1,
                    router: router,
                    blankRouter: prouter && prouter.blank && this.current
                };
                if(deactive===true){
                    return;
                }
                //第一次不需要动画
                if(prouter){
                    if(prouter.deactive){
                        prouter.deactive({
                            operate: 'hidden'
                        });
                    }
                    this.handleAddRouter(router, prouter, list,
                            list.length - 1, current.index, event);
                }
            }
            else{
                var addIndex = ret.index;
                if(ret.opt === eBase.Layout.optionsNoChange){
                    router.blankRouter = prouter && prouter.blank && prouter;
                    current.router = router;
                    return;
                }

                var mids = list.slice(addIndex+1, current.index+1);
                this.list = list.slice(0, addIndex+1);
                var deactive = eBase.PageRouter.trigger('deactive', {
                    router: router,
                    prouter: prouter,
                    removes:mids,
                    operate: eBase.Layout.optionsDel
                });
                this.current = {
                    index: addIndex,
                    router: router
                };

                if(deactive===true){
                    return;
                }
                if(ret.opt === eBase.Layout.optionsAddDel){
                    router.view.el.addClass('page-add-prev-ani');
                    router.view.el.insertBefore(ret.nextRouter.view.el);
                }
                if(prouter && prouter.deactive){
                    prouter.deactive({
                        operate: 'remove'
                    });
                }
                this.handleDeleteRouter(router, prouter, mids,
                    addIndex, current.index, event);
            }

        },
        handleRoute: function(router, event){
            var list = this.list,
                ret,
                has,
                optType,
                self = this;
            if(list.length){
                list.some(function(item, index){
                    if(item.getHash() === router.getHash()){
                        //替换真实router
                        if(!(item instanceof eBase.Router) || self.current.router === router){
                            list[index] = router;
                            optType = eBase.Layout.optionsNoChange;
                        }

                        ret = {
                            index: index,
                            curRouter: router,
                            opt: optType || eBase.Layout.optionsDel
                        };
                        return true;
                    }
                });

                if(event && event.replace){
                    var detoryRouter = list[list.length-1];
                    if(detoryRouter&&detoryRouter.hash.match(new RegExp('(?:#|^)'+event.replace+'[^\/]*$'))){
                        self.destroy(detoryRouter);
                        detoryRouter.destroy();
                    }
                }

                if(!ret){
                    var nList, self = this;
                    list.some(function (item, index) {
                        if(item.getHash().indexOf(router.getHash())>=0){
                            has = router,
                                nList = list.slice(0, index);
                            nList.push(router);
                            self.list = list = nList.concat(list.slice(index));
                            if(self.current.index >= index){
                                self.current.index++;
                            }
                            ret = {
                                index: index,
                                curRouter: router,
                                nextRouter: list[index+1],
                                opt: eBase.Layout.optionsAddDel
                            }
                            return true;
                        }
                    })
                }
                return ret;
            }
            else{
                return false;
            }

        },
        addBlankElement: function(el, event){
            function blank(){}
            this.blankRoute = {
                view: {
                    el: el,
                    render: blank,
                    status:{
                        init: true,
                        destory: false
                    },
                    getStatus: function(prop){
                        if(prop === undefined){
                            return this.status;
                        }
                        return this.status[prop];
                    }
                },
                hash: eBase.PageRouter.getHash(),
                getHash: function () {
                    return this.hash;
                },
                destroy: function () {
                    this.view.status.destory = true;
                },
                blank: true
            }
            this.add(this.blankRoute, event);
        },
        destroy: function(router){
            var list = this.list, l = list.length;
            while(l){
                l--;
                if(list[l] === router){
                    this.list = list.slice(0, l).concat(list.slice(l+1));
                    break;
                }
            }
        },
        removeBlankElement: function(){
            this.blankRoute = null;
        },
        handleAddRouter: function(current, prev, list, currentIndex, prevIndex, event){
            var cel = current.view.el,
                pel = prev.view.el,
                noAnimate = this.noAnimate;
            if(current){
                if(prev.setScrollTop){
                    prev.setScrollTop(document.body.scrollTop);
                }
                animate();
                if(current.view.render){
                    if(event && event.type == eBase.Router.constants.NotraceOption){
                        update();
                    }
                    else{
                        this.updateTimeCaller(update, cel, noAnimate?-1:null);
                    }
                }
            }
            function animate() {
                cel.removeClass('page-hidden').addClass('page-ani')
                    .removeClass('page-add-prev-ani page-del-ani page-del-prev-ani');
                cel.addClass('page-add-ani');
                if(prev){
                    pel.removeClass('page-hidden').addClass('page-add-prev-ani')
                        .removeClass('page-add-ani page-del-ani page-del-prev-ani');
                }
            }
            function update(force){
                window.scrollTo(0, 0);
                if(!current.view.getStatus('destory')){
                    pel.addClass('page-hidden');
                }
                cel.removeClass('page-ani page-add-ani');

            }
        },
        handleDeleteRouter: function(current, prev, list, currentIndex, prevIndex, event){
            var cel = current && current.view.el,
                pel = prev && prev.view.el,
                self = this,
                noAnimate = this.noAnimate;
            if(current !== prev){
                if(prev){
                    var scroll = document.body.scrollTop,
                        clone = noAnimate?null:pel.clone().css({
                            'margin-top': -scroll,
                            'position': 'fixed',
                            'z-index':'10000'
                        }).removeClass('page-ani page-add-ani page-add-prev-ani page-del-ani page-del-prev-ani').appendTo(pel.parent());
                    /*if(clone){
                        var pImages = pel.find('img'), pImage, cImageParent, pImageParent;
                        clone.find('img').forEach(function (cImage, index) {
                            pImage = pImages[index];
                            cImageParent = cImage.parentElement;
                            pImage && cImageParent && cImageParent.replaceChild(pImage, cImage);
                            if(pImage){
                                pImageParent = pImage.parentElement;
                                cImage && pImageParent && pImageParent.replaceChild(cImage, pImage);
                            }
                        });
                    }*/
                    if(noAnimate){
                        pel.addClass('page-hidden');
                        cel.removeClass('page-hidden');
                    }
                    var time = noAnimate?-1:navigator.userAgent.match(/(Android.*MQQBrowser)/)?100:50,
                        version = this.version;

                    eBase.delay(function(){
                        cel.removeClass('page-hidden');
                        eBase.delay(function () {
                            if(version.ucDisguise && !version.ios){
                                eBase.delay(handleClone, 150);
                            }
                            else{
                                handleClone();
                            }
                            cel.addClass('page-del-ani').removeClass('page-add-ani page-add-prev-ani page-del-prev-ani');


                            if(current.getScrollTop){
                                window.scrollTo(0, current.getScrollTop());
                            }
                            var mids = list
                            mids.forEach(function (item, index) {
                                self.destroy(item);
                                item.destroy();
                                item.view.el.removeClass('page-hidden page-add-prev-ani page-del-ani page-del-prev-ani').addClass('page-ani');
                            });
                            if(prev){
                                self.destroy(prev);
                                prev.destroy({
                                    remainEl: true
                                });
                                var blankRouter = prev && prev.blankRouter;
                                if(blankRouter){
                                    delete prev.blankRouter;
                                    blankRouter.destroy();
                                }
                            }
                            if(current.view.render){
                                if(event && event.type == eBase.Router.constants.NotraceOption){
                                    update();
                                }
                                else{
                                    self.updateTimeCaller(update, pel);
                                }
                            }
                            function update(force){
                                if(!force){
                                    //pel.remove().show();
                                    eBase.off(pel);
                                    clone && clone.remove();
                                }
                                if(force){
                                    eBase.off(pel);
                                    clone && Exp.setTimeout(function(){clone.remove();}, 300);
                                }
                                cel.removeClass('page-hidden page-ani page-del-ani');
                            }
                        }, time);
                    }, time)
                }
                eBase.util.hideLoading();
            }
            function handleClone(){
                clone && clone.addClass('page-del-prev-ani')
                    .removeClass('page-hidden page-add-ani page-add-prev-ani page-del-ani');
            }

        },
        /*
         * 定时器管理
         * @param {Func} callback 回调方法
         * @param {Zepto|Element} el 元素对象
         * */
        updateTimeCaller: function(callback, el, time){
            var self = this;
            if(this.timeCaller){
                if(this.timeCaller.el === el){
                    clearTimeout(this.timeCaller.timer);
                    this.timeCaller.callback(true);
                }
                this.timeCaller = null;
            }
            if(time<0){
                callback();
            }
            else{
                this.timeCaller = {
                    timer: setTimeout(function(){
                        if(callback){
                            callback();
                        }
                        self.timeCaller = null;
                    }, time || eBase.Config.layout.animateDuration),
                    callback: callback,
                    el: el
                };
            }

        },
        hasHistory: function(){
            return !!this.list.length;
        },
        hasRouter: function(fragment){
            var list = this.list;
            return list.some(function (item) {
                if(item.getHash() == fragment || item.getHash() == '#'+fragment){
                    return item;
                }
            });
        },
        isAddFirstPage: function(){
            var list = this.list,
                current = this.current;
            return list.length == 0 || list.length == 1 && list[0].hash == eBase.PageRouter.getHash();
        }
    });
    return eBase;
});