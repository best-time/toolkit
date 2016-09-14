var Router = function () {

    /**
     * constructor
     * @param options
     */


    // array of route config
    function Router(options) {
        _classCallCheck(this, Router);

        this._options = {
            container: '#container',
            enter: 'enter',
            enterTimeout: 0,
            leave: 'leave',
            leaveTimeout: 0
        };
        this._index = 1;
        this._$container = null;
        this._routes = [];
        this._default = null;

        this._options = _extends({}, this._options, options);
        this._$container = document.querySelector(this._options.container);
    }

    /**
     * initial
     * @returns {Router}
     */


    // default route config


    // container element


    // default option


    _createClass(Router, [{
        key: 'init',
        value: function init() {
            var _this = this;

            // why not `history.pushState`? see https://github.com/weui/weui/issues/26, Router in wechat webview
            window.addEventListener('hashchange', function (event) {
                var hash = util.getHash(event.newURL);
                var state = history.state || {};

                _this.go(hash, state._index <= _this._index);
            }, false);

            if (history.state && history.state._index) {
                this._index = history.state._index;
            }

            this._index--;

            var hash = util.getHash(location.href);
            var route = util.getRoute(this._routes, hash);
            this.go(route ? hash : this._default);

            return this;
        }

        /**
         * push route config into routes array
         * @param {Object} route
         * @returns {Router}
         */

    }, {
        key: 'push',
        value: function push(route) {

            var exist = this._routes.filter(function (r) {
                return r.url === route.url;
            })[0];
            if (exist) {
                throw new Error('route ' + route.url + ' is existed');
            }

            route = _extends({}, {
                url: '*',
                className: '',
                render: util.noop,
                bind: util.noop
            }, route);
            this._routes.push(route);
            return this;
        }

        /**
         * set default url when no matcher was found
         * @param {String} url
         * @returns {Router}
         */

    }, {
        key: 'setDefault',
        value: function setDefault(url) {
            this._default = url;
            return this;
        }

        /**
         * go to the specify url
         * @param {String} url
         * @param {Boolean} isBack, default: false
         * @returns {Router}
         */

    }, {
        key: 'go',
        value: function go(url) {
            var _this2 = this;

            var isBack = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var route = util.getRoute(this._routes, url);
            if (route) {
                (function () {

                    var leave = function leave(hasChildren) {
                        // if have child already, then remove it
                        if (hasChildren) {
                            (function () {
                                var child = _this2._$container.children[0];
                                if (isBack) {
                                    child.classList.add(_this2._options.leave);
                                }

                                if (_this2._options.leaveTimeout > 0) {
                                    setTimeout(function () {
                                        child.parentNode.removeChild(child);
                                    }, _this2._options.leaveTimeout);
                                } else {
                                    child.parentNode.removeChild(child);
                                }
                            })();
                        }
                    };

                    var enter = function enter(hasChildren, html) {
                        var node = document.createElement('div');

                        // add class name
                        if (route.className) {
                            node.classList.add(route.className);
                        }

                        node.innerHTML = html;
                        _this2._$container.appendChild(node);
                        // add class
                        if (!isBack && _this2._options.enter && hasChildren) {
                            node.classList.add(_this2._options.enter);
                        }

                        if (_this2._options.enterTimeout > 0) {
                            setTimeout(function () {
                                node.classList.remove(_this2._options.enter);
                            }, _this2._options.enterTimeout);
                        } else {
                            node.classList.remove(_this2._options.enter);
                        }

                        location.hash = '#' + url;
                        try {
                            isBack ? _this2._index-- : _this2._index++;
                            history.replaceState && history.replaceState({ _index: _this2._index }, '', location.href);
                        } catch (e) {}

                        if (typeof route.bind === 'function' /* && !route.__isBind*/) {
                            route.bind.call(node);
                            //route.__isBind = true;
                        }
                    };

                    var hasChildren = util.hasChildren(_this2._$container);

                    // pop current page
                    leave(hasChildren);

                    // callback
                    var callback = function callback(err) {
                        var html = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

                        if (err) {
                            throw err;
                        }

                        // push next page
                        enter(hasChildren, html);
                    };

                    var res = route.render(callback);
                    // promise
                    if (res && typeof res.then === 'function') {
                        res.then(function (html) {
                            callback(null, html);
                        }, callback);
                    }
                    // synchronous
                    else if (route.render.length === 0) {
                        callback(null, res);
                    }
                    // callback
                    else {}
                })();
            } else {
                throw new Error('url ' + url + ' was not found');
            }
            return this;
        }
    }]);

    return Router;
}();