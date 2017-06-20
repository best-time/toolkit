
/*
JSONP({
    url: 'http://api.example.com/sample.js',
    data: { foo: 'bar' },
    success: function(data) { console.log(data); }
});

This example will generate:

<script src="http://api.example.com/sample.js?foo=bar&callback=jsonp_a1b2c3d4e5f6g7h" async="true"></script>
Options

url: (string) (required) URL for the JSONP resource.
data: (object) (optional) Object used to generate GET query parameters for the JSONP resource.
success: (function) (optional) Callback function executed upon a successful request.
error: (function) (optional) Callback function executed for a failed request.
complete: (function) (optional) Callback function exected when the request is completed regardless of success or error.
beforeSend: (function) (optional) Callback function executed before request is created. If it returns false, the request is aborted.
callbackName: (string) (optional) Name of callback function name. Default is 'callback'.


 */

(function () {
  var JSONP, computedUrl, createElement, encode, noop, objectToURI, random, randomString;

  createElement = function(tag) {
    return window.document.createElement(tag);
  };

  encode = window.encodeURIComponent;

  random = Math.random;

  JSONP = function(options) {
    var callback, callbackFunc, callbackName, done, head, params, script;
    if (options == null) {
      options = {};
    }
    params = {
      data: options.data || {},
      error: options.error || noop,
      success: options.success || noop,
      beforeSend: options.beforeSend || noop,
      complete: options.complete || noop,
      url: options.url || ''
    };
    params.computedUrl = computedUrl(params);
    if (params.url.length === 0) {
      throw new Error('MissingUrl');
    }
    done = false;
    if (params.beforeSend({}, params) !== false) {
      callbackName = options.callbackName || 'callback';
      callbackFunc = options.callbackFunc || 'jsonp_' + randomString(15);
      callback = params.data[callbackName] = callbackFunc;
      window[callback] = function(data) {
        window[callback] = null;
        params.success(data, params);
        return params.complete(data, params);
      };
      script = createElement('script');
      script.src = computedUrl(params);
      script.async = true;
      script.onerror = function(evt) {
        params.error({
          url: script.src,
          event: evt
        });
        return params.complete({
          url: script.src,
          event: evt
        }, params);
      };
      script.onload = script.onreadystatechange = function() {
        var ref, ref1;
        if (done || ((ref = this.readyState) !== 'loaded' && ref !== 'complete')) {
          return;
        }
        done = true;
        if (script) {
          script.onload = script.onreadystatechange = null;
          if ((ref1 = script.parentNode) != null) {
            ref1.removeChild(script);
          }
          return script = null;
        }
      };
      head = window.document.getElementsByTagName('head')[0] || window.document.documentElement;
      head.insertBefore(script, head.firstChild);
    }
    return {
      abort: function() {
        window[callback] = function() {
          return window[callback] = null;
        };
        done = true;
        if (script != null ? script.parentNode : void 0) {
          script.onload = script.onreadystatechange = null;
          script.parentNode.removeChild(script);
          return script = null;
        }
      }
    };
  };

  noop = function() {
    return void 0;
  };

  computedUrl = function(params) {
    var url;
    url = params.url;
    url += params.url.indexOf('?') < 0 ? '?' : '&';
    url += objectToURI(params.data);
    return url;
  };

  randomString = function(length) {
    var str;
    str = '';
    while (str.length < length) {
      str += random().toString(36).slice(2, 3);
    }
    return str;
  };

  objectToURI = function(obj) {
    var data, key, value;
    data = (function() {
      var results;
      results = [];
      for (key in obj) {
        value = obj[key];
        results.push(encode(key) + '=' + encode(value));
      }
      return results;
    })();
    return data.join('&');
  };

  if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
    define(function() {
      return JSONP;
    });
  } else if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = JSONP;
  } else {
    this.JSONP = JSONP;
  }

}).call(this);
