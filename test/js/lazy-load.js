;
!function(win, doc) {
    'use strict';

    var _css1compat = 'CSS1Compat',
        compatMode = doc.compatMode === _css1compat;
    
    function eazyLoad(opts) {
        this.height;
        this.elScrollTop;
        this.download_list = [];
        this.download_count = 0;
    }
    
    eazyLoad.prototype = {
        constructor: eazyLoad,
        init: function() {
            var _this = this;
            _this.handleImgList();
            // _this.lazyLoad();
            window.onload = function () {
                // setTimeout(function () {
                    _this.lazyLoad();
                // }, 80)
            };
            window.addEventListener('scroll', function() {
                // setTimeout(function () {
                    _this.lazyLoad();
                // }, 80)
            }, false);

        },
        lazyLoad: function() {
            if(!this.download_count) return;
            var viewport = this.getViewport();
            var scrollTop = this.getScrollTop();
            var downloadLen = this.download_list.length;
            
            for(var i = 0; i < downloadLen; i++) {
                var elViewport = this.getEleViewTop(this.download_list[i])
                if(elViewport - scrollTop < viewport) {
                    this.download_list[i].src = this.download_list[i].getAttribute('lazy-src');
                    delete this.download_list[i];
                    this.download_count--
                }
            }
        },
        handleImgList: function() {
            var imgList = doc.getElementsByTagName('img'),
                imgListLen = imgList.length;
            for(var i = 0; i < imgListLen; i++) {
                if(imgList[i].getAttribute('lazy-src')) {
                    this.download_list.push(imgList[i]);
                    this.download_count++;
                }
            }
        },
        getViewport: function() {
            // if(doc.compatMode === _css1compat) {
            //     this.height = doc.documentElement.clientHeight()
            // } else {
            //     this.height = doc.body.clientHeight()
            // }
            this.height = compatMode ? doc.documentElement.clientHeight : doc.body.clientHeight
            return this.height
        },
        getScrollTop: function() {
            // if(doc.compatMode === _css1compat) {
            //     this.elScrollTop = doc.body.scrollTop()
            // } else {
            //     this.elScrollTop = doc.documentElement.scrollTop()
            // }
            this.elScrollTop = compatMode ? doc.body.scrollTop : doc.documentElement.scrollTop;
            return this.elScrollTop
        },
        getEleViewTop: function(el) {
            if(!!el) {
                var actualTop = el.offsetTop,
                    elParent = el.offsetParent;
                while(elParent != null) {
                    actualTop += elParent.offsetTop;
                    elParent = elParent.offsetParent
                }
                return actualTop - this.getScrollTop()
            }
        }
    };
    
    win.eazyLoad = eazyLoad;
}(window, document, undefined);