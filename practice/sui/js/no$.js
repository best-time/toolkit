
!function (win, doc) {
    "use strict"
    if(typeof as !== 'undefined') return
    
    var as = function () {

    }
    var ap = as.prototype

    ap.get = function (opt) {
        var request = new XMLHttpRequest()
        request.open('GET', opt.url || '', true)
        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    var data = JSON.parse(this.responseText)
                    opt.success && opt.success(data)
                }
            } else {
                opt.error && opt.error(this.responseText)
            }
        }
        request.send()
        request = null
    }
    ap.post = function (opt) {
        var request = new XMLHttpRequest()
        request.open('POST', opt.url || '', true)
        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    var data = JSON.parse(this.responseText)
                    opt.success && opt.success(data)
                }
            } else {
                opt.error && opt.error(this.responseText)
            }
        }
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        request.send(opt.data || {})
        request = null
    }
    ap.fadeIn = function (el) {
        var opacity = 0
        el.style.display = ''
        el.style.opacity = 0
        el.style.filter = ''

        var last = +new Date()
        var tick = function () {
                opacity += (+new Date() - last) / 400
            console.log(opacity)
                el.style.opacity = opacity
                // el.style.filter = 'alpha(opacity=' + (100 * opacity) | 0 + ')'
                last = +new Date()
                if (opacity < 1) {
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
                }    
            }
        tick()
    }
    ap.getId = function (id) {
        id = id.indexOf('#') === 0 ? id.slice(1) : id
        return doc.getElementById(id)
    }
    ap.hide = function (el) {
        el.style.display = 'none'
    }
    ap.show = function (el) {
        el.style.display = ''
    }
    ap.addClass = function (el, className) {
        if (el.classList) {
            el.classList.add(className)
        } else {
            el.className += ' ' + className
        }
    }
    ap.removeClass = function (el, className) {
        if (el.classList) {
            el.classList.remove(className)
        } else {
            var clsStr = className.split(' ').join('|')
            el.className = el.className.replace(new RegExp('(^|\\b)' + clsStr + '(\\b|$)', 'gi'), ' ');
        }
    }
    ap.toggleClass = function (el, className) {
        if (el.classList) {
            el.classList.toggle(className)
        } else {
            var classes = el.className.split(' ');
            var existingIndex = -1;
            for (var i = classes.length; i--;) {
                if (classes[i] === className)
                    existingIndex = i;
            }

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
            else
                classes.push(className);

            el.className = classes.join(' ');
        }
    }

    // $(el).after()
    ap.after = function (el, htmlString) {
        el.insertAdjacentHTML('afterend', htmlString)
    }
    ap.before = function (el, htmlString) {
        el.insertAdjacentHTML('beforebegin', htmlString)
    }
    // append
    ap.append = function (el, child) {
        el.apppendChild(child)
    }
    ap.prepend = function (parent, el) {
        parent.insertBefore(el, parent.firstChild)
    }

    ap.children = function (el) {
        var children = [], elChild = el.children, i = elChild.length
        while (--i >= 0) {
            if (el.children[i].nodeType !== 8) { // 剔除注释节点
                children.unshift(el.children[i])
            }
        }
        return children
    }
    
    ap.clone = function (el) {
        return el.cloneNode(true)
    }

    ap.contains = function (el, child) {
        return el !== child && el.contains(child)
    }
    ap.find = function (el, cls) {
        return el.querySelector(cls)
    }
    ap.empty = function (el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild)
        }
    }
    ap.css = function (el, name) {
        return doc.defaultView.getComputedStyle(el, null)[name]
    }

    // text()
    ap.text = function (el) {
        return el.textContent || el.innerText
    }

    ap.hasClass = function (el, cls) {
        if (el.classList) {
            return el.classList.contains(className)
        } else {
            return new RegExp('(^| )' + cls + '( |$)', 'gi').test(el.className)
        }
    }
    ap.next = function (el) {
        function nextElementSibling(el) {
            do {
                el = el.nextSibling
            } while (el && el.nodeType !== 1) 
            return el
        }

        return el.nextElementSibling || nextElementSibling(el)
    }
    ap.prev = function (el) {
        function previousElementSibling(el) {
            do {
                el = el.previousSibling;
            } while (el && el.nodeType !== 1);
            return el;
        }

        return el.previousElementSibling || previousElementSibling(el);
    }

    // offset
    ap.offset = function (el) {
        var rect = el.getBoundingClientRect()
        return {
            top: rect.top + doc.body.scrollTop,
            left: rect.left + doc.body.scrollLeft,
        }
    }

    ap.offsetParent = function (el) {
        return el.offsetParent || el
    }
        
    ap.position = function (el) {
        return {
            left: el.offsetLeft,
            top: el.offsetTop
        }
    }
    ap.remove = function (el) {
        el.parentNode.removeChild(el)
    }

    ap.ready = function (fn) {
        if (doc.readyState != 'loading') {
            fn()
        } else if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', fn)
        } else {
            doc.attachEvent('onreadystatechange', function () {
                if (doc.readyState != 'loading') {
                    fn()
                }
            })
        }
    }    

    // $.extend(true, {}, objA, objB);
    ap.deepExtend = function (out) {
        out = out || {}
        var i = 1, len = arguments.length
        for (; i < len; i++) {
            var obj = arguments[i]
            if (obj) continue
            
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                   out[key] = ap.extend(out[key], obj[key]) 
                } else {
                    out[key] = obj[key]
                }
            }
        }
        return out
    }

    ap.extend = function (out) {
        out = out || {}
        
        var i = 1, len = arguments.length
        for (; i < len; i++) {
            if (!arguments[i]) continue;

            for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key))
                out[key] = arguments[i][key];
            }
        }
        return out
    }
/*
    $(el).trigger('custom-event', {key1: 'data'});

    // Native
    if (window.CustomEvent) {
    const event = new CustomEvent('custom-event', {detail: {key1: 'data'}});
    } else {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('custom-event', true, true, {key1: 'data'});
    }

    el.dispatchEvent(event);
*/

    win.as = new as()
}(this, document)