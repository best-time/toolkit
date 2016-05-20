function callBackMyLicai() {
    window.location.href = BASE_PATH + "/portal/app/index.htm?path=lazy-index&" + appThemeNavType
}
function callBackLicai() {
    window.location.href = BASE_PATH + "/portal/app/index.htm?" + appThemeNavType
}
function callBackMyLqb() {
    window.location.href = BASE_PATH + "/app/hFiveBuy/myLqb.htm?" + appThemeNavType
}
if ("undefined" == typeof template)var template = {};
var Exp = function (t, e) {
    var i = {cssSupport: {}}, n = {}, a = navigator.userAgent;
    n.ios = a.toLowerCase().match(/\(i[^;]+;( u;)? cpu.+mac os x/);
    var s = {
        mobile: !!a.match(/AppleWebKit.*Mobile.*/) || "undefined" != typeof window.orientation,
        addDefaultsEvents: function (t) {
            function e() {
                return !1
            }

            for (var i = this.mobile, n = ["mousewheel", "DOMMouseScroll", i ? "touchstart" : "mousedown", i ? "touchmove" : "mousemove", i ? "touchend" : "mouseup"], a = n.length; a--;)t.on(n[a], e)
        },
        cssSupports: function () {
            var t = i.cssSupport;
            return function (e) {
                var i = document.createElement("div"), n = "khtml o moz webkit".split(" "), a = n.length, s = !1;
                if (e = e.replace(/-[\w]/g, function (t) {
                        return t.toUpperCase().substring(1)
                    }), e in t)return t[e];
                if ("-ms-" + e in i.style)s = "-ms-" + e; else for (e = e.replace(/^[a-z]/, function (t) {
                    return t.toUpperCase()
                }); a -= 1;)n[a] + e in i.style && (s = n[a] + e);
                return t[e] = s
            }
        }(),
        css: function (t, e, i) {
            var n = document.defaultView.getComputedStyle, a = this.cssSupports(e);
            if (void 0 === i)return t.length && (t = t[0]), t && t.style[a] || t && n(t, "").getPropertyValue(e);
            if (t.length)for (var s = 0; s < t.length; s++)t[s].style[a] = i; else t.style && (t.style[a] = i)
        },
        css3: function (t, e) {
            var i = /\((?:[\s,]*([-\d\.]+)[px\s]*)?(?:[\s,]*([-\d\.]+)[px\s]*)?(?:[\s,]*([-\d\.]+)[px\s]*)?/g, n = i.exec(s.css(t, e));
            return n && n.shift(), n
        },
        extend: function (t, e, i) {
            var n = Object.prototype.toString, a = "[object Array]";
            t = t || {};
            for (var s in e)i === !0 && e.hasOwnProperty(s) && "object" == typeof e[s] ? (t[s] || (t[s] = n.call(e[s]) === a ? [] : {}), arguments.callee(t[s], e[s], i)) : t[s] = e[s];
            return t
        },
        getTop: function (t, e) {
            var i = 0;
            if (null != t.offsetParent) {
                i = t.offsetTop;
                var n = t.offsetParent;
                e ? i += arguments.callee(t.offsetParent) : -1 == "relative absolute fixed".indexOf(n.style.position) && (i += arguments.callee(t.offsetParent))
            } else null != t.offsetParent;
            return i
        },
        getLeft: function (t, e) {
            var i = 0;
            if (null != t.offsetParent) {
                i = t.offsetLeft;
                var n = t.offsetParent;
                e ? i += arguments.callee(t.offsetParent) : -1 == "relative absolute fixed".indexOf(n.style.position) && (i += arguments.callee(t.offsetParent))
            }
            return i
        },
        getVersion: function () {
            return n
        },
        checkDevice: {
            isMobile: function () {
                return !(navigator.userAgent.match(/Win/i) || navigator.userAgent.match(/MacIntel/i) || navigator.userAgent.match(/Linux/i))
            }
        },
        position: {
            getHeight: function () {
                var t = document.documentElement.offsetHeight || document.body.offsetHeight;
                return t
            }, scrollTop: function () {
                return document.documentElement.scrollTop || document.body.scrollTop
            }, scrollHeight: function () {
                return document.body.scrollHeight || document.documentElement.scrollHeight
            }, clientHeight: function () {
                return document.documentElement.clientHeight || document.body.clientHeight
            }
        },
        remove: function () {
            return this.parentNode ? void this.parentNode.removeChild(this) : void 0
        },
        buttonChange: function (e) {
            function i() {
                c.valide({
                    hide: !0,
                    notRemote: !0
                }) || 1 == u ? (n.removeClass(o).addClass(a), h && h(!0)) : (n.removeClass(a).addClass(o), h && h(!1))
            }

            var e = e || {}, n = e.button, a = e.notClass, o = e.yesClass, r = (e.inputsId, e.valideId, e.errorClass, e.checkbox), c = e.valideEl, l = e.lisenerParent, u = !1, h = e.callBack, d = e.clickCallback;
            t(l || window).on("input", function () {
                r && r.element.hasClass(r.uncheckClass) || i()
            }), d && s.click(n, function () {
                c.valide() ? (n.removeClass(o).addClass(a), d && d(!0)) : (n.removeClass(a).addClass(o), d && d(!1))
            }), r && s.click(r.element, function () {
                var e = t(this);
                u = !!e.hasClass(r.uncheckClass), i()
            }), i()
        },
        pageList: function (t) {
            var e, i, n = t.root, a = t.pages, s = 0, o = t.minInterval || 500, r = new Date;
            t.currentIndex = t.currentIndex || 0;
            var c = t.slidePageBtns;
            a.each(function (e, i) {
                var s = (c.eq(e), a.eq(e));
                s.on("transitionend", function (i) {
                    t.transitionEndCall && t.transitionEndCall({
                        target: s,
                        root: n,
                        pages: a,
                        index: e,
                        elapsedTime: i.elapsedTime,
                        propertyName: i.propertyName,
                        type: "transitionend"
                    })
                })
            }), c.each(function (l, u) {
                var h = c.eq(l), d = a.eq(l);
                h.on("mousedown touchstart", function (i) {
                    if (new Date - r < o)return s = 0, !1;
                    r = new Date, s = 1;
                    var c = i.touches ? i.touches[0] : i;
                    e = {x: c.clientX, y: c.clientY}, t.touchStartCall && t.touchStartCall({
                        start: e,
                        target: i.target,
                        curPage: d,
                        root: n,
                        pages: a,
                        index: l,
                        type: "touchstart"
                    });
                    var u = i.srcElement || i.target;
                    "A" !== u.tagName.toUpperCase() && i.preventDefault()
                }).on("mousemove touchmove", function (i) {
                    if (!(0 == s || s > 2)) {
                        var o = !1, r = i.touches ? i.touches[0] : i, c = {
                            x: r.clientX,
                            y: r.clientY
                        }, u = c.y - e.y, h = c.x - e.x;
                        u >= 0 && 0 == l && !o || 0 >= u && l == a.length - 1 && !o || (1 == s && (s = 2, o = !0), 2 == s && (u || h) && t.touchMoveCall && t.touchMoveCall({
                            start: e,
                            move: c,
                            target: i.target,
                            curPage: d,
                            root: n,
                            pages: a,
                            index: l,
                            type: "touchmove",
                            first: o
                        }), i.preventDefault())
                    }
                }).on("mouseup touchend", function (o) {
                    if (0 != s) {
                        s = 3;
                        var r = o.changedTouches ? o.changedTouches[0] : o;
                        i = {x: r.clientX, y: r.clientY};
                        var c = i.y - e.y, u = i.x - e.x;
                        if (c >= 0 && 0 == l)return void((c || u) && t.firstPageEndCall && t.firstPageEndCall({
                            start: e,
                            move: i,
                            target: o.target,
                            curPage: d,
                            root: n,
                            pages: a,
                            index: l,
                            type: "touchend"
                        }));
                        if (0 >= c && l == a.length - 1)return void((c || u) && t.lastPageEndCall && t.lastPageEndCall({
                            start: e,
                            move: i,
                            target: o.target,
                            curPage: d,
                            root: n,
                            pages: a,
                            index: l,
                            type: "touchend"
                        }));
                        (c || u) && t.touchEndCall && t.touchEndCall({
                            start: e,
                            move: i,
                            target: o.target,
                            curPage: d,
                            root: n,
                            pages: a,
                            index: l,
                            type: "touchend"
                        }), o.preventDefault()
                    }
                })
            })
        },
        alertBox: function () {
            function e(e) {
                this.opts = e || {}, this.title = this.opts.title || "", this.msg = this.opts.msg || "", this.type = this.opts.type || "default", this.hasMask = this.opts.hasMask !== !1, this.confirm = this.opts.confirm || function () {
                    }, this.cancel = this.opts.cancel || function () {
                    };
                var i = this.opts.callBack, n = this;
                this.callBack = function () {
                    i && i.call(n), s.clickActive(t(n.el))
                }, this._event = s.checkDevice.isMobile() ? "tap" : "click", e.animate || e.animate === !1 || (e.animate = "alert-box-anim"), e.bgAnimate || e.bgAnimate === !1 || (e.bgAnimate = "alert-bg-anim"), this.animate = e.animate, this.bgAnimate = e.bgAnimate, this.scrollerClass = e.scrollerClass, this.survivePeriod = e.survivePeriod || !1, this.createTime = new Date, this.delayRender = e.delayRender === !1 || e.delayRender ? e.delayRender : !0, this.upOffset = e.upOffset || 0, this.resetCallback = e.resetCallback, this.asyncResetCallback = e.asyncResetCallback, this.background = e.background, this.bgClickReset = e.bgClickReset, this.preventScroller = function (t) {
                    return t.preventDefault(), !1
                }
            }

            return e.prototype = {
                init: function () {
                    var t = this;
                    switch (t.type) {
                        case"default":
                            var e = '<div class="alert-box"><div class="msg">{{msg}}</div><div class="wbox"><div class="wbox-col-a btn-b btn-cancel mr20"><a href="#">取消</a></div><div class="wbox-col-a btn-c btn-confirm"><a href="#">确定</a></div></div></div>';
                            break;
                        case"alert":
                            var e = '<div class="alert-box"><div class="msg">{{msg}}</div><div class="layout wbox"><div class="wbox-col-a btn-c btn-confirm"><a href="#">确定</a></div></div></div>';
                            break;
                        case"validate":
                            var e = '<div class="alert-box alert-box-valide"><div class="msg">{{msg}}</div></div>';
                            break;
                        case"custom":
                            var e = this.opts.html
                    }
                    var i = e.replace(/{{.*}}/g, t.msg);
                    return t.delayRender ? setTimeout(function () {
                        t.render(i)
                    }, 50) : t.render(i), "validate" == t.type && t.opts.autoCancel && setTimeout(function () {
                        t.cancel && t.cancel(), t.reset()
                    }, 1500), this
                }, render: function (e) {
                    function i(t) {
                        s.setMaskPos(), s.opts.setPos ? s.opts.setPos.call(s, t) : s.setPos(t)
                    }

                    function n(t) {
                        d = t.touches[0].clientY
                    }

                    function a(t) {
                        var e = h.height(), i = h[0].scrollTop, n = h[0].scrollHeight, a = t.touches[0].clientY, s = d - a;
                        return i >= 0 && n > i + e && s > 0 ? t.stopPropagation() : i > 0 && n >= i + e && 0 > s ? t.stopPropagation() : t.preventDefault(), !1
                    }

                    var s = this, o = document.body;
                    if (this.opts.contextAnimate) {
                        var r = t(o), c = r.find(".alert-context"), l = r.children(":not(.alert-context):not(script)");
                        c.length || (c = t('<section class="alert-context"></section>').appendTo(r)), c.append(l), this.context = c
                    }
                    o.insertAdjacentHTML("beforeend", e);
                    var u = s.el = s.get(".alert-box");
                    if (s.hasMask && s.mask(o), this.setPosProxy = i, s.animate && u.setAttribute("class", (u.getAttribute("class") || "") + " " + s.animate), s.context && s.context.addClass("alert-back-in"), s.opts.renderTime ? setTimeout(function () {
                            "function" == typeof s.callBack && s.callBack(), t(window).on("resize", i), i()
                        }, s.opts.renderTime) : "function" == typeof s.callBack && (s.callBack(), t(window).on("resize", i)), i(), s.addEvent(), document.addEventListener("touchmove", this.preventScroller), this.scrollerClass) {
                        var h = t("." + this.scrollerClass);
                        h[0].addEventListener("touchstart", n), h[0].addEventListener("touchmove", a);
                        var d
                    }
                }, mask: function (e) {
                    var i = this, n = document.createElement("div");
                    n.setAttribute("class", "alert-box-bg alert-box-bg-" + i.type + (this.opts && this.opts.rootClass ? " " + this.opts.rootClass + "-bg" : "")), this.bg = n, this.background !== !1 && (e.appendChild(n), this.setMaskPos(), i.bgAnimate && n.setAttribute("class", (n.getAttribute("class") || "") + " " + i.bgAnimate), this.bgClickReset !== !1 && s.click(t(i.bg), function () {
                        t(i.bg).hasClass("alert-box-bg-validate") || i.reset()
                    }))
                }, setMaskPos: function () {
                    var t = s.position.scrollHeight();
                    this.bg.style.cssText += ";height:" + t + "px;width:" + document.documentElement.scrollWidth + "px;"
                }, setPos: function () {
                    var e = this, i = e.el, n = e.bg, a = s.position.scrollTop(), o = "fixed" === s.css([i], "position");
                    i.style.cssText += ";top:" + ((o ? 0 : a) + window.innerHeight / 2 - i.offsetHeight / 2 - this.upOffset) + "px;left:" + (document.documentElement.offsetWidth / 2 - i.offsetWidth / 2) + "px;", "mini" == e.type && (n.style.opacity = 0, setTimeout(function () {
                        n.fadeOut(500, function () {
                            t(this).remove()
                        }), n.fadeOut(500, function () {
                            t(this).remove()
                        })
                    }, 2e3))
                }, addEvent: function () {
                    var e = this, i = e.el;
                    t(i.querySelector(".btn-confirm")).on(e._event, function (t) {
                        e.confirm(i), e.reset(), t.preventDefault()
                    }), "alert" != e.type && t(i.querySelector(".btn-cancel")).on(e._event, function (t) {
                        e.cancel(i), e.reset(), t.preventDefault()
                    })
                }, reset: function (e) {
                    function i() {
                        function i() {
                            r && s.remove.call(r), s.remove.call(o), n.resetCallback && n.resetCallback.call(n), "mini" != this.type && n.die(o), a && a.removeClass("alert-back-in alert-front-in")
                        }

                        var o = n.el, r = n.bg, c = t(o), l = t(r), u = n.opts;
                        c.removeClass(u.animate).addClass(u.animateOut || "alert-box-anim-out"), l.removeClass(u.bgAnimate).addClass(u.bgAnimateOut || "alert-bg-anim-out"), a && a.addClass("alert-front-in").removeClass("alert-back-in"), e ? i() : setTimeout(i, 390), n.removeScrollerEvent(), n.asyncResetCallback && n.asyncResetCallback.call(n)
                    }

                    if (!(this.survivePeriod && new Date - this.createTime < this.survivePeriod)) {
                        var n = this, a = n.context;
                        n.context = null, e ? i() : setTimeout(i, 50)
                    }
                }, show: function () {
                    this.el.style.display = "block", this.bg.style.display = "block"
                }, hide: function () {
                    this.el.style.display = "none", this.bg.style.display = "none", this.removeScrollerEvent()
                }, removeScrollerEvent: function () {
                    document.removeEventListener("touchmove", this.preventScroller), t(window).off("resize", this.setPosProxy)
                }, die: function () {
                    var e = this, i = e.el;
                    t(i.querySelector(".btn-confirm")).off(e._event), "alert" != e.type && t(i.querySelector(".btn-cancel")).off(e._event)
                }, get: function (t) {
                    var e = document.querySelectorAll(t);
                    return e[e.length - 1]
                }
            }, function (t) {
                return new e(t).init()
            }
        }(),
        stopper: function (t, e) {
            e = e || 1e3;
            var i;
            return function () {
                time = new Date, (!i || time - i > e) && (t.call(this), i = time)
            }
        },
        registerListener: function (t, e, i, n) {
            n || (n = i, i = void 0);
            var a = s.mobile, o = {
                touchstart: {name: a ? "touchstart" : "mousedown", path: "touches"},
                touchmove: {name: a ? "touchmove" : "mousemove", path: "touches"},
                touchend: {name: a ? "touchend" : "mouseup", path: "changedTouches"},
                touchcancel: {name: a ? "touchcancel" : "mouseup", path: "touches"}
            }, r = o[e], c = function (t) {
                var e = t[r.path] ? t[r.path][0] : t, i = this;
                return n ? n.call(i, e, t) : void 0
            }, l = [r.name, i, c];
            i || (l = [r.name, c]), t.on.apply(t, l)
        },
        touchstart: function (t, e, i) {
            this.registerListener(t, "touchstart", e, i)
        },
        touchmove: function (t, e, i) {
            this.registerListener(t, "touchmove", e, i)
        },
        touchend: function (t, e, i) {
            this.registerListener(t, "touchend", e, i)
        },
        touchcancel: function (t, e, i, n) {
            this.registerListener(t, "touchcancel", e, i, n)
        },
        click: function (t, e, i, n, a) {
            var s, o, r;
            "function" == typeof arguments[1] && (a = n, n = i, i = e, e = void 0, o = a && a.touchstart, r = a && a.touchend), this.touchstart(t, e, function (t) {
                o && o.call(this, t, a), s || (s = {x: t.clientX, y: t.clientY, target: this})
            }), this.touchend(t, e, function (t) {
                var e = this;
                if (s && this == s.target) {
                    if (Math.abs(t.clientX - s.x) <= 10 && Math.abs(t.clientY - s.y) <= 10 && i) {
                        if (n === !0)return s = null, i.call(this, t, a);
                        "number" == typeof n ? setTimeout(function () {
                            i.call(e, t)
                        }, n) : setTimeout(function () {
                            i.call(e, t, a)
                        }, 30)
                    }
                    r && r.call(this, t, a), s = null
                }
            }), this.touchcancel(t, e, function (t) {
                s = null
            })
        },
        stopClick: function (t, e, i, n, a) {
            for (var s = Array.prototype.slice.apply(arguments), o = 1; 2 >= o; o++)if ("function" == typeof s[o]) {
                s[o] = this.stopper(s[o]);
                break
            }
            this.click.apply(this, s)
        },
        touch: function (t, e, i, n) {
            var a;
            s.touchstart(t, function (i) {
                var n = /translate3d\(([\d-+.]+)px?, ([\d-+.]+)px?, ([\d-+.]+)px?\)/gi.exec(s.css(t, "transform")), o = n ? n[2] - 0 : 0;
                return a = {x: i.clientX, y: i.clientY, startY: o}, e ? e.call(t, i, a) : void 0
            }), s.touchmove(t, function (e) {
                if (a) {
                    var n = {x: e.clientX, y: e.clientY, subX: e.clientX - a.x, subY: e.clientY - a.y};
                    return i ? i.call(t, e, n) : void 0
                }
            }), s.touchend(t, function (e) {
                if (a) {
                    var i = {x: e.clientX, y: e.clientY, subX: e.clientX - a.clientX, subY: e.clientY - a.clientY};
                    return a = null, n ? n.call(t, e, i) : void 0
                }
            })
        },
        page: function (e) {
            var i, n, a = '<div class="alert-box alert-page-box' + (e.rootClass ? " " + e.rootClass : "") + '">', s = "</div>", o = this, r = {
                slideOut: function (t) {
                    return i = setTimeout(function () {
                    }, 400), this.alertBox.slideOut(t), this
                }, slideIn: function (t) {
                    return i && (clearTimeout(i), i = 0), this.alertBox.slideIn(t), this
                }, remove: function () {
                    return this.alertBox.reset(), this
                }, hide: function () {
                    return this.alertBox.el.style.display = "none", this.alertBox.bg.style.display = "none", this
                }, show: function () {
                    return this.alertBox.el.style.display = "block", this.alertBox.bg.style.display = "block", this
                }, resize: function () {
                    return n(), this
                }, create: function () {
                    return this.alertBox = o.alertBox({
                        delayRender: !1,
                        type: "custom",
                        rootClass: e.rootClass,
                        html: a + (e && e.html ? e.html : "") + s,
                        transition: {position: e.position || "bottom", to: e.to || "200px"},
                        resetCallback: e.resetCallback,
                        asyncResetCallback: e.asyncResetCallback,
                        bgClickReset: e.bgClickReset,
                        scrollerClass: e.scrollerClass,
                        background: e.background,
                        setPos: function (i) {
                            function a(t) {
                                "%" == d[2] ? h.to = ("top bottom".indexOf(h.position) > -1 ? window.innerHeight : window.innerWidth) * (d[1] / 100) : h.to = d[1] - 0;
                                var i = h.position, n = 0, a = 0, s = window.innerWidth, o = window.innerHeight, r = "fixed" === c.css("position") || c.hasClass("alert-page-keyboard") ? 0 : window.scrollY;
                                "top" == i ? (e.auto === !0 ? (o = c.height(), h.to = o) : o = h.to, a = -h.to + r) : "bottom" == i ? (a = o + window.scrollY, e.auto === !0 ? (o = c.height(), h.to = o) : o = c.height()) : "left" == i ? (n = -h.to, e.auto === !0 ? (s = c.width(), h.to = s) : s = h.to) : "right" == i && (n = window.innerWidth, e.auto === !0 ? (s = c.width(), h.to = s) : s = h.to), c.css({
                                    top: a,
                                    left: n,
                                    height: o,
                                    width: s,
                                    opacity: t && "resize" == t.type ? 1 : 0
                                })
                            }

                            var s = this, c = t(this.el), l = t(this.bg), u = this.opts, h = u.transition, d = (h.to + "").match(/(\d+)(.*)/);
                            o.position.scrollTop();
                            this.addEvent = function () {
                            }, this.bgClickReset !== !1 && o.click(l, function () {
                                s.slideOut()
                            }), a(i), n = a, this.slideIn = function (t) {
                                t = t || {};
                                var e = h.position, i = 0, n = 0;
                                "top" == e ? n = t.to || h.to : "bottom" == e ? n = -(t.to || h.to) : "left" == e ? i = t.to || h.to : "right" == e && (i = -(t.to || h.to)), setTimeout(function () {
                                    c.addClass(t.slideAnimate || "page-slide-ani"), o.css(c, "transform", "translate3d(" + i + "px," + n + "px,0px)"), c.css({opacity: 1})
                                }, 10)
                            }, this.slideOut = function (e) {
                                var i = this, n = this.opts;
                                c.addClass(n.slideAnimate || "page-slide-ani"), l.addClass(n.bgAnimateOut || "alert-box-anim-out2").removeClass(n.bgAnimate || "alert-bg-anim");
                                var a = h.position, s = 0, u = 0;
                                return "top" == a ? u = 0 : "bottom" == a ? u = 0 : "left" == a ? u = 0 : "right" == a && (u = 0), o.css(c, "transform", "translate3d(" + s + "px," + u + "px,0px)"), e && e.persistent === !0 ? (c.css("opacity", 0), void i.removeScrollerEvent()) : (r.remove(), i.removeScrollerEvent(), void t("body").css("overflow", "auto"))
                            }, this.reset = function () {
                                l.css("opacity", 0);
                                var t = this, i = this.el, n = this.bg, a = this.opts;
                                setTimeout(function () {
                                    a && a.resetCallback && a.resetCallback.call(t), n && o.remove.call(n), o.remove.call(i)
                                }, e.slideTime || 410), a && a.asyncResetCallback && a.asyncResetCallback.call(this)
                            }, e.resizeCallback && e.resizeCallback.call(this)
                        },
                        animate: e.animate || "alert-page-anim",
                        bgAnimate: e.bgAnimate || "alert-bg-anim",
                        bgAnimateOut: "alert-bg-anim-out2",
                        autoCancel: !0,
                        callBack: e.alertCallBack || function () {
                        }
                    }), this
                }
            };
            return r.create(), r
        },
        lazier: function (e) {
            "undefined" == typeof e && (e = {});
            var i = e.type || "class", n = e.property || "data-lasy", a = e.type || "data-lasytype", s = [], o = t(document.body);
            return {
                operate: function (t, e, i) {
                    switch (t) {
                        case"class":
                            e.addClass(i);
                            break;
                        case"image":
                            e.is("img") ? e.attr("src", i) : e.css("background-image", i)
                    }
                }, find: function () {
                    var e = o.find("[" + n + "]");
                    s = [], e.each(function (e, o) {
                        var o = t(o), r = o.offset();
                        s.push({
                            el: o,
                            value: o.attr(n),
                            top: r.top,
                            left: r.left,
                            type: o.attr(a) || i
                        }), o.removeAttr(n)
                    })
                }, scrolled: function () {
                    var t = o.prop("scrollTop"), e = document.body.offsetHeight || document.body.clientHeight, i = t + e, n = this.operate;
                    s = s.filter(function (e) {
                        return e.top >= t && e.top <= i ? (n(e.type, e.el, e.value), !1) : !0
                    })
                }, start: function () {
                    var t = this;
                    window.addEventListener("scroll", function () {
                        t.scrolled()
                    }, !1)
                }
            }
        },
        evalScale: function () {
            var e = t("[scale]");
            e.each(function (e, i) {
                var n, a, s = t(this), o = t(this).attr("scale") || "1:1", r = o.split(":"), c = s.width() || r[0] || s.attr("width") || 0, l = s.height() || r[1] || s.attr("height") || 0, u = c, h = l;
                2 == r.length && (n = (r[0] || 1) / (r[1] || 1), a = l * n, c > a ? u = a : h = c / n), s.width(u).height(h)
            })
        },
        scrolledAjax: function (i) {
            function n() {
                if (D && L.scrolled(), w && A && a())c(); else {
                    if (x || !A)return;
                    a() && c()
                }
            }

            function a() {
                var t = document.documentElement, e = document.body, i = t.clientHeight || e.clientHeight, n = e.scrollTop || t.scrollTop, a = e.scrollHeight || t.scrollHeight;
                return i + n + T > a
            }

            function o() {
                var e = E.parent(), n = e.find(".scroll-loading"), a = 0 === n.length;
                i.loader !== !1 && (i.loader ? u = i.loader : u || (u = t('<div class="scroll-loading"><span class="mb3 loading-flag"/>&nbsp;加载中...</div>'), a ? u : u = "", "" !== u && u.insertAfter(E), e.css("position", "relative"), r()), u && u.show())
            }

            function r() {
                u && u.hide()
            }

            function c() {
                if (!P) {
                    w = !1;
                    var t = i, e = t.data;
                    if (o(), e[p] = ++C, R < e[p])return r(), void--C;
                    e[y] = h, e[v] = Math.ceil(C / h), e[g] = C += h - 1, e[b] = (new Date).getTime(), R < e[g] && (e[g] = R), P = !0, q.authAjax({
                        url: t.url,
                        type: t.type || "GET",
                        data: e || {},
                        dataType: "json",
                        noloading: !0,
                        success: function (t) {
                            l(t), s.clickActive(E), D && (L.find(), L.scrolled())
                        },
                        error: function () {
                            k > 0 ? (k--, C -= h, P = !1, c()) : (P = !1, C -= h, r())
                        }
                    })
                }
            }

            function l(t) {
                if (t) {
                    var n = [];
                    if (R = t[f] > d ? d : t[f]) {
                        var s = t[m];
                        if (C == h && (B.list = s || []), s && s.length > 0) {
                            if (i.template) {
                                for (var o = 0, l = s.length; l > o; o++) {
                                    var u = "string" == typeof i.template ? i.template : "function" == typeof i.template ? i.template(s[o], o) : "";
                                    s[o];
                                    u && (u = u.replace(/\&\{([\d\.\w\?\:\-]*)\}/g, "{{$1}}"));
                                    var p = e.compile(u)(i.handleData ? i.handleData(s[o], o) : s[o]);
                                    E[0].insertAdjacentHTML("beforeend", p);
                                    var v = E[0].lastElementChild;
                                    i.animate && v.setAttribute("class", (v.getAttribute("class") || "") + " " + i.animate), n.push(v)
                                }
                                i.animate && setTimeout(function () {
                                    for (var t = 0, e = n.length; e > t; t++)n[t].style.opacity = 1
                                }, 10)
                            } else {
                                if (i.handleData)for (var o = 0, l = s.length; l > o; o++)i.handleData(s[o], o);
                                var u = e(i.templateId, t);
                                E.append(u);
                                var y = E.children(), b = y.size(), x = s.length;
                                if (i.animate)for (; x--;)!function (t) {
                                    var e = y.get(t);
                                    n.push(e), e.setAttribute("class", (e.getAttribute("class") || "") + " " + i.animate), setTimeout(function () {
                                        e.style.opacity = 1
                                    }, 10)
                                }(b - x - 1)
                            }
                            i.success && i.success(t, i, n)
                        }
                        if (R <= i.data[g]) {
                            if (i.endCallback) {
                                var w = d && d <= t[f] && C >= d;
                                i.endCallback(i, w)
                            }
                            r()
                        }
                    } else if (i.zeroCallback)return r(), void i.zeroCallback(i, E, t)
                }
                P = !1, a() && S !== !1 && c()
            }

            var u, h = i.steps || 10, d = i.maxRecords || 150, f = i.totalFlag || "total", p = i.startFlag || "startIndex", g = i.endFlag || "endIndex", m = i.recordsFlag || "list", v = i.pageIndex || "pageIndex", y = i.pageSize || "pageSize", b = i.timestamp || "timestamp", x = 0, w = !0, k = 3, C = 0, T = 300, S = i.autoGetData !== !1, R = h, E = i.parent, P = !1, A = void 0 === i.startFetch ? !0 : i.startFetch, B = {list: []}, L = s.lazier(), D = i.lasyAnimate, q = this;
            return i.data = i.data || {}, A && S !== !1 && c(), S !== !1 && window.addEventListener("scroll", n, !1), {
                start: function () {
                    A = !0, t(window).trigger("scroll")
                }, close: function () {
                    A = !1
                }, getData: function () {
                    c()
                }, isLoadingData: function () {
                    return P
                }, clearLoading: function () {
                    r()
                }, destory: function () {
                    window.removeEventListener("scroll", n), u && u.remove(), this.pulldownRefresh && this.pulldownRefresh.destory()
                }, resetRemainTimes: function () {
                    k = 3, w = !0, R = h
                }, abort: function () {
                    this.ajaxObject && this.ajaxObject.abort()
                }, createPulldownRefresh: function (e) {
                    var i = e.element, n = e.pullDownArea || E, a = e.insertBeforeEl, o = e.endCallback, r = e.id, c = r ? r.split(" ") : [], l = 0 === E.find(".ui-pulldown-refresh").length;
                    if (!i) {
                        var u = '<div class="ui-pulldown-refresh"><div style="bottom:' + (e.bottom || 0) + ';"><i></i><span>下拉刷新</span></div></div>';
                        l ? u : u = "", a = a || n, i = t(u).insertBefore(a)
                    }
                    var h = this;
                    this.pulldownRefresh = s.pulldownRefresh({
                        element: i,
                        pullDownArea: n,
                        insertBeforeEl: a,
                        endCallback: function (t) {
                            h.abort(), h.update(c, t), o && o()
                        }
                    })
                }, update: function (e, n) {
                    function a(t, e, i) {
                        var n = i.length, a = t.length;
                        if (a != e.length)return !1;
                        for (var s, o, r = 0; a > r; r++) {
                            s = t[r], o = e[r];
                            for (var c = 0; n > c; c++)if (s[i[c]] != o[i[c]])return !1
                        }
                        return !0
                    }

                    var s = B.list, o = i, r = o.data, c = e.length;
                    if (s) {
                        var u = {};
                        u = t.extend(u, o.data || {}), u[p] = 1, u[y] = h, u[v] = Math.ceil(1 / h), u[g] = h, u.timestamp = (new Date).getTime(), this.ajaxObject = t.ajax({
                            url: o.url,
                            type: o.type || "GET",
                            data: u || {},
                            dataType: "json",
                            success: function (t) {
                                var i = t[m] || [], o = s, u = i, d = !0;
                                u ? d = o && c ? a(u, o, e) : !1 : u != o && (d = !1), d ? n.refreshNoData() : (C = 0, r[p] = ++C, r[y] = h, r[v] = Math.ceil(C / h), r[g] = C += h - 1, E.empty(), n.hide(), l(t)), D && setTimeout(function () {
                                    L.find(), L.scrolled()
                                }, 500)
                            }
                        })
                    }
                }
            }
        },
        sectionSlide: function (e, i, n, a) {
            this.box = t(e), this.tabs = t(i), this.tabBg = t(n), this.contents = this.box.children(), this.tabBgMove = 0, this.config = t.extend({}, a || {}), this.width = this.config.width || this.box.width(), this.size = this.config.size || this.box.children().length, this.loop = this.config.loop || !1, this.auto = this.config.auto || !1, this.auto_wait_time = this.config.auto_wait_time || 3e3, this.scrollTime = 300, this.minleft = -this.width * (this.size - 1), this.maxleft = 0, this.nowLeft = 0, this.pointX = null, this.startX = null, this.startY = null, this.index = this.config.index, this.touchSlide = this.config.touchSlide !== !1, this.terminalFix = this.config.terminalFix || !1, this.busy = !1, this.timer, this.boxRadius = this.config.boxRadius !== !1, this.slope = .8;
            var o = this.tabs.find("li.on");
            "number" != typeof this.index && o.size() && (this.index = this.tabs.find("li").index(o));
            var r = t("head meta[name=viewport]").attr("content");
            this.times = 1 / (r || "1").match(/initial\-scale\=([.\d]+)/)[1] || 1;
            var c = 0;
            this.init = function () {
                var t = this.width;
                this.contents.width(t), this.bindEvent(), this.initWidth(), this.autoScroll(), this.index > 0 && this.goIndex(this.index, !0), this.fixPage(this.index)
            }, this.initWidth = function () {
                this.box.css("width", this.width * this.size), this.tabBg.css("width", 1 / this.size * 100 + "%")
            }, this.bindEvent = function () {
                var e, i, n = this, a = !0;
                n.tabs.children().length > 0 && s.click(n.tabs.children(), function () {
                    if (!n.busy) {
                        var e = t(this).index();
                        n.tabsClick(e)
                    }
                }), 0 != n.touchSlide && s.touch(n.box, function (t) {
                    n.busy || (n.startX = n.pointX = t.screenX, n.startY = n.pointY = t.screenY, isFirst = !0, a = !0, e = {
                        x: t.screenX,
                        y: t.screenY
                    })
                }, function (t) {
                    if (!n.busy) {
                        if (!a)return !1;
                        var s = n.move(t.screenX, t.screenY);
                        if (isFirst && (isFirst = !1, i = s), i !== s)return a = !1, !1;
                        if (e = {x: t.screenX, y: t.screenY}, !s)return s
                    }
                }, function (t) {
                    c = 0, a ? !n.busy && n.movEnd(t.screenX, t.screenY) : !n.busy && n.movEnd(e.x, e.y)
                })
            }, this.autoScroll = function () {
                var t = this;
                t.loop && t.auto && (clearTimeout(t.timer), t.timer = setTimeout(function () {
                    t.goIndex((t.index + 1) % t.size)
                }, t.auto_wait_time))
            }, this.tabsClick = function (t) {
                var e = this, i = (e.tabs.width() / this.contents.size(), e.tabs.children());
                i.get(t);
                if (i.length > 0) {
                    if (e.tabBgMove = i.eq(t).position().left, e.busy)return;
                    clearTimeout(e.timer), e.goIndex(t)
                }
            }, this.goIndex = function (t, e) {
                var i = this, n = (i.nowLeft, i.width), a = i.size, s = e || !1, o = i.tabs.children();
                o.get(t);
                i.busy = !0, 0 > t ? t = 0 : t >= a && (t = a - 1), -1 == t || t == a ? (i.index = -1 == t ? a - 1 : 0, i.nowLeft = -1 == t ? 0 : -n * (a + 1)) : (i.index != t && (s = !0), i.index = t, i.nowLeft = -(n * t)), i.tabsClick(t), i.tabBg.css(this.getStyle(1, !0)[1]), o.removeClass("on").eq(t).addClass("on"), i.box.css(this.getStyle(1, this.boxRadius)[0]), setTimeout(function () {
                    i.complete(t, s)
                }, 5)
            }, this.complete = function (t, e) {
                var i = this;
                i.busy = !1, i.fixPage(t), i.autoScroll(), 0 != e && i.config.callback && i.config.callback(i.index)
            }, this.fixPage = function (e) {
                var i = this;
                if (i.config.pageFixed) {
                    i.index != e && window.scrollTo(0, 0);
                    var n = document.documentElement.clientHeight + (i.config.pageFixedPx || 0);
                    this.contents.each(function (i, a) {
                        var a = t(a);
                        i == e ? a.css("max-height", "") : a.css("max-height", n)
                    })
                }
            }, this.next = function () {
                this.busy || this.goIndex(this.index + 1)
            }, this.prev = function () {
                this.busy || this.goIndex(this.index - 1)
            }, this.move = function (t, e) {
                var i = this, n = i.tabs.children(), a = (n.get(i.index), t - (null === this.pointX ? t : this.pointX)), s = (e - (null === this.pointY ? e : this.pointY), Math.abs(t - this.startX) * i.slope <= Math.abs(e - this.startY));
                if (s)return this.preventDefault = !0, !0;
                if (i.terminalFix) {
                    if (0 == i.index && a > 0)return this.preventDefault = !0, !0;
                    if (i.index == i.size - 1 && 0 > a)return this.preventDefault = !0, !0
                }
                return this.nowLeft = this.nowLeft + a, this.pointX = t, this.box.css(this.getStyle(2)[0]), this.tabBgMove = this.tabBgMove - a / this.width * this.tabBg.width(), n.removeClass("on").eq(i.index).addClass("on"), this.preventDefault = !1, !1
            }, this.movEnd = function (t, e) {
                var i = this.nowLeft = t - (null === this.startX ? t : this.startX);
                if (this.preventDefault === !0)index = this.index; else {
                    if (0 === i)return;
                    -70 > i ? index = this.index + 1 : i > 70 ? index = this.index - 1 : index = this.index
                }
                this.pointX = null, this.goIndex(index)
            }, this.getStyle = function (t, e) {
                var i = this, n = i.nowLeft, a = 1 == t ? i.scrollTime : 0, o = i.tabBgMove, r = [{
                    "-webkit-transition": "-webkit-transform " + a + "ms",
                    "-webkit-transform": "translateX(" + n + "px)",
                    "-webkit-backface-visibility": "hidden",
                    transition: "transform " + a + "ms",
                    transform: "translateX(" + n + "px)"
                }, {
                    "-webkit-transition": "-webkit-transform " + a + "ms",
                    "-webkit-transform": "translateX(" + o + "px)",
                    "-webkit-backface-visibility": "hidden",
                    transition: "transform " + a + "ms",
                    transform: "translateX(" + o + "px)"
                }];
                if (e) {
                    var c = 5 * this.times + "px";
                    c = 0 == this.index ? {
                        "border-radius": "initial",
                        "border-top-left-radius": c,
                        "border-bottom-left-radius": c
                    } : this.index == this.size - 1 ? {
                        "border-radius": "initial",
                        "border-top-right-radius": c,
                        "border-bottom-right-radius": c
                    } : {"border-radius": "initial"}, s.extend(r[0], c), s.extend(r[1], c)
                }
                return r
            }, this.init()
        },
        inputTrim: function (t) {
            function e() {
                return t.element.val() || t.element.text()
            }

            function i(t, e) {
                if (t.setSelectionRange)t.focus(), t.setSelectionRange(e, e); else if (t.createTextRange) {
                    var i = t.createTextRange();
                    i.collapse(!0), i.moveEnd("character", e), i.moveStart("character", e), i.select()
                }
            }

            function n(t) {
                var e = 0;
                if (document.selection) {
                    t.focus();
                    var i = document.selection.createRange();
                    i.moveStart("character", -t.value.length), e = i.text.length
                } else(t.selectionStart || "0" == t.selectionStart) && (e = t.selectionStart);
                return e
            }

            function a() {
                var a = t.element, o = e(), r = t.tip, c = t.trimReg;
                if (r == o && (o = ""), c) {
                    var l = o.match(c), u = l ? l.join("") : "";
                    if (l = u.match(c), u = l ? l[0] : "", u != o)if ("number" == s)a.val(u); else {
                        var h = n(a[0]);
                        a.val(u), i(a[0], h - 1)
                    }
                }
            }

            var s = t.element ? t.element.attr("type") : "";
            t.element.on("input", function () {
                a()
            })
        },
        pulldownRefresh: function (e) {
            function i() {
                v.css({height: "0"})
            }

            function n() {
                v.css({"-webkit-transition": "height 0.4s ease"})
            }

            function a() {
                v.css({"-webkit-transition": ""})
            }

            function o() {
                v.find("span").html("已是最新数据"), v.find("i").addClass("ui-hide"), setTimeout(function () {
                    i(), v.css({"-webkit-transition": "height 0.5s liner"})
                }, 1e3)
            }

            var r, c, l, u, h, d, f, p, g, m = e.insertBeforeEl, v = e.element, y = !1, b = e.noDie, x = v.find("div"), w = 0, k = 0;
            return s.touchstart(m, function (e) {
                y || (u = e.screenX, r = e.screenY, p = t(window).scrollTop(), t(".zc-title .title-list").css("opacity", 0).hide(), g = t("body").height(), a())
            }), s.touchmove(m, function (t) {
                if (!(y || p > 0)) {
                    if (f = t.screenX, c = t.screenY, w = f - u, k = c - r, h = 0 > w ? -w : w, d = 0 > k ? -k : k, 2 * h > d)return !0;
                    var e = 80, i = 50;
                    if (!(0 > k))return v.find("i").removeClass("load"), 0 == p ? (l = k / g * k, l = l > e ? e : l, v.find("i").removeClass("ui-hide"), l > i && e >= l ? (v.find("span").html("释放立即刷新"), v.find("i").addClass("up")) : (v.find("span").html("下拉刷新"), v.find("i").removeClass("up")), v.css({height: l + "px"}), x.css({"margin-left": -x.width() / 2}), !1) : void 0
                }
            }), s.touchend(m, function (t) {
                if (!y) {
                    if (h > d)return !0;
                    var a = document.body.scrollTop;
                    if (v.find("i").hasClass("load") && 0 > a && (v.find("i").removeClass("load"), e.stopStaut = !0, e.endCallback(e), a > 40 && (document.body.scrollTop = 0), i()), (0 > k || 0 !== a) && v.find("i").hasClass("load"))return !1;
                    k > 0 && (e.endCallback && v.find("i").hasClass("up") ? (e.stopStaut = !1, e.hide = i, e.refreshNoData = o, v.find("span").html("加载中..."), v.find("i").addClass("load"), v.css({height: "36px"}), x.css({"margin-left": -x.width() / 2}), e.endCallback(e)) : i()), n(), w = 0, k = 0
                }
            }), {
                destory: function () {
                    b || v.remove(), y = !0
                }
            }
        },
        logger: function (e) {
            for (var i = "", n = 0; n < arguments.length; n++)i += "-----" + arguments[n];
            t.ajax({
                url: "data/logger.json" + i + "-------------------------",
                type: "get",
                dataType: "json",
                data: {},
                success: function () {
                }
            })
        },
        clickActive: function (e) {
            function i(t) {
                for (var e = ""; "html" != t[0].tagName.toLowerCase() && (e = t.css("background-color"), "rgba(0, 0, 0, 0)" == e || "transparent" == e);)t = t.parent();
                return e
            }

            function n(t) {
                for (var e, i = t.match(/\d+/gi), n = "rgb(", a = 0; 3 > a; a++)e = Math.ceil(i[a] - (256 - i[a]) / 8 - 21), e = 0 > e ? 0 : e, n += e, 2 != a && (n += ",");
                return n += ")"
            }

            function a(t) {
                "relative|absolute|fixed".indexOf(t.css("position")) < 0 && t.css("position", "relative"), "hidden".indexOf(t.css("overflow")) < 1 && t.css("overflow", "hidden")
            }

            e || (e = t(document.body));
            var s = this, o = /^(#\d+|change)$/, r = /^[.\d]+s$/, c = /^(normal|long|wave)$/, l = [], u = 2e3;
            e.find("[data-clickactive]").each(function (e, h) {
                function d(t, e) {
                    "wave" !== R && (C ? (h.addClass("click-active"), h.css("background-color", m)) : (h.css("background-color", ""), h.removeClass("click-active")))
                }

                function f(t) {
                    var e = l.shift();
                    e && (e.el.addClass("wave-large"), setTimeout(function () {
                        e.el.remove(), clearTimeout(k), k = setTimeout(function () {
                            "hidden".indexOf(h.css("overflow")) < 1 && h.css("overflow", "")
                        }, t || 1e3)
                    }, t || 1e3))
                }

                var p, g, m, v, y, b, x, w, k, h = t(h), C = !1, T = 100, S = h.data("clickactive").split(","), R = "normal", E = h.data("href");
                S.forEach(function (t, e) {
                    t.match(o) ? (m = t, "change" == m && (y = !0)) : t.match(r) ? v = t : t.match(c) && (R = t)
                }), m || (m = n(i(h))), h.removeAttr("data-clickactive").removeAttr("data-href"), v && -1 === navigator.userAgent.indexOf(/MQQBrowser/) && s.css(h, "transition", "background-color " + (v || ".1s")), s.touchstart(h, function (e) {
                    return g && clearInterval(g), e.target && h.is("[data-clickforbidden]") ? void(x = !0) : (x = !1, void(y && (b = h.is("[data-clickforbidden]")) || (p = {
                        x: e.clientX,
                        y: e.clientY,
                        px: e.pageX,
                        py: e.pageY
                    }, C = !0, "wave" === R ? (g = setTimeout(w, T), w = function () {
                        var e = p.px - h.offset().left - 25, i = p.py - h.offset().top - 25;
                        l.push({
                            el: t('<div class="wave" style="left:' + e + "px;top:" + i + "px;background-color:" + m + '"></div>').appendTo(h),
                            timer: setTimeout(function () {
                                f()
                            }, u)
                        }), g = 0
                    }, ("relative|absolute|fixed".indexOf(h.css("position")) < 0 || "hidden".indexOf(h.css("overflow")) < 1) && a(h), clearTimeout(k)) : (g = setInterval(d, T), y && (m = n(i(h)))))))
                }), s.touchmove(h, function (t) {
                    y && b || x || (C = !1, clearInterval(g), d(h, t), f())
                }), s.touchend(h, function (t) {
                    if (!(y && b || x)) {
                        if (p) {
                            var e = t.clientX, i = t.clientY;
                            Math.abs(p.x - e) <= 10 && Math.abs(p.y - i) <= 10 ? (d(h, t), C = !1, setTimeout(d, "long" == R ? 10 * T : T), E && setTimeout(function () {
                                window.location.href = E
                            }, T + 400), "wave" === R && g && (clearTimeout(g), w())) : (C = !1, d(h, t)), "wave" === R ? (clearTimeout(g), f(0)) : clearInterval(g)
                        }
                        p = null, C = !1
                    }
                }), h.on("touchcancel", function (t) {
                    C = !1, f(3500)
                })
            })
        },
        createLoading: function (t) {
            this.createLoading.loading || (this.createLoading.loading = this.initLoading(t));
            var e = this.createLoading.loading;
            return e.show(), {
                reset: function () {
                    e.hide()
                }
            }
        },
        showAlert: function (t, e, i) {
            if ("number" == typeof e) {
                var n = i;
                i = e, e = n
            }
            return s.alertBox({
                type: "validate",
                animate: "alert-box-anim",
                bgAnimate: "alert-bg-anim",
                msg: t,
                callBack: function () {
                    var t = this;
                    setTimeout(function () {
                        t.reset(), e && e()
                    }, i || 2e3)
                }
            })
        },
        openPopWindow: function (i, n, a, o, r) {
            "function" == typeof n && (r = o, o = a, a = n, n = {}), n = n || {}, r = r || {};
            var c = '<div class="alert-box pop-window' + (r.rootClass ? "  " + r.rootClass : " alert-box-anim-init pop-window-end") + '">', l = "</div>";
            return s.alertBox({
                type: "custom",
                html: c + e.compile("string" == typeof i ? i : i.html())(n) + l,
                contextAnimate: r.contextAnimate || !1,
                animate: r.animate || "alert-box-anim",
                bgAnimate: r.bgAnimate || "alert-bg-anim",
                animateOut: "alert-box-anim-out2",
                bgAnimateOut: "alert-bg-anim-out2",
                bgClickReset: r.bgClickReset,
                upOffset: r.upOffset,
                resetCallback: r.resetCallback,
                asyncResetCallback: r.asyncResetCallback,
                scrollerClass: r.scrollerClass,
                callBack: function () {
                    var e = t(this.el), i = this;
                    r.callback && r.callback.call(i), s.clickActive(), s.stopClick(e.find(".close"), function () {
                        var t;
                        o && (t = o()), t !== !1 && i.reset()
                    }), s.stopClick(e.find(".confirm"), function () {
                        var t;
                        a && (t = a()), t !== !1 && i.reset()
                    })
                }
            })
        },
        showLoading: function (t) {
            this.messageAlertBox = this.createLoading(t)
        },
        hideLoading: function () {
            this.messageAlertBox && this.messageAlertBox.reset()
        },
        getContext: function () {
            return compose && compose.getContext() ? compose.getContext() : ""
        },
        getEvn: function () {
            var t = document.location.hostname, e = /^([\w\.]*)(pre)(\w*)(.cnsuning.com)$/, i = /^([\w\.]*)(sit)(\w*)(.cnsuning.com)$/, n = "";
            return t.match(e) ? n = "pre" : t.match(i) && (n = "sit"), n
        },
        getPayPassport: function () {
            var t = this.getEvn();
            return "https://" + t + "paypassport." + (t ? "cn" : "") + "suning.com/ids/login?loginTheme=wap&service="
        },
        getPassport: function () {
            var t = this.getEvn();
            return "https://" + t + "passport." + (t ? "cn" : "") + "suning.com/ids/login?loginTheme=wap&service="
        },
        authAjax: function (e) {
            var i = this, n = t.extend({
                type: e.type || "get",
                dataType: "json",
                timeout: e.timeout || 15e3,
                handleLogin: !0,
                data: {}
            }, e), a = new Date;
            n.data.ts = a.valueOf(), n.noloading || i.showLoading();
            n.success;
            return n.success = function (t) {
                i.hideLoading(), i.authorFiler(t, n, e)
            }, n.error = function (t) {
                i.hideLoading(), e.error && e.error(t), n.connectNoError || i.showAlert("网络繁忙，请重试")
            }, t.ajax(n)
        },
        authorFiler: function (t, e, i) {
            var n = this, a = e.dataType, s = i.success;
            "json" == a ? e.handleLogin && t && (t.idsIntercepted || "0999" == t.responseCode) ? (i.error && i.error({type: "needAuthor"}), window.partMemberRequire ? n.loginSubmit(t, e, i) : n.showAlert("请登录", function () {
                window.location.reload()
            })) : s && (!e.filter || e.filter && !e.filter(t)) && s(t) : s(t)
        },
        loginSubmit: function (e, i, n) {
            if (window.appConfig && window.appConfig.loginUrl) {
                var a = eBase.util[n && n.requireType ? "get" : "remove"]("login-path-valide");
                if (a && eBase.util.isSupport && "page" == n.requireType)return void eBase.PageRouter.trigger("login-back", a);
                eBase.util.put("login-path-valide", {
                    fragment: eBase.getFragment("", !0),
                    forbidBack: !(!n || !n.forbidBack)
                }), setTimeout(function () {
                    eBase.util.remove("login-path-valide")
                }, 1e3);
                var s = n && n.authorBackUrl || eBase.param("path");
                eBase.util.put("login-path", s);
                var o = t('<form method="post" action="' + (window.appConfig.loginUrl || "") + '?navigationType=LinkClicked&loginTheme=wap"><input type="hidden" name="path" value="' + s + '"/></form>');
                setTimeout(function () {
                    o.submit()
                }, 300)
            }
        },
        direct: function (t) {
            window.location.href = t, setTimeout(function () {
                window.location.reload()
            }, 800)
        },
        initLoading: function (t) {
            var e = t && t.msg || "加载中", i = window.location.hostname, n = (i.match(/\.suning\.com/) ? "." : "sit.cn", '<div class="loading"><span class="loading-tip">' + e + '</span><div class="req-circle"/></div></div>');
            return s.alertBox({
                type: "validate",
                msg: n,
                animate: "alert-box-anim",
                bgAnimate: "alert-bg-anim",
                delayRender: !1,
                callBack: function () {
                    this.el.style.opacity = 1, this.bg.style.display = "none"
                }
            })
        },
        init: function () {
            this.clickActive()
        }
    };
    return s.click(t(document.body), function () {
    }), s.init(), s
}($, template), headerAsync = function () {
    var t = [], e = !0;
    return {
        add: function (i) {
            i && (e ? t.push(i) : i())
        }, cancelAsync: function () {
            e = !1
        }, exec: function () {
            for (var e = 0; e < t.length; e++)t[e]();
            t = []
        }
    }
}(), headerMenu = {
    init: function () {
        var t = this;
        document.body.addEventListener("scroll", function (t) {
            return $("header .menu").hasClass("hide") ? void 0 : (t.preventDefault(), !1)
        }, !1), t.checkApp() && t.showRightButton()
    }, checkApp: function () {
        return navigator.userAgent.match(/SNEBUY-APP;?/i) || navigator.userAgent.match(/SNYifubao;?/i) || navigator.userAgent.match(/SNSTORE-APP;?/i)
    }, setPageTitle: function (t, e) {
        var i = this;
        $("title").html(e);
        try {
            navigator.userAgent;
            if (i.checkApp()) {
                if ($("header").remove(), window.SNNativeClient && window.SNNativeClient.updateTitle)try {
                    window.SNNativeClient.updateTitle(e)
                } catch (n) {
                }
                return
            }
            t.find(".title").html(e)
        } catch (n) {
        }
    }, showDropMenu: function (t) {
        var e = t && t.find ? t.find.bind(t) : $, i = e(".points-wrap"), n = e(".menu"), a = e(".mask"), s = navigator.userAgent;
        if (Exp.click(i, function () {
                n.removeClass("hide"), n.toggleClass("menu-show"), n.removeClass("menu-hide"), a.toggleClass("hide")
            }), Exp.click(a, function () {
                n.removeClass("menu-show"), n.addClass("menu-hide"), setTimeout(function () {
                    a.addClass("hide"), n.addClass("hide")
                }, 300)
            }), Exp.click(e("header .menu li"), function () {
                e(this).index();
                setTimeout(function () {
                    n.addClass("hide"), a.addClass("hide")
                }, 500)
            }), s.indexOf("SNEBUY-APP") > 0 || s.indexOf("SNYifubao") > 0) {
            var o = e(".fix-header");
            o.length > 0 && (o.removeClass("fix-header"), e(".fix-content").removeClass("fix-content"))
        }
        e("header .goback").click(function () {
            window.history.go(-1)
        })
    }, showRightButton: function (t) {
        function e() {
            var e = navigator.userAgent, n = e.substring(e.indexOf("SNYifubao") + 10), a = e.substring(e.indexOf("EBuy-SNYifubao") + 15);
            if (t && 1 == t)var s = '[{"title":"我的理财","callBack":"callBackMyLicai","params":"100"}]'; else var s = '[{"title":"理财首页","callBack":"callBackLicai","params":"https://imgssl.suning.com/images/advertise/001/khd/lc.png"},{"title":"我的理财","callBack":"callBackMyLicai","params":"https://imgssl.suning.com/images/advertise/001/khd/wdlc.png"},{"title":"零钱宝","callBack":"callBackMyLqb","params":"https://imgssl.suning.com/images/advertise/001/khd/lqb.png"}]';
            if (e.indexOf("SNEBUY-APP") > 0)if (e.indexOf("Android") > -1 || e.indexOf("Linux") > -1)lcresPath.indexOf(".com/") > 0 && (lcresPath = lcresPath.substring(0, lcresPath.indexOf(".com/") + 4)), i.lazyLoadScript("https://sslres.suning.com/project/mvs/RES/common/script/android/sneapp.js", function () {
                setTimeout(function () {
                    try {
                        baseApi.showRightButtons(s)
                    } catch (t) {
                    }
                    headerAsync.exec(), headerAsync.cancelAsync()
                }, 1500)
            }); else try {
                window.SNNativeClient.showRightButtons(s)
            } catch (o) {
            } else if (e.indexOf("SNYifubao") > 0) {
                if ("4.6.0" > n && e.indexOf("EBuy-SNYifubao") < 0 || "3.8.0" > a && e.indexOf("EBuy-SNYifubao") > 0) {
                    s = '{"titles":["我的理财"], "callBacks":["callBackMyLicai"], "params":["100"]}';
                    try {
                        window.SNNativeClient.showRightButtons(s)
                    } catch (o) {
                    }
                } else try {
                    window.SNNativeClient.showRightButtonMenu(s)
                } catch (o) {
                }
            }
        }

        var i = this;
        navigator.userAgent;
        window.SNNativeClient ? e() : document.addEventListener("SNNativeClientReady", e, !1)
    }, lazyLoadScript: function (t, e) {
        var i = {};
        if (!i[t]) {
            i[t] = e;
            var n = document.createElement("script");
            if ("function" == typeof e)/msie/i.test(navigator.userAgent.toLowerCase()) || (n.onload = e), n.onreadystatechange = function () {
                "loaded" != n.readyState && "complete" != n.readyState || e()
            }; else if (isArray(e)) {
                var a = function () {
                    for (var t = 0; t < e.length; t++)e[t]()
                };
                n.onload = a, n.onreadystatechange = function () {
                    "loaded" != n.readyState && "complete" != n.readyState || a()
                }
            }
            n.type = "text/javascript", n.src = t;
            var s = document.getElementsByTagName("head")[0];
            s.appendChild(n)
        }
    }
};
headerMenu.init(), function (t, e, i) {
    "use strict";
    var n = t.eBase = {
        version: "1.0.0", $: e, template: i, templater: function (t, e) {
            return i.compile(t)(e)
        }, isElement: function (t) {
            return !(!t || 1 !== t.nodeType)
        }, isArray: function (t) {
            return "[object Array]" === toString.call(t)
        }, isObject: function (t) {
            var e = typeof t;
            return "function" === e || "object" === e && !!t
        }, modules: function () {
            var t = {}, e = {
                put: function (e, i) {
                    t[e] = i
                }, get: function (e) {
                    return t[e]
                }, remove: function (e) {
                    delete t[e]
                }
            };
            return e
        }(), getMethod: function (t, e) {
            return t ? e + t.replace(/^\w/, function (t) {
                return t.toUpperCase()
            }) : function () {
            }
        }, delay: function (t, e, i) {
            function n(t, e, i) {
                s.push({
                    func: t, getTime: function () {
                        var t = new Date;
                        return i = i || t, e + (i - t)
                    }
                })
            }

            function a() {
                var t = s.shift();
                if (t) {
                    var e = t.getTime();
                    e = 0 > e ? 0 : e, setTimeout(function () {
                        t.func(), a()
                    }, e)
                }
            }

            var s = [], e = e || 0;
            return n(t, e, i), a(), {
                delay: function (t, e, i) {
                    n(t, e, i)
                }
            }
        }, tip: function (t, e) {
            Exp.showAlert(t, e)
        }, "extends": function (t, e, i) {
            var a = Object.prototype.toString, s = "[object Array]";
            t = t || {};
            for (var e, o = arguments, r = 1; r < o.length; r++) {
                e = o[r];
                for (var c in e)e.hasOwnProperty(c) ? "[object Object]" !== toString.call(e[c]) || "object" != typeof e[c] || i ? t[c] = e[c] : (t[c] || (t[c] = a.call(e[c]) === s ? [] : {}), n["extends"](t[c], e[c])) : t[c] = e[c]
            }
            return t
        }, simulate: function (t, e, i) {
            t ? n.Config.simulate.timeout ? setTimeout(e, n.Config.simulate.timeout) : e() : i && i()
        }, extend: function (t, e) {
            function i() {
                this._super = t.prototype, t.apply(this, arguments)
            }

            return n.isFunction(t) || (e = t, t = this), n["extends"](i, t), i.prototype = Object.create(t.prototype), n["extends"](i.prototype, e), i.prototype.constructor = i, i
        }, off: function (t, e) {
            setTimeout(function () {
                var e = t.find("*");
                t.forEach(function (t) {
                    e.push(t)
                }), e.off()
            }, "number" == typeof e ? e : 1e3)
        }, encodeHash: function (e) {
            return decodeURIComponent(e || t.location.hash)
        }, encodeHref: function (e) {
            return decodeURIComponent(e || t.location.href)
        }, param: function (t, e, i) {
            i = n.encodeHref(i);
            var a, s = new RegExp("[\\?&]" + t + "=([^&#]*)"), o = new RegExp("[?&]" + t + "=(?=&|$)", "g"), r = i.match(s);
            return void 0 === e ? r ? r[1] || "" : "" : (a = r ? i.replace(s, function (t, i) {
                return t.replace("=" + i, "=" + e)
            }) : i + (i.indexOf("?") > 0 ? "&" : "?") + t + "=" + e, a = a.replace(o, function (t) {
                return t.indexOf("?") >= 0 && a.indexOf("&") >= 0 ? "?" : ""
            }).replace(/[\?,]$/, "").replace(/\?&/, "?"), i != a && history.replaceState("", "", a), void 0)
        }, hash: function (t, e) {
            var e = n.encodeHref(e), i = e.replace(/#.*/, "");
            history.replaceState("", "", i + t)
        }, parseToParam: function () {
            var t, e = n.Config.router, i = e.openPath, a = e.pathName, s = this.parseToParam.hash || "", o = n.encodeHref(), r = n.encodeHash(), c = this.param(a), l = /##/g;
            if (!r) {
                var u = r.match(/(#*)$/);
                r = u ? u[0] : n.encodeHash()
            }
            r.match(/^##/) && (r = r.replace(l, "#"), o = o.replace(l, "#"), t = !0), i ? (r = r.replace(/\#/g, ",").replace(/^,/, ""), t || ("null" === c && (c = n.util.get("login-path") || ""), c && (r = c + (r ? "," + r : ""))), this.param(a, r, o.substring(0, o.indexOf("#"))), this.hash("")) : ((s.indexOf(r) >= 0 || r.indexOf(s) >= 0) && (t = !0), t ? this.hash("#" === r ? "" : r) : (r = s + r, this.hash(r)), this.parseToParam.hash = r)
        }, getFragment: function (e, i) {
            var a, e = n.encodeHref(e || t.location.href), s = n.Config.router;
            if (s.openPath) {
                var o = this.param(s.pathName) || "";
                a = o.replace(/,/g, "#")
            } else {
                var r = e.indexOf("#") || 0;
                a = 0 > r ? "" : e.substring(r + 1)
            }
            if (i) {
                var c = a.split(/#/);
                a = c.pop()
            }
            return a
        }
    };
    ["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"].forEach(function (t) {
        n["is" + t] = function (e) {
            return toString.call(e) === "[object " + t + "]"
        }
    }), n.log = function () {
        function t(t, e, i) {
            (n.Config.debug || i) && console.log("%c" + t, e)
        }

        return n["extends"](t, {
            info: function (e, i) {
                t(e, "color: #ccc;", i)
            }, warn: function (e, i) {
                t(e, "color: #8a6d3b;", i)
            }, success: function (e, i) {
                t(e, "color: #00A503;", i)
            }, except: function (e, i) {
                t(e, "color: #a94442;", i)
            }, error: function (t, e) {
                console.error(t)
            }
        }), t
    }();
    var a = 0;
    n.Event = function () {
        var t = {
            _events: {}, on: function (t, e) {
                if (t) {
                    if (this._events[t] || (this._events[t] = []), n.isString(e) && (e = this[e]), !e)return;
                    this._events[t].push({name: t, callback: e, counter: ++a})
                }
                return this
            }, trigger: function (e) {
                var i, n, a, s = this._events[e] || [];
                if (t)for (var o = 0; o < s.length; o++)if (i = s[o], n = i.callback, n && (a = n.apply(this, Array.prototype.slice.call(arguments, 1)), a === !0))return a
            }, off: function (t, e) {
                if (t) {
                    var i, n, a = this._events[t];
                    if (a)if (e)for (var s = 0; s < a.length; s++)i = a[s], n = i.callback, e && e === n && (this._events[t] = a = a.slice(0, s).concat(a.slice(s)), s--); else e || (this._events[t] = [])
                }
                return this
            }
        };
        return t
    }, n.View = function (t) {
        this.instance.apply(this, arguments)
    }, n["extends"](n.View, {extend: n.extend}), n["extends"](n.View.prototype, n.Event(), {
        instance: function (t) {
            this.status = {}, t = t || {}, this.el = t.el, this.tagName = t.tagName || "div", this.attrs = t.attrs || {}, t.className && (this.attrs["class"] = t.className), this.setEl(), this._status = n["extends"]({}, this.status), this.trigger("instance", t)
        }, render: function () {
        }, getStatus: function (t) {
            return void 0 === t ? this.status : this.status[t]
        }, setStatus: function (t) {
            n.isString(t) ? this.status[t] = arguments[1] : n["extends"](this.status, t)
        }, active: function () {
            this.setStatus({active: !0, deactive: !1, destory: !1}), this.trigger("active", status)
        }, deactive: function () {
            this.setStatus({active: !1, deactive: !0, destory: !1}), this.trigger("deactive")
        }, destroy: function (t) {
            var t = t || {};
            t.remainEl || this.el.empty().remove(), this.setStatus({
                active: !1,
                deactive: !0,
                destory: !0
            }), this.trigger("destroy")
        }, setRouteData: function (t) {
            this.routeData = t
        }, setEl: function () {
            this.el ? this.el = e(this.el) : this.el = e(document.createElement(this.tagName)).attr(this.attrs)
        }, setRouter: function (t) {
            this.router = t
        }, getRouter: function () {
            return this.router
        }, setService: function (t) {
            this.service = t
        }, getService: function () {
            return this.service
        }
    }), n.Router = function (t) {
        this.instance.apply(this, arguments)
    }, n["extends"](n.Router, {
        extend: n.extend, _routers: {}, register: function (t, e) {
            var i;
            for (var n in t)i = t[n], this._routers[n] = {
                callback: i,
                router: e,
                name: n
            }, this._analyse(n, this._routers[n])
        }, start: function () {
            return this.startFlag || (this.startFlag = !0, this._analyse(), this.onStart(), this.addEvent(), this.execRouter({type: "refresh"})), this
        }, onStart: function () {
        }, forward: function (t, e) {
            t = t || "", this.checkRouter(t) && (history.pushState("", "", t ? "#" + t : ""), this.execRouter(e || {type: "trigger"}))
        }, change: function (t) {
            var e = this.getFragment();
            this.forward(e, t)
        }, add: function (t) {
            this.go(t)
        }, go: function (e, i) {
            var a = ((e || "") + "").match(/([+-]\d+)/);
            if (i === !0 && a)t.history.go(e - 0); else if ("notrace" === i)history.replaceState("", "", n.encodeHref() + "#" + e), this.execRouter({type: "notrace"}); else if (a)if (a[0] - 0 >= 0)t.history.go(a[0] - 0); else {
                var s = n.Config.router, o = s.openPath, r = s.pathName, c = n.encodeHash();
                o && (c = "##" + n.param(r).replace(/,/g, "#"));
                var l = c.split("#");
                c = l.slice(0, l.length + (a[0] - 0)), c = c.join("#") || "#", t.location.href = "#" == c ? "##" : c
            } else n.delay(function () {
                t.location.href = "#" + e
            }, 10)
        }, back: function () {
            t.history.back()
        }, getHash: function () {
            return n.getFragment()
        }, getFragment: function () {
            return n.getFragment(t.location.href, !0)
        }, addEvent: function () {
            var e = t.addEventListener || function (t, e) {
                    return attachEvent("on" + t, e)
                };
            e("popstate", this.execRouter.bind(this, {type: "click"}))
        }, hasRouter: function () {
            var t = this._routers, e = this.getHash(), i = !1, n = 0;
            for (var a in t)if (a !== e && "#" + a !== e || (i = !0), n++, 2 === n)return !0;
            return !i && n
        }, checkRouter: function (t) {
            var e, i = this._routers;
            for (var a in i)if (e = i[a], e && t.match(e.reg))return e.name = a, e.router.setHash(n.Router.getHash()), e
        }, execRouter: function (t) {
            var e = n.parseToParam();
            if (!e) {
                var i = this.getFragment(), a = this.checkRouter(i), s = !1;
                if (this.event = t, a) {
                    var o = i.match(a.reg).map(function (t) {
                        return t && (t = t.replace(/^\//, "")), t
                    });
                    a.callback.apply(a, o.slice(1)), a.router.active(), s = !0
                }
                this.trigger("execRouter", {
                    fragment: i,
                    success: s,
                    routerName: a && a.name,
                    type: t.type || "trigger"
                })
            }
        }, _analyse: function (t, e) {
            var i, n = this._routers;
            arguments.length && (n = {}, n[t] = e.callback);
            for (var a in n)i = a, i && (i = i.replace(/\/\:([^\/]+)/g, function (t) {
                return t && t.indexOf("|") >= 0 ? "($|(?:/)[^|#/]+|(?:/)[^/]?)" : "((?:/)[^|#/]+|(?:/)[^/]?)"
            })), this._routers[a] = {
                reg: new RegExp((i ? "^" + i : "^$") + "(?:\\?([\\s\\S]*))?$"),
                callback: e.callback,
                router: e.router
            }
        }, getRouter: function (t) {
            var e = this._routers[t];
            return e || (e = this.checkRouter(t)), e && (e = e.router), e
        }, isOnline: function () {
            return t.navigator.onLine
        }
    }, n.Event()), n["extends"](n.Router.prototype, n.Event(), {
        instance: function (t) {
            this.options = t || {}, this.setView(t.view), this.trigger("instance", t)
        }, setView: function (t) {
            this.view = t, this.view.setRouter(this)
        }, getView: function () {
            return this.view
        }, setRouteData: function () {
            this.routeData = arguments, this.view && this.view.setRouteData(arguments)
        }, getRouteData: function () {
            return this.routeData
        }, register: function () {
            this.analyse(), this.constructor.register(this.route, this)
        }, analyse: function () {
            var t, e = this.route, i = this;
            for (var a in e)t = e[a], n.isString(t) && (t = this[t]), t = t.bind(this), e[a] = function () {
                var n = arguments.length - 1, a = arguments[n], s = Array.prototype.slice.call(arguments, 0, void 0 === a ? n : n + 1);
                i.setRouteData.apply(i, s), t.apply(e, s)
            }
        }, getViewStatus: function () {
            return this.view && this.view.getStatus()
        }, active: function (t) {
            this.view && this.view.active(t), this.trigger("active", t)
        }, deactive: function (t) {
            this.view && this.view.deactive(t), this.trigger("deactive", t)
        }, destroy: function (t) {
            this.view && this.view.destroy(t), this.trigger("destroy", t)
        }, setHash: function (t) {
            this.hash = t
        }, getHash: function (t) {
            return this.hash
        }, getFragment: function () {
            return n.getFragment(t.location.href, !0)
        }
    }), n.Service = function (t) {
        this.instance.apply(this, arguments)
    }, n["extends"](n.Service, n.Event(), {extend: n.extend}), n["extends"](n.Service.prototype, n.Event(), {
        instance: function (t) {
            this.options = t || {}, this.setView(t.view), this.trigger("instance", t)
        }, setView: function (t) {
            this.view = t, this.view.setService(this)
        }, getView: function () {
            return this.view
        }
    })
}(window, $, template), function (t) {
    window.eBase.Config = {
        view: {requireTimes: {always: "always", once: "once"}, loadingMinTime: 500, prefetch: !0},
        router: {resources: {}, closeRoot: !0, openPath: !0, pathName: "path"},
        service: {urls: {templatePath: appConfig.templatePath || "data/html"}, timeout: 15e3},
        layout: {animateDuration: 600},
        simulate: {reqResFail: !1, timeout: 3e3},
        debug: !0,
        member: "epp",
        partMemberRequire: !0
    }
}(eBase), function (t) {
    "use strict";
    t.Layout = function (t) {
        t = t || {}, this.list = [], this.current = {}, this.instance.apply(this, arguments), this.timeCaller = null
    }, t["extends"](t.Layout, {
        extend: t.extend,
        optionsAdd: "add",
        optionsDel: "del",
        optionsAddDel: "addAndDel",
        optionsNoChange: "noChange"
    }), t["extends"](t.Layout.prototype, t.Event(), {
        instance: function () {
        }
    }), t.DislocationLayout = t.Layout.extend({
        current: {}, instance: function (t) {
        }, active: function () {
        }, add: function (e, i) {
            var n = this.handleRoute(e), a = this.list, s = this.current, o = s.router;
            if (n) {
                var r = n.index;
                if (n.opt === t.Layout.optionsNoChange)return e.blankRouter = o && o.blank && o, void(s.router = e);
                t.PageRouter.trigger("deactive"), n.opt === t.Layout.optionsAddDel && (e.view.el.addClass("page-add-prev-ani page-hidden"), e.view.el.insertBefore(n.nextRouter.view.el)), o && o.deactive && o.deactive({operate: "remove"}), this.handleDeleteRouter(e, o, a, r, s.index, i), this.current = {
                    index: r,
                    router: e
                }
            } else t.PageRouter.trigger("deactive"), a.push(e), o && (o.deactive && o.deactive({operate: "hidden"}), this.handleAddRouter(e, o, a, a.length - 1, s.index, i)), this.current = {
                index: a.length - 1,
                router: e,
                blankRouter: o && o.blank && this.current
            }
        }, handleRoute: function (e) {
            var i, n, a, s = this.list, o = this;
            if (s.length) {
                if (s.some(function (n, r) {
                        return n.getHash() === e.getHash() ? (n instanceof t.Router && o.current.router !== e || (s[r] = e, a = t.Layout.optionsNoChange), i = {
                            index: r,
                            curRouter: e,
                            opt: a || t.Layout.optionsDel
                        }, !0) : void 0
                    }), !i) {
                    var r, o = this;
                    s.some(function (a, c) {
                        return a.getHash().indexOf(e.getHash()) >= 0 ? (n = e, r = s.slice(0, c), r.push(e), o.list = s = r.concat(s.slice(c)), o.current.index >= c && o.current.index++, i = {
                            index: c,
                            curRouter: e,
                            nextRouter: s[c + 1],
                            opt: t.Layout.optionsAddDel
                        }, !0) : void 0
                    })
                }
                return i
            }
            return !1
        }, addBlankElement: function (e, i) {
            function n() {
            }

            this.blankRoute = {
                view: {
                    el: e, render: n, status: {init: !0, destory: !1}, getStatus: function (t) {
                        return void 0 === t ? this.status : this.status[t]
                    }
                }, hash: t.PageRouter.getHash(), getHash: function () {
                    return this.hash
                }, destroy: function () {
                    this.view.status.destory = !0
                }, blank: !0
            }, this.add(this.blankRoute, i)
        }, destroy: function (t) {
            for (var e = this.list, i = e.length; i;)if (i--, e[i] === t) {
                this.list = e.slice(0, i).concat(e.slice(i + 1));
                break
            }
        }, removeBlankElement: function () {
            this.blankRoute = null
        }, handleAddRouter: function (t, e, i, n, a, s) {
            function o() {
                window.scrollTo(0, 0), t.view.getStatus("destory") || c.addClass("page-hidden"), r.removeClass("page-ani page-add-ani")
            }

            var r = t.view.el, c = e.view.el;
            t && (r.removeClass("page-hidden").addClass("page-ani").removeClass("page-add-prev-ani page-del-ani page-del-prev-ani"), r.addClass("page-add-ani"), e && c.removeClass("page-hidden").addClass("page-add-prev-ani").removeClass("page-add-ani page-del-ani page-del-prev-ani"), t.view.render && (s && "notrace" == s.type ? o() : this.updateTimeCaller(o, r)), e.setScrollTop && e.setScrollTop(document.body.scrollTop))
        }, handleDeleteRouter: function (e, i, n, a, s, o) {
            var r = e && e.view.el, c = i && i.view.el, l = this;
            if (e !== i && i) {
                var u = document.body.scrollTop, h = c.clone().css({
                    "margin-top": -u,
                    position: "fixed",
                    "z-index": "10000"
                }).appendTo(c.parent()), d = navigator.userAgent.match(/(Android.*MQQBrowser)/) ? 100 : 50;
                t.delay(function () {
                    c.hide(), r.removeClass("page-hidden"), t.delay(function () {
                        function u() {
                            c.remove(), t.off(c), h.remove(), r.removeClass("page-hidden page-ani page-del-ani")
                        }

                        r.addClass("page-del-ani").removeClass("page-add-ani page-add-prev-ani page-del-prev-ani"), e.getScrollTop && window.scrollTo(0, e.getScrollTop()), h.addClass("page-del-prev-ani").removeClass("page-hidden page-add-ani page-add-prev-ani page-del-ani");
                        var d = n.slice(a + 1, s);
                        if (d.forEach(function (t, e) {
                                l.destroy(t), t.destroy()
                            }), i) {
                            l.destroy(i), i.destroy({remainEl: !0});
                            var f = i && i.blankRouter;
                            f && (delete i.blankRouter, f.destroy())
                        }
                        e.view.render && (o && "notrace" == o.type ? u() : l.updateTimeCaller(u, c))
                    }, d)
                }, d)
            }
        }, updateTimeCaller: function (e, i) {
            var n = this;
            this.timeCaller && (this.timeCaller.el === i && clearTimeout(this.timeCaller.timer), this.timeCaller = null), this.timeCaller = {
                timer: setTimeout(function () {
                    e && e(), n.timeCaller = null
                }, t.Config.layout.animateDuration), callback: e, el: i
            }
        }, hasHistory: function () {
            return !!this.list.length
        }, hasRouter: function (t) {
            var e = this.list;
            return e.some(function (e) {
                return e.getHash() == t || e.getHash() == "#" + t ? e : void 0
            })
        }
    })
}(eBase), function (t, e) {
    "use strict";
    var i = t.eBase.PageView = e.View.extend({
        instance: function (t, i) {
            e["extends"](this, i || {}, e.Event()), this.addPageElement(t), this.wrapRender(), this.on("satisfy", "render"), this.on("destroy", "onDestroy"), this.on("instance", "onInstance"), this._super.instance.call(this, t), this.el.find(".page-cont").size() || t.background === !1 || this.el.append('<div class="page-cont"></div>'), this.setStatus({required: !1}), this._status.required = !1
        }, addPageElement: function (t) {
            var e = n.getBlankElement(!0);
            if (e) {
                var i = e.el;
                t ? t.el = i : this.resetEl(i), this.addBlankTime = e.time
            } else this.addBlankTime = null
        }, onInstance: function () {
        }, onDestroy: function () {
            var t = this.requires;
            t.startIndex = 0, t.ajax && t.ajax.abort(), this.render.timer && (clearTimeout(this.render.timer), delete this.render.timer), this.addBlankTime = null, this.hideLoadingBar(), this.setStatus({
                operate: "",
                required: !1
            })
        }, active: function () {
            this.getStatus("active") || (this._super.active.apply(this), this.getStatus("required") && !this.getStatus("destory") || this.satisfy())
        }, resetEl: function (t) {
            this.el = t, this.setEl()
        }, render: function () {
        }, wrapRender: function () {
            var t = this.render.bind(this);
            this.render = function (i) {
                function a() {
                    var i = "add" === o.getStatus("operate") || "valide" === o.getStatus("operate");
                    if (c.required && !i) {
                        var a = n.pageLoading, s = n.getBlankElement(o.getRouter().getFragment());
                        a && s && a.hide(), o.el.addClass(o.attrs["class"]), o.setStatus({operate: "add"})
                    } else c.required ? o.setStatus({operate: "valide"}) : o.setStatus({operate: "reset"});
                    o.routeData && (o.pageData = o.pageData || {}, o.pageData.params = o.routeData), o.setTemplateTag();
                    var r = e["extends"]({}, c);
                    t(o.routeData || [], r), o.el.css("position", "")
                }

                var s = this.hasCompleted(), o = this;
                if (s && !this.getStatus("destory")) {
                    if (i && !i.ajax) {
                        var r = this.getRouter();
                        n.addBlankPage(r.getFragment())
                    }
                    var c = this.getStatus(), l = this.addBlankTime;
                    c.required && l ? o.render.timer = e.delay(a, e.Config.view.loadingMinTime, l) : a()
                }
            }
        }, setTemplateTag: function () {
            e.template.config("openTag", "${"), e.template.config("closeTag", "}"), e.template.config("escape", !1)
        }, resetTemplateTag: function () {
            e.template.config("openTag", "{{"), e.template.config("closeTag", "}}"), e.template.config("escape", !1)
        }, requires: [], satisfy: function () {
            var t = this.requires, i = this;
            t.startFetch || (e["extends"](t, {
                startIndex: 0,
                ajaxCount: 0,
                completes: 0,
                startFetch: !0
            }), t.forEach(function (n, a) {
                var s = n.property, o = n.getter || e.getMethod(s, "get"), r = n.setter || e.getMethod(s, "set");
                e.isString(o) && (o = n.getter = i[o].bind(i)), e.isString(r) && (r = n.setter = i[r].bind(i)), n.invoke = function (e) {
                    t.completes++, r(e), n.data = e, n.required = !0, i.getStatus("deactive") || i.notifyLoadingBar(), t.completes === t.length && (i.setStatus("required", !0), i.trigger("satisfy", {ajax: !!t.ajaxCount}), t.startFetch = !1)
                }, n.handle = function (i) {
                    this.required && this.times === e.Config.view.requireTimes.once ? this.invoke(this.data) : (t.ajaxCount++, this.getter(this)), t.startIndex++
                }, n.handle()
            }), 0 === t.length && i.trigger("satisfy"))
        }, resetPageData: function () {
            var t = this.requires, i = 0;
            t.some(function (n, a) {
                return n.times === e.Config.view.requireTimes.always ? (t.startIndex = a, t.completes = i, !0) : void i++
            })
        }, refresh: function (t) {
            this.setStatus("operate", "reset"), e.off(this.el, 0), t && (this.resetPageData(), this.getPageData())
        }, hasCompleted: function () {
            return this.requires.completes === this.requires.length || 0 === this.requires.length
        }, notifyLoadingBar: function () {
            var t = this.requires.length, i = this.requires.completes, n = 0;
            n = 0 == t ? 100 : 100 * i / t, e.util.setPageProcess(n, t)
        }, hideLoadingBar: function () {
            var t = e.util.getPageLoadingbar();
            t && t.css("opacity", 0)
        }, getTemplateHtml: function (t) {
            this.service.getTemplateHtml(t)
        }, setTemplateHtml: function (t) {
            this.resetTemplateTag(), this.templateHtml = t, this.template = e.template.compile(this.templateHtml)
        }, template: function (t) {
            return ""
        }, setPageData: function (t) {
            this.pageData = t
        }, getPageData: function () {
            return this.pageData
        }, addLoadingTo: function (t, i, n) {
            var a = this.el;
            a.parent().size() || a.appendTo(t), e.PageRouter.hidePageLoading();
            var s, o = a.find(".page-cont");
            n ? s = n(this.pageData, this.template) : (s = this.template(this.pageData || {}), i && (s = i(s))), o.show().css("opacity", 0), setTimeout(function () {
                o.hide()
            }, 300), this._cont && this._cont.remove(), this._cont = $(s).insertBefore(o)
        }, manualLoadingTo: function (t, e) {
            e && this.addLoadingTo(t, null, e)
        }, compileHtml: function (t, e) {
            this.setTemplateTag();
            var i = template.compile(t), n = i(e);
            return n
        }
    });
    e["extends"](i, {"static": {templateAjax: "template", commonAjax: "common"}});
    var n = t.eBase.PageRouter = e.Router.extend({
        instance: function (t, i) {
            e["extends"](this, i || {}), this._super.instance.call(this, t), this.register(), this.onInstance(t)
        }, onInit: function () {
        }, onInstance: function () {
        }, launch: function () {
        }, setScrollTop: function (t) {
            this.scrollTop = t
        }, getScrollTop: function () {
            return this.scrollTop || 0
        }
    });
    e["extends"](n, {
        events: {},
        resources: e["extends"]({}, e.Config.router.resources),
        resStatus: {init: 0, start: 1, success: 2, fail: 3},
        _handledRes: {},
        onStart: function () {
            this.analyseResource(), this.setLayout(new e.DislocationLayout), this.on("execRouter", "onExecRouter")
        },
        requireResource: function (t, i, n) {
            function a(i, n, a) {
                i.status = l.resStatus.fail, e.log.error("PageRouter.requireResource: 路由[" + t + "]-->[" + n.join(",") + "]资源获取失败！"), e.util.setPageProcess(100), a || l.back(!0)
            }

            var s, o, r = this.resources, c = i.bind(this, "reqsuccess"), l = this;
            this.checkResource(t, function (i) {
                return s = i.route, o = s.status, s.cb = c, o === l.resStatus.success ? s.cb() : o !== l.resStatus.init && o !== l.resStatus.fail || (l.trigger("requireResource"), r = e["extends"]([], s.path), s.status = l.resStatus.start, e.simulate(e.Config.simulate.reqResFail, function () {
                    a(s, r, n)
                }, function () {
                    compose.require(r, function () {
                        "undefined" == typeof l.success || l.success ? (e.log.success("PageRouter.requireResource: 路由[" + t + "]-->[" + r.join(",") + "]资源" + ("prefetch" === n ? "预取" : "获取") + "成功！"), s.status = l.resStatus.success, s.cb()) : a(s, r, n)
                    }, function () {
                        s.status = l.resStatus.fail, a(s, r, n)
                    })
                })), !0
            })
        },
        analyseResource: function () {
            var t, i, n = this.resources;
            for (var a in n)t = n[a], e.isArray(t) && (i = a ? "(^" + a + "$)" : "(^$)", n[a] = {
                reg: new RegExp(i),
                path: t,
                status: this.resStatus.init
            })
        },
        addResource: function (t) {
            e["extends"](this.resources, t || {})
        },
        setLayout: function (t) {
            this.layout = t
        },
        getPreRouter: function () {
            var t = this.getHash(), e = "";
            if (t) {
                var i = t.match(/\#[\s\S^#]+/);
                i.length > 1 && (e = i[i.length - 2])
            }
            return this.getRouter(e)
        },
        onExecRouter: function (t) {
            var i = e.util.get("login-path-valide");
            if (i && t && t.fragment != i.fragment && e.util.remove("login-path-valide"), t.success) {
                var n = this.getRouter(t.routerName), a = n.view.getStatus();
                a.required ? this.addLayoutRouter(n, t) : this.change(t)
            } else this.change(t)
        },
        change: function (t) {
            var i = this.getFragment(), n = this.checkResource(i);
            n ? this.layout.hasRouter(i) || (this.hasRouter() && this.addBlankPage(i), this.forward(i, t)) : (this.handleError(this.handleError.noResourceByPageError), e.log.error("PageRouter.change: hash值[" + i + "]-->eBase.Config.router.resources配置不存在，请检查config.js配置"))
        },
        forward: function (i, n) {
            i = i || "", e.util.setPageProcess(40, 4), this.requireResource(i, function (a) {
                if (this.checkRouter(i)) {
                    "trigger" === n.type && t.history.pushState("", "", i ? "#" + i : ""), n.type = "resource";
                    var s = this.checkRouter(i), o = i.match(s.reg).map(function (t) {
                        return t && (t = t.replace(/^\//, "")), t
                    });
                    s.callback.apply(s, o.slice(1)), s = s.router, s.active(), this.addLayoutRouter(s)
                } else"reqsuccess" === a && e.log.error("PageRouter.forward: hash值[" + i + "]-->获取js成功，但还是找不到hash值[" + i + "]对应的路由,请确认该页面的js是否有异常或对应的pageConfig.route配置是否正确")
            })
        },
        checkResource: function (t, e) {
            var i, n = this.resources, t = t.split("/")[0];
            for (var a in n)if (i = n[a], t.match(n[a].reg)) {
                var s = {name: t, route: n[a], fragment: t};
                return e && e(s), s
            }
        },
        prefetch: function (t) {
            if (e.Config.view.prefetch) {
                var i = this.checkResource(t);
                i && (t = t || "", this.requireResource(t, function () {
                }, "prefetch"))
            }
        },
        addLayoutRouter: function (t, e) {
            this.layout && this.layout.add(t, e)
        },
        addBlankPage: function (t) {
            var e = this.createBlankElement(t);
            this.layout.addBlankElement(e, this.event);
            var i = this.checkRouter(t);
            i && i.router.view.addPageElement()
        },
        createBlankElement: function (t) {
            var e = $('<div class="page"><div class="page-cont"></div></div>').appendTo(this.rootEl), i = this.getPageLoading();
            return i && (e.append(i), i.show()), this.setBlankElement(e, t), e
        },
        setBlankElement: function (t, e) {
            this.blankElement || (this.blankElement = {}), this.blankElement[e] = {el: t, time: new Date}
        },
        getBlankElement: function (t, e) {
            var i, n = e || this.getFragment(), a = this.blankElement;
            return a && a[n] ? (i = a[n], t && (this.blankElement[n] = null), i) : null
        },
        setPageLoading: function (t) {
            this.pageLoading = t
        },
        hidePageLoading: function () {
            this.pageLoading && (this.pageLoading.remove(), this.pageLoading = null)
        },
        hideLoadingBar: i.prototype.hideLoadingBar,
        setRoot: function (t) {
            this.rootEl = t
        },
        getPageLoading: function () {
            function t(t, e) {
                var i, n = t.match(/(\w+)|(\s*[\w\-\:]*\s*=\s*"[^"]*")/g), a = n.shift(), s = {};
                n.pop(), i = e ? document.createElementNS("http://www.w3.org/2000/svg", a) : document.createElement(a), n.forEach(function (t) {
                    var e = t.trim().match(/([\w\-\:]*)\s*=\s*"([^"]*)"/);
                    s[e[1]] = e[2]
                });
                for (var o in s)i.setAttribute(o, s[o]);
                return i
            }

            var e = $('<div class="page-loading-box"><div class="page-loading"><div class="page-circle"></div></div></div>'), i = e.find(".page-loading")[0], n = '<svg class="svg-circle" width="80" height="80" viewBox="-1 -1 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>', a = '<path fill="#fff" d="M22.941,17.764h-1.133H13.73l0.336-0.734h6.703c2.875,0,3.609-1.805,3.609-3.029v-1.89 c0-1.041-0.643-1.408-1.529-1.408h-1.133h-8.262h-0.765h-2.05v6.334h0.857l-2.081,4.498h2.632l0.979-2.111h0.857l-2.02,4.591h2.509 l1.989-4.56h1.163l-1.989,4.56h2.478l1.991-4.56h1.836v1.988c0,0.674-0.611,1.102-1.377,1.102h-0.888l-0.643,1.5h2.113 c2.691,0,3.609-1.621,3.609-2.846v-1.775C24.625,18.285,23.828,17.764,22.941,17.764z M21.596,12.165v2.295 c0,0.673-0.521,1.163-1.316,1.163h-6.794v-0.948h7.039v-1.53h-7.039v-0.979H21.596z"></path>', s = '<path opacity=".25" d="M17 0 A17 17 0 0 0 17 34 A17 17 0 0 0 34 17 A17 17 0 0 0 17 0" stroke="#fff" fill="rgba(0,0,0,0)" stroke-width="1px"/>', o = '<path class="svg-circle" d="M17 0 A17 17 0 0 0 17 34 A17 17 0 0 0 34 17" stroke-dasharray="78" stroke="#fff" fill="rgba(0,0,0,0)" stroke-width="1px"></path>', r = '<animateTransform attributeName="transform" type="rotate" values="0 17 17;50 17 17; 360 17 17" dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines=".5 0 .5 1;.5 0 .5 1"></animateTransform>', c = '<animateTransform attributeName="transform" type="rotate" values="0 17 17;360 17 17" dur="2.15s" repeatCount="indefinite" additive="sum"></animateTransform>', l = '<animate attributeName="stroke-dashoffset" dur="1.5s" values="0; 76; 0" repeatCount="indefinite" calcMode="spline" keySplines=".5 0 .5 1;.5 0 .5 1"></animate>', u = t(n, !0), h = t(a, !0), d = t(s, !0), f = t(o, !0), p = t(r, !0), g = t(c, !0), m = t(l, !0);
            return u.appendChild(h), u.appendChild(d), u.appendChild(f), i.appendChild(u), f.appendChild(p), f.appendChild(g), f.appendChild(m), this.pageLoading && this.pageLoading.remove(), this.pageLoading = e, e
        },
        removeBlankElement: function (t) {
            this.layout.removeBlankElement()
        },
        handleError: function () {
            var t = function (i) {
                var n = this;
                switch (i) {
                    case t.noResourceError:
                        break;
                    case t.noResourceByPageError:
                        e.tip("您的请求路径不存在", function () {
                            n.back()
                        });
                        break;
                    case t.noHtmlDataError:
                }
            };
            return e["extends"](t, {
                noResourceError: "noRes",
                noResourceByPageError: "noResByPage",
                noHtmlDataError: "noHtmlOrData"
            }), t
        }(),
        back: function (t) {
            this.layout && this.layout.hasHistory() && (this.isOnline() ? e.Router.back() : setTimeout(function () {
                e.Router.back()
            }, 1e3)), t && this.showNetworkTip(t)
        },
        showNetworkTip: function (t) {
            "boolean" == typeof t && (t = ""), this.isOnline() ? e.tip(t || "网络不稳定，请稍后再试") : e.tip(t || "未检测到网络")
        }
    });
    t.eBase.PageService = e.Service.extend({
        instance: function (t, i) {
            this._super.instance.call(this, t), e["extends"](this, i || {}), this.onInstance(this.options)
        }, onInit: function () {
        }, onInstance: function () {
        }, getData: function (t, e, i, n) {
        }, _getTemplateHtml: function (t) {
            var i = t.name;
            this.handleRequire({
                dataType: "text",
                url: e.Config.service.urls.templatePath + "/" + (/\.html$/.test(i) ? i : i + ".html")
            })
        }, _getPageData: function (t) {
            this.handleRequire({
                dataType: "json",
                data: t.data || {},
                url: t.url,
                success: t.success,
                error: t.error,
                headers: t.headers
            })
        }, handleRequire: function (t) {
            var i, n = this.view.requires, a = n[n.startIndex], s = this.view, o = e.Config;
            if (a) {
                switch (i = a.invoke, a.times) {
                    case o.view.requireTimes.once:
                        if (a.required)return void a.setter(l);
                    case o.view.requireTimes.every:
                }
                void 0 === this.counttime && (this.counttime = 0);
                var r, c = new Date, l = t.data;
                l && (l.ts = c.valueOf()), r = t.dataType || "json", a.ajax = Exp.authAjax({
                    url: t.url,
                    data: t.data || {},
                    type: t.type || "get",
                    dataType: r,
                    requireType: "page",
                    noloading: !0,
                    headers: t.headers,
                    timeout: e.Config.service.timeout || 0,
                    filter: function (t) {
                        var i = e.PageService.trigger("templateJsonFilter", t || "", {
                            time: t.ts,
                            type: e.PageView["static"].templateAjax
                        });
                        return i && (a.ajax = "complete", n.startFetch = !1), i
                    },
                    success: function (o) {
                        return e.log.success("PageService.handleRequire:模板数据[" + t.url + "]数据获取成功！"), s.getStatus("destory") ? void(n.startFetch = !1) : (t.success && t.success(o), void i(o, {required: a.required}))
                    },
                    error: function (i) {
                        n.startFetch = !1, e.log.error("PageService.handleRequire: " + t.url + "数据获取失败！" + ((t.url || "").match(/\.html$/) ? "请检查模板目录：" + e.Config.service.urls.templatePath + "下是否有该文件" : "请检查url地址是否正确")), a.ajax = "complete", s.getStatus("deactive") || e.util.setPageProcess(100), s.getStatus("destory") || (t.error ? t.error(i) : "needAuthor" == i.type ? e.delay(function () {
                            var t = e.util.remove("login-path-valide");
                            t && !t.forbidBack && e.PageRouter.back("用户未登录")
                        }, 2e3) : e.delay(function () {
                            e.PageRouter.back()
                        }, 1500, c))
                    }
                })
            }
        }, authAjax: function (t) {
            var i = $.extend(t, {
                noloading: t.noloading, filter: function (n) {
                    return e.PageService.trigger("dataJsonFilter", n || "", $.extend(t, {
                        time: i.data.ts,
                        type: e.PageView["static"].commonAjax
                    }))
                }
            });
            return Exp.authAjax(i)
        }
    })
}(window, eBase), function (t, e) {
    e.util = {
        showLoading: function () {
            this.messageAlertBox = Exp.createLoading()
        }, hideLoading: function () {
            this.messageAlertBox && this.messageAlertBox.reset()
        }, showAlert: function (t, e) {
            Exp.showAlert(t, e)
        }, removeUndefined: function (t) {
            if (t)for (var e in t)void 0 != t[e] && "undefined" != t[e] || delete t[e]
        }, execute: function (t) {
            var e = this.execs = this.execs || [];
            if (t)this.execs.push(t); else for (var i = e.length; i;)i--, (t = e.pop())()
        }, setPageLoadingbar: function (t) {
            t ? this.loadingbar = t : this.loadingbar = $('<div class="loadingbar"></div>').appendTo(document.body)
        }, getPageLoadingbar: function () {
            return this.loadingbar
        }, setPageProcess: function (t, e) {
            var i = this.loadingbar, e = e || 1, n = 140, a = arguments.callee, s = a.lastProcess;
            if (i) {
                if (t >= 100 ? t = n : (t += (150 - t) / e, t > 100 && (t = 100)), a.timer && clearTimeout(a.timer), 0 == i.css("opacity") && (i.css({
                        width: "0%",
                        display: "block"
                    }), i.css("opacity", 1)), s > t && n > s)return;
                a.lastProcess = t, setTimeout(function () {
                    i && i.css({width: t + "%"}), t > 100 && (a.timer = setTimeout(function () {
                        i && (i.css({opacity: 0}), setTimeout(function () {
                            i.css({width: "0%", display: "none"})
                        }, 150)), a.timer = null
                    }, 500))
                }, 0)
            }
        }, sessionStorage: {}, put: function (i, n) {
            n && e.isObject(n) && !(e.isFunction(n) || e.isArray(n) || e.isString(n) || e.isNumber(n)) && (n = JSON.stringify(n));
            try {
                t.sessionStorage ? t.sessionStorage.setItem(i, n) : this.sessionStorage[i] = n
            } catch (a) {
                this.sessionStorage[i] = n
            }
        }, get: function (e) {
            var i;
            try {
                t.sessionStorage && (i = t.sessionStorage.getItem(e)), i || (i = this.sessionStorage[e])
            } catch (n) {
                i = this.sessionStorage[e]
            }
            return i && /^\{[\s\S]*\}$/.test(i) && (i = JSON.parse(i)), i
        }, remove: function (e) {
            var i = this.get(e);
            try {
                t.sessionStorage && t.sessionStorage.removeItem(e)
            } catch (n) {
                delete this.sessionStorage[e]
            }
            return i
        }, isSupport: function () {
            var e = t.sessionStorage;
            try {
                if (e)return e.setItem("t", "t"), e.removeItem("t"), !0
            } catch (i) {
            }
            return !1
        }(), unvalideDirect: function (t, i) {
            var n = this.get(t);
            return n ? n : void e.PageRouter.go("#" + i)
        }
    }
}(window, eBase), compose.config({basePath: ""}), compose.require(["../../src-common/scripts/lib/exp.js", "../../src-common/scripts/header.js", "../../src-common/scripts/eBase/eBase.min"], function (t, e, i) {
    i.PageRouter.addResource({
        "": ["scripts/app/page/index"],
        subject: ["scripts/app/page/subject"],
        search: ["scripts/app/page/search"],
        productsList: ["scripts/app/page/productsList"],
        detail: ["scripts/app/page/detail"],
        detailCyt: ["scripts/app/page/detailCyt"],
        buy: ["scripts/app/page/buy"],
        error: ["scripts/app/page/error"],
        tip: ["scripts/app/page/tip"]
    });
    var n = new i.PageView({tagName: "section", className: "page-app", background: !1}, {
        onInstance: function () {
            $(".header-common").removeClass("hide"), this.el.appendTo($(document.body));
            var t = $(".page-loading-box");
            i.PageRouter.setPageLoading(t), i.util.setPageLoadingbar(), i.PageRouter.on("deactive", function () {
                i.util.execute()
            }), i.delay(function () {
                compose.config({paths: {monitor: lcresPath + "/common/scripts/app/common/monitor.js"}}), compose.require(["monitor"])
            }, 3e3)
        }, getHeaderHtml: function (t) {
            var e;
            return e = "fix" == t ? "header-fixed" : "header-common", '<header class="' + e + '"><section><div class="goback"><i></i></div><div class="title">理财</div><div class="gomenu"><div class="points-wrap"><i class="points"></i></div></div></section><ul class="menu hide"><li data-clickActive data-href="' + BASE_PATH + '/app/licaiIndex.htm"><i class="triangle-up"></i><i class="icon icon1"></i><span>理财首页</span></li><li data-clickActive data-href="' + BASE_PATH + '/portal/app/index.htm?path=lazy-index"><i class="icon icon2"></i><span>我的理财</span></li><li data-clickActive data-href="' + BASE_PATH + '/app/hFiveBuy/myLqb.htm"><i class="icon icon3"></i><span>零钱宝</span></li></ul><div class="mask hide"></div></header>'
        }
    });
    i.modules.put("app", n), i.PageRouter.start(), i.PageRouter.setRoot(n.el), t.createLoading.svg = $(".svg-circle-request")
}, ["Exp", "headerMenu", "eBase"]);