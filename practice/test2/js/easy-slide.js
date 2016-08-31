;
!function (win, doc) {
    'use strict';

    // var win = window,
    //     doc = document;

    var delayTime = 200
        ;
    var startX, startY, distX, distY, scrollY;

    var index = 0, oldIndex = index;

    var isTouch = 'ontouchstart' in win;

    var conBox = qs('.__slide-content__');
    var conDom = conBox.children,
        conSize = conDom.length;
    var slideWidth = qs('.__slide-content__').clientWidth;

    qs('.__slide-content__').style.cssText = 'position: relative; width: ' + conSize * slideWidth + 'px; \
        overflow:hidden;';

    for (var i = 0; i < conSize; i++) {
        conDom[i].style.cssText = 'display: table-cell; vertical-align: top;width: ' + slideWidth + 'px';
    }


    var navDom = qs('.__switch-nac__').children,
        navSize = navDom.length;

    function orientationChange() {

        slideWidth = qs('.__easy-slide__').clientWidth;
        console.log(slideWidth)
        qs('.__slide-content__').style.width = conSize * slideWidth + 'px';

        for (var i = 0; i < conSize; i++) {
            conDom[i].style.width = slideWidth + 'px';
        }
        // var ind = effect == "leftLoop" ? index + 1 : index;
        translate(-index * slideWidth, 0);
    }

    window.addEventListener('resize', orientationChange, false);


    //给切换添加事件
    for (var i = 0; i < navSize; i++) {
        (function () {
            var j = i;

            if (index == j) navDom[j].className = 'on';

            navDom[j].addEventListener('click', function () {

                index = j;
                doPlay();

            }, false);
        })()
    }

    conBox.addEventListener('touchstart', tStart, false);

    function tStart(e) {
        e.preventDefault();
        scrollY = undefined;
        distX = 0;

        e = isTouch ? e.targetTouches[0] : e;
        startX = e.pageX;
        startY = e.pageY;

        console.log(startX, startY);

        conBox.addEventListener('touchmove', tMove, false);
        conBox.addEventListener('touchend', tEnd, false);

    }

    function tMove(e) {
        e.preventDefault();
        e = isTouch ? e.targetTouches[0] : e;
        distX = e.pageX - startX;
        distY = e.pageY - startY;

        if (typeof scrollY == 'undefined') {
            scrollY = !!( scrollY || Math.abs(distX) < Math.abs(distY) );
        }
        if (!scrollY) {
            if (
                (index == 0 && distX > 0) ||   //第一页 继续向右侧 拖动
                (index >= conSize - 1 && distX < 0 ) //尾页 继续向左侧 拖动
            ) {

                distX = distX * 0.3; //到首页或尾页, 拖动div块,给人一种 '拖不动的感觉'
            }

            translate(-index * slideWidth + distX, 0);
        }

    }

    function tEnd(e) {
        e.preventDefault();

        if (distX == 0) {
            return;
        }
        if (!scrollY) {

            if (Math.abs(distX) > slideWidth / 10) {
                distX > 0 ? index-- : index++;
            }

            doPlay(true);

        }

        conBox.removeEventListener('touchmove', tMove, false);
        conBox.removeEventListener('touchend', tEnd, false);
    }

    function doPlay(isTouch) {

        if (index >= navSize) {
            index = isTouch ? index - 1 : 0;
        } else if (index < 0) {
            index = isTouch ? 0 : navSize - 1;
        }
        // if (sLoad != null) {
        //     doSwitchLoad(0)
        // }
        translate((-index * slideWidth), delayTime);
        oldIndex = index;
    }


    function translate(dist, speed, ele) {
        ele = ele ? ele.style : conBox.style;

        ele.webkitTransitionDuration =
            ele.MozTransitionDuration =
                ele.msTransitionDuration =
                    ele.OTransitionDuration =
                        ele.transitionDuration = speed + 'ms';

        // ele.webkitTransform = 'translate3d(' + dist + 'px,0)' + 'translateZ(0)';
        ele.webkitTransform = 'translate3d(' + dist + 'px,0,0)';
        ele.msTransform =
            ele.MozTransform =
                ele.OTransform = 'translateX(' + dist + 'px)';

    }

    function qs(selector) {
        return doc.querySelector(selector)
    }

    function qsa(selector) {
        return doc.querySelectorAll(selector)
    }





    function eSlide(opts) {
        var slideContent = opts.slideContent || '', //滑动区
            navContent = opts.navContent || '', //导航区
            delayTime = opts.delayTime || 200,
            defaultIndex = opts.defaultIndex || 0,

            startFunc = opts.startFunc || null,
            endFunc = opts.endFunc || null

            ;

        var isTouch = 'ontouchstart' in win;
        var startX, startY, distX, distY, scrollY;


    }

    eSlide.prototype = {
        constructor: eSlide,
        getId: function (selector) {
            return doc.getElementById(selector)
        },
        qs: function (selector) {
            return doc.querySelector(selector)
        },
        qsa: function (selector) {
            return doc.querySelectorAll(selector)
        },
        hasClass: function (selector, className) {
            return selector.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
        },
        addClass: function (selector, className) {
            if (!hasClass(selector, className)) {
                selector.className = ' ' + className;
            }
        },
        removeClass: function (selector, className) {
            if (hasClass(selector, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                selector.className = selector.className.replace(reg, ' ')
            }
        }
    };

    win.eSlide = eSlide;

}(window, document, undefined);