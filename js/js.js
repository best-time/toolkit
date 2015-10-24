window.onload = function() {
    //去除input值左右空格
    var _rstrBtn = document.getElementById("rstrBtn"),
        _strs = document.getElementById("strs");
    _rstrBtn.onclick = function() {
        _strs.value = strTrim(_strs.value);
    };

    //验证input是否为空
    var _isContent = document.getElementById("isContent"),
        _strs = document.getElementById("strs");
    _isContent.onclick = function() {
        var content = strTrim(_strs.value);
        if (content) {
            alert("不为空");
        } else {
            alert("为空");
        }
    };

    //input禁止输入
    var jsinput = document.getElementById("jsinput");
    jsinput.onfocus = function() {
        jsinput.blur();
    }

    //input禁止输入 方法2;
    var jsinput2 = document.getElementById("jsinput2");
    var notext = function() {
        jsinput2.value = "";
    };
    jsinput2.onkeyup = notext;
    jsinput2.onblur = notext;

    //禁止粘贴和复制
    var banCopyPaste = document.getElementById("banCopyPaste");
    banCopyPaste.oncopy = function() {
        return false;
    }
    banCopyPaste.onpaste = function() {
        return false;
    }

    //js实现 input框 只能输入数字
    // Unicode编码中的汉字范围   /^[\u2E80-\u9FFF]+$/ 
    var banNumber = document.getElementById("banNumber");
    var clearNoNumber = function(tThis) {
        var _v = tThis.value;
        tThis.value = _v.replace(/\D/g, "");
    };
    banNumber.onfocus = function() {
        clearNoNumber(this);
    }
    banNumber.onkeyup = function() {
        clearNoNumber(this);
    }
    banNumber.onblur = function() {
        clearNoNumber(this);
    }

    //js实现字符串输入的长度
    var limitLength = document.getElementById("limitLength");
    var clearStr = function(tThis) {
        var _v = tThis.value, //获取value值
            _vLen = _v.length, //value值长度
            dataLength = tThis.getAttribute("data-length"); //限制的长度
        if (_vLen > dataLength) {
            tThis.value = _v.substr(0, dataLength);
        }
    };
    limitLength.onfocus = function() {
        clearStr(this); // 这里this指向 inputElement
    }
    limitLength.onkeyup = function() {
        clearStr(this);
    }
    limitLength.onblur = function() {
        clearStr(this);
    }

    //js 限制字符串长度 (区分中英文)
    var forElementArr = function(_elementArr, callBack) {
        var arr = _elementArr,
            self = this;
        if (!(_elementArr instanceof Array)) {
            arr = [_elementArr];
        }
        for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
            var arrl = arr[i];
            if (typeof arrl == "string") {
                arrl = document.getElementById(arrl);
            }
            callBack && callBack(i, arrl);
        }
    };

    showRemainingCharacters = function(_nums, _remainingCharacters) {
        if (_remainingCharacters.search(",") != -1) {
            _remainingCharacters = _remainingCharacters.split(",")
        }
        forElementArr(_remainingCharacters, function(_index, _this) {
            _this.innerHTML = (_nums && _nums.toString()) || "0";
        })
    }
    remainingCharacters = document.getElementById("remainingCharacters");
    clearNoNum = function(tThis) {
        var _v = tThis.value,
            _vLen = _v.length,
            dataLength = tThis.getAttribute("data-length"),
            remainingCharacters = tThis.getAttribute("data-remainingCharacters");
        //区分中英文前
        /*if(_v.length > dataLength){
            tThis.value = _v.substr(0, dataLength);
        }*/
        var dataModel = tThis.getAttribute("data-model");
        var subLen = dataLength;
        if (dataModel == "Ch") {
            _vLen = strLen(_v.dataModel);
            var vv = _v.match(/[\u4e00-\u9fa5]/g);
            subLen = dataLength - (!vv ? 0 : vv.length);
        }
        if (_vLen > dataLength) {
            tThis.value = _v.substr(0, subLen);
        }
        if (remainingCharacters) {
            showRemainingCharacters(!_vLen ? dataLength : (_vLen > dataLength ? 0 : dataLength - _vLen), remainingCharacters);
        }
    };

    remainingCharacters.onfocus = function() {
        clearNoNum(this); // 这里this指向 inputElement
    }
    remainingCharacters.onkeyup = function() {
        clearNoNum(this);
    }
    remainingCharacters.onblur = function() {
        clearNoNum(this);
    }

    //验证密码强度
    function setCss(_this, cssOption) {
        if (!_this || _this.nodeType === 3 || _this.nodeType === 8 | !_this.style) {
            return;
        }
        for (var cs in cssOption) {
            _this.style[cs] = cssOption[cs];
        }
        return _this;
    }

    /**
        字符权重: 数字 1 字母2 其他字符为3
        当密码长度小于6时不符合标准
        长度>=6,强度<10,强度弱,
        长度>=6 强度>=10且<15,强度中,
        长度>=6 强度>=15 强度高
    */
    function passwordStrength(passwordStrength, showStrength) {
        var self = this;
        passwordStrength.onkeyup = function() {
            var _color = ["red", "yellow", "orange", "green"],
                msgs = ["密码太短", "弱", "中", "强"],
                _strength = 0,
                _v = strTrim(passwordStrength.value),
                _vL = _v.length,
                i = 0;
            var charStrength = function(char) {
                if (char >= 48 && char <= 57) {
                    return 1;
                } else if (char >= 97 && char <= 122) {
                    return 2;
                } else {
                    return 3;
                }
            };

            if (_vL < 6) {
                showStrength.innerText = msgs[0];
                setCss(showStrength, {
                    color: _color[0]
                })
            } else {
                for (; i < _vL; i++) {
                    _strength += charStrength(_v.toLowerCase().charCodeAt(i));
                }
                if (_strength < 10) {
                    showStrength.innerText = msgs[1];
                    setCss(showStrength, {
                        color: _color[1]
                    })
                }
                if (_strength >= 10 && _strength < 15) {
                    showStrength.innerText = msgs[2];
                    setCss(showStrength, {
                        color: _color[2]
                    })
                }
                if (_strength >= 15) {
                    showStrength.innerText = msgs[3];
                    setCss(showStrength, {
                        color: _color[3]
                    })
                }
            }
        }
    }

    var pwdStrength = document.getElementById("passwordStrength"),
        sStrength = document.getElementById("showStrength");
    passwordStrength(pwdStrength, sStrength);


    //回车提交
    document.getElementById("enterSubmit").onkeyup = function(e) {
        e = e || window.event;
        var keycode = e.keycode || e.which || e.charCode; //兼容,获取键码
        if (keycode === 13) {
            alert("回车提交成功")
        }
    }

    //光标停留在文字最后
    var cursorPos = document.getElementById("cursorPos");
    cursorPos.onclick = cursorPos.onkeyup = function() { // click鼠标事件, onkeyup 键盘事件
        var _vLen = this.value.length;
        if (this.setSelectionRange) { //非 ie
            this.setSelectionRange(_vLen, _vLen)
        } else {
            var a = this.createTextRange(); // ie
            a.moveStart('character', _vLen);
            a.collapse(true);
            a.select();
        }
    }

    //默认选定文本内容
    document.getElementById("autoSelected").select(); // select() 主流浏览器都支持.

    //获取/失去焦点时改变样式
    var strToJson = function(str) {
        return typeof JSON == 'object' ? JSON.parse(str) : (new Function("return" + str))();
    };
    var autoUpdateCss = document.getElementById("autoUpdateCss"),
        fCss = autoUpdateCss.getAttribute("data-fCss"),
        fClass = autoUpdateCss.getAttribute("data-fClass"),
        bCss = autoUpdateCss.getAttribute("data-bCss"),
        bClass = autoUpdateCss.getAttribute("data-bClass");

    autoUpdateCss.onfocus = function() { //获得焦点时
        fCss && setCss(this, strToJson(fCss));
        fClass && (this.className = fClass);
    }
    autoUpdateCss.onblur = function() {
        bCss && setCss(this, strToJson(bCss));
        bClass && (this.className = bClass);
    }

    //表单常见验证规则   Page 42

    //关键词过滤
    var _keyWordsFiltering = document.getElementById("keyWordsFiltering");
    _keyWordsFiltering.onclick = function() {
        var keyWordsLibs = ["JavaScript", "美女", /[外]{1}.{0, 3}[挂]{1}/];
        keyWordsLibsLen = keyWordsLibs.length;
        for (var i = 0; i < keyWordsLibsLen; i++) {
            _keyWordsFiltering.value = _keyWordsFiltering.value.replace(keyWordsLibs[i], "***");
        }
    }

    //剔除所有html代码
    var _delHtmlTags = document.getElementById("delHtmlTags");
    _delHtmlTags.onblur = function() {
        this.value = this.value.replace(/<[\/\!]*[^<>]*>/ig, "");
    }

    //判断单选框是否选中
    var sexMan = document.getElementById("sexMan"),
        sexWoman = document.getElementById("sexWoman");
    if (sexMan.checked) {
        console.log("sexMan 被选中");
    } else {
        console.log("sexMan 未被选中");
    }
    //复选框最多选几项
    var _forbidcheckSelects = document.getElementsByName("forbidcheckSelects"),
        banNums = 3;
    for (var i in _forbidcheckSelects) {
        _forbidcheckSelects[i].onclick = function() {
            var __forbidcheckSelects = document.getElementsByName("forbidcheckSelects"),
                selectNum = 0;
            for (var i in __forbidcheckSelects) {
                if (i == "length") break;
                if (__forbidcheckSelects[i].checked) {
                    selectNum++;
                }
            }
            if (selectNum > banNums) {
                this.checked = false;
            }
        }
    }

    //全选 反选 全部选
    var targets = document.getElementsByName("actionSelects"),
        targetsLen = targets.length;
    document.getElementById("allSelect").onclick = function() { //全选
        for (i = 0; i < targetsLen; i++) {
            targets[i].checked = true;
        }
    }
    document.getElementById("cancelallSelect").onclick = function() { //取消全选
        for (i = 0; i < targetsLen; i++) {
            targets[i].checked = false;
        }
    }
    document.getElementById("_select").onclick = function() { //反选
        for (i = 0; i < targetsLen; i++) {
            targets[i].checked = !targets[i].checked;
        }
    };

    //关键词对应 复选框选中
    var contentCheckbox = document.getElementById("contentCheckbox"),
        checkboxName = contentCheckbox.getAttribute("data-target"),
        _targets = document.getElementsByName(checkboxName),
        targetsLen = _targets.length;
    contentCheckbox.onkeyup = function() {
        for (var i = 0; i < targetsLen; i++) {
            var _t = _targets[i],
                _v = this.value;
            _t.checked = _v.search(_t.getAttribute("data-k")) != -1 && true;
        }
    };
    //下拉框是否选中
    var _selectOptions = document.getElementById("selectOptions");
    _selectOptions.onchange = function() {
        if (this.value === "") {
            alert("下拉框未选中");
        } else {
            alert(this.value);
        }
    };

    //动态添加下拉选项
    var _addOptions = document.getElementById("addOptions"), //按钮
        down = document.getElementById("down"), //下拉
        addOptions = function(target, option) {
            var _option = null,
                ol = option.length,
                i = 0,
                _v = "",
                _t = "";
            for (; i < ol; i++) {
                _v = option[i].value;
                _t = option[i].text;
                //创建option引用
                _option = document.createElement("OPTION");
                _option.value = _v;
                _option.text = _t;
                target.options.add(_option); // 兼容ie和 firefox
            }
        };
    _addOptions.onclick = function() {
        addOptions(down, [{
            "value": "新添加的元素",
            "text": "新添加元素的内容"
        }])
    };


    //-----2015年08月10日22:38:47  Page 57

    //删除已存在的option选项
    var _removeOptions = document.getElementById("removeOptions"), //获得删除按钮对象
        removeOptions = function(target, op) {
            var ol = op.length,
                i = 0;
            console.log(ol);
            for (; i < ol; i++) {
                target.options[i] && target.options.remove(target.options[i]);
            }
        };
    _removeOptions.onclick = function() {
        removeOptions(document.getElementById("removeOption"), [1, 2, 3]);
    };

    //省市地区联动
    function linkage(parents, childs) {
        var _linkDatas = linkDatas,
            _parents = _linkDatas.province,
            _childs = _linkDatas.citys,
            _initCity = _childs[0],
            _p = [];
        for (var i in _parents) {
            _p.push({
                "text": _parents[i].name,
                "value": _parents[i].code
            })
        }
        addOptions(parents, _p); //先拼接省份下拉

        parents.onchange = function() {
            var __childs = _childs[this.value],
                __childsLen = __childs.length,
                i = 0,
                __p = [];
            childs.innerHTML = "";
            for (; i < __childsLen; i++) {
                __p.push({
                    "value": __childs[i],
                    "text": __childs[i]
                });
            }
            addOptions(childs, __p);
        };
    }
    linkage(document.getElementById("province"), document.getElementById("citys"));


    //可输入的下拉框, 可以自主添加下拉选项
    var _inOption = document.getElementById("inOption"), // option下拉
        _inInput = document.getElementById("inInput"); // input框

    _inInput.onkeyup = function() {
        var key = event.keyCode,
            _v = _inInput.value;
        if (key == 13) { // 如果输入完 按enter, 则拼接下拉
            addOptions(_inOption, [{
                "value": _v,
                "text": _v
            }])
        }
    };
    _inOption.onchange = function() {
        _inInput.value = this.value;
    };

    //清空所有文本
    var _clearText = document.getElementById("clearText");
    _clearText.onclick = function() {
        var _elements = document.getElementById("clearForm").elements, //获得form表单所有元素
            _elementsLen = _elements.length,
            _ei = null,
            i = 0;
        for (; i < _elementsLen; i++) {
            _ei = _elements[i];
            (_ei.type == "text" || _ei.type == "textarea") && (_ei.value = "");
        };
    };

    //javascript上传文件
    uploadCount = 1; //增加文件input标示符
    isIE = function() { //是否是IE
        return document.all ? true : false;
    };

    //鼠标悬停提示

    /**
     * 获取鼠标在页面上的位置
     * _e 触发的事件
     * left : 鼠标离左侧的位置,
     * top: 鼠标离顶部的位置
     * @param  {[type]}
     * @return {[type]}
     */
    getMousePoint = function(_e) {
        var _body = document.body,
            _mousepos = {
                "top": 0,
                "left": 0
            },
            _left = 0,
            _top = 0;
        //获取滚动条距离顶部和左侧的距离
        if (typeof window.pageYOffset != "undefined") {
            _left = window.pageXOffset;
            _top = window.pageYOffset;
        } else if (typeof document.compatMode != "undefined" && document.compatMode != "BackCompat") {
            _left = document.documentElement.scrollLeft;
            _top = document.documentElement.scrollTop;
        } else if (typeof _body != "undefined") {
            _left = _body.scrollLeft;
            _top = _body.scrollTop;
        }

        _left += _e.clientX;
        _top += _e.clientY;

        _mousepos.left = _left;
        _mousepos.top = _top;
        return _mousepos;
    };
    tooltipShow = function(e, tooltopMsg) {
        //rows 集合返回表格中所有行（TableRow 对象）的一个数组，即一个 HTMLCollection。
        var trE = e.rows,
            trLen = trE.length,
            i = 0;
        for (; i < trLen; i++) {
            var trEi = trE[i],
                dataTooltip = trEi.getAttribute("data-tooltip");
            if (dataTooltip) {
                trEi.onmousemove = function(event) {
                    event = event || window.event;
                    var _pos = getMousePoint(event); // 获取鼠标位置
                    tooltopMsg.innerHTML = this.getAttribute("data-tooltip");
                    setCss(tooltopMsg, {
                        "left": _pos.left + "px",
                        "top": (_pos.top + 18) + "px",
                        "display": "inline"
                    })
                };

                trEi.onmouseout = function() {
                    setCss(tooltopMsg, {
                        "display": "none"
                    })
                };
            }
        }
    };
    var tooltip = document.getElementById("tooltip"),
        tooltipMsg = document.getElementById("tooltipMsg");
    tooltipShow(tooltip, tooltipMsg);

    //表格光棒效果
    var trE1 = document.getElementById("lightBar").rows,
        trLen1 = trE1.length,
        i = 0;
    for (; i < trLen1; i++) {
        var trEi = trE1[i];

        trEi.onmousemove = function() {
            this.style.backgroundColor = "#a5e5aa";
        };
        trEi.onmouseout = function() {
            this.style.backgroundColor = "#fff";
        };
    }

    //弹出层
    function setPopup(e, openPop, closePop) {
        setCss(e, {
            "position": "absolute",
            "zIndex": 100,
            "backgroundColor": "#EBEDF3"
        });
        openPop.onclick = function() {
            e.style.display = "block";
            setCss(e, {
                "left": "50%",
                "marginLeft": -e.offsetWidth / 2 + "px",
                "top": ((document.body.scrollTop || document.documentElement.scrollTop) + window.screen.availHeight / 2 - e.offsetHeight) - 100 + "px"
            });
        };
        closePop.onclick = function() {
            e.style.display = "none";
        };
    }
    setPopup(document.getElementById("popupDiv"),
        document.getElementById("popupOpen"),
        document.getElementById("popupClose")
    );

    // 2015年08月11日22:23:21  page 164

    //遮罩层效果
    document.getElementById("showMaskLayer").onclick = function() {
        var b = document.body.parentNode,
            maskLayer = document.getElementById("maskLayer");
        setCss(maskLayer, {
            "position": "absolute",
            "left": "0px",
            "display": "block",
            "top": "0px",
            "zIndex": 1000,
            "backgroundColor": "#ccc",
            "height": b.scrollHeight + "px",
            "width": b.offsetWidth + "px",
            "filter": "alpha(Opacity=60)",
            "opacity": "0.6",
            "-moz-opacity": "0.6",
            "filter": "progid:DXImageTransform.Microsoft.alpha(Opacity=60)",
            "-MS-filter": "progid:DXImageTransform.Microsoft.alpha(Opacity=60)"
        })
    };

    //tab选项切换
    function getTypeElement(es, type) {
        var esLen = es.length,
            i = 0,
            eArr = [],
            esl = null;
        for (; i < esLen; i++) {
            esl = es[i];
            if (esl.nodeName.replace("#", "").toLocaleLowerCase() == type) {
                eArr.push(esl);
            }
        }
        return eArr;
    }

    function tabSwitch(e) {
        var divs = getTypeElement(e.childNodes, "div"),
            l = divs.length,
            i = 0;
        for (; i < l; i++) {
            divs[i].onclick = function() {
                for (var ii = 0; ii < l; ii++) {
                    divs[ii].className = "",
                        document.getElementById("tabSwitch" + (ii + 1)).style.display = "none";
                }
                this.className = "on";
                document.getElementById(this.getAttribute("data-targent")).style.display = "block";
            };
        }
    }

    tabSwitch(document.getElementById("tabSwitch"));

    //页面跳转的几种方式:
    //window.location.href = ""; //在原来的窗口中
    //window.open(""); //在新窗口中打开页面
    //window.location.replace(""); //通过指定 URL 替换当前页面及缓存内容,导致跳转页面后没有后退功能
    //<meta http-equiv="refresh" content="0, url=''" >

    //刷新iframe窗口
    document.getElementById("updateIframeBtn").onclick = function() {
        updateIframe.location.href = "tt.html";
    };

    //刷新当前页面
    // window.location.reload()
    // window.location.href=window.location.href;
    // window.location.replace(window.location.href);

    //屏蔽右键
    document.getElementById("shieldingRight").onclick = function() {
        document.oncontextmenu = function() {
            return false;
        };
    };

    //防止被人frame
    if (top.location != self.location) {
        top.location = self.location;
    }
    //禁止有滚动条
    document.getElementById("banScrollBar").onclick = function() {
        document.onmousewheel = function(event) { // 禁止鼠标中轴滚动
            event = event || window.event;
            if (event && event.preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                return false;
            }
        };
    }

    //取消选取
    document.getElementById("deselect").onclick = function() {
        (window.getSelection && window.getSelection().removeAllRanges()) ||
        (document.selection && document.selection.empty && document.selection.empty());
    };

    var preventCopying = document.getElementById("preventCopying");
    preventCopying.oncopy = function() {
        return false;
    };
    preventCopying.oncut = function() {
        return false;
    };

    preventCopying.onselectstart = function() {
        return false;
    };

    //添加到收藏夹
    function addFavorite(url, title) {
        try {
            window.external.AddFavorite(url, title);
        } catch (e) {
            try {
                window.sidebar.addPanel(url, title);
            } catch (error) {
                alert("添加收藏夹失败, 请用Ctrl+D或手动设置!");
            }
        }
    }
    document.getElementById("addFavorite").onclick = function() {
        addFavorite("http://aa.com", "框架");
    };

    //查看网页源代码
    // document.getElementById("aa").onclick = function() {
    //     var source = window.open("tt.html", "", "menubar=no,location=no,scrollbars=yes,resizable=yes");
    //     if (window.XMLHttpRequest) {
    //         xmlHttp = new XMLHttpRequest(); //firefox opera 支持的创建方式
    //     } else {
    //         xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); // ie创建方式
    //     }
    //     xmlHttp.onreadystatechange = function() {
    //         if (xmlHttp.readyState == 4) {
    //             source.document.write("<textarea cols='1000' rows='1000'>" + xmlHttp.responseText + "</textarea>");
    //         }
    //     };
    //     xmlHttp.open("GET", "tt.html", true);
    //     xmlHttp.send(null);
    // }

    document.getElementById("viewDocumentSource").onclick = function() {
        window.open("view-source:" + location.href);
    };

    // 2015年08月12日22:59:25 202
    /*-------------------------------------------------------------------------*/
    /**
        去除字符左右空格
    */
    function strTrim(str) {
        return str.replace(/^\s+|\s+$/g, "");
    }

    var memorizer = function(memo, fundamental) {
        var shell = function(n) {
            var result = memo[n];
            // console.log(result);
            if (typeof result !== 'number') {
                result = fundamental(shell, n);
                memo[n] = result;
            }
            166

            return result;
        };
        return shell;
    };
    var fibonacci = memorizer([0, 1], function(shell, n) {
        return shell(n - 1) + shell(n - 2);
    });
    console.log(fibonacci(4));
    //阶乘函数
    var factorial = memorizer([1, 1], function(shell, n) {
        return n * shell(n - 1);
    })
}