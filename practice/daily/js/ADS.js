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
            if(len == 1) {
                return element;
            }
            elements.push(element);
        }
        return elements;
    }

    function addEvent(node, type, listener) {
        if(!isCompatible()) return false;
        if(! ( node = $(node) )) return false;
    }

    function removeEvent(node, type, listener) {
    }

    function getElementsByClassName(className, tag, parent) {
    }

    function toggleDisplay(node, value) {
    }

    function insertAfter(node, referenceNode) {
    }

    function removeChildren(parent) {
    }

    function prependChild(parent, newChild) {
    }


    window['ADS']['isCompatible'] = isCompatible;
    window['ADS']['$'] = $;
    window['ADS']['addEvent'] = addEvent;
    window['ADS']['removeEvent'] = removeEvent;
    window['ADS']['getElementsByClassName'] = getElementsByClassName;
    window['ADS']['toggleDisplay'] = toggleDisplay;
    window['ADS']['removeChildren'] = removeChildren;
    window['ADS']['isCompatible'] = isCompatible;
    window['ADS']['prependChild'] = prependChild;

})();