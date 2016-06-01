compose.require('scripts/common/validate.js', [
    'window.$',
    'scripts/lib/exp.js'
], function($, Exp){
    function Validate(){
        this.init.apply(this, arguments);
    }
    window.Validate = Validate;
    Exp.extend(Validate, {
        start:function(){
            /*兼容jQuery*/
            if($){
                var validateForms = [], Class = this;

                /**
                 * 表单验证
                 * @param {Obect} validates 各个输入input的配置
                 * @param {Obect} opts 统一的配置
                 * @param {String} name 验证名称
                 */
                $.fn.validate = function(validates, opts, name){
                    var validate, self = this;
                    if(validates){
                        if(validate = check()){
                            validate.add(validates);
                        }
                        else{
                            validate = Class.create(validates);
                            validateForms.push({
                                el: this,
                                validate: validate
                            });
                            this.on("submit", function(event){
                                var ret = self.valide(name, opts);
                                return !ret;
                            });
                        }
                    }
                    function check(){
                        var form = self, obj, validate;
                        for(var i=0; i< validateForms.length; i++){
                            obj = validateForms[i];
                            if(obj.el.get(0) == form.get(0)){
                                validate = obj.validate;
                                break;
                            }
                        }
                        return validate;
                    }
                    return this;
                }
                /**
                 * 验证动作
                 * @param {Obect} name 验证的表单信息
                 * @param {String} opts 验证的配置信息
                 */
                $.fn.valide = function(name, opts){
                    if(typeof name == "object"){
                        opts = name;
                        name = undefined;
                    }
                    var form;
                    if(this.is("input")){
                        form = this.parent();
                        while(form.size()){
                            if(form.is("form"))break;
                            form = form.parent();
                        }
                        var validate, i = validateForms.length;
                        while(i--){
                            var vform = validateForms[i];
                            if(vform && vform.el.get(0) == form.get(0)){
                                validate = vform.validate;
                                break;
                            }
                        }
                        if(validate){
                            var cache = validate.cache;
                            for(var name in cache){
                                if(this[0] == cache[name].element[0]){
                                    return form.valide(name, opts);
                                }
                            }
                        }
                    }
                    else form = this;

                    var validate, i = validateForms.length;
                    while(i--){
                        var vform = validateForms[i];
                        if(vform && vform.el.get(0) == form.get(0)){
                            validate = vform.validate;
                            break;
                        }
                    }
                    if(validate){
                        return validate.valide(name, "submit", opts);
                    }
                }
                /**
                 * 隐藏验证信息息
                 * @param {String} name 名称
                 */
                $.fn.hideValide = function(name){
                    var form;
                    if(this.is("input")){
                        form = this.parent();
                        while(form.size()){
                            if(form.is("form"))break;
                            form = form.parent();
                        }
                        if(!form.size())return;
                    }
                    else form = this;
                    var validate, i = validateForms.length;
                    while(i--){
                        var vform = validateForms[i];
                        if(vform && vform.el.get(0) == form.get(0)){
                            validate = vform.validate;
                        }
                    }
                    if(validate){
                        validate.hideValide(name);
                    }
                    return this;
                }
                /**
                 * 手动显示验证信息息
                 * @param {String} name 名称
                 * @param {String} msg 错误信息
                 */
                $.fn.showByMsg = function(name, msg){
                    var validate, i = validateForms.length;
                    while(i--){
                        var vform = validateForms[i];
                        if(vform && vform.el.get(0) == this.get(0)){
                            validate = vform.validate;
                        }
                    }
                    if(validate){
                        validate.showByMsg(name, msg);
                    }
                    return this;
                }
                /**
                 * 检测验证
                 */
                $.fn.checkValide = function(){
                    var validate, i = validateForms.length;
                    while(i--){
                        var vform = validateForms[i];
                        if(vform && vform.el.get(0) == this.get(0)){
                            validate = vform.validate;
                        }
                    }
                    if(validate){
                        validate.refresh();
                    }
                    return this;
                }
            }
        },
        /**
         * 工厂方法
         * @param {Obect} validates 验证配置
         */
        create: function(validates){
            validates = validates || {};
            var options = {validates: validates};
            return new this(options);
        },
        messages: {
            empty: "不能为空",
            number: "只能输入0-9数字",
            alpha: "只能输入字母",
            alphanumber: "只能输入字母和数字",
            integer: "只能输入整数",
            decimal: "只能输入数字",
            email: "邮箱格式不正确",
            url: "不是有效链接",
            length: "请输入长度为${0}的字符串",
            maxlength: "最多只能输入${0}位",
            minlength: "至少输入${0}位",
            mobile: "请输入正确的手机号码",
            check: "请选中我",
            mobileCheckCode:"请输入6位数字的手机校验码",
            checkCode:"请输入验证码",
            realName:"姓名格式为汉字或“•”",
            idCard:"身份证号码不正确",
            userName:"请输入正确的身份证号"
        },
        types: {
            empty: {reg: /^[\S\s]+$/},
            minlength: {},
            maxlength: {},
            length: {},
            check: {},
            number: {
                reg: /^[0-9]+$/
            },
            alpha: {
                reg: /^[a-z]+$/i
            },
            alphanumber: {
                reg: /^[a-z0-9]+$/i
            },
            integer: {
                reg: /^\-?[0-9]+$/
            },
            decimal: {
                reg: /^\-?[0-9]*\.?[0-9]+$/
            },
            email: {
                reg: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
            },
            mobile:{
                reg: /^1[3-8]\d{9}$/,
                maxlength:11
            },
            checkCode:{
                reg: /^[a-z0-9]{4}$/i,
                maxlength:4
            },
            mobileCheckCode:{
                reg: /^[a-z0-9]{6}$/i,
                maxlength:6
            },
            realName:{
                reg:/^[\u4E00-\u9FA5•]+$/,
                minlength:2,
                maxlength:32
            },
            bankcard:{
                reg:/^[0-9\s?]{10,20}$/,
                maxlength:19
            },
            cvv2:{
                reg:/^[0-9]{3}$/i,
                minlength:3,
            },
            idCard:{
                reg:/^(\d{18}|\d{15}|\d{17}[xX])$/,
                maxlength:18
            },
            userName:{
                reg:/(^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$)|(^1[0-9]{10}$)/
            }
        },
        valideChange: "change",
        valideBlur: "blur",
        test:function(type, value){
            var reg = this.types[type].reg;
            if(reg)return reg.test(value);
            return false;
        },
        cache: {
            ie: Exp.getVersion(),
            count:0
        }
    });
    Exp.extend(Validate.prototype,
        {
            /**
             * 构造器
             */
            init: function(options){
                this.options = options;
                this.cache = {};
                options.validates = options.validates || {};
                this.initValidates();
            },
            /**
             * 初始化验证信息
             */
            initValidates: function(){
                var options = this.options, validates= options.validates;
                this.setValidates(validates);
            },
            /**
             * 添加验证
             * @param validates {Object} 验证祥光配置信息
             */
            add:function(validates){
                this.setValidates(validates);
            },
            /**
             * 设置验证
             * @param validates {Object} 验证祥光配置信息
             */
            setValidates:function(validates){
                var self = this, options = this.options, cache = this.cache,
                    include = Exp.extend, allTypes = this.constructor.types,
                    messages = this.constructor.messages, count = this.constructor.cache.count, firstName = true;
                for(var i in validates){
                    (function(i){
                        var validate = validates[i], newObj = include({}, validate),
                            types, msgs, regs, tempRegs = [], regMsgs = validate.regMsgs || [];
                        newObj.types =  newObj.types || "";
                        types = newObj.types = newObj.types && newObj.types.split(" ");
                        msgs = newObj.msgs = newObj.msgs || [];
                        regs = newObj.regs = newObj.regs || [];
                        newObj.property = newObj.property || "name";
                        var element = newObj.element = $('input['+newObj.property+'="' + i +'"]');
                        if(element.size() == 0)return;

                        var maxlength = -1;
                        for(var j=0,h=types.length; j<h; j++){//遍历types
                            var type = types[j], curType = allTypes[type], val={};

                            if(curType.reg){
                                tempRegs.push(curType.reg);
                                if(curType.maxlength !== undefined) maxlength = curType.maxlength;
                            }
                            else if(type == "minlength"){
                                tempRegs.push(new RegExp("^[\\s\\S]{"+ (validate.minlength || 0) +"}"));
                                val = {0: validate.minlength};
                            }
                            else if(type == "maxlength"){
                                tempRegs.push(new RegExp("^[\\s\\S]{0,"+ (validate.maxlength || 1) +"}$"));
                                val = {0: validate.maxlength};
                                maxlength = validate.maxlength;
                            }
                            else if(type == "length"){
                                tempRegs.push(new RegExp("^[\\s\\S]{"+ (validate.length || 1) +"}$"));
                                val = {0: validate.length};
                                maxlength = validate.length;
                            }
                            else if(type == "check"){
                                tempRegs.push("check");
                                val = {0: validate.check};
                            }
                            if(j >= msgs.length)msgs.push(self.replaceMessage(messages[type], val) || msgs[msgs.length-1]);
                        }
                        for(var k=0,w=regs.length; k<w; k++){//遍历tregs
                            var reg = regs[k], regMsg = regMsgs[k];
                            tempRegs.push(reg);
                            if(k < tempRegs.length)msgs.push(regMsg);
                        }
                        if(maxlength > -1)element.attr("maxlength", maxlength);
                        if(!newObj.getValue)newObj.getValue = function(){return newObj.element.val() || newObj.element.text()};
                        newObj.regs = tempRegs;
                        newObj.method = newObj.method || self.constructor.valideChange;
                        newObj.type = newObj.type|| "error";
                        newObj.inputName = i;
                        newObj.callback = newObj.callback || function(){};
                        newObj.proxyCallback = function(){
                            self.handleDynamicTip(newObj, arguments[1]);
                            var ret = newObj.callback.apply(newObj, arguments);
                            return ret;
                        };
                        if(newObj.dynamicTip)newObj.dynamicTip.hide();
                        newObj.tip = element.attr("rel");
                        newObj.topOffset = newObj.topOffset || 0;
                        newObj.rightOffset = newObj.rightOffset || 0;
                        newObj.bottomOffset = newObj.bottomOffset || 0;
                        newObj.leftOffset = newObj.leftOffset || 0;
                        newObj.blurEmptyValide = newObj.blurEmptyValide || false;
                        if(newObj.remote)newObj.remote.checkEvent = newObj.remote.checkEvent || "submit";
                        if(self.cache[i]){
                            newObj = Exp.extend(self.cache[i], newObj);
                        }
                        else {
                            self.cache[i] = newObj;
                        }

                        if(element.is("[bgvalide]"))self.handleValide(newObj, "init");
                        if(firstName){
                            self.focusOpt = newObj;
                            firstName = false;
                        }
                        if(newObj.trimReg && newObj.trimKeyboard !== false) {
                            element.css("ime-mode", "disabled");
                        }
                        if(newObj.method === 'blur'){
                            element.blur(function(){
                                setTimeout(function(){
                                    if(self.valideBox){
                                        return;
                                    }
                                    self.handleValide(newObj, 'blur');
                                }, 150);
                            });
                        }
                    })(i);
                }
            },
            /**
             * 设置focus的操作
             * @param {Obect} opt 相关配置信息
             * @deprecate 用于首页登陆只有一个验证位置信息
             */
            setFocusOpt:function(opt){
                var eventName = opt.eventName;
                if(eventName == "focus" || eventName == "keyup")this.focusOpt = opt;
            },
            /**
             * 验证元素获取焦点
             * @param {Obect} opt input验证内部详细信息
             */
            setFocus:function(opt){
                if(opt == this.focusOpt) opt.element.focus();
            },
            /**
             * 处理提示信息显示或隐藏的动画和非动画效果
             * @param {Obect} opt input验证内部详细信息
             * @param {ename} 事件名称
             */
            handleDynamicTip: function(opt, ename){

            },
            /**
             * 进行验证匹配处理
             * @param {Obect} opt input验证内部详细信息
             * @param {String} eventName 时间名称
             * @param {Boolean} opts.hide 是否隐藏
             * @param {Boolean} opts.notRemote 是否远程校验
             */
            handleValide: function(opt, eventName, opts){
                var el = opt.element, val = opt.getValue(), tip = opt.tip,
                    msgs = opt.msgs, options = this.options,
                    regs = opt.regs,
                    opts = opts || {};

                if(el.attr("disabled") || (eventName == 'blur' && val == '')){
                    this.removeValide(opt);
                    return false;
                }
                if(tip == val) val = "";
                opt.callbackFlag = "beforeValide";
                if(eventName == "init"){
                    var hide = opt.proxyCallback(true, eventName, val);
                    if(hide)opts.hide = hide;
                    this.showValide(opt, el.attr("bgvalide"), opts);
                    opt.proxyCallback(true, eventName, val, el.attr("bgvalide"));
                    return true;
                }
                if(opt.preCondition){
                    var ret = opt.preCondition(val, opt, opts);
                    if(ret){
                        this.showValide(opt, ret, opts);
                        opt.proxyCallback(true, eventName, val, opts);
                        return true;
                    }
                }

                for(var i=0,l=regs.length; i<l; i++){
                    var reg = regs[i];
                    if(reg && reg.test && !reg.test(val)){
                        var hide = opt.proxyCallback(true, eventName, val);
                        if(hide)opts.hide = hide;
                        this.showValide(opt, msgs[i], opts);
                        opt.proxyCallback(true, eventName, val, msgs[i]);
                        return true;
                    }
                    if(reg && typeof reg == "function" && !reg(val)){
                        var hide = opt.proxyCallback(true, eventName, val);
                        if(hide)opts.hide = hide;
                        this.showValide(opt, msgs[i], opts);
                        opt.proxyCallback(true, eventName, val, msgs[i]);
                        return true;
                    }
                    else if(reg == "check"){
                        if(!el.is(":checked")){
                            var hide = opt.proxyCallback(true, eventName, val);
                            if(hide)opts.hide = hide;
                            this.showValide(opt, msgs[i], opts);
                            opt.proxyCallback(true, eventName, val, msgs[i]);
                            return true;
                        }
                        else{
                            this.removeValide(opt);
                            opt.proxyCallback(false, eventName, val);
                            return false;
                        }
                    }
                }
                if(i == l){
                    var ret ,remote = opt.remote, self = this, temp;
                    if(opt.condition){
                        ret = opt.condition(val, opt, opts);
                        if(opt.type == "error" && ret){
                            var hide = opt.proxyCallback(true, eventName, val);
                            if(hide)opts.hide = hide;
                            this.showValide(opt, ret === true || ret == "true" ? "" : ret, opts);
                            opt.proxyCallback(true, eventName, val, ret === true || ret == "true" ? "" : ret);
                            temp = true;
                        }
                        else if(opt.type == "success"){
                            if(ret){
                                var hide = opt.proxyCallback(true, eventName, val);
                                if(hide)opts.hide = hide;
                                this.showValide(opt, ret === true || ret == "true" ? "" : ret, opts);
                                opt.proxyCallback(true, eventName, val, ret === true || ret == "true" ? "" : ret);
                                temp = false;
                            }
                            else{
                                this.removeValide(opt);
                                opt.proxyCallback(false, eventName, val);
                            }
                            temp = false;
                        }
                        if(temp)return temp;
                        else if(!remote) {
                            this.removeValide(opt);
                            opt.proxyCallback(false, eventName, val);
                            return temp;
                        }
                    }
                    if(remote && remote.checkEvent.indexOf(eventName) != -1 && !opts.notRemote){
                        remote.data = remote.data ||{};
                        Exp.extend(remote.data, {timestamp:new Date() - 1});
                        if(remote.getData)Exp.extend(remote.data, remote.getData());
                        var ajaxOpt = {
                            url: remote.url,
                            type: remote.type || "GET",
                            dataType: remote.dataType || "json",
                            data: remote.data,
                            async: false,
                            error:function(){
                            },
                            success: function(data){
                                ret = remote.condition? remote.condition.call(opt, data, opts) : data;;
                                msg = ret === true ? "" : ret;
                                if(opt.type == "error"){
                                    if(ret){
                                        var hide = opt.proxyCallback(ret, eventName, val, msg, data);
                                        if(hide)opts.hide = hide;
                                        self.showValide(opt, ret === true ? "" : ret, opts);
                                        opt.proxyCallback(ret, eventName, val,  ret, msg, data);
                                        return true;
                                    }
                                    else {
                                        self.removeValide(opt);
                                        opt.proxyCallback(false, eventName, val, msg, data);
                                    }
                                    return false;
                                }
                                else if(opt.type == "success"){
                                    if(ret === false || ret == "false"){
                                        var hide = opt.proxyCallback(false, eventName, val, msg, data);
                                        if(hide)opts.hide = hide;
                                        self.showValide(opt, "", opts);
                                        opt.proxyCallback(false, eventName, val, msg, data);
                                        return false;
                                    }
                                    else {
                                        self.removeValide(opt);
                                        opt.proxyCallback(false, eventName, val, msg, data);
                                    }
                                    return true;
                                }
                                else{
                                    self.removeValide(opt);
                                    opt.proxyCallback(false, eventName, val, msg, data);
                                }
                            }
                        }
                        if(remote.jsonp)ajaxOpt.jsonp = remote.jsonp;
                        $.ajax(ajaxOpt);
                        return ret;
                    }
                    this.removeValide(opt);
                    opt.proxyCallback(false, eventName, val);
                }
                else{
                    this.removeValide(opt);
                    opt.proxyCallback(false, eventName, val);
                    return false;
                }
            },
            /**
             * 对元素进行验证
             * @param {String} name 元素名称
             * @param {String} eventName 时间名称
             * @param {Obect} opts 相关配置
             */
            valide: function(name, eventName, opts){
                var obj, opts = opts || {};
                if(name){
                    var names = name.split(" "), obj = {}, l = names.length;
                    while(l--){
                        var opt = this.cache[names[l]];
                        if(!opt) continue;
                        obj[names[l]] = opt;
                    }
                }
                else obj = this.cache;
                var result = false, firstFlag = true;
                for(var i in obj){
                    var opt = obj[i], ret = this.handleValide(opt, eventName, {
                        hide: (opts&&opts.hide)
                            || (opt && opt.remote && opt.remote.dataType == "jsonp")
                            ? true:false,
                        notRemote: opts.notRemote
                    });
                    opt.eventName = eventName;
                    if(ret) {
                        //opt.element.focus();
                        result = true;
                        break;
                    }
                }
                return result;
            },
            /**
             * 隐藏验证字段信息
             * @param {String} name 字段名称
             */
            hideValide: function(name){
                var obj;
                if(name){
                    var names = name.split(" "), obj = {}, l = names.length;
                    while(l--)obj[names[l]] = this.cache[names[l]];
                }
                else obj = this.cache;
                for(var i in obj){
                    this.removeValide(obj[i]);
                }
            },
            /**
             * 手动显示验证信息息
             * @param {String} name 名称
             * @param {String} msg 错误信息
             */
            showByMsg: function(name, msg){
                var obj;
                if(name){
                    var names = name.split(" "), obj = {}, l = names.length, ms = msg.split(" "), msgs = {};
                    while(l--){
                        obj[names[l]] = this.cache[names[l]];
                        msgs[names[l]] = ms[l];
                    }
                }
                else obj = this.cache;
                for(var i in obj){
                    this.showValide(obj[i], msgs[i], false);
                }
            },
            /**
             * 刷新验证显示信息，对已经显示的验证信息重新定位
             * @param {String} name (可选) 指定名称
             */
            refresh: function(name){
                var obj;
                if(name)obj = {name: this.cache[name]};
                else obj = this.cache;
                for(var i in obj){
                    this.refreshValide(obj[i]);
                }
            },
            /**
             * 解析模板内容息
             * @param {String} msg 是否隐藏
             * @param {Object} val 值
             */
            replaceMessage: function(msg, val){
                var render = template.compile(msg);
                return render(val);
            },
            /**
             * 刷新某个验证显示信息，对已经显示的验证信息重新定位
             * @param {Obect} opt input验证内部详细信息
             * @param {Boolean} hide 是否隐藏
             */
            refreshValide: function(opt, hide){

            },
            /**
             * 移除验证显示信息
             * @param {Obect} opt input验证内部详细信息
             */
            removeValide: function(opt){

            },
            /**
             * 显示验证信息，对已经显示的验证信息重新
             * @param {Obect} opt input验证内部详细信息
             * @param {String} msg 是否隐藏
             * @param {Boolean} opts.hide 是否隐藏
             * @param {Boolean} opts.notRemote 是否远程校验
             */
            showValide: function(opt, msg, opts){
                if(opts.hide || this.valideBox){
                    return;
                }
                var self = this;
                this.valideBox = Exp.alertBox({
                    type:"validate",
                    msg: msg,
                    animate:"alert-box-anim",
                    bgAnimate: "alert-bg-anim",
                    autoCancel:true,
                    cancel: function(){
                        self.valideBox = null;
                        if(opt.errorCallback){
                            opt.errorCallback(opt.element);
                        }
                    }
                });

            }
        });
    Validate.start();
    return Validate;
});