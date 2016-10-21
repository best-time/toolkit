(function ($, win) {

    $.log = function (msg, type) {
        if (!type) type = 'info';
        switch (type) {
            case 'info':
                log('info: '+msg, 'color: #ccc;');
                break;
            case 'warn':
                log('warn: ' +msg, 'color: #ff0000;');
                break;
            case 'success':
                log('suc: ' +msg, 'color: #00A503;');
                break;
            case 'except':
                log(msg, 'color: #a94442;');
                break;
            case 'error':
                console.error(msg);
                break;

        }
        function log(msg, css) {
            return console.log('%c' + msg, css)
        }
    };

    //null undefined boolean number string function array date regexp object error
    var isType = ['null', 'undefined', 'boolean', 'number', 'string', 'function', 'array', 'date', 'regexp', 'object', 'error'];
    $.each(isType, function (i, v) {
        var isTemp = $['is' + handleEveryChar(v, 0, function() {return ('').toUpperCase.call(arguments[0])})];
        isTemp = function(param) {
            return $.type(param) === v;
        };
        var notTemp = $['not' + handleEveryChar(v, 0, function() {return ('').toUpperCase.call(arguments[0])})];
        notTemp = not(isTemp);
    });



    //当前时间戳
    $.now = Date.now() || +new Date() || new Date() - 0 || new Date().getTime();

    //[min, max] 之间随机数
    $.random = function (min, max) {
        if ($.type(min) != 'number') min = 0;
        if (max == null) {
            max = min, min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1))
    };

    function handleEveryChar(str, index, cb) {
        str = str + '';
        var strLen = str.length,
            index = index <= 0 ? 0 : (index < strLen ? index : strLen)
            ;
        str = str.slice(0, index) + cb(str.charAt(index)) + str.slice(index +1, strLen);
        return str
    }

    function not(func) {
        return function() {
            return !func.apply(null, ([]).slice.call(arguments));
        }
    }

})(Zepto, window, undefined);