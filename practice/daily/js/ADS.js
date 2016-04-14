/**
 * Created by yy on 2016-3-23.
 */
;
(function () {
    if (!window.ADS) {
        window['ADS'] = {};
    }
    //是否兼容库
    function isCompatible(other) {
        if (other == false ||
            !Array.prototype.push ||
            !Object.hasOwnProperty ||
            !document.createElement ||
            !document.getElementsByTagName
        ) {
            return false;
        }
        return true;
    }
    //根据id 获取dom对象
    function $() {
        var elements = [];
        var element;
        var i = 0,
            len = arguments.length;
        for(; i < len; i++) {
            element = arguments[i];
            //是字符串 假设是id
            if(typeof element == "string") {
                element = document.getElementById(element);
            }
            if(len == 1) return element;

            elements.push(element);
        }
        return elements;
    }

    function addEvent(node, type, listener) {
        if(!isCompatible()) return false;
        if(! ( node = $(node) )) return false;

        if(node.addEventListener) {
            node.addEventListener(type, listener, false);
            return true;
        } else if(node.attachEvent) {
            node['e' + type + listener] = listener;
            node[type + listener] = function() {
                node['e' + type + listener](window.event);
            };
            node.attachEvent('on'+type, node[type + listener]);
            return true;
        }
        return false;
    }

    function removeEvent(node, type, listener) {
        if(!(node = $(node))) return false;
        if(node.removeEventListener) {
            node.removeEventListener(type, listener, false);
            return true;
        } else if (node.detachEvent) {
            node.detachEvent('on'+type, node[type + listener]);
            node[type + listener] = null;
            return true;
        }
        return false;
    }

    //兼容ie 6 - 8 , ie8 不支持document.getElementsByClassName
    function getElementsByClassName(className, tag, parent) {
        parent = parent || document;
        if(!(parent = $(parent))) return false;

        // 查找所有匹配的标签
        var allTags = (tag == "*" && parent.all) ?
                                    parent.all :
                                    parent.getElementsByTagName(tag);
        var matchingElements = [];

        //创建正则来判断className是否正确
        className = className.replace(/\-/g, "\\-");
        var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");

        var element,
            len = allTags.length,
            i = 0;
        //检查每个元素
        for(; i < len; i++) {
            element = allTags[i];
            if(regex.test(element.className)) {
                matchingElements.push(element);
            }
        }
        return matchingElements;
    }

    function toggleDisplay(node, value) {
        if(!(node = $(node))) return false;

        if(node.style.display != "none") {
            node.style.display = "none";
        } else {
            node.style.display = value || "";
        }
        return true;
    }

    function insertAfter(node, referenceNode) {
        if(!(node = $(node))) return false;
        if(!(referenceNode = $(referenceNode))) return false;

        return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
    }

    function removeChildren(parent) {
        if(!(parent = $(parent))) return false;

        while(parent.firstChild) {
            parent.firstChild.parentNode.removeChild(parent.firstChild);
        }
        return parent;
    }

    function prependChild(parent, newChild) {
        if(!(parent = $(parent))) return false;
        if(!(newChild = $(newChild))) return false;

        if(parent.firstChild) { //如果存在子节点,则在这个子节点之前插入
            parent.insertBefore(newChild, parent.firstChild)
        } else {
            parent.appendChild(newChild);
        }
        return parent;
    }
    //函数绑定
    function bindFunction(obj, func) {
        return function() {
            func.apply(obj, arguments);
        };
    }
    // 日志输出
    function myLogger(id) {
        id = id || "ASDLogWindow";
        var logWindow = null;
        var createWindow = function() {};
        this.writeRaw = function(message) {};
    }
    myLogger.prototype = {
        write: function(message) {},
        header: function(message) {}
    };


    window['ADS']['isCompatible'] = isCompatible;
    window['ADS']['$'] = $;
    window['ADS']['addEvent'] = addEvent;
    window['ADS']['removeEvent'] = removeEvent;
    window['ADS']['getElementsByClassName'] = getElementsByClassName;
    window['ADS']['toggleDisplay'] = toggleDisplay;
    window['ADS']['removeChildren'] = removeChildren;
    window['ADS']['isCompatible'] = isCompatible;
    window['ADS']['prependChild'] = prependChild;
    window['ADS']['bindFunction'] = bindFunction;
    window['ADS']['log'] = new myLogger();

})();