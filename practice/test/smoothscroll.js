/**
 *
 EasingFunctions = {
      linear: function (t) { return t },
      easeInQuad: function (t) { return t*t },
      easeOutQuad: function (t) { return t*(2-t) },
      easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
      easeInCubic: function (t) { return t*t*t },
      easeOutCubic: function (t) { return (--t)*t*t+1 },
      easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
      easeInQuart: function (t) { return t*t*t*t },
      easeOutQuart: function (t) { return 1-(--t)*t*t*t },
      easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
      easeInQuint: function (t) { return t*t*t*t*t },
      easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
      easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
    }
 */
(function (root, smoothScroll) {
    'use strict';

    // RequireJS
    if (typeof define === 'function' && define.amd) {
        define(smoothScroll);
        // CommonJS
    } else if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = smoothScroll();
    } else {
        root.smoothScroll = smoothScroll();
    }

})(this, function () {
    'use strict';

// Do not initialize smoothScroll when running server side, handle it in client:
    if (typeof window !== 'object') return;

// That means no smoothscroll on IE9 and below.
    if (document.querySelectorAll === void 0
        || window.pageYOffset === void 0
        || history.pushState === void 0) {
        return;
    }

// Get the top position of an element in the document
    var getTop = function (element) {
        // return value of html.getBoundingClientRect().top ...
        // IE : 0, other browsers : -pageYOffset
        if (element.nodeName === 'HTML') {
            return -window.pageYOffset
        }
        return element.getBoundingClientRect().top + window.pageYOffset; //当前对象离顶部高度,包含滚动条滚动距离
    }
// ease in out function thanks to:
// http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
    var easeInOutCubic = function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }

// calculate the scroll position we should be in
// given the start and end point of the scroll
// the time elapsed from the beginning of the scroll
// and the total duration of the scroll (default 500ms)
    var position = function (start, end, elapsed, duration) {
        if (elapsed > duration) {
            return end;
        }
        return start + (end - start) * easeInOutCubic(elapsed / duration); // <-- you can change the easing funtion there
        // return start + (end - start) * (elapsed / duration); // <-- this would give a linear scroll
    }

// we use requestAnimationFrame to be called by the browser before every repaint
// if the first argument is an element then scroll to the top of this element
// if the first argument is numeric then scroll to this location
// if the callback exist, it is called when the scrolling is finished
// if context is set then scroll that element, else scroll window 
    var smoothScroll = function (el, duration, callback, context) {
        duration = duration || 500;
        context = context || window;
        var start = window.pageYOffset;

        if (typeof el === 'number') {
            var end = parseInt(el);
        } else {
            var end = getTop(el);
        }

        var clock = Date.now();
        var requestAnimationFrame = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || function (fn) {
                window.setTimeout(fn, 15);
            };

        var step = function () {
            var elapsed = Date.now() - clock;
            if (context !== window) {
                context.scrollTop = position(start, end, elapsed, duration);
            } else {
                window.scroll(0, position(start, end, elapsed, duration));
            }

            if (elapsed > duration) {
                if (typeof callback === 'function') {
                    callback(el);
                }
            } else {
                requestAnimationFrame(step);
            }
        }
        step();
    }

    var linkHandler = function (ev) {
        ev.preventDefault();
        console.log(this)
        console.log(this.hash);
        console.log(window.location.hash);

        if (location.hash !== this.hash) {
            window.history.pushState(null, null, this.hash)
        }
        // using the history api to solve issue #1 - back doesn't work
        // most browser don't update :target when the history api is used:
        // THIS IS A BUG FROM THE BROWSERS.

        // change the scrolling duration in this call
        smoothScroll(document.getElementById(this.hash.substring(1)), 500, function (el) {
            location.replace('#' + el.id)
            // this will cause the :target to be activated.
        });
    }

// We look for all the internal links in the documents and attach the smoothscroll function
    document.addEventListener("DOMContentLoaded", function () {
        var internal = document.querySelectorAll('a[href^="#"]:not([href="#"])'), // href="#some"
            a;
        for (var i = internal.length; a = internal[--i];) {
            a.addEventListener("click", linkHandler, false);
        }
    });


    return smoothScroll;

});
