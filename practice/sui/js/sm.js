/*!
 * =====================================================
 * SUI Mobile - http://m.sui.taobao.org/
 *
 * =====================================================
 */
; $.smVersion = "0.6.2";
+function ($) {
    "use strict";

    //全局配置
    var defaults = {
        autoInit: false, //自动初始化页面
        showPageLoadingIndicator: true, //push.js加载页面的时候显示一个加载提示
        router: true, //默认使用router
        swipePanel: "left", //滑动打开侧栏
        swipePanelOnlyClose: true  //只允许滑动关闭，不允许滑动打开侧栏
    };

    $.smConfig = $.extend(defaults, $.config);

}(Zepto);

+ function($) {
    "use strict";

    //比较一个字符串版本号
    //a > b === 1
    //a = b === 0
    //a < b === -1
    $.compareVersion = function(a, b) {
        var as = a.split('.');
        var bs = b.split('.');
        if (a === b) return 0;

        for (var i = 0; i < as.length; i++) {
            var x = parseInt(as[i]);
            if (!bs[i]) return 1;
            var y = parseInt(bs[i]);
            if (x < y) return -1;
            if (x > y) return 1;
        }
        return -1;
    };

    $.getCurrentPage = function() {
        return $(".page-current")[0] || $(".page")[0] || document.body;
    };

}(Zepto);

/* global WebKitCSSMatrix:true */

(function($) {
    "use strict";
    ['width', 'height'].forEach(function(dimension) {
        var  Dimension = dimension.replace(/./, function(m) {
            return m[0].toUpperCase();
        });
        $.fn['outer' + Dimension] = function(margin) {
            var elem = this;
            if (elem) {
                var size = elem[dimension]();
                var sides = {
                    'width': ['left', 'right'],
                    'height': ['top', 'bottom']
                };
                sides[dimension].forEach(function(side) {
                    if (margin) size += parseInt(elem.css('margin-' + side), 10);
                });
                return size;
            } else {
                return null;
            }
        };
    });

    //support
    $.support = (function() {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };

    $.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }

        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }

        return curTransform || 0;
    };
    /* jshint ignore:start */
    $.requestAnimationFrame = function (callback) {
        if (requestAnimationFrame) return requestAnimationFrame(callback);
        else if (webkitRequestAnimationFrame) return webkitRequestAnimationFrame(callback);
        else if (mozRequestAnimationFrame) return mozRequestAnimationFrame(callback);
        else {
            return setTimeout(callback, 1000 / 60);
        }
    };
    $.cancelAnimationFrame = function (id) {
        if (cancelAnimationFrame) return cancelAnimationFrame(id);
        else if (webkitCancelAnimationFrame) return webkitCancelAnimationFrame(id);
        else if (mozCancelAnimationFrame) return mozCancelAnimationFrame(id);
        else {
            return clearTimeout(id);
        }
    };
    /* jshint ignore:end */

    $.fn.dataset = function() {
        var dataset = {},
            ds = this[0].dataset;
        for (var key in ds) { // jshint ignore:line
            var item = (dataset[key] = ds[key]);
            if (item === 'false') dataset[key] = false;
            else if (item === 'true') dataset[key] = true;
            else if (parseFloat(item) === item * 1) dataset[key] = item * 1;
        }
        // mixin dataset and __eleData
        return $.extend({}, dataset, this[0].__eleData);
    };
    $.fn.data = function(key, value) {
        var tmpData = $(this).dataset();
        if (!key) {
            return tmpData;
        }
        // value may be 0, false, null
        if (typeof value === 'undefined') {
            // Get value
            var dataVal = tmpData[key],
                __eD = this[0].__eleData;

            //if (dataVal !== undefined) {
            if (__eD && (key in __eD)) {
                return __eD[key];
            } else {
                return dataVal;
            }

        } else {
            // Set value,uniformly set in extra ```__eleData```
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                // delete multiple data in dataset
                if (key in tmpData) delete el.dataset[key];

                if (!el.__eleData) el.__eleData = {};
                el.__eleData[key] = value;
            }
            return this;
        }
    };
    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this;// jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }
    $.fn.animationEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };
    $.fn.transitionEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        return this;
    };
    $.fn.transition = function(duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };
    $.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
        }
        return this;
    };
    $.fn.prevAll = function (selector) {
        var prevEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.previousElementSibling) {
            var prev = el.previousElementSibling;
            if (selector) {
                if($(prev).is(selector)) prevEls.push(prev);
            }
            else prevEls.push(prev);
            el = prev;
        }
        return $(prevEls);
    };
    $.fn.nextAll = function (selector) {
        var nextEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.nextElementSibling) {
            var next = el.nextElementSibling;
            if (selector) {
                if($(next).is(selector)) nextEls.push(next);
            }
            else nextEls.push(next);
            el = next;
        }
        return $(nextEls);
    };

    //重置zepto的show方法，防止有些人引用的版本中 show 方法操作 opacity 属性影响动画执行
    $.fn.show = function(){
        var elementDisplay = {};
        function defaultDisplay(nodeName) {
            var element, display;
            if (!elementDisplay[nodeName]) {
                element = document.createElement(nodeName);
                document.body.appendChild(element);
                display = getComputedStyle(element, '').getPropertyValue("display");
                element.parentNode.removeChild(element);
                display === "none" && (display = "block");
                elementDisplay[nodeName] = display;
            }
            return elementDisplay[nodeName];
        }

        return this.each(function(){
            this.style.display === "none" && (this.style.display = '');
            if (getComputedStyle(this, '').getPropertyValue("display") === "none");
            this.style.display = defaultDisplay(this.nodeName);
        });
    };
})(Zepto);

/*===========================
Device/OS Detection
===========================*/
;(function ($) {
    "use strict";
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
            (ipod || iphone) &&
            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os) {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }

    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    // keng..
    device.isWeixin = /MicroMessenger/i.test(ua);

    $.device = device;
})(Zepto);



/*======================================================
************   Modals   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
    "use strict";
    var _modalTemplateTempDiv = document.createElement('div');

    $.modalStack = [];

    $.modalStackClearQueue = function () {
        if ($.modalStack.length) {
            ($.modalStack.shift())();
        }
    };
    $.modal = function (params) {
        params = params || {};
        var modalHTML = '';
        var buttonsHTML = '';
        if (params.buttons && params.buttons.length > 0) {
            for (var i = 0; i < params.buttons.length; i++) {
                buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
            }
        }
        var extraClass = params.extraClass || '';
        var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
        var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
        var afterTextHTML = params.afterText ? params.afterText : '';
        var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
        var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
        modalHTML = '<div class="modal ' + extraClass + ' ' + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $(defaults.modalContainer).append(modal[0]);

        // Add events on buttons
        modal.find('.modal-button').each(function (index, el) {
            $(el).on('click', function (e) {
                if (params.buttons[index].close !== false) $.closeModal(modal);
                if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                if (params.onClick) params.onClick(modal, index);
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.alert = function (text, title, callbackOk) {
        if (typeof title === 'function') {
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [ {text: defaults.modalButtonOk, bold: true, onClick: callbackOk} ]
        });
    };
    $.confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [
                {text: defaults.modalButtonCancel, onClick: callbackCancel},
                {text: defaults.modalButtonOk, bold: true, onClick: callbackOk}
            ]
        });
    };
    $.prompt = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                if (index === 0 && callbackCancel) callbackCancel($(modal).find('.modal-text-input').val());
                if (index === 1 && callbackOk) callbackOk($(modal).find('.modal-text-input').val());
            }
        });
    };
    $.modalLogin = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" name="modal-username" placeholder="' + defaults.modalUsernamePlaceholder + '" class="modal-text-input modal-text-input-double"><input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input modal-text-input-double">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(username, password);
                if (index === 1 && callbackOk) callbackOk(username, password);
            }
        });
    };
    $.modalPassword = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(password);
                if (index === 1 && callbackOk) callbackOk(password);
            }
        });
    };
    $.showPreloader = function (title) {
        $.hidePreloader();
        $.showPreloader.preloaderModal = $.modal({
            title: title || defaults.modalPreloaderTitle,
            text: '<div class="preloader"></div>'
        });

        return $.showPreloader.preloaderModal;
    };
    $.hidePreloader = function () {
        $.showPreloader.preloaderModal && $.closeModal($.showPreloader.preloaderModal);
    };
    $.showIndicator = function () {
        if ($('.preloader-indicator-modal')[0]) return;
        $(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
    };
    $.hideIndicator = function () {
        $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
    };
    // Action Sheet
    $.actions = function (params) {
        var modal, groupSelector, buttonSelector;
        params = params || [];

        if (params.length > 0 && !$.isArray(params[0])) {
            params = [params];
        }
        var modalHTML;
        var buttonsHTML = '';
        for (var i = 0; i < params.length; i++) {
            for (var j = 0; j < params[i].length; j++) {
                if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                var button = params[i][j];
                var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                if (button.bold) buttonClass += ' actions-modal-button-bold';
                if (button.color) buttonClass += ' color-' + button.color;
                if (button.bg) buttonClass += ' bg-' + button.bg;
                if (button.disabled) buttonClass += ' disabled';
                buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
                if (j === params[i].length - 1) buttonsHTML += '</div>';
            }
        }
        modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $(defaults.modalContainer).append(modal[0]);
        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';

        var groups = modal.find(groupSelector);
        groups.each(function (index, el) {
            var groupIndex = index;
            $(el).children().each(function (index, el) {
                var buttonIndex = index;
                var buttonParams = params[groupIndex][buttonIndex];
                var clickTarget;
                if ($(el).is(buttonSelector)) clickTarget = $(el);
                // if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

                if (clickTarget) {
                    clickTarget.on('click', function (e) {
                        if (buttonParams.close !== false) $.closeModal(modal);
                        if (buttonParams.onClick) buttonParams.onClick(modal, e);
                    });
                }
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.popup = function (modal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            var _modal = document.createElement('div');
            _modal.innerHTML = modal.trim();
            if (_modal.childNodes.length > 0) {
                modal = _modal.childNodes[0];
                if (removeOnClose) modal.classList.add('remove-on-close');
                $(defaults.modalContainer).append(modal);
            }
            else return false; //nothing found
        }
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        modal.find(".content").scroller("refresh");
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);

        return modal[0];
    };
    $.pickerModal = function (pickerModal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof pickerModal === 'string' && pickerModal.indexOf('<') >= 0) {
            pickerModal = $(pickerModal);
            if (pickerModal.length > 0) {
                if (removeOnClose) pickerModal.addClass('remove-on-close');
                $(defaults.modalContainer).append(pickerModal[0]);
            }
            else return false; //nothing found
        }
        pickerModal = $(pickerModal);
        if (pickerModal.length === 0) return false;
        pickerModal.show();
        $.openModal(pickerModal);
        return pickerModal[0];
    };
    $.loginScreen = function (modal) {
        if (!modal) modal = '.login-screen';
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);
        return modal[0];
    };
    //显示一个消息，会在2秒钟后自动消失
    $.toast = function(msg, duration, extraclass) {
        var $toast = $('<div class="modal toast ' + (extraclass || '') + '">' + msg + '</div>').appendTo(document.body);
        $.openModal($toast, function(){
            setTimeout(function() {
                $.closeModal($toast);
            }, duration || 2000);
        });
    };
    $.openModal = function (modal, cb) {
        modal = $(modal);
        var isModal = modal.hasClass('modal'),
            isNotToast = !modal.hasClass('toast');
        if ($('.modal.modal-in:not(.modal-out)').length && defaults.modalStack && isModal && isNotToast) {
            $.modalStack.push(function () {
                $.openModal(modal, cb);
            });
            return;
        }
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');
        var isToast = modal.hasClass('toast');
        if (isModal) {
            modal.show();
            modal.css({
                marginTop: - Math.round(modal.outerHeight() / 2) + 'px'
            });
        }
        if (isToast) {
            modal.css({
                marginLeft: - Math.round(modal.outerWidth() / 2 / 1.185) + 'px' //1.185 是初始化时候的放大效果
            });
        }

        var overlay;
        if (!isLoginScreen && !isPickerModal && !isToast) {
            if ($('.modal-overlay').length === 0 && !isPopup) {
                $(defaults.modalContainer).append('<div class="modal-overlay"></div>');
            }
            if ($('.popup-overlay').length === 0 && isPopup) {
                $(defaults.modalContainer).append('<div class="popup-overlay"></div>');
            }
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        }

        //Make sure that styles are applied, trigger relayout;
        var clientLeft = modal[0].clientLeft;

        // Trugger open event
        modal.trigger('open');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).addClass('with-picker-modal');
        }

        // Classes for transition in
        if (!isLoginScreen && !isPickerModal && !isToast) overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');
        });
        // excute callback
        if (typeof cb === 'function') {
          cb.call(this);
        }
        return true;
    };
    $.closeModal = function (modal) {
        modal = $(modal || '.modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var isModal = modal.hasClass('modal'),
            isPopup = modal.hasClass('popup'),
            isToast = modal.hasClass('toast'),
            isLoginScreen = modal.hasClass('login-screen'),
            isPickerModal = modal.hasClass('picker-modal'),
            removeOnClose = modal.hasClass('remove-on-close'),
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        if (isPopup){
            if (modal.length === $('.popup.modal-in').length) {
                overlay.removeClass('modal-overlay-visible');
            }
        }
        else if (!(isPickerModal || isToast)) {
            overlay.removeClass('modal-overlay-visible');
        }

        modal.trigger('close');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).removeClass('with-picker-modal');
            $(defaults.modalContainer).addClass('picker-modal-closing');
        }

        modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');

            if (isPickerModal) {
                $(defaults.modalContainer).removeClass('picker-modal-closing');
            }
            if (isPopup || isLoginScreen || isPickerModal) {
                modal.removeClass('modal-out').hide();
                if (removeOnClose && modal.length > 0) {
                    modal.remove();
                }
            }
            else {
                modal.remove();
            }
        });
        if (isModal &&  defaults.modalStack ) {
            $.modalStackClearQueue();
        }

        return true;
    };
    function handleClicks(e) {
        /*jshint validthis:true */
        var clicked = $(this);
        var url = clicked.attr('href');


        //Collect Clicked data- attributes
        var clickedData = clicked.dataset();

        // Popup
        var popup;
        if (clicked.hasClass('open-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup';
            $.popup(popup);
        }
        if (clicked.hasClass('close-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup.modal-in';
            $.closeModal(popup);
        }

        // Close Modal
        if (clicked.hasClass('modal-overlay')) {
            if ($('.modal.modal-in').length > 0 && defaults.modalCloseByOutside)
                $.closeModal('.modal.modal-in');
            if ($('.actions-modal.modal-in').length > 0 && defaults.actionsCloseByOutside)
                $.closeModal('.actions-modal.modal-in');

        }
        if (clicked.hasClass('popup-overlay')) {
            if ($('.popup.modal-in').length > 0 && defaults.popupCloseByOutside)
                $.closeModal('.popup.modal-in');
        }




    }
    $(document).on('click', ' .modal-overlay, .popup-overlay, .close-popup, .open-popup, .close-picker', handleClicks);
    var defaults =  $.modal.prototype.defaults  = {
        modalStack: true,
        modalButtonOk: '确定',
        modalButtonCancel: '取消',
        modalPreloaderTitle: '加载中',
        modalContainer : document.body
    };
}(Zepto);

/*======================================================
************   Calendar   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
    "use strict";
    var rtl = false;
    var Calendar = function (params) {
        var p = this;
        var defaults = {
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            firstDay: 1, // First day of the week, Monday
            weekendDays: [0, 6], // Sunday and Saturday
            multiple: false,
            dateFormat: 'yyyy-mm-dd',
            direction: 'horizontal', // or 'vertical'
            minDate: null,
            maxDate: null,
            touchMove: true,
            animate: true,
            closeOnSelect: true,
            monthPicker: true,
            monthPickerTemplate:
                '<div class="picker-calendar-month-picker">' +
                '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' +
                '<div class="current-month-value"></div>' +
                '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' +
                '</div>',
            yearPicker: true,
            yearPickerTemplate:
                '<div class="picker-calendar-year-picker">' +
                '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' +
                '<span class="current-year-value"></span>' +
                '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' +
                '</div>',
            weekHeader: true,
            // Common settings
            scrollToInput: true,
            inputReadOnly: true,
            toolbar: true,
            toolbarCloseText: 'Done',
            toolbarTemplate:
                '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                '{{monthPicker}}' +
                '{{yearPicker}}' +
                // '<a href="#" class="link close-picker">{{closeText}}</a>' +
                '</div>' +
                '</div>',
            /* Callbacks
               onMonthAdd
               onChange
               onOpen
               onClose
               onDayClick
               onMonthYearChangeStart
               onMonthYearChangeEnd
               */
        };
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;

        // Is horizontal
        p.isH = p.params.direction === 'horizontal';

        // RTL inverter
        var inverter = p.isH ? (rtl ? -1 : 1) : 1;

        // Animating flag
        p.animating = false;

        // Format date
        function formatDate(date) {
            date = new Date(date);
            var year = date.getFullYear();
            var month = date.getMonth();
            var month1 = month + 1;
            var day = date.getDate();
            var weekDay = date.getDay();
            return p.params.dateFormat
                .replace(/yyyy/g, year)
                .replace(/yy/g, (year + '').substring(2))
                .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
                .replace(/m/g, month1)
                .replace(/MM/g, p.params.monthNames[month])
                .replace(/M/g, p.params.monthNamesShort[month])
                .replace(/dd/g, day < 10 ? '0' + day : day)
                .replace(/d/g, day)
                .replace(/DD/g, p.params.dayNames[weekDay])
                .replace(/D/g, p.params.dayNamesShort[weekDay]);
        }


        // Value
        p.addValue = function (value) {
            if (p.params.multiple) {
                if (!p.value) p.value = [];
                var inValuesIndex;
                for (var i = 0; i < p.value.length; i++) {
                    if (new Date(value).getTime() === new Date(p.value[i]).getTime()) {
                        inValuesIndex = i;
                    }
                }
                if (typeof inValuesIndex === 'undefined') {
                    p.value.push(value);
                }
                else {
                    p.value.splice(inValuesIndex, 1);
                }
                p.updateValue();
            }
            else {
                p.value = [value];
                p.updateValue();
            }
        };
        p.setValue = function (arrValues) {
            p.value = arrValues;
            p.updateValue();
        };
        p.updateValue = function () {
            p.wrapper.find('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
            var i, inputValue;
            for (i = 0; i < p.value.length; i++) {
                var valueDate = new Date(p.value[i]);
                p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
            }
            if (p.params.onChange) {
                p.params.onChange(p, p.value, p.value.map(formatDate));
            }
            if (p.input && p.input.length > 0) {
                if (p.params.formatValue) inputValue = p.params.formatValue(p, p.value);
                else {
                    inputValue = [];
                    for (i = 0; i < p.value.length; i++) {
                        inputValue.push(formatDate(p.value[i]));
                    }
                    inputValue = inputValue.join(', ');
                }
                $(p.input).val(inputValue);
                $(p.input).trigger('change');
            }
        };

        // Columns Handlers
        p.initCalendarEvents = function () {
            var col;
            var allowItemClick = true;
            var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;
            function handleTouchStart (e) {
                if (isMoved || isTouched) return;
                // e.preventDefault();
                isTouched = true;
                touchStartX = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date()).getTime();
                percentage = 0;
                allowItemClick = true;
                isScrolling = undefined;
                startTranslate = currentTranslate = p.monthsTranslate;
            }
            function handleTouchMove (e) {
                if (!isTouched) return;

                touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (typeof isScrolling === 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
                }
                if (p.isH && isScrolling) {
                    isTouched = false;
                    return;
                }
                e.preventDefault();
                if (p.animating) {
                    isTouched = false;
                    return;
                }
                allowItemClick = false;
                if (!isMoved) {
                    // First move
                    isMoved = true;
                    wrapperWidth = p.wrapper[0].offsetWidth;
                    wrapperHeight = p.wrapper[0].offsetHeight;
                    p.wrapper.transition(0);
                }
                e.preventDefault();

                touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
                percentage = touchesDiff/(p.isH ? wrapperWidth : wrapperHeight);
                currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;

                // Transform wrapper
                p.wrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');

            }
            function handleTouchEnd (e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;

                touchEndTime = new Date().getTime();
                if (touchEndTime - touchStartTime < 300) {
                    if (Math.abs(touchesDiff) < 10) {
                        p.resetMonth();
                    }
                    else if (touchesDiff >= 10) {
                        if (rtl) p.nextMonth();
                        else p.prevMonth();
                    }
                    else {
                        if (rtl) p.prevMonth();
                        else p.nextMonth();
                    }
                }
                else {
                    if (percentage <= -0.5) {
                        if (rtl) p.prevMonth();
                        else p.nextMonth();
                    }
                    else if (percentage >= 0.5) {
                        if (rtl) p.nextMonth();
                        else p.prevMonth();
                    }
                    else {
                        p.resetMonth();
                    }
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleDayClick(e) {
                if (!allowItemClick) return;
                var day = $(e.target).parents('.picker-calendar-day');
                if (day.length === 0 && $(e.target).hasClass('picker-calendar-day')) {
                    day = $(e.target);
                }
                if (day.length === 0) return;
                if (day.hasClass('picker-calendar-day-selected') && !p.params.multiple) return;
                if (day.hasClass('picker-calendar-day-disabled')) return;
                if (day.hasClass('picker-calendar-day-next')) p.nextMonth();
                if (day.hasClass('picker-calendar-day-prev')) p.prevMonth();
                var dateYear = day.attr('data-year');
                var dateMonth = day.attr('data-month');
                var dateDay = day.attr('data-day');
                if (p.params.onDayClick) {
                    p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay);
                }
                p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
                if (p.params.closeOnSelect) p.close();
            }

            p.container.find('.picker-calendar-prev-month').on('click', p.prevMonth);
            p.container.find('.picker-calendar-next-month').on('click', p.nextMonth);
            p.container.find('.picker-calendar-prev-year').on('click', p.prevYear);
            p.container.find('.picker-calendar-next-year').on('click', p.nextYear);
            p.wrapper.on('click', handleDayClick);
            if (p.params.touchMove) {
                p.wrapper.on($.touchEvents.start, handleTouchStart);
                p.wrapper.on($.touchEvents.move, handleTouchMove);
                p.wrapper.on($.touchEvents.end, handleTouchEnd);
            }

            p.container[0].f7DestroyCalendarEvents = function () {
                p.container.find('.picker-calendar-prev-month').off('click', p.prevMonth);
                p.container.find('.picker-calendar-next-month').off('click', p.nextMonth);
                p.container.find('.picker-calendar-prev-year').off('click', p.prevYear);
                p.container.find('.picker-calendar-next-year').off('click', p.nextYear);
                p.wrapper.off('click', handleDayClick);
                if (p.params.touchMove) {
                    p.wrapper.off($.touchEvents.start, handleTouchStart);
                    p.wrapper.off($.touchEvents.move, handleTouchMove);
                    p.wrapper.off($.touchEvents.end, handleTouchEnd);
                }
            };


        };
        p.destroyCalendarEvents = function (colContainer) {
            if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
        };

        // Calendar Methods
        p.daysInMonth = function (date) {
            var d = new Date(date);
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        };
        p.monthHTML = function (date, offset) {
            date = new Date(date);
            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();
            if (offset === 'next') {
                if (month === 11) date = new Date(year + 1, 0);
                else date = new Date(year, month + 1, 1);
            }
            if (offset === 'prev') {
                if (month === 0) date = new Date(year - 1, 11);
                else date = new Date(year, month - 1, 1);
            }
            if (offset === 'next' || offset === 'prev') {
                month = date.getMonth();
                year = date.getFullYear();
            }
            var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
                daysInMonth = p.daysInMonth(date),
                firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
            if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;

            var dayDate, currentValues = [], i, j,
                rows = 6, cols = 7,
                monthHTML = '',
                dayIndex = 0 + (p.params.firstDay - 1),
                today = new Date().setHours(0,0,0,0),
                minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
                maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null;

            if (p.value && p.value.length) {
                for (i = 0; i < p.value.length; i++) {
                    currentValues.push(new Date(p.value[i]).setHours(0,0,0,0));
                }
            }

            for (i = 1; i <= rows; i++) {
                var rowHTML = '';
                var row = i;
                for (j = 1; j <= cols; j++) {
                    var col = j;
                    dayIndex ++;
                    var dayNumber = dayIndex - firstDayOfMonthIndex;
                    var addClass = '';
                    if (dayNumber < 0) {
                        dayNumber = daysInPrevMonth + dayNumber + 1;
                        addClass += ' picker-calendar-day-prev';
                        dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                    }
                    else {
                        dayNumber = dayNumber + 1;
                        if (dayNumber > daysInMonth) {
                            dayNumber = dayNumber - daysInMonth;
                            addClass += ' picker-calendar-day-next';
                            dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                        }
                        else {
                            dayDate = new Date(year, month, dayNumber).getTime();
                        }
                    }
                    // Today
                    if (dayDate === today) addClass += ' picker-calendar-day-today';
                    // Selected
                    if (currentValues.indexOf(dayDate) >= 0) addClass += ' picker-calendar-day-selected';
                    // Weekend
                    if (p.params.weekendDays.indexOf(col - 1) >= 0) {
                        addClass += ' picker-calendar-day-weekend';
                    }
                    // Disabled
                    if ((minDate && dayDate < minDate) || (maxDate && dayDate > maxDate)) {
                        addClass += ' picker-calendar-day-disabled';
                    }

                    dayDate = new Date(dayDate);
                    var dayYear = dayDate.getFullYear();
                    var dayMonth = dayDate.getMonth();
                    rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + (addClass) + '" data-date="' + (dayYear + '-' + dayMonth + '-' + dayNumber) + '"><span>'+dayNumber+'</span></div>';
                }
                monthHTML += '<div class="picker-calendar-row">' + rowHTML + '</div>';
            }
            monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + '</div>';
            return monthHTML;
        };
        p.animating = false;
        p.updateCurrentMonthYear = function (dir) {
            if (typeof dir === 'undefined') {
                p.currentMonth = parseInt(p.months.eq(1).attr('data-month'), 10);
                p.currentYear = parseInt(p.months.eq(1).attr('data-year'), 10);
            }
            else {
                p.currentMonth = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-month'), 10);
                p.currentYear = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-year'), 10);
            }
            p.container.find('.current-month-value').text(p.params.monthNames[p.currentMonth]);
            p.container.find('.current-year-value').text(p.currentYear);

        };
        p.onMonthChangeStart = function (dir) {
            p.updateCurrentMonthYear(dir);
            p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
            var currentIndex = dir === 'next' ? p.months.length - 1 : 0;

            p.months.eq(currentIndex).addClass('picker-calendar-month-current');
            p.months.eq(dir === 'next' ? currentIndex - 1 : currentIndex + 1).addClass(dir === 'next' ? 'picker-calendar-month-prev' : 'picker-calendar-month-next');

            if (p.params.onMonthYearChangeStart) {
                p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
            }
        };
        p.onMonthChangeEnd = function (dir, rebuildBoth) {
            p.animating = false;
            var nextMonthHTML, prevMonthHTML, newMonthHTML;
            p.wrapper.find('.picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)').remove();

            if (typeof dir === 'undefined') {
                dir = 'next';
                rebuildBoth = true;
            }
            if (!rebuildBoth) {
                newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir);
            }
            else {
                p.wrapper.find('.picker-calendar-month-next, .picker-calendar-month-prev').remove();
                prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'prev');
                nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'next');
            }
            if (dir === 'next' || rebuildBoth) {
                p.wrapper.append(newMonthHTML || nextMonthHTML);
            }
            if (dir === 'prev' || rebuildBoth) {
                p.wrapper.prepend(newMonthHTML || prevMonthHTML);
            }
            p.months = p.wrapper.find('.picker-calendar-month');
            p.setMonthsTranslate(p.monthsTranslate);
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
            }
            if (p.params.onMonthYearChangeEnd) {
                p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
            }
        };
        p.setMonthsTranslate = function (translate) {
            translate = translate || p.monthsTranslate || 0;
            if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
            p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
            var prevMonthTranslate = -(translate + 1) * 100 * inverter;
            var currentMonthTranslate = -translate * 100 * inverter;
            var nextMonthTranslate = -(translate - 1) * 100 * inverter;
            p.months.eq(0).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            p.months.eq(1).transform('translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)').addClass('picker-calendar-month-current');
            p.months.eq(2).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
        };
        p.nextMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr('data-month'), 10);
            var nextYear = parseInt(p.months.eq(p.months.length - 1).attr('data-year'), 10);
            var nextDate = new Date(nextYear, nextMonth);
            var nextDateTime = nextDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.maxDate) {
                if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate --;
            if (nextMonth === p.currentMonth) {
                var nextMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
                var nextMonthHTML = $(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
                p.wrapper.append(nextMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('next');
            var translate = (p.monthsTranslate * 100) * inverter;

            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd('next');
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('next');
            }
        };
        p.prevMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var prevMonth = parseInt(p.months.eq(0).attr('data-month'), 10);
            var prevYear = parseInt(p.months.eq(0).attr('data-year'), 10);
            var prevDate = new Date(prevYear, prevMonth + 1, -1);
            var prevDateTime = prevDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.minDate) {
                if (prevDateTime < new Date(p.params.minDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate ++;
            if (prevMonth === p.currentMonth) {
                var prevMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
                var prevMonthHTML = $(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
                p.wrapper.prepend(prevMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.months.eq(0)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('prev');
            var translate = (p.monthsTranslate * 100) * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd('prev');
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('prev');
            }
        };
        p.resetMonth = function (transition) {
            if (typeof transition === 'undefined') transition = '';
            var translate = (p.monthsTranslate * 100) * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
        };
        p.setYearMonth = function (year, month, transition) {
            if (typeof year === 'undefined') year = p.currentYear;
            if (typeof month === 'undefined') month = p.currentMonth;
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var targetDate;
            if (year < p.currentYear) {
                targetDate = new Date(year, month + 1, -1).getTime();
            }
            else {
                targetDate = new Date(year, month).getTime();
            }
            if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
                return false;
            }
            if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
                return false;
            }
            var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
            var dir = targetDate > currentDate ? 'next' : 'prev';
            var newMonthHTML = p.monthHTML(new Date(year, month));
            p.monthsTranslate = p.monthsTranslate || 0;
            var prevTranslate = p.monthsTranslate;
            var monthTranslate, wrapperTranslate;
            var transitionEndCallback = p.animating ? false : true;
            if (targetDate > currentDate) {
                // To next
                p.monthsTranslate --;
                if (!p.animating) p.months.eq(p.months.length - 1).remove();
                p.wrapper.append(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate - 1) * 100 * inverter;
                p.months.eq(p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
            }
            else {
                // To prev
                p.monthsTranslate ++;
                if (!p.animating) p.months.eq(0).remove();
                p.wrapper.prepend(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate + 1) * 100 * inverter;
                p.months.eq(0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            }
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
            }
            p.animating = true;
            p.onMonthChangeStart(dir);
            wrapperTranslate = (p.monthsTranslate * 100) * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd(dir, true);
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd(dir);
            }
        };
        p.nextYear = function () {
            p.setYearMonth(p.currentYear + 1);
        };
        p.prevYear = function () {
            p.setYearMonth(p.currentYear - 1);
        };


        // HTML Layout
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;

            var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0,0,0,0);
            var prevMonthHTML = p.monthHTML(layoutDate, 'prev');
            var currentMonthHTML = p.monthHTML(layoutDate);
            var nextMonthHTML = p.monthHTML(layoutDate, 'next');
            var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + '</div></div>';
            // Week days header
            var weekHeaderHTML = '';
            if (p.params.weekHeader) {
                for (i = 0; i < 7; i++) {
                    var weekDayIndex = (i + p.params.firstDay > 6) ? (i - 7 + p.params.firstDay) : (i + p.params.firstDay);
                    var dayName = p.params.dayNamesShort[weekDayIndex];
                    weekHeaderHTML += '<div class="picker-calendar-week-day ' + ((p.params.weekendDays.indexOf(weekDayIndex) >= 0) ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';

                }
                weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + '</div>';
            }
            pickerClass = 'picker-modal picker-calendar ' + (p.params.cssClass || '');
            var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
            if (p.params.toolbar) {
                toolbarHTML = p.params.toolbarTemplate
                    .replace(/{{closeText}}/g, p.params.toolbarCloseText)
                    .replace(/{{monthPicker}}/g, (p.params.monthPicker ? p.params.monthPickerTemplate : ''))
                    .replace(/{{yearPicker}}/g, (p.params.yearPicker ? p.params.yearPickerTemplate : ''));
            }

            pickerHTML =
                '<div class="' + (pickerClass) + '">' +
                toolbarHTML +
                '<div class="picker-modal-inner">' +
                weekHeaderHTML +
                monthsHTML +
                '</div>' +
                '</div>';


            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            // 安卓微信webviewreadonly的input依然弹出软键盘问题修复
            if ($.device.isWeixin && $.device.android && p.params.inputReadOnly) {
                /*jshint validthis:true */
                this.focus();
                this.blur();
            }
            if (p.opened) return;
            p.open();
            if (p.params.scrollToInput) {
                var pageContent = p.input.parents('.content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;

                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
        }
        function closeOnHTMLClick(e) {
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
            }
            else {
                if ($(e.target).parents('.picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.on('click', openOnInput);
                }
            }

        }

        if (!p.inline) $('html').on('click', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) p.input.parents('.content').css({'padding-bottom': ''});
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.destroyCalendarEvents();
        }

        p.opened = false;
        p.open = function () {
            var updateValue = false;
            if (!p.opened) {
                // Set date value
                if (!p.value) {
                    if (p.params.value) {
                        p.value = p.params.value;
                        updateValue = true;
                    }
                }

                // Layout
                p.layout();

                // Append
                if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                }
                else {
                    p.container = $($.pickerModal(p.pickerHTML));
                    $(p.container)
                        .on('close', function () {
                            onPickerClose();
                        });
                }

                // Store calendar instance
                p.container[0].f7Calendar = p;
                p.wrapper = p.container.find('.picker-calendar-months-wrapper');

                // Months
                p.months = p.wrapper.find('.picker-calendar-month');

                // Update current month and year
                p.updateCurrentMonthYear();

                // Set initial translate
                p.monthsTranslate = 0;
                p.setMonthsTranslate();

                // Init events
                p.initCalendarEvents();

                // Update input value
                if (updateValue) p.updateValue();

            }

            // Set flag
            p.opened = true;
            p.initialized = true;
            if (p.params.onMonthAdd) {
                p.months.each(function () {
                    p.params.onMonthAdd(p, this);
                });
            }
            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function () {
            if (!p.opened || p.inline) return;
            $.closeModal(p.container);
            return;
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.off('click', openOnInput);
            }
            $('html').off('click', closeOnHTMLClick);
        };

        if (p.inline) {
            p.open();
        }

        return p;
    };
    $.fn.calendar = function (params) {
        return this.each(function() {
            var $this = $(this);
            if(!$this[0]) return;
            var p = {};
            if($this[0].tagName.toUpperCase() === "INPUT") {
                p.input = $this;
            } else {
                p.container = $this;
            }
            new Calendar($.extend(p, params));
        });
    };

    $.initCalendar = function(content) {
        var $content = content ? $(content) : $(document.body);
        $content.find("[data-toggle='date']").each(function() {
            $(this).calendar();
        });
    };
}(Zepto);

/*======================================================
************   Picker   ************
======================================================*/
/* jshint unused:false */
/* jshint multistr:true */
+ function($) {
    "use strict";
    var Picker = function (params) {
        var p = this;
        var defaults = {
            updateValuesOnMomentum: false,
            updateValuesOnTouchmove: true,
            rotateEffect: false,
            momentumRatio: 7,
            freeMode: false,
            // Common settings
            scrollToInput: true,
            inputReadOnly: true,
            toolbar: true,
            toolbarCloseText: '确定',
            toolbarTemplate: '<header class="bar bar-nav">\
                <button class="button button-link pull-right close-picker">确定</button>\
                <h1 class="title">请选择</h1>\
                </header>',
        };
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.cols = [];
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;

        // 3D Transforms origin bug, only on safari
        var originBug = $.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !$.device.android;

        // Value
        p.setValue = function (arrValues, transition) {
            var valueIndex = 0;
            for (var i = 0; i < p.cols.length; i++) {
                if (p.cols[i] && !p.cols[i].divider) {
                    p.cols[i].setValue(arrValues[valueIndex], transition);
                    valueIndex++;
                }
            }
        };
        p.updateValue = function () {
            var newValue = [];
            var newDisplayValue = [];
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    newValue.push(p.cols[i].value);
                    newDisplayValue.push(p.cols[i].displayValue);
                }
            }
            if (newValue.indexOf(undefined) >= 0) {
                return;
            }
            p.value = newValue;
            p.displayValue = newDisplayValue;
            if (p.params.onChange) {
                p.params.onChange(p, p.value, p.displayValue);
            }
            if (p.input && p.input.length > 0) {
                $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
                $(p.input).trigger('change');
            }
        };

        // Columns Handlers
        p.initPickerCol = function (colElement, updateItems) {
            var colContainer = $(colElement);
            var colIndex = colContainer.index();
            var col = p.cols[colIndex];
            if (col.divider) return;
            col.container = colContainer;
            col.wrapper = col.container.find('.picker-items-col-wrapper');
            col.items = col.wrapper.find('.picker-item');

            var i, j;
            var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
            col.replaceValues = function (values, displayValues) {
                col.destroyEvents();
                col.values = values;
                col.displayValues = displayValues;
                var newItemsHTML = p.columnHTML(col, true);
                col.wrapper.html(newItemsHTML);
                col.items = col.wrapper.find('.picker-item');
                col.calcSize();
                col.setValue(col.values[0], 0, true);
                col.initEvents();
            };
            col.calcSize = function () {
                if (p.params.rotateEffect) {
                    col.container.removeClass('picker-items-col-absolute');
                    if (!col.width) col.container.css({width:''});
                }
                var colWidth, colHeight;
                colWidth = 0;
                colHeight = col.container[0].offsetHeight;
                wrapperHeight = col.wrapper[0].offsetHeight;
                itemHeight = col.items[0].offsetHeight;
                itemsHeight = itemHeight * col.items.length;
                minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
                maxTranslate = colHeight / 2 - itemHeight / 2;
                if (col.width) {
                    colWidth = col.width;
                    if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                    col.container.css({width: colWidth});
                }
                if (p.params.rotateEffect) {
                    if (!col.width) {
                        col.items.each(function () {
                            var item = $(this);
                            item.css({width:'auto'});
                            colWidth = Math.max(colWidth, item[0].offsetWidth);
                            item.css({width:''});
                        });
                        col.container.css({width: (colWidth + 2) + 'px'});
                    }
                    col.container.addClass('picker-items-col-absolute');
                }
            };
            col.calcSize();

            col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


            var activeIndex = 0;
            var animationFrameId;

            // Set Value Function
            col.setValue = function (newValue, transition, valueCallbacks) {
                if (typeof transition === 'undefined') transition = '';
                var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
                if(typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                    return;
                }
                var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
                // Update wrapper
                col.wrapper.transition(transition);
                col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');

                // Watch items
                if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex ) {
                    $.cancelAnimationFrame(animationFrameId);
                    col.wrapper.transitionEnd(function(){
                        $.cancelAnimationFrame(animationFrameId);
                    });
                    updateDuringScroll();
                }

                // Update items
                col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
            };

            col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
                if (typeof translate === 'undefined') {
                    translate = $.getTranslate(col.wrapper[0], 'y');
                }
                if(typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate)/itemHeight);
                if (activeIndex < 0) activeIndex = 0;
                if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
                var previousActiveIndex = col.activeIndex;
                col.activeIndex = activeIndex;
                /*
                   col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');

                   col.items.transition(transition);
                   var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
                   var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
                   var nextItems = selectedItem.nextAll().addClass('picker-after-selected');
                   */
                //去掉 .picker-after-selected, .picker-before-selected 以提高性能
                col.wrapper.find('.picker-selected').removeClass('picker-selected');
                if (p.params.rotateEffect) {
                    col.items.transition(transition);
                }
                var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

                if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                    // Update values
                    col.value = selectedItem.attr('data-picker-value');
                    col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                    // On change callback
                    if (previousActiveIndex !== activeIndex) {
                        if (col.onChange) {
                            col.onChange(p, col.value, col.displayValue);
                        }
                        p.updateValue();
                    }
                }

                // Set 3D rotate effect
                if (!p.params.rotateEffect) {
                    return;
                }
                var percentage = (translate - (Math.floor((translate - maxTranslate)/itemHeight) * itemHeight + maxTranslate)) / itemHeight;

                col.items.each(function () {
                    var item = $(this);
                    var itemOffsetTop = item.index() * itemHeight;
                    var translateOffset = maxTranslate - translate;
                    var itemOffset = itemOffsetTop - translateOffset;
                    var percentage = itemOffset / itemHeight;

                    var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                    var angle = (-18*percentage);
                    if (angle > 180) angle = 180;
                    if (angle < -180) angle = -180;
                    // Far class
                    if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
                    else item.removeClass('picker-item-far');
                    // Set transform
                    item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
                });
            };

            function updateDuringScroll() {
                animationFrameId = $.requestAnimationFrame(function () {
                    col.updateItems(undefined, undefined, 0);
                    updateDuringScroll();
                });
            }

            // Update items on init
            if (updateItems) col.updateItems(0, maxTranslate, 0);

            var allowItemClick = true;
            var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
            function handleTouchStart (e) {
                if (isMoved || isTouched) return;
                e.preventDefault();
                isTouched = true;
                touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date()).getTime();

                allowItemClick = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
            }
            function handleTouchMove (e) {
                if (!isTouched) return;
                e.preventDefault();
                allowItemClick = false;
                touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (!isMoved) {
                    // First move
                    $.cancelAnimationFrame(animationFrameId);
                    isMoved = true;
                    startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                    col.wrapper.transition(0);
                }
                e.preventDefault();

                var diff = touchCurrentY - touchStartY;
                currentTranslate = startTranslate + diff;
                returnTo = undefined;

                // Normalize translate
                if (currentTranslate < minTranslate) {
                    currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                    returnTo = 'min';
                }
                if (currentTranslate > maxTranslate) {
                    currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                    returnTo = 'max';
                }
                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

                // Update items
                col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

                // Calc velocity
                velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
                velocityTime = (new Date()).getTime();
                prevTranslate = currentTranslate;
            }
            function handleTouchEnd (e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;
                col.wrapper.transition('');
                if (returnTo) {
                    if (returnTo === 'min') {
                        col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                    }
                    else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
                }
                touchEndTime = new Date().getTime();
                var velocity, newTranslate;
                if (touchEndTime - touchStartTime > 300) {
                    newTranslate = currentTranslate;
                }
                else {
                    velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                    newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
                }

                newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

                // Active Index
                var activeIndex = -Math.floor((newTranslate - maxTranslate)/itemHeight);

                // Normalize translate
                if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate,10)) + 'px,0)');

                // Update items
                col.updateItems(activeIndex, newTranslate, '', true);

                // Watch items
                if (p.params.updateValuesOnMomentum) {
                    updateDuringScroll();
                    col.wrapper.transitionEnd(function(){
                        $.cancelAnimationFrame(animationFrameId);
                    });
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleClick(e) {
                if (!allowItemClick) return;
                $.cancelAnimationFrame(animationFrameId);
                /*jshint validthis:true */
                var value = $(this).attr('data-picker-value');
                col.setValue(value);
            }

            col.initEvents = function (detach) {
                var method = detach ? 'off' : 'on';
                col.container[method]($.touchEvents.start, handleTouchStart);
                col.container[method]($.touchEvents.move, handleTouchMove);
                col.container[method]($.touchEvents.end, handleTouchEnd);
                col.items[method]('click', handleClick);
            };
            col.destroyEvents = function () {
                col.initEvents(true);
            };

            col.container[0].f7DestroyPickerCol = function () {
                col.destroyEvents();
            };

            col.initEvents();

        };
        p.destroyPickerCol = function (colContainer) {
            colContainer = $(colContainer);
            if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
        };
        // Resize cols
        function resizeCols() {
            if (!p.opened) return;
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    p.cols[i].calcSize();
                    p.cols[i].setValue(p.cols[i].value, 0, false);
                }
            }
        }
        $(window).on('resize', resizeCols);

        // HTML Layout
        p.columnHTML = function (col, onlyItems) {
            var columnItemsHTML = '';
            var columnHTML = '';
            if (col.divider) {
                columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
            }
            else {
                for (var j = 0; j < col.values.length; j++) {
                    columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
                }

                columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
            }
            return onlyItems ? columnItemsHTML : columnHTML;
        };
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;
            p.cols = [];
            var colsHTML = '';
            for (i = 0; i < p.params.cols.length; i++) {
                var col = p.params.cols[i];
                colsHTML += p.columnHTML(p.params.cols[i]);
                p.cols.push(col);
            }
            pickerClass = 'picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
            pickerHTML =
                '<div class="' + (pickerClass) + '">' +
                (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '') +
                '<div class="picker-modal-inner picker-items">' +
                colsHTML +
                '<div class="picker-center-highlight"></div>' +
                '</div>' +
                '</div>';

            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            // 安卓微信webviewreadonly的input依然弹出软键盘问题修复
            if ($.device.isWeixin && $.device.android && p.params.inputReadOnly) {
                /*jshint validthis:true */
                this.focus();
                this.blur();
            }
            if (p.opened) return;
            p.open();
            if (p.params.scrollToInput) {
                var pageContent = p.input.parents('.content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;
                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
        }
        function closeOnHTMLClick(e) {
            if (!p.opened) return;
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
            }
            else {
                if ($(e.target).parents('.picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.on('click', openOnInput);
                }
            }
        }

        if (!p.inline) $('html').on('click', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) p.input.parents('.content').css({'padding-bottom': ''});
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.container.find('.picker-items-col').each(function () {
                p.destroyPickerCol(this);
            });
        }

        p.opened = false;
        p.open = function () {
            if (!p.opened) {

                // Layout
                p.layout();

                // Append
                if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                    p.opened = true;
                }
                else {
                    p.container = $($.pickerModal(p.pickerHTML));
                    $(p.container)
                        .one('opened', function() {
                            p.opened = true;
                        })
                        .on('close', function () {
                            onPickerClose();
                        });
                }

                // Store picker instance
                p.container[0].f7Picker = p;

                // Init Events
                p.container.find('.picker-items-col').each(function () {
                    var updateItems = true;
                    if ((!p.initialized && p.params.value) || (p.initialized && p.value)) updateItems = false;
                    p.initPickerCol(this, updateItems);
                });

                // Set value
                if (!p.initialized) {
                    if (p.params.value) {
                        p.setValue(p.params.value, 0);
                    }
                }
                else {
                    if (p.value) p.setValue(p.value, 0);
                }
            }

            // Set flag
            p.initialized = true;

            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function () {
            if (!p.opened || p.inline) return;
            $.closeModal(p.container);
            return;
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.off('click', openOnInput);
            }
            $('html').off('click', closeOnHTMLClick);
            $(window).off('resize', resizeCols);
        };

        if (p.inline) {
            p.open();
        }

        return p;
    };

    $(document).on("click", ".close-picker", function() {
        var pickerToClose = $('.picker-modal.modal-in');
        $.closeModal(pickerToClose);
    });

    $.fn.picker = function(params) {
        var args = arguments;
        return this.each(function() {
            if(!this) return;
            var $this = $(this);

            var picker = $this.data("picker");
            if(!picker) {
                var p = $.extend({
                    input: this,
                    value: $this.val() ? $this.val().split(' ') : ''
                }, params);
                picker = new Picker(p);
                $this.data("picker", picker);
            }
            if(typeof params === typeof "a") {
                picker[params].apply(picker, Array.prototype.slice.call(args, 1));
            }
        });
    };
}(Zepto);

/* jshint unused:false*/

+ function($) {
    "use strict";

    var today = new Date();

    var getDays = function(max) {
        var days = [];
        for(var i=1; i<= (max||31);i++) {
            days.push(i < 10 ? "0"+i : i);
        }
        return days;
    };

    var getDaysByMonthAndYear = function(month, year) {
        var int_d = new Date(year, parseInt(month)+1-1, 1);
        var d = new Date(int_d - 1);
        return getDays(d.getDate());
    };

    var formatNumber = function (n) {
        return n < 10 ? "0" + n : n;
    };

    var initMonthes = ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ');

    var initYears = (function () {
        var arr = [];
        for (var i = 1950; i <= 2030; i++) { arr.push(i); }
        return arr;
    })();


    var defaults = {

        rotateEffect: false,  //为了性能

        value: [today.getFullYear(), formatNumber(today.getMonth()+1), formatNumber(today.getDate()), today.getHours(), formatNumber(today.getMinutes())],

        onChange: function (picker, values, displayValues) {
            var days = getDaysByMonthAndYear(picker.cols[1].value, picker.cols[0].value);
            var currentValue = picker.cols[2].value;
            if(currentValue > days.length) currentValue = days.length;
            picker.cols[2].setValue(currentValue);
        },

        formatValue: function (p, values, displayValues) {
            return displayValues[0] + '-' + values[1] + '-' + values[2] + ' ' + values[3] + ':' + values[4];
        },

        cols: [
            // Years
        {
            values: initYears
        },
        // Months
        {
            values: initMonthes
        },
        // Days
        {
            values: getDays()
        },

        // Space divider
        {
            divider: true,
            content: '  '
        },
        // Hours
        {
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 23; i++) { arr.push(i); }
                return arr;
            })(),
        },
        // Divider
        {
            divider: true,
            content: ':'
        },
        // Minutes
        {
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                return arr;
            })(),
        }
        ]
    };

    $.fn.datetimePicker = function(params) {
        return this.each(function() {
            if(!this) return;
            var p = $.extend(defaults, params);
            $(this).picker(p);
            if (params.value) $(this).val(p.formatValue(p, p.value, p.value));
        });
    };

}(Zepto);



/* ===============================================================================
************   scroller   ************
=============================================================================== */
+ function($) {
    "use strict";
    //重置zepto自带的滚动条
    var _zeptoMethodCache = {
        "scrollTop": $.fn.scrollTop,
        "scrollLeft": $.fn.scrollLeft
    };
    //重置scrollLeft和scrollRight
    (function() {
        $.extend($.fn, {
            scrollTop: function(top, dur) {
                if (!this.length) return;
                var scroller = this.data('scroller');
                if (scroller && scroller.scroller) { //js滚动
                    return scroller.scrollTop(top, dur);
                } else {
                    return _zeptoMethodCache.scrollTop.apply(this, arguments);
                }
            }
        });
        $.extend($.fn, {
            scrollLeft: function(left, dur) {
                if (!this.length) return;
                var scroller = this.data('scroller');
                if (scroller && scroller.scroller) { //js滚动
                    return scroller.scrollLeft(left, dur);
                } else {
                    return _zeptoMethodCache.scrollLeft.apply(this, arguments);
                }
            }
        });
    })();



    //自定义的滚动条
    var Scroller = function(pageContent, _options) {
        var $pageContent = this.$pageContent = $(pageContent);

        this.options = $.extend({}, this._defaults, _options);

        var type = this.options.type;
        //auto的type,系统版本的小于4.4.0的安卓设备和系统版本小于6.0.0的ios设备，启用js版的iscoll
        var useJSScroller = (type === 'js') || (type === 'auto' && ($.device.android && $.compareVersion('4.4.0', $.device.osVersion) > -1) || (type === 'auto' && ($.device.ios && $.compareVersion('6.0.0', $.device.osVersion) > -1)));

        if (useJSScroller) {

            var $pageContentInner = $pageContent.find('.content-inner');
            //如果滚动内容没有被包裹，自动添加wrap
            if (!$pageContentInner[0]) {
                // $pageContent.html('<div class="content-inner">' + $pageContent.html() + '</div>');
                var children = $pageContent.children();
                if (children.length < 1) {
                    $pageContent.children().wrapAll('<div class="content-inner"></div>');
                } else {
                    $pageContent.html('<div class="content-inner">' + $pageContent.html() + '</div>');
                }
            }

            if ($pageContent.hasClass('pull-to-refresh-content')) {
                //因为iscroll 当页面高度不足 100% 时无法滑动，所以无法触发下拉动作，这里改动一下高度
                //区分是否有.bar容器，如有，则content的top:0，无则content的top:-2.2rem,这里取2.2rem的最大值，近60
                var minHeight = $(window).height() + ($pageContent.prev().hasClass(".bar") ? 1 : 61);
                $pageContent.find('.content-inner').css('min-height', minHeight + 'px');
            }

            var ptr = $(pageContent).hasClass('pull-to-refresh-content');
            //js滚动模式，用transform移动内容区位置，会导致fixed失效，表现类似absolute。因此禁用transform模式
            var useTransform = $pageContent.find('.fixed-tab').length === 0;
            var options = {
                probeType: 1,
                mouseWheel: true,
                //解决安卓js模式下，刷新滚动条后绑定的事件不响应，对chrome内核浏览器设置click:true
                click: $.device.androidChrome,
                useTransform: useTransform,
                //js模式下允许滚动条横向滚动，但是需要注意，滚动容易宽度必须大于屏幕宽度滚动才生效
                scrollX: true
            };
            if (ptr) {
                options.ptr = true;
                options.ptrOffset = 44;
            }
            //如果用js滚动条，用transform计算内容区位置，position：fixed将实效。若有.fixed-tab，强制使用native滚动条；备选方案，略粗暴
            // if($(pageContent).find('.fixed-tab').length>0){
            //     $pageContent.addClass('native-scroll');
            //     return;
            // }
            this.scroller = new IScroll(pageContent, options); // jshint ignore:line
            //和native滚动统一起来
            this._bindEventToDomWhenJs();
            $.initPullToRefresh = $._pullToRefreshJSScroll.initPullToRefresh;
            $.pullToRefreshDone = $._pullToRefreshJSScroll.pullToRefreshDone;
            $.pullToRefreshTrigger = $._pullToRefreshJSScroll.pullToRefreshTrigger;
            $.destroyToRefresh = $._pullToRefreshJSScroll.destroyToRefresh;
            $pageContent.addClass('javascript-scroll');
            if (!useTransform) {
                $pageContent.find('.content-inner').css({
                    width: '100%',
                    position: 'absolute'
                });
            }

            //如果页面本身已经进行了原生滚动，那么把这个滚动换成JS的滚动
            var nativeScrollTop = this.$pageContent[0].scrollTop;
            if(nativeScrollTop) {
                this.$pageContent[0].scrollTop = 0;
                this.scrollTop(nativeScrollTop);
            }
        } else {
            $pageContent.addClass('native-scroll');
        }
    };
    Scroller.prototype = {
        _defaults: {
            type: 'native',
        },
        _bindEventToDomWhenJs: function() {
            //"scrollStart", //the scroll started.
            //"scroll", //the content is scrolling. Available only in scroll-probe.js edition. See onScroll event.
            //"scrollEnd", //content stopped scrolling.
            if (this.scroller) {
                var self = this;
                this.scroller.on('scrollStart', function() {
                    self.$pageContent.trigger('scrollstart');
                });
                this.scroller.on('scroll', function() {
                    self.$pageContent.trigger('scroll');
                });
                this.scroller.on('scrollEnd', function() {
                    self.$pageContent.trigger('scrollend');
                });
            } else {
                //TODO: 实现native的scrollStart和scrollEnd
            }
        },
        scrollTop: function(top, dur) {
            if (this.scroller) {
                if (top !== undefined) {
                    this.scroller.scrollTo(0, -1 * top, dur);
                } else {
                    return this.scroller.getComputedPosition().y * -1;
                }
            } else {
                return this.$pageContent.scrollTop(top, dur);
            }
            return this;
        },
        scrollLeft: function(left, dur) {
            if (this.scroller) {
                if (left !== undefined) {
                    this.scroller.scrollTo(-1 * left, 0);
                } else {
                    return this.scroller.getComputedPosition().x * -1;
                }
            } else {
                return this.$pageContent.scrollTop(left, dur);
            }
            return this;
        },
        on: function(event, callback) {
            if (this.scroller) {
                this.scroller.on(event, function() {
                    callback.call(this.wrapper);
                });
            } else {
                this.$pageContent.on(event, callback);
            }
            return this;
        },
        off: function(event, callback) {
            if (this.scroller) {
                this.scroller.off(event, callback);
            } else {
                this.$pageContent.off(event, callback);
            }
            return this;
        },
        refresh: function() {
            if (this.scroller) this.scroller.refresh();
            return this;
        },
        scrollHeight: function() {
            if (this.scroller) {
                return this.scroller.scrollerHeight;
            } else {
                return this.$pageContent[0].scrollHeight;
            }
        }

    };

    //Scroller PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        var args = Array.apply(null, arguments);
        args.shift();
        var internal_return;

        this.each(function() {

            var $this = $(this);

            var options = $.extend({}, $this.dataset(), typeof option === 'object' && option);

            var data = $this.data('scroller');
            //如果 scroller 没有被初始化，对scroller 进行初始化r
            if (!data) {
                //获取data-api的
                $this.data('scroller', (data = new Scroller(this, options)));

            }
            if (typeof option === 'string' && typeof data[option] === 'function') {
                internal_return = data[option].apply(data, args);
                if (internal_return !== undefined)
            return false;
            }

        });

        if (internal_return !== undefined)
            return internal_return;
        else
            return this;

    }

    var old = $.fn.scroller;

    $.fn.scroller = Plugin;
    $.fn.scroller.Constructor = Scroller;


    // Scroll NO CONFLICT
    // =================

    $.fn.scroller.noConflict = function() {
        $.fn.scroller = old;
        return this;
    };
    //添加data-api
    $(function() {
        $('[data-toggle="scroller"]').scroller();
    });

    //统一的接口,带有 .javascript-scroll 的content 进行刷新
    $.refreshScroller = function(content) {
        if (content) {
            $(content).scroller('refresh');
        } else {
            $('.javascript-scroll').each(function() {
                $(this).scroller('refresh');
            });
        }

    };
    //全局初始化方法，会对页面上的 [data-toggle="scroller"]，.content. 进行滚动条初始化
    $.initScroller = function(option) {
        this.options = $.extend({}, typeof option === 'object' && option);
        $('[data-toggle="scroller"],.content').scroller(option);
    };
    //获取scroller对象
    $.getScroller = function(content) {
        //以前默认只能有一个无限滚动，因此infinitescroll都是加在content上，现在允许里面有多个，因此要判断父元素是否有content
        content = content.hasClass('content') ? content : content.parents('.content');
        if (content) {
            return $(content).data('scroller');
        } else {
            return $('.content.javascript-scroll').data('scroller');
        }
    };
    //检测滚动类型,
    //‘js’: javascript 滚动条
    //‘native’: 原生滚动条
    $.detectScrollerType = function(content) {
        if (content) {
            if ($(content).data('scroller') && $(content).data('scroller').scroller) {
                return 'js';
            } else {
                return 'native';
            }
        }
    };

}(Zepto);

/* ===============================================================================
************   Tabs   ************
=============================================================================== */
+function ($) {
    "use strict";

    var showTab = function (tab, tabLink, force) {
        var newTab = $(tab);
        if (arguments.length === 2) {
            if (typeof tabLink === 'boolean') {
                force = tabLink;
            }
        }
        if (newTab.length === 0) return false;
        if (newTab.hasClass('active')) {
            if (force) newTab.trigger('show');
            return false;
        }
        var tabs = newTab.parent('.tabs');
        if (tabs.length === 0) return false;

        // Animated tabs
        /*var isAnimatedTabs = tabs.parent().hasClass('tabs-animated-wrap');
          if (isAnimatedTabs) {
          tabs.transform('translate3d(' + -newTab.index() * 100 + '%,0,0)');
          }*/

        // Remove active class from old tabs
        var oldTab = tabs.children('.tab.active').removeClass('active');
        // Add active class to new tab
        newTab.addClass('active');
        // Trigger 'show' event on new tab
        newTab.trigger('show');

        // Update navbars in new tab
        /*if (!isAnimatedTabs && newTab.find('.navbar').length > 0) {
        // Find tab's view
        var viewContainer;
        if (newTab.hasClass(app.params.viewClass)) viewContainer = newTab[0];
        else viewContainer = newTab.parents('.' + app.params.viewClass)[0];
        app.sizeNavbars(viewContainer);
        }*/

        // Find related link for new tab
        if (tabLink) tabLink = $(tabLink);
        else {
            // Search by id
            if (typeof tab === 'string') tabLink = $('.tab-link[href="' + tab + '"]');
            else tabLink = $('.tab-link[href="#' + newTab.attr('id') + '"]');
            // Search by data-tab
            if (!tabLink || tabLink && tabLink.length === 0) {
                $('[data-tab]').each(function () {
                    if (newTab.is($(this).attr('data-tab'))) tabLink = $(this);
                });
            }
        }
        if (tabLink.length === 0) return;

        // Find related link for old tab
        var oldTabLink;
        if (oldTab && oldTab.length > 0) {
            // Search by id
            var oldTabId = oldTab.attr('id');
            if (oldTabId) oldTabLink = $('.tab-link[href="#' + oldTabId + '"]');
            // Search by data-tab
            if (!oldTabLink || oldTabLink && oldTabLink.length === 0) {
                $('[data-tab]').each(function () {
                    if (oldTab.is($(this).attr('data-tab'))) oldTabLink = $(this);
                });
            }
        }

        // Update links' classes
        if (tabLink && tabLink.length > 0) tabLink.addClass('active');
        if (oldTabLink && oldTabLink.length > 0) oldTabLink.removeClass('active');
        tabLink.trigger('active');

        //app.refreshScroller();

        return true;
    };

    var old = $.showTab;
    $.showTab = showTab;

    $.showTab.noConflict = function () {
        $.showTab = old;
        return this;
    };
    //a标签上的click事件，在iscroll下响应有问题
    $(document).on("click", ".tab-link", function(e) {
        e.preventDefault();
        var clicked = $(this);
        showTab(clicked.data("tab") || clicked.attr('href'), clicked);
    });


}(Zepto);

/* ===============================================================================
************   Tabs   ************
=============================================================================== */
+function ($) {
    "use strict";
    $.initFixedTab = function(){
        var $fixedTab = $('.fixed-tab');
        if ($fixedTab.length === 0) return;
        $('.fixed-tab').fixedTab();//默认{offset: 0}
    };
    var FixedTab = function(pageContent, _options) {
        var $pageContent = this.$pageContent = $(pageContent);
        var shadow = $pageContent.clone();
        var fixedTop = $pageContent[0].getBoundingClientRect().top;

        shadow.css('visibility', 'hidden');
        this.options = $.extend({}, this._defaults, {
            fixedTop: fixedTop,
            shadow: shadow,
            offset: 0
        }, _options);

        this._bindEvents();
    };

    FixedTab.prototype = {
        _defaults: {
            offset: 0,
        },
        _bindEvents: function() {
            this.$pageContent.parents('.content').on('scroll', this._scrollHandler.bind(this));
            this.$pageContent.on('active', '.tab-link', this._tabLinkHandler.bind(this));
        },
        _tabLinkHandler: function(ev) {
            var isFixed = $(ev.target).parents('.buttons-fixed').length > 0;
            var fixedTop = this.options.fixedTop;
            var offset = this.options.offset;
            $.refreshScroller();
            if (!isFixed) return;
            this.$pageContent.parents('.content').scrollTop(fixedTop - offset);
        },
        // 滚动核心代码
        _scrollHandler: function(ev) {
            var $scroller = $(ev.target);
            var $pageContent = this.$pageContent;
            var shadow = this.options.shadow;
            var offset = this.options.offset;
            var fixedTop = this.options.fixedTop;
            var scrollTop = $scroller.scrollTop();
            var isFixed = scrollTop >= fixedTop - offset;
            if (isFixed) {
                shadow.insertAfter($pageContent);
                $pageContent.addClass('buttons-fixed').css('top', offset);
            } else {
                shadow.remove();
                $pageContent.removeClass('buttons-fixed').css('top', 0);
            }
        }
    };

    //FixedTab PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        var args = Array.apply(null, arguments);
        args.shift();
        this.each(function() {
            var $this = $(this);
            var options = $.extend({}, $this.dataset(), typeof option === 'object' && option);
            var data = $this.data('fixedtab');
            if (!data) {
                //获取data-api的
                $this.data('fixedtab', (data = new FixedTab(this, options)));
            }
        });

    }
    $.fn.fixedTab = Plugin;
    $.fn.fixedTab.Constructor = FixedTab;
    $(document).on('pageInit',function(){
        $.initFixedTab();
    });



}(Zepto);

+ function($) {
    "use strict";
    //这里实在js滚动时使用的下拉刷新代码。

    var refreshTime = 0;
    var initPullToRefreshJS = function(pageContainer) {
        var eventsTarget = $(pageContainer);
        if (!eventsTarget.hasClass('pull-to-refresh-content')) {
            eventsTarget = eventsTarget.find('.pull-to-refresh-content');
        }
        if (!eventsTarget || eventsTarget.length === 0) return;

        var page = eventsTarget.hasClass('content') ? eventsTarget : eventsTarget.parents('.content');
        var scroller = $.getScroller(page[0]);
        if(!scroller) return;


        var container = eventsTarget;

        function handleScroll() {
            if (container.hasClass('refreshing')) return;
            if (scroller.scrollTop() * -1 >= 44) {
                container.removeClass('pull-down').addClass('pull-up');
            } else {
                container.removeClass('pull-up').addClass('pull-down');
            }
        }

        function handleRefresh() {
            if (container.hasClass('refreshing')) return;
            container.removeClass('pull-down pull-up');
            container.addClass('refreshing transitioning');
            container.trigger('refresh');
            refreshTime = +new Date();
        }
        scroller.on('scroll', handleScroll);
        scroller.scroller.on('ptr', handleRefresh);

        // Detach Events on page remove
        function destroyPullToRefresh() {
            scroller.off('scroll', handleScroll);
            scroller.scroller.off('ptr', handleRefresh);
        }
        eventsTarget[0].destroyPullToRefresh = destroyPullToRefresh;

    };

    var pullToRefreshDoneJS = function(container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
        if (container.length === 0) return;
        var interval = (+new Date()) - refreshTime;
        var timeOut = interval > 1000 ? 0 : 1000 - interval; //long than bounce time
        var scroller = $.getScroller(container);
        setTimeout(function() {
            scroller.refresh();
            container.removeClass('refreshing');
            container.transitionEnd(function() {
                container.removeClass("transitioning");
            });
        }, timeOut);
    };
    var pullToRefreshTriggerJS = function(container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content');
        if (container.hasClass('refreshing')) return;
        container.addClass('refreshing');
        var scroller = $.getScroller(container);
        scroller.scrollTop(44 + 1, 200);
        container.trigger('refresh');
    };

    var destroyPullToRefreshJS = function(pageContainer) {
        pageContainer = $(pageContainer);
        var pullToRefreshContent = pageContainer.hasClass('pull-to-refresh-content') ? pageContainer : pageContainer.find('.pull-to-refresh-content');
        if (pullToRefreshContent.length === 0) return;
        if (pullToRefreshContent[0].destroyPullToRefresh) pullToRefreshContent[0].destroyPullToRefresh();
    };

    $._pullToRefreshJSScroll = {
        "initPullToRefresh": initPullToRefreshJS,
        "pullToRefreshDone": pullToRefreshDoneJS,
        "pullToRefreshTrigger": pullToRefreshTriggerJS,
        "destroyPullToRefresh": destroyPullToRefreshJS,
    };
}(Zepto); // jshint ignore:line

+ function($) {
    'use strict';
    $.initPullToRefresh = function(pageContainer) {
        var eventsTarget = $(pageContainer);
        if (!eventsTarget.hasClass('pull-to-refresh-content')) {
            eventsTarget = eventsTarget.find('.pull-to-refresh-content');
        }
        if (!eventsTarget || eventsTarget.length === 0) return;

        var isTouched, isMoved, touchesStart = {},
            isScrolling, touchesDiff, touchStartTime, container, refresh = false,
            useTranslate = false,
            startTranslate = 0,
            translate, scrollTop, wasScrolled, triggerDistance, dynamicTriggerDistance;

        container = eventsTarget;

        // Define trigger distance
        if (container.attr('data-ptr-distance')) {
            dynamicTriggerDistance = true;
        } else {
            triggerDistance = 44;
        }

        function handleTouchStart(e) {
            if (isTouched) {
                if ($.device.android) {
                    if ('targetTouches' in e && e.targetTouches.length > 1) return;
                } else return;
            }
            isMoved = false;
            isTouched = true;
            isScrolling = undefined;
            wasScrolled = undefined;
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = (new Date()).getTime();
            /*jshint validthis:true */
            container = $(this);
        }

        function handleTouchMove(e) {
            if (!isTouched) return;
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
            }
            if (!isScrolling) {
                isTouched = false;
                return;
            }

            scrollTop = container[0].scrollTop;
            if (typeof wasScrolled === 'undefined' && scrollTop !== 0) wasScrolled = true;

            if (!isMoved) {
                /*jshint validthis:true */
                container.removeClass('transitioning');
                if (scrollTop > container[0].offsetHeight) {
                    isTouched = false;
                    return;
                }
                if (dynamicTriggerDistance) {
                    triggerDistance = container.attr('data-ptr-distance');
                    if (triggerDistance.indexOf('%') >= 0) triggerDistance = container[0].offsetHeight * parseInt(triggerDistance, 10) / 100;
                }
                startTranslate = container.hasClass('refreshing') ? triggerDistance : 0;
                if (container[0].scrollHeight === container[0].offsetHeight || !$.device.ios) {
                    useTranslate = true;
                } else {
                    useTranslate = false;
                }
                useTranslate = true;
            }
            isMoved = true;
            touchesDiff = pageY - touchesStart.y;

            if (touchesDiff > 0 && scrollTop <= 0 || scrollTop < 0) {
                // iOS 8 fix
                if ($.device.ios && parseInt($.device.osVersion.split('.')[0], 10) > 7 && scrollTop === 0 && !wasScrolled) useTranslate = true;

                if (useTranslate) {
                    e.preventDefault();
                    translate = (Math.pow(touchesDiff, 0.85) + startTranslate);
                    container.transform('translate3d(0,' + translate + 'px,0)');
                } else {}
                if ((useTranslate && Math.pow(touchesDiff, 0.85) > triggerDistance) || (!useTranslate && touchesDiff >= triggerDistance * 2)) {
                    refresh = true;
                    container.addClass('pull-up').removeClass('pull-down');
                } else {
                    refresh = false;
                    container.removeClass('pull-up').addClass('pull-down');
                }
            } else {

                container.removeClass('pull-up pull-down');
                refresh = false;
                return;
            }
        }

        function handleTouchEnd() {
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            if (translate) {
                container.addClass('transitioning');
                translate = 0;
            }
            container.transform('');
            if (refresh) {
                //防止二次触发
                if(container.hasClass('refreshing')) return;
                container.addClass('refreshing');
                container.trigger('refresh');
            } else {
                container.removeClass('pull-down');
            }
            isTouched = false;
            isMoved = false;
        }

        // Attach Events
        eventsTarget.on($.touchEvents.start, handleTouchStart);
        eventsTarget.on($.touchEvents.move, handleTouchMove);
        eventsTarget.on($.touchEvents.end, handleTouchEnd);


        function destroyPullToRefresh() {
            eventsTarget.off($.touchEvents.start, handleTouchStart);
            eventsTarget.off($.touchEvents.move, handleTouchMove);
            eventsTarget.off($.touchEvents.end, handleTouchEnd);
        }
        eventsTarget[0].destroyPullToRefresh = destroyPullToRefresh;

    };
    $.pullToRefreshDone = function(container) {
        $(window).scrollTop(0);//解决微信下拉刷新顶部消失的问题
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
        container.removeClass('refreshing').addClass('transitioning');
        container.transitionEnd(function() {
            container.removeClass('transitioning pull-up pull-down');
        });
    };
    $.pullToRefreshTrigger = function(container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content');
        if (container.hasClass('refreshing')) return;
        container.addClass('transitioning refreshing');
        container.trigger('refresh');
    };

    $.destroyPullToRefresh = function(pageContainer) {
        pageContainer = $(pageContainer);
        var pullToRefreshContent = pageContainer.hasClass('pull-to-refresh-content') ? pageContainer : pageContainer.find('.pull-to-refresh-content');
        if (pullToRefreshContent.length === 0) return;
        if (pullToRefreshContent[0].destroyPullToRefresh) pullToRefreshContent[0].destroyPullToRefresh();
    };

    //这里是否需要写到 scroller 中去？
/*    $.initPullToRefresh = function(pageContainer) {
        var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.initPullToRefresh(item);
            } else {
                initPullToRefresh(item);
            }
        });
    };


    $.pullToRefreshDone = function(pageContainer) {
        var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.pullToRefreshDone(item);
            } else {
                pullToRefreshDone(item);
            }
        });
    };


    $.pullToRefreshTrigger = function(pageContainer) {
       var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.pullToRefreshTrigger(item);
            } else {
                pullToRefreshTrigger(item);
            }
        });
    };

    $.destroyPullToRefresh = function(pageContainer) {
        var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.destroyPullToRefresh(item);
            } else {
                destroyPullToRefresh(item);
            }
        });
    };
*/

}(Zepto); //jshint ignore:line

+ function($) {
    'use strict';

    function handleInfiniteScroll() {
        /*jshint validthis:true */
        var inf = $(this);
        var scroller = $.getScroller(inf);
        var scrollTop = scroller.scrollTop();
        var scrollHeight = scroller.scrollHeight();
        var height = inf[0].offsetHeight;
        var distance = inf[0].getAttribute('data-distance');
        var virtualListContainer = inf.find('.virtual-list');
        var virtualList;
        var onTop = inf.hasClass('infinite-scroll-top');
        if (!distance) distance = 50;
        if (typeof distance === 'string' && distance.indexOf('%') >= 0) {
            distance = parseInt(distance, 10) / 100 * height;
        }
        if (distance > height) distance = height;
        if (onTop) {
            if (scrollTop < distance) {
                inf.trigger('infinite');
            }
        } else {
            if (scrollTop + height >= scrollHeight - distance) {
                if (virtualListContainer.length > 0) {
                    virtualList = virtualListContainer[0].f7VirtualList;
                    if (virtualList && !virtualList.reachEnd) return;
                }
                inf.trigger('infinite');
            }
        }

    }
    $.attachInfiniteScroll = function(infiniteContent) {
        $.getScroller(infiniteContent).on('scroll', handleInfiniteScroll);
    };
    $.detachInfiniteScroll = function(infiniteContent) {
        $.getScroller(infiniteContent).off('scroll', handleInfiniteScroll);
    };

    $.initInfiniteScroll = function(pageContainer) {
        pageContainer = $(pageContainer);
        var infiniteContent = pageContainer.hasClass('infinite-scroll')?pageContainer:pageContainer.find('.infinite-scroll');
        if (infiniteContent.length === 0) return;
        $.attachInfiniteScroll(infiniteContent);
        //如果是顶部无限刷新，要将滚动条初始化于最下端
        pageContainer.forEach(function(v){
            if($(v).hasClass('infinite-scroll-top')){
                var height = v.scrollHeight - v.clientHeight;
                $(v).scrollTop(height);
            }
        });
        function detachEvents() {
            $.detachInfiniteScroll(infiniteContent);
            pageContainer.off('pageBeforeRemove', detachEvents);
        }
        pageContainer.on('pageBeforeRemove', detachEvents);
    };
}(Zepto);

+function ($) {
    "use strict";
    $(function() {
        $(document).on("focus", ".searchbar input", function(e) {
            var $input = $(e.target);
            $input.parents(".searchbar").addClass("searchbar-active");
        });
        $(document).on("click", ".searchbar-cancel", function(e) {
            var $btn = $(e.target);
            $btn.parents(".searchbar").removeClass("searchbar-active");
        });
        $(document).on("blur", ".searchbar input", function(e) {
            var $input = $(e.target);
            $input.parents(".searchbar").removeClass("searchbar-active");
        });
    });
}(Zepto);

/*======================================================
************   Panels   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
    "use strict";
    $.allowPanelOpen = true;
    $.openPanel = function (panel) {
        if (!$.allowPanelOpen) return false;
        if(panel === 'left' || panel === 'right') panel = ".panel-" + panel;  //可以传入一个方向
        panel = panel ? $(panel) : $(".panel").eq(0);
        var direction = panel.hasClass("panel-right") ? "right" : "left";
        if (panel.length === 0 || panel.hasClass('active')) return false;
        $.closePanel(); // Close if some panel is opened
        $.allowPanelOpen = false;
        var effect = panel.hasClass('panel-reveal') ? 'reveal' : 'cover';
        panel.css({display: 'block'}).addClass('active');
        panel.trigger('open');

        // Trigger reLayout
        var clientLeft = panel[0].clientLeft;

        // Transition End;
        var transitionEndTarget = effect === 'reveal' ? $($.getCurrentPage()) : panel;
        var openedTriggered = false;

        function panelTransitionEnd() {
            transitionEndTarget.transitionEnd(function (e) {
                if (e.target === transitionEndTarget[0]) {
                    if (panel.hasClass('active')) {
                        panel.trigger('opened');
                    }
                    else {
                        panel.trigger('closed');
                    }
            $.allowPanelOpen = true;
                }
                else panelTransitionEnd();
            });
        }
        panelTransitionEnd();

        $(document.body).addClass('with-panel-' + direction + '-' + effect);
        return true;
    };
    $.closePanel = function () {
        var activePanel = $('.panel.active');
        if (activePanel.length === 0) return false;
        var effect = activePanel.hasClass('panel-reveal') ? 'reveal' : 'cover';
        var panelPosition = activePanel.hasClass('panel-left') ? 'left' : 'right';
        activePanel.removeClass('active');
        var transitionEndTarget = effect === 'reveal' ? $('.page') : activePanel;
        activePanel.trigger('close');
        $.allowPanelOpen = false;

        transitionEndTarget.transitionEnd(function () {
            if (activePanel.hasClass('active')) return;
            activePanel.css({display: ''});
            activePanel.trigger('closed');
            $('body').removeClass('panel-closing');
            $.allowPanelOpen = true;
        });

        $('body').addClass('panel-closing').removeClass('with-panel-' + panelPosition + '-' + effect);
    };

    $(document).on("click", ".open-panel", function(e) {
        var panel = $(e.target).data('panel');
        $.openPanel(panel);
    });
    $(document).on("click", ".close-panel, .panel-overlay", function(e) {
        $.closePanel();
    });
    /*======================================================
     ************   Swipe panels   ************
     ======================================================*/
    $.initSwipePanels = function () {
        var panel, side;
        var swipePanel = $.smConfig.swipePanel;
        var swipePanelOnlyClose = $.smConfig.swipePanelOnlyClose;
        var swipePanelCloseOpposite = true;
        var swipePanelActiveArea = false;
        var swipePanelThreshold = 2;
        var swipePanelNoFollow = false;

        if(!(swipePanel || swipePanelOnlyClose)) return;

        var panelOverlay = $('.panel-overlay');
        var isTouched, isMoved, isScrolling, touchesStart = {}, touchStartTime, touchesDiff, translate, opened, panelWidth, effect, direction;
        var views = $('.page');

        function handleTouchStart(e) {
            if (!$.allowPanelOpen || (!swipePanel && !swipePanelOnlyClose) || isTouched) return;
            if ($('.modal-in, .photo-browser-in').length > 0) return;
            if (!(swipePanelCloseOpposite || swipePanelOnlyClose)) {
                if ($('.panel.active').length > 0 && !panel.hasClass('active')) return;
            }
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            if (swipePanelCloseOpposite || swipePanelOnlyClose) {
                if ($('.panel.active').length > 0) {
                    side = $('.panel.active').hasClass('panel-left') ? 'left' : 'right';
                }
                else {
                    if (swipePanelOnlyClose) return;
                    side = swipePanel;
                }
                if (!side) return;
            }
            panel = $('.panel.panel-' + side);
            if(!panel[0]) return;
            opened = panel.hasClass('active');
            if (swipePanelActiveArea && !opened) {
                if (side === 'left') {
                    if (touchesStart.x > swipePanelActiveArea) return;
                }
                if (side === 'right') {
                    if (touchesStart.x < window.innerWidth - swipePanelActiveArea) return;
                }
            }
            isMoved = false;
            isTouched = true;
            isScrolling = undefined;

            touchStartTime = (new Date()).getTime();
            direction = undefined;
        }
        function handleTouchMove(e) {
            if (!isTouched) return;
            if(!panel[0]) return;
            if (e.f7PreventPanelSwipe) return;
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
            }
            if (isScrolling) {
                isTouched = false;
                return;
            }
            if (!direction) {
                if (pageX > touchesStart.x) {
                    direction = 'to-right';
                }
                else {
                    direction = 'to-left';
                }

                if (
                        side === 'left' &&
                        (
                         direction === 'to-left' && !panel.hasClass('active')
                        ) ||
                        side === 'right' &&
                        (
                         direction === 'to-right' && !panel.hasClass('active')
                        )
                   )
                {
                    isTouched = false;
                    return;
                }
            }

            if (swipePanelNoFollow) {
                var timeDiff = (new Date()).getTime() - touchStartTime;
                if (timeDiff < 300) {
                    if (direction === 'to-left') {
                        if (side === 'right') $.openPanel(side);
                        if (side === 'left' && panel.hasClass('active')) $.closePanel();
                    }
                    if (direction === 'to-right') {
                        if (side === 'left') $.openPanel(side);
                        if (side === 'right' && panel.hasClass('active')) $.closePanel();
                    }
                }
                isTouched = false;
                console.log(3);
                isMoved = false;
                return;
            }

            if (!isMoved) {
                effect = panel.hasClass('panel-cover') ? 'cover' : 'reveal';
                if (!opened) {
                    panel.show();
                    panelOverlay.show();
                }
                panelWidth = panel[0].offsetWidth;
                panel.transition(0);
                /*
                   if (panel.find('.' + app.params.viewClass).length > 0) {
                   if (app.sizeNavbars) app.sizeNavbars(panel.find('.' + app.params.viewClass)[0]);
                   }
                   */
            }

            isMoved = true;

            e.preventDefault();
            var threshold = opened ? 0 : -swipePanelThreshold;
            if (side === 'right') threshold = -threshold;

            touchesDiff = pageX - touchesStart.x + threshold;

            if (side === 'right') {
                translate = touchesDiff  - (opened ? panelWidth : 0);
                if (translate > 0) translate = 0;
                if (translate < -panelWidth) {
                    translate = -panelWidth;
                }
            }
            else {
                translate = touchesDiff  + (opened ? panelWidth : 0);
                if (translate < 0) translate = 0;
                if (translate > panelWidth) {
                    translate = panelWidth;
                }
            }
            if (effect === 'reveal') {
                views.transform('translate3d(' + translate + 'px,0,0)').transition(0);
                panelOverlay.transform('translate3d(' + translate + 'px,0,0)');
                //app.pluginHook('swipePanelSetTransform', views[0], panel[0], Math.abs(translate / panelWidth));
            }
            else {
                panel.transform('translate3d(' + translate + 'px,0,0)').transition(0);
                //app.pluginHook('swipePanelSetTransform', views[0], panel[0], Math.abs(translate / panelWidth));
            }
        }
        function handleTouchEnd(e) {
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            isTouched = false;
            isMoved = false;
            var timeDiff = (new Date()).getTime() - touchStartTime;
            var action;
            var edge = (translate === 0 || Math.abs(translate) === panelWidth);

            if (!opened) {
                if (translate === 0) {
                    action = 'reset';
                }
                else if (
                        timeDiff < 300 && Math.abs(translate) > 0 ||
                        timeDiff >= 300 && (Math.abs(translate) >= panelWidth / 2)
                        ) {
                            action = 'swap';
                        }
                else {
                    action = 'reset';
                }
            }
            else {
                if (translate === -panelWidth) {
                    action = 'reset';
                }
                else if (
                        timeDiff < 300 && Math.abs(translate) >= 0 ||
                        timeDiff >= 300 && (Math.abs(translate) <= panelWidth / 2)
                        ) {
                            if (side === 'left' && translate === panelWidth) action = 'reset';
                            else action = 'swap';
                        }
                else {
                    action = 'reset';
                }
            }
            if (action === 'swap') {
                $.allowPanelOpen = true;
                if (opened) {
                    $.closePanel();
                    if (edge) {
                        panel.css({display: ''});
                        $('body').removeClass('panel-closing');
                    }
                }
                else {
                    $.openPanel(side);
                }
                if (edge) $.allowPanelOpen = true;
            }
            if (action === 'reset') {
                if (opened) {
                    $.allowPanelOpen = true;
                    $.openPanel(side);
                }
                else {
                    $.closePanel();
                    if (edge) {
                        $.allowPanelOpen = true;
                        panel.css({display: ''});
                    }
                    else {
                        var target = effect === 'reveal' ? views : panel;
                        $('body').addClass('panel-closing');
                        target.transitionEnd(function () {
                            $.allowPanelOpen = true;
                            panel.css({display: ''});
                            $('body').removeClass('panel-closing');
                        });
                    }
                }
            }
            if (effect === 'reveal') {
                views.transition('');
                views.transform('');
            }
            panel.transition('').transform('');
            panelOverlay.css({display: ''}).transform('');
        }
        $(document).on($.touchEvents.start, handleTouchStart);
        $(document).on($.touchEvents.move, handleTouchMove);
        $(document).on($.touchEvents.end, handleTouchEnd);
    };

    $.initSwipePanels();
}(Zepto);

/**
 * 路由
 *
 * 路由功能将接管页面的链接点击行为，最后达到动画切换的效果，具体如下：
 *  1. 链接对应的是另一个页面，那么则尝试 ajax 加载，然后把新页面里的符合约定的结构提取出来，然后做动画切换；如果没法 ajax 或结构不符合，那么则回退为普通的页面跳转
 *  2. 链接是当前页面的锚点，并且该锚点对应的元素存在且符合路由约定，那么则把该元素做动画切入
 *  3. 浏览器前进后退（history.forward/history.back）时，也使用动画效果
 *  4. 如果链接有 back 这个 class，那么则忽略一切，直接调用 history.back() 来后退
 *
 * 路由功能默认开启，如果需要关闭路由功能，那么在 zepto 之后，msui 脚本之前设置 $.config.router = false 即可（intro.js 中会 extend 到 $.smConfig 中）。
 *
 * 可以设置 $.config.routerFilter 函数来设置当前点击链接是否使用路由功能，实参是 a 链接的 zepto 对象；返回 false 表示不使用 router 功能。
 *
 * ajax 载入新的文档时，并不会执行里面的 js。到目前为止，在开启路由功能时，建议的做法是：
 *  把所有页面的 js 都放到同一个脚本里，js 里面的事件绑定使用委托而不是直接的绑定在元素上（因为动态加载的页面元素还不存在），然后所有页面都引用相同的 js 脚本。非事件类可以通过监控 pageInit 事件，根据里面的 pageId 来做对应区别处理。
 *
 * 如果有需要
 *
 * 对外暴露的方法
 *  - load （原 loadPage 效果一致,但后者已标记为待移除）
 *  - forward
 *  - back
 *
 * 事件
 * pageLoad* 系列在发生 ajax 加载时才会触发；当是块切换或已缓存的情况下，不会发送这些事件
 *  - pageLoadCancel: 如果前一个还没加载完,那么取消并发送该事件
 *  - pageLoadStart: 开始加载
 *  - pageLodComplete: ajax complete 完成
 *  - pageLoadError: ajax 发生 error
 *  - pageAnimationStart: 执行动画切换前，实参是 event，sectionId 和 $section
 *  - pageAnimationEnd: 执行动画完毕，实参是 event，sectionId 和 $section
 *  - beforePageRemove: 新 document 载入且动画切换完毕，旧的 document remove 之前在 window 上触发，实参是 event 和 $pageContainer
 *  - pageRemoved: 新的 document 载入且动画切换完毕，旧的 document remove 之后在 window 上触发
 *  - beforePageSwitch: page 切换前，在 pageAnimationStart 前，beforePageSwitch 之后会做一些额外的处理才触发 pageAnimationStart
 *  - pageInitInternal: （经 init.js 处理后，对外是 pageInit）紧跟着动画完成的事件，实参是 event，sectionId 和 $section
 *
 * 术语
 *  - 文档（document），不带 hash 的 url 关联着的应答 html 结构
 *  - 块（section），一个文档内有指定块标识的元素
 *
 * 路由实现约定
 *  - 每个文档的需要展示的内容必需位于指定的标识（routerConfig.sectionGroupClass）的元素里面，默认是: div.page-group （注意,如果改变这个需要同时改变 less 中的命名）
 *  - 每个块必需带有指定的块标识（routerConfig.pageClass），默认是 .page
 *
 *  即，使用路由功能的每一个文档应当是下面这样的结构（省略 <body> 等）:
 *      <div class="page-group">
 *          <div class="page">xxx</div>
 *          <div class="page">yyy</div>
 *      </div>
 *
 * 另，每一个块都应当有一个唯一的 ID，这样才能通过 #the-id 的形式来切换定位。
 * 当一个块没有 id 时，如果是第一个的默认的需要展示的块，那么会给其添加一个随机的 id；否则，没有 id 的块将不会被切换展示。
 *
 * 通过 history.state/history.pushState 以及用 sessionStorage 来记录当前 state 以及最大的 state id 来辅助前进后退的切换效果，所以在不支持 sessionStorage 的情况下，将不开启路由功能。
 *
 * 为了解决 ajax 载入页面导致重复 ID 以及重复 popup 等功能，上面约定了使用路由功能的所有可展示内容都必需位于指定元素内。从而可以在进行文档间切换时可以进行两个文档的整体移动，切换完毕后再把前一个文档的内容从页面之间移除。
 *
 * 默认地过滤了部分协议的链接，包括 tel:, javascript:, mailto:，这些链接将不会使用路由功能。如果有更多的自定义控制需求，可以在 $.config.routerFilter 实现
 *
 * 注: 以 _ 开头的函数标明用于此处内部使用，可根据需要随时重构变更，不对外确保兼容性。
 *
 */
+function($) {
    'use strict';

    if (!window.CustomEvent) {
        window.CustomEvent = function(type, config) {
            config = config || { bubbles: false, cancelable: false, detail: undefined};
            var e = document.createEvent('CustomEvent');
            e.initCustomEvent(type, config.bubbles, config.cancelable, config.detail);
            return e;
        };

        window.CustomEvent.prototype = window.Event.prototype;
    }

    var EVENTS = {
        pageLoadStart: 'pageLoadStart', // ajax 开始加载新页面前
        pageLoadCancel: 'pageLoadCancel', // 取消前一个 ajax 加载动作后
        pageLoadError: 'pageLoadError', // ajax 加载页面失败后
        pageLoadComplete: 'pageLoadComplete', // ajax 加载页面完成后（不论成功与否）
        pageAnimationStart: 'pageAnimationStart', // 动画切换 page 前
        pageAnimationEnd: 'pageAnimationEnd', // 动画切换 page 结束后
        beforePageRemove: 'beforePageRemove', // 移除旧 document 前（适用于非内联 page 切换）
        pageRemoved: 'pageRemoved', // 移除旧 document 后（适用于非内联 page 切换）
        beforePageSwitch: 'beforePageSwitch', // page 切换前，在 pageAnimationStart 前，beforePageSwitch 之后会做一些额外的处理才触发 pageAnimationStart
        pageInit: 'pageInitInternal' // 目前是定义为一个 page 加载完毕后（实际和 pageAnimationEnd 等同）
    };

    var Util = {
        /**
         * 获取 url 的 fragment（即 hash 中去掉 # 的剩余部分）
         *
         * 如果没有则返回空字符串
         * 如: http://example.com/path/?query=d#123 => 123
         *
         * @param {String} url url
         * @returns {String}
         */
        getUrlFragment: function(url) {
            var hashIndex = url.indexOf('#');
            return hashIndex === -1 ? '' : url.slice(hashIndex + 1);
        },
        /**
         * 获取一个链接相对于当前页面的绝对地址形式
         *
         * 假设当前页面是 http://a.com/b/c
         * 那么有以下情况:
         * d => http://a.com/b/d
         * /e => http://a.com/e
         * #1 => http://a.com/b/c#1
         * http://b.com/f => http://b.com/f
         *
         * @param {String} url url
         * @returns {String}
         */
        getAbsoluteUrl: function(url) {
            var link = document.createElement('a');
            link.setAttribute('href', url);
            var absoluteUrl = link.href;
            link = null;
            return absoluteUrl;
        },
        /**
         * 获取一个 url 的基本部分，即不包括 hash
         *
         * @param {String} url url
         * @returns {String}
         */
        getBaseUrl: function(url) {
            var hashIndex = url.indexOf('#');
            return hashIndex === -1 ? url.slice(0) : url.slice(0, hashIndex);
        },
        /**
         * 把一个字符串的 url 转为一个可获取其 base 和 fragment 等的对象
         *
         * @param {String} url url
         * @returns {UrlObject}
         */
        toUrlObject: function(url) {
            var fullUrl = this.getAbsoluteUrl(url),
                baseUrl = this.getBaseUrl(fullUrl),
                fragment = this.getUrlFragment(url);

            return {
                base: baseUrl,
                full: fullUrl,
                original: url,
                fragment: fragment
            };
        },
        /**
         * 判断浏览器是否支持 sessionStorage，支持返回 true，否则返回 false
         * @returns {Boolean}
         */
        supportStorage: function() {
            var mod = 'sm.router.storage.ability';
            try {
                sessionStorage.setItem(mod, mod);
                sessionStorage.removeItem(mod);
                return true;
            } catch(e) {
                return false;
            }
        }
    };

    var routerConfig = {
        sectionGroupClass: 'page-group',
        // 表示是当前 page 的 class
        curPageClass: 'page-current',
        // 用来辅助切换时表示 page 是 visible 的,
        // 之所以不用 curPageClass，是因为 page-current 已被赋予了「当前 page」这一含义而不仅仅是 display: block
        // 并且，别的地方已经使用了，所以不方便做变更，故新增一个
        visiblePageClass: 'page-visible',
        // 表示是 page 的 class，注意，仅是标志 class，而不是所有的 class
        pageClass: 'page'
    };

    var DIRECTION = {
        leftToRight: 'from-left-to-right',
        rightToLeft: 'from-right-to-left'
    };

    var theHistory = window.history;

    var Router = function() {
        this.sessionNames = {
            currentState: 'sm.router.currentState',
            maxStateId: 'sm.router.maxStateId'
        };

        this._init();
        this.xhr = null;
        window.addEventListener('popstate', this._onPopState.bind(this));
    };

    /**
     * 初始化
     *
     * - 把当前文档内容缓存起来
     * - 查找默认展示的块内容，查找顺序如下
     *      1. id 是 url 中的 fragment 的元素
     *      2. 有当前块 class 标识的第一个元素
     *      3. 第一个块
     * - 初始页面 state 处理
     *
     * @private
     */
    Router.prototype._init = function() {

        this.$view = $('body');

        // 用来保存 document 的 map
        this.cache = {};
        var $doc = $(document);
        var currentUrl = location.href;
        this._saveDocumentIntoCache($doc, currentUrl);

        var curPageId;

        var currentUrlObj = Util.toUrlObject(currentUrl);
        var $allSection = $doc.find('.' + routerConfig.pageClass);
        var $visibleSection = $doc.find('.' + routerConfig.curPageClass);
        var $curVisibleSection = $visibleSection.eq(0);
        var $hashSection;

        if (currentUrlObj.fragment) {
            $hashSection = $doc.find('#' + currentUrlObj.fragment);
        }
        if ($hashSection && $hashSection.length) {
            $visibleSection = $hashSection.eq(0);
        } else if (!$visibleSection.length) {
            $visibleSection = $allSection.eq(0);
        }
        if (!$visibleSection.attr('id')) {
            $visibleSection.attr('id', this._generateRandomId());
        }

        if ($curVisibleSection.length &&
            ($curVisibleSection.attr('id') !== $visibleSection.attr('id'))) {
            // 在 router 到 inner page 的情况下，刷新（或者直接访问该链接）
            // 直接切换 class 会有「闪」的现象,或许可以采用 animateSection 来减缓一下
            $curVisibleSection.removeClass(routerConfig.curPageClass);
            $visibleSection.addClass(routerConfig.curPageClass);
        } else {
            $visibleSection.addClass(routerConfig.curPageClass);
        }
        curPageId = $visibleSection.attr('id');


        // 新进入一个使用 history.state 相关技术的页面时，如果第一个 state 不 push/replace,
        // 那么在后退回该页面时，将不触发 popState 事件
        if (theHistory.state === null) {
            var curState = {
                id: this._getNextStateId(),
                url: Util.toUrlObject(currentUrl),
                pageId: curPageId
            };

            theHistory.replaceState(curState, '', currentUrl);
            this._saveAsCurrentState(curState);
            this._incMaxStateId();
        }
    };

    /**
     * 切换到 url 指定的块或文档
     *
     * 如果 url 指向的是当前页面，那么认为是切换块；
     * 否则是切换文档
     *
     * @param {String} url url
     * @param {Boolean=} ignoreCache 是否强制请求不使用缓存，对 document 生效，默认是 false
     */
    Router.prototype.load = function(url, ignoreCache) {
        if (ignoreCache === undefined) {
            ignoreCache = false;
        }

        if (this._isTheSameDocument(location.href, url)) {
            this._switchToSection(Util.getUrlFragment(url));
        } else {
            this._saveDocumentIntoCache($(document), location.href);
            this._switchToDocument(url, ignoreCache);
        }
    };

    /**
     * 调用 history.forward()
     */
    Router.prototype.forward = function() {
        theHistory.forward();
    };

    /**
     * 调用 history.back()
     */
    Router.prototype.back = function() {
        theHistory.back();
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @deprecated
     */
    Router.prototype.loadPage = Router.prototype.load;

    /**
     * 切换显示当前文档另一个块
     *
     * 把新块从右边切入展示，同时会把新的块的记录用 history.pushState 来保存起来
     *
     * 如果已经是当前显示的块，那么不做任何处理；
     * 如果没对应的块，那么忽略。
     *
     * @param {String} sectionId 待切换显示的块的 id
     * @private
     */
    Router.prototype._switchToSection = function(sectionId) {
        if (!sectionId) {
            return;
        }

        var $curPage = this._getCurrentSection(),
            $newPage = $('#' + sectionId);

        // 如果已经是当前页，不做任何处理
        if ($curPage === $newPage) {
            return;
        }

        this._animateSection($curPage, $newPage, DIRECTION.rightToLeft);
        this._pushNewState('#' + sectionId, sectionId);
    };

    /**
     * 载入显示一个新的文档
     *
     * - 如果有缓存，那么直接利用缓存来切换
     * - 否则，先把页面加载过来缓存，然后再切换
     *      - 如果解析失败，那么用 location.href 的方式来跳转
     *
     * 注意：不能在这里以及其之后用 location.href 来 **读取** 切换前的页面的 url，
     *     因为如果是 popState 时的调用，那么此时 location 已经是 pop 出来的 state 的了
     *
     * @param {String} url 新的文档的 url
     * @param {Boolean=} ignoreCache 是否不使用缓存强制加载页面
     * @param {Boolean=} isPushState 是否需要 pushState
     * @param {String=} direction 新文档切入的方向
     * @private
     */
    Router.prototype._switchToDocument = function(url, ignoreCache, isPushState, direction) {
        var baseUrl = Util.toUrlObject(url).base;

        if (ignoreCache) {
            delete this.cache[baseUrl];
        }

        var cacheDocument = this.cache[baseUrl];
        var context = this;

        if (cacheDocument) {
            this._doSwitchDocument(url, isPushState, direction);
        } else {
            this._loadDocument(url, {
                success: function($doc) {
                    try {
                        context._parseDocument(url, $doc);
                        context._doSwitchDocument(url, isPushState, direction);
                    } catch (e) {
                        location.href = url;
                    }
                },
                error: function() {
                    location.href = url;
                }
            });
        }
    };

    /**
     * 利用缓存来做具体的切换文档操作
     *
     * - 确定待切入的文档的默认展示 section
     * - 把新文档 append 到 view 中
     * - 动画切换文档
     * - 如果需要 pushState，那么把最新的状态 push 进去并把当前状态更新为该状态
     *
     * @param {String} url 待切换的文档的 url
     * @param {Boolean} isPushState 加载页面后是否需要 pushState，默认是 true
     * @param {String} direction 动画切换方向，默认是 DIRECTION.rightToLeft
     * @private
     */
    Router.prototype._doSwitchDocument = function(url, isPushState, direction) {
        if (typeof isPushState === 'undefined') {
            isPushState = true;
        }

        var urlObj = Util.toUrlObject(url);
        var $currentDoc = this.$view.find('.' + routerConfig.sectionGroupClass);
        var $newDoc = $($('<div></div>').append(this.cache[urlObj.base].$content).html());

        // 确定一个 document 展示 section 的顺序
        // 1. 与 hash 关联的 element
        // 2. 默认的标识为 current 的 element
        // 3. 第一个 section
        var $allSection = $newDoc.find('.' + routerConfig.pageClass);
        var $visibleSection = $newDoc.find('.' + routerConfig.curPageClass);
        var $hashSection;

        if (urlObj.fragment) {
            $hashSection = $newDoc.find('#' + urlObj.fragment);
        }
        if ($hashSection && $hashSection.length) {
            $visibleSection = $hashSection.eq(0);
        } else if (!$visibleSection.length) {
            $visibleSection = $allSection.eq(0);
        }
        if (!$visibleSection.attr('id')) {
            $visibleSection.attr('id', this._generateRandomId());
        }

        var $currentSection = this._getCurrentSection();
        $currentSection.trigger(EVENTS.beforePageSwitch, [$currentSection.attr('id'), $currentSection]);

        $allSection.removeClass(routerConfig.curPageClass);
        $visibleSection.addClass(routerConfig.curPageClass);

        // prepend 而不 append 的目的是避免 append 进去新的 document 在后面，
        // 其里面的默认展示的(.page-current) 的页面直接就覆盖了原显示的页面（因为都是 absolute）
        this.$view.prepend($newDoc);

        this._animateDocument($currentDoc, $newDoc, $visibleSection, direction);

        if (isPushState) {
            this._pushNewState(url, $visibleSection.attr('id'));
        }
    };

    /**
     * 判断两个 url 指向的页面是否是同一个
     *
     * 判断方式: 如果两个 url 的 base 形式（不带 hash 的绝对形式）相同，那么认为是同一个页面
     *
     * @param {String} url
     * @param {String} anotherUrl
     * @returns {Boolean}
     * @private
     */
    Router.prototype._isTheSameDocument = function(url, anotherUrl) {
        return Util.toUrlObject(url).base === Util.toUrlObject(anotherUrl).base;
    };

    /**
     * ajax 加载 url 指定的页面内容
     *
     * 加载过程中会发出以下事件
     *  pageLoadCancel: 如果前一个还没加载完,那么取消并发送该事件
     *  pageLoadStart: 开始加载
     *  pageLodComplete: ajax complete 完成
     *  pageLoadError: ajax 发生 error
     *
     *
     * @param {String} url url
     * @param {Object=} callback 回调函数配置，可选，可以配置 success\error 和 complete
     *      所有回调函数的 this 都是 null，各自实参如下：
     *      success: $doc, status, xhr
     *      error: xhr, status, err
     *      complete: xhr, status
     *
     * @private
     */
    Router.prototype._loadDocument = function(url, callback) {
        if (this.xhr && this.xhr.readyState < 4) {
            this.xhr.onreadystatechange = function() {
            };
            this.xhr.abort();
            this.dispatch(EVENTS.pageLoadCancel);
        }

        this.dispatch(EVENTS.pageLoadStart);

        callback = callback || {};
        var self = this;

        this.xhr = $.ajax({
            url: url,
            success: $.proxy(function(data, status, xhr) {
                // 给包一层 <html/>，从而可以拿到完整的结构
                var $doc = $('<html></html>');
                $doc.append(data);
                callback.success && callback.success.call(null, $doc, status, xhr);
            }, this),
            error: function(xhr, status, err) {
                callback.error && callback.error.call(null, xhr, status, err);
                self.dispatch(EVENTS.pageLoadError);
            },
            complete: function(xhr, status) {
                callback.complete && callback.complete.call(null, xhr, status);
                self.dispatch(EVENTS.pageLoadComplete);
            }
        });
    };

    /**
     * 对于 ajax 加载进来的页面，把其缓存起来
     *
     * @param {String} url url
     * @param $doc ajax 载入的页面的 jq 对象，可以看做是该页面的 $(document)
     * @private
     */
    Router.prototype._parseDocument = function(url, $doc) {
        var $innerView = $doc.find('.' + routerConfig.sectionGroupClass);

        if (!$innerView.length) {
            throw new Error('missing router view mark: ' + routerConfig.sectionGroupClass);
        }

        this._saveDocumentIntoCache($doc, url);
    };

    /**
     * 把一个页面的相关信息保存到 this.cache 中
     *
     * 以页面的 baseUrl 为 key,而 value 则是一个 DocumentCache
     *
     * @param {*} doc doc
     * @param {String} url url
     * @private
     */
    Router.prototype._saveDocumentIntoCache = function(doc, url) {
        var urlAsKey = Util.toUrlObject(url).base;
        var $doc = $(doc);

        this.cache[urlAsKey] = {
            $doc: $doc,
            $content: $doc.find('.' + routerConfig.sectionGroupClass)
        };
    };

    /**
     * 从 sessionStorage 中获取保存下来的「当前状态」
     *
     * 如果解析失败，那么认为当前状态是 null
     *
     * @returns {State|null}
     * @private
     */
    Router.prototype._getLastState = function() {
        var currentState = sessionStorage.getItem(this.sessionNames.currentState);
        try {
            currentState = JSON.parse(currentState);
        } catch(e) {
            currentState = null;
        }

        return currentState;
    };

    /**
     * 把一个状态设为当前状态，保存仅 sessionStorage 中
     *
     * @param {State} state
     * @private
     */
    Router.prototype._saveAsCurrentState = function(state) {
        sessionStorage.setItem(this.sessionNames.currentState, JSON.stringify(state));
    };

    /**
     * 获取下一个 state 的 id
     *
     * 读取 sessionStorage 里的最后的状态的 id，然后 + 1；如果原没设置，那么返回 1
     *
     * @returns {number}
     * @private
     */
    Router.prototype._getNextStateId = function() {
        var maxStateId = sessionStorage.getItem(this.sessionNames.maxStateId);
        return maxStateId ? parseInt(maxStateId, 10) + 1 : 1;
    };

    /**
     * 把 sessionStorage 里的最后状态的 id 自加 1
     *
     * @private
     */
    Router.prototype._incMaxStateId = function() {
        sessionStorage.setItem(this.sessionNames.maxStateId, this._getNextStateId());
    };

    /**
     * 从一个文档切换为显示另一个文档
     *
     * @param $from 目前显示的文档
     * @param $to 待切换显示的新文档
     * @param $visibleSection 新文档中展示的 section 元素
     * @param direction 新文档切入方向
     * @private
     */
    Router.prototype._animateDocument = function($from, $to, $visibleSection, direction) {
        var sectionId = $visibleSection.attr('id');


        var $visibleSectionInFrom = $from.find('.' + routerConfig.curPageClass);
        $visibleSectionInFrom.addClass(routerConfig.visiblePageClass).removeClass(routerConfig.curPageClass);

        $visibleSection.trigger(EVENTS.pageAnimationStart, [sectionId, $visibleSection]);

        this._animateElement($from, $to, direction);

        $from.animationEnd(function() {
            $visibleSectionInFrom.removeClass(routerConfig.visiblePageClass);
            // 移除 document 前后，发送 beforePageRemove 和 pageRemoved 事件
            $(window).trigger(EVENTS.beforePageRemove, [$from]);
            $from.remove();
            $(window).trigger(EVENTS.pageRemoved);
        });

        $to.animationEnd(function() {
            $visibleSection.trigger(EVENTS.pageAnimationEnd, [sectionId, $visibleSection]);
            // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
            $visibleSection.trigger(EVENTS.pageInit, [sectionId, $visibleSection]);
        });
    };

    /**
     * 把当前文档的展示 section 从一个 section 切换到另一个 section
     *
     * @param $from
     * @param $to
     * @param direction
     * @private
     */
    Router.prototype._animateSection = function($from, $to, direction) {
        var toId = $to.attr('id');
        $from.trigger(EVENTS.beforePageSwitch, [$from.attr('id'), $from]);

        $from.removeClass(routerConfig.curPageClass);
        $to.addClass(routerConfig.curPageClass);
        $to.trigger(EVENTS.pageAnimationStart, [toId, $to]);
        this._animateElement($from, $to, direction);
        $to.animationEnd(function() {
            $to.trigger(EVENTS.pageAnimationEnd, [toId, $to]);
            // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
            $to.trigger(EVENTS.pageInit, [toId, $to]);
        });
    };

    /**
     * 切换显示两个元素
     *
     * 切换是通过更新 class 来实现的，而具体的切换动画则是 class 关联的 css 来实现
     *
     * @param $from 当前显示的元素
     * @param $to 待显示的元素
     * @param direction 切换的方向
     * @private
     */
    Router.prototype._animateElement = function($from, $to, direction) {
        // todo: 可考虑如果入参不指定，那么尝试读取 $to 的属性，再没有再使用默认的
        // 考虑读取点击的链接上指定的方向
        if (typeof direction === 'undefined') {
            direction = DIRECTION.rightToLeft;
        }

        var animPageClasses = [
            'page-from-center-to-left',
            'page-from-center-to-right',
            'page-from-right-to-center',
            'page-from-left-to-center'].join(' ');

        var classForFrom, classForTo;
        switch(direction) {
            case DIRECTION.rightToLeft:
                classForFrom = 'page-from-center-to-left';
                classForTo = 'page-from-right-to-center';
                break;
            case DIRECTION.leftToRight:
                classForFrom = 'page-from-center-to-right';
                classForTo = 'page-from-left-to-center';
                break;
            default:
                classForFrom = 'page-from-center-to-left';
                classForTo = 'page-from-right-to-center';
                break;
        }

        $from.removeClass(animPageClasses).addClass(classForFrom);
        $to.removeClass(animPageClasses).addClass(classForTo);

        $from.animationEnd(function() {
            $from.removeClass(animPageClasses);
        });
        $to.animationEnd(function() {
            $to.removeClass(animPageClasses);
        });
    };

    /**
     * 获取当前显示的第一个 section
     *
     * @returns {*}
     * @private
     */
    Router.prototype._getCurrentSection = function() {
        return this.$view.find('.' + routerConfig.curPageClass).eq(0);
    };

    /**
     * popState 事件关联着的后退处理
     *
     * 判断两个 state 判断是否是属于同一个文档，然后做对应的 section 或文档切换；
     * 同时在切换后把新 state 设为当前 state
     *
     * @param {State} state 新 state
     * @param {State} fromState 旧 state
     * @private
     */
    Router.prototype._back = function(state, fromState) {
        if (this._isTheSameDocument(state.url.full, fromState.url.full)) {
            var $newPage = $('#' + state.pageId);
            if ($newPage.length) {
                var $currentPage = this._getCurrentSection();
                this._animateSection($currentPage, $newPage, DIRECTION.leftToRight);
                this._saveAsCurrentState(state);
            } else {
                location.href = state.url.full;
            }
        } else {
            this._saveDocumentIntoCache($(document), fromState.url.full);
            this._switchToDocument(state.url.full, false, false, DIRECTION.leftToRight);
            this._saveAsCurrentState(state);
        }
    };

    /**
     * popState 事件关联着的前进处理,类似于 _back，不同的是切换方向
     *
     * @param {State} state 新 state
     * @param {State} fromState 旧 state
     * @private
     */
    Router.prototype._forward = function(state, fromState) {
        if (this._isTheSameDocument(state.url.full, fromState.url.full)) {
            var $newPage = $('#' + state.pageId);
            if ($newPage.length) {
                var $currentPage = this._getCurrentSection();
                this._animateSection($currentPage, $newPage, DIRECTION.rightToLeft);
                this._saveAsCurrentState(state);
            } else {
                location.href = state.url.full;
            }
        } else {
            this._saveDocumentIntoCache($(document), fromState.url.full);
            this._switchToDocument(state.url.full, false, false, DIRECTION.rightToLeft);
            this._saveAsCurrentState(state);
        }
    };

    /**
     * popState 事件处理
     *
     * 根据 pop 出来的 state 和当前 state 来判断是前进还是后退
     *
     * @param event
     * @private
     */
    Router.prototype._onPopState = function(event) {
        var state = event.state;
        // if not a valid state, do nothing
        if (!state || !state.pageId) {
            return;
        }

        var lastState = this._getLastState();

        if (!lastState) {
            console.error && console.error('Missing last state when backward or forward');
            return;
        }

        if (state.id === lastState.id) {
            return;
        }

        if (state.id < lastState.id) {
            this._back(state, lastState);
        } else {
            this._forward(state, lastState);
        }
    };

    /**
     * 页面进入到一个新状态
     *
     * 把新状态 push 进去，设置为当前的状态，然后把 maxState 的 id +1。
     *
     * @param {String} url 新状态的 url
     * @param {String} sectionId 新状态中显示的 section 元素的 id
     * @private
     */
    Router.prototype._pushNewState = function(url, sectionId) {
        var state = {
            id: this._getNextStateId(),
            pageId: sectionId,
            url: Util.toUrlObject(url)
        };

        theHistory.pushState(state, '', url);
        this._saveAsCurrentState(state);
        this._incMaxStateId();
    };

    /**
     * 生成一个随机的 id
     *
     * @returns {string}
     * @private
     */
    Router.prototype._generateRandomId = function() {
        return "page-" + (+new Date());
    };

    Router.prototype.dispatch = function(event) {
        var e = new CustomEvent(event, {
            bubbles: true,
            cancelable: true
        });

        //noinspection JSUnresolvedFunction
        window.dispatchEvent(e);
    };

    /**
     * 判断一个链接是否使用 router 来处理
     *
     * @param $link
     * @returns {boolean}
     */
    function isInRouterBlackList($link) {
        var classBlackList = [
            'external',
            'tab-link',
            'open-popup',
            'close-popup',
            'open-panel',
            'close-panel'
        ];

        for (var i = classBlackList.length -1 ; i >= 0; i--) {
            if ($link.hasClass(classBlackList[i])) {
                return true;
            }
        }

        var linkEle = $link.get(0);
        var linkHref = linkEle.getAttribute('href');

        var protoWhiteList = [
            'http',
            'https'
        ];

        //如果非noscheme形式的链接，且协议不是http(s)，那么路由不会处理这类链接
        if (/^(\w+):/.test(linkHref) && protoWhiteList.indexOf(RegExp.$1) < 0) {
            return true;
        }

        //noinspection RedundantIfStatementJS
        if (linkEle.hasAttribute('external')) {
            return true;
        }

        return false;
    }

    /**
     * 自定义是否执行路由功能的过滤器
     *
     * 可以在外部定义 $.config.routerFilter 函数，实参是点击链接的 Zepto 对象。
     *
     * @param $link 当前点击的链接的 Zepto 对象
     * @returns {boolean} 返回 true 表示执行路由功能，否则不做路由处理
     */
    function customClickFilter($link) {
        var customRouterFilter = $.smConfig.routerFilter;
        if ($.isFunction(customRouterFilter)) {
            var filterResult = customRouterFilter($link);
            if (typeof filterResult === 'boolean') {
                return filterResult;
            }
        }

        return true;
    }

    $(function() {
        // 用户可选关闭router功能
        if (!$.smConfig.router) {
            return;
        }

        if (!Util.supportStorage()) {
            return;
        }

        var $pages = $('.' + routerConfig.pageClass);
        if (!$pages.length) {
            var warnMsg = 'Disable router function because of no .page elements';
            if (window.console && window.console.warn) {
                console.warn(warnMsg);
            }
            return;
        }

        var router = $.router = new Router();

        $(document).on('click', 'a', function(e) {
            var $target = $(e.currentTarget);

            var filterResult = customClickFilter($target);
            if (!filterResult) {
                return;
            }

            if (isInRouterBlackList($target)) {
                return;
            }

            e.preventDefault();

            if ($target.hasClass('back')) {
                router.back();
            } else {
                var url = $target.attr('href');
                if (!url || url === '#') {
                    return;
                }

                var ignoreCache = $target.attr('data-no-cache') === 'true';

                router.load(url, ignoreCache);
            }
        });
    });
}(Zepto);

/**
 * @typedef {Object} State
 * @property {Number} id
 * @property {String} url
 * @property {String} pageId
 */

/**
 * @typedef {Object} UrlObject 字符串 url 转为的对象
 * @property {String} base url 的基本路径
 * @property {String} full url 的完整绝对路径
 * @property {String} origin 转换前的 url
 * @property {String} fragment url 的 fragment
 */

/**
 * @typedef {Object} DocumentCache
 * @property {*|HTMLElement} $doc 看做是 $(document)
 * @property {*|HTMLElement} $content $doc 里的 routerConfig.innerViewClass 元素
 */

/*======================================================
************   Modals   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
  "use strict";
  $.lastPosition =function(options) {
    if ( !sessionStorage) {
        return;
    }
    // 需要记忆模块的className
    var needMemoryClass = options.needMemoryClass || [];

    $(window).off('beforePageSwitch').on('beforePageSwitch', function(event,id,arg) {
      updateMemory(id,arg);
    });
    $(window).off('pageAnimationStart').on('pageAnimationStart', function(event,id,arg) {
      getMemory(id,arg);
    });
    //让后退页面回到之前的高度
    function getMemory(id,arg){
      needMemoryClass.forEach(function(item, index) {
          if ($(item).length === 0) {
              return;
          }
          var positionName = id ;
          // 遍历对应节点设置存储的高度
          var memoryHeight = sessionStorage.getItem(positionName);
          arg.find(item).scrollTop(parseInt(memoryHeight));

      });
    }
    //记住即将离开的页面的高度
    function updateMemory(id,arg) {
        var positionName = id ;
        // 存储需要记忆模块的高度
        needMemoryClass.forEach(function(item, index) {
            if ($(item).length === 0) {
                return;
            }
            sessionStorage.setItem(
                positionName,
                arg.find(item).scrollTop()
            );

        });
    }
  };
}(Zepto);

/*jshint unused: false*/
+function($) {
    'use strict';

    var getPage = function() {
        var $page = $(".page-current");
        if (!$page[0]) $page = $(".page").addClass('page-current');
        return $page;
    };

    //初始化页面中的JS组件
    $.initPage = function(page) {
        var $page = getPage();
        if (!$page[0]) $page = $(document.body);
        var $content = $page.hasClass('content') ?
                       $page :
                       $page.find('.content');
        $content.scroller();  //注意滚动条一定要最先初始化

        $.initPullToRefresh($content);
        $.initInfiniteScroll($content);
        $.initCalendar($content);

        //extend
        if ($.initSwiper) $.initSwiper($content);
    };

    if ($.smConfig.showPageLoadingIndicator) {
        //这里的 以 push 开头的是私有事件，不要用
        $(window).on('pageLoadStart', function() {
            $.showIndicator();

        });
        $(window).on('pageAnimationStart', function() {
            $.hideIndicator();
        });
        $(window).on('pageLoadCancel', function() {
            $.hideIndicator();
        });
        $(window).on('pageLoadComplete', function() {
            $.hideIndicator();
        });
        $(window).on('pageLoadError', function() {
            $.hideIndicator();
            $.toast('加载失败');
        });
    }

    $(window).on('pageAnimationStart', function(event,id,page) {
        // 在路由切换页面动画开始前,为了把位于 .page 之外的 popup 等隐藏,此处做些处理
        $.closeModal();
        $.closePanel();
        // 如果 panel 的 effect 是 reveal 时,似乎是 page 的动画或别的样式原因导致了 transitionEnd 时间不会触发
        // 这里暂且处理一下
        $('body').removeClass('panel-closing');
        $.allowPanelOpen = true;  
    });
   
    $(window).on('pageInit', function() {
        $.hideIndicator();
        $.lastPosition({
            needMemoryClass: [
                '.content'
            ]
        });
    });
    // safari 在后退的时候会使用缓存技术，但实现上似乎存在些问题，
    // 导致路由中绑定的点击事件不会正常如期的运行（log 和 debugger 都没法调试），
    // 从而后续的跳转等完全乱了套。
    // 所以，这里检测到是 safari 的 cache 的情况下，做一次 reload
    // 测试路径(后缀 D 表示是 document，E 表示 external，不使用路由跳转）：
    // 1. aD -> bDE
    // 2. back
    // 3. aD -> bD
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            location.reload();
        }
    });

    $.init = function() {
        var $page = getPage();
        var id = $page[0].id;
        $.initPage();
        $page.trigger('pageInit', [id, $page]);
    };

    //DOM READY
    $(function() {
        //直接绑定
        FastClick.attach(document.body);

        if ($.smConfig.autoInit) {
            $.init();
        }

        $(document).on('pageInitInternal', function(e, id, page) {
            $.init();
        });
    });

}(Zepto);

/**
 * ScrollFix v0.1
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
/* ===============================================================================
************   ScrollFix   ************
=============================================================================== */

+ function($) {
    "use strict";
    //安卓微信中使用scrollfix会有问题，因此只在ios中使用，安卓机器按照原来的逻辑

    if($.device.ios){
        var ScrollFix = function(elem) {

            // Variables to track inputs
            var startY;
            var startTopScroll;

            elem = elem || document.querySelector(elem);

            // If there is no element, then do nothing
            if(!elem)
                return;

            // Handle the start of interactions
            elem.addEventListener('touchstart', function(event){
                startY = event.touches[0].pageY;
                startTopScroll = elem.scrollTop;

                if(startTopScroll <= 0)
                elem.scrollTop = 1;

            if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
                elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
            }, false);
        };

        var initScrollFix = function(){
            var prefix = $('.page-current').length > 0 ? '.page-current ' : '';
            var scrollable = $(prefix + ".content");
            new ScrollFix(scrollable[0]);
        };

        $(document).on($.touchEvents.move, ".page-current .bar",function(){
            event.preventDefault();
        });
        //监听ajax页面跳转
        $(document).on("pageLoadComplete", function(){
             initScrollFix();
        });
        //监听内联页面跳转
        $(document).on("pageAnimationEnd", function(){
             initScrollFix();
        });
        initScrollFix();
    }

}(Zepto);
