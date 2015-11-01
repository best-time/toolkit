var Sole = {
    $: function(id) {
        return document.getElementById(id);
    },
    defaults: { //默认选项
        title: "标题栏", //标题描述
        shade: true, //是否有遮罩层
        opacity: 20, //遮罩层透明度
        width: 500, //弹窗宽度
        height: 300, //弹窗高度
        _temp: "", //弹窗html,
        timeout: 1200,
        ConfirmFun: false, //点击确定按钮的回调函数
        CancelFun: false // 点击取消按钮的回调函数
    },
    addHtml: function() {
        this.createShade(); //生成遮罩层
        this.createPrompt(); //生成弹窗的div块
    },
    init: function(option) { //初始化参数
        this.addHtml()
        this.defaults.title = option.title ? option.title : this.defaults.title;
        this.defaults.shade = option.shade ? option.shade : this.defaults.shade;
        this.defaults.opacity = option.opacity ? option.opacity : this.defaults.opacity;
        this.defaults.width = option.width ? option.width : this.defaults.width;
        this.defaults.height = option.height ? option.height : this.defaults.height;
        this.defaults._temp = option.html ? option.html : this.defaults._temp;
        this.defaults.ConfirmFun = option.ConfirmFun ? option.ConfirmFun : this.defaults.ConfirmFun;
        this.defaults.CancelFun = option.CancelFun ? option.CancelFun : this.defaults.CancelFun;

        this.editTitle();
        this.editHtml();
        if (this.defaults.ConfirmFun) {
            this.showBottom();
        } else {
            this.hideBottom();
        }
        this.show();
    },
    editTitle: function() { //  生成title的div块
        var prompt_title = this.$("prompt_title");
        if (this.defaults.title) {
            prompt_title.innerHTML = this.defaults.title;
            //添加拖拽方法
            this.drag();
            prompt_title.style.display = "block";
        } else {
            prompt_title.style.display = "none";
        }
    },
    editHtml: function() {
        var prompt_body = this.$("prompt_body");
        prompt_body.innerHTML = this.defaults._temp;
    },
    createPrompt: function() { //创建弹出的div
        var doc = document,
            Div = doc.createElement("div");
        Div.id = "prompt";
        Div.innerHTML = "<span id='prompt_close'></span><div id='prompt_title'></div><div id='prompt_body'></div><div id='prompt_bottom'></div>";
        doc.body.appendChild(Div);

        var prompt_close = this.$("prompt_close");
        this.addHandler(prompt_close, "click", this.hide);
    },
    showBottom: function() { //创建确定 取消按钮
        var that = this,
            prompt_bottom = that.$("prompt_bottom");

        if (that.defaults.CancelFun) {
            prompt_bottom.innerHTML = "<a class='butn' id='ConfirmFun'>确定</a><a class='butn' id='CancelFun'>取消</a>";
            that.addHandler(that.$("ConfirmFun"), "click", function() {
                that.hide();
                that.defaults.ConfirmFun();
            });

            that.addHandler(that.$("CancelFun"), "click", function() {
                that.hide();
                that.defaults.CancelFun();
            });
        } else {
            prompt_bottom.innerHTML = "<a class='butn' id='ConfirmFun'>确定</a>";
            that.addHandler(that.$("ConfirmFun"), "click", function() {
                that.hide();
                that.defaults.ConfirmFun();
            });
        }
        prompt_bottom.style.display = "block";
    },
    hideBottom: function() {
        this.$("prompt_bottom").innerHTML = "";
        this.$("prompt_bottom").style.display = "none";
    },
    show: function() {
        var promptDiv = this.$("prompt"),
            shadeDiv = this.$("shadeDiv"),
            bodyHeight = document.documentElement.clientHeight || document.body.clientHeight;
        promptDiv.style.display = "block";
        promptDiv.style.width = this.defaults.width + "px";
        promptDiv.style.height = this.defaults.height + "px";
        promptDiv.style.left = (this.bodyWidth / 2 - this.defaults.width / 2) + "px";
        promptDiv.style.top = (bodyHeight / 2 - this.defaults.height / 2) + "px"; //弹窗居中
        if (this.defaults.shade) {
            shadeDiv.style.display = "block";
            if (document.all) { // ie
                shadeDiv.filters.alpha.opacity = this.defaults.opacity;
                shadeDiv.style.zoom = 1; //hack
            } else {
                shadeDiv.style.opacity = this.defaults.opacity / 100;
            }
        }
        if (this.IE6()) {
            promptDiv.appendChild(this.createIframe()); //ie6添加iframe
        }
    },
    hide: function() {
        this.$("prompt").style.display = "none";
        this.$("shadeDiv").style.display = "none";
    },
    createShade: function() { //创建遮罩层
        var doc = document,
            bodyWidth = this.bodyWidth = doc.documentElement.clientWidth || doc.body.clientWidth,
            bodyHeight = this.bodyHeight = doc.documentElement.clientHeight || doc.body.clientHeight,
            Div = doc.createElement("div");
        Div.id = "shadeDiv";
        Div.style.height = bodyHeight + "px";
        Div.style.width = bodyWidth + "px";
        Div.style.opacity = 0.2;
        if (this.IE6()) { //   ie6添加iframe
            Div.appendChild(this.createIframe("shadeDiv"));
        }
        doc.body.appendChild(Div);
    },
    createIframe: function(div) {
        var width, height;
        if (div == "shadeDiv") {
            width = this.bodyWidth;
            height = this.bodyHeight;
        } else {
            width = this.defaults.width;
            height = this.defaults.height;
        }
        var Iframe = document.createElement('iframe');
        Iframe.style.position = 'absolute';
        Iframe.style.zIndex = '-1';
        Iframe.style.left = '-1px';
        Iframe.style.top = 0;
        Iframe.style.border = 0;
        Iframe.style.filter = 'alpha(opacity=0)';
        Iframe.style.width = width + 'px';
        Iframe.style.height = height + 'px';
        return Iframe;
    },
    isDown: false,
    drag: function() { //添加拖拽事件
        var that = this,
            mouseX, mouseY, objY, objX,
            prompt_title = this.$("prompt_title"),
            prompt = this.$("prompt");

        that.addHandler(prompt_title, "mousedown", function(event) { //按下鼠标左键
            var event = window.event || event;
            if (event.button == 0 || event.button == 1) { //鼠标左键chrome=0 ie=1
                (!window.ActiveXObject) ?
                event.preventDefault():
                    event.returnValue = false; //取消默认行为
                mouseX = event.clientX;
                mouseY = event.clientY;
                // console.log(mouseX, mouseY)
                objY = parseInt(prompt.style.top, 10);
                objX = parseInt(prompt.style.left, 10);
                console.log(objX, objY)
                that.isDown = true;
            }
        });

        that.addHandler(document, "mousemove", function(event) {
            if (that.isDown) {
                var event = window.event || event;
                (!window.ActiveXObject) ?
                event.preventDefault():
                    event.returnValue = false; //取消默认行为
                var leftPos = event.clientX - (mouseX - objX); //鼠标点击处离屏幕左侧距离- 鼠标点击离弹窗左侧距离=弹窗离左边距离
                var topPos = event.clientY - (mouseY - objY);
                console.log(leftPos, topPos)
                if (leftPos < 0) { //弹窗不外溢
                    leftPos = 0;
                } else if (leftPos > document.documentElement.clientWidth - that.defaults.width) {
                    leftPos = document.documentElement.clientWidth - that.defaults.width;
                }
                if (topPos < 0) {
                    topPos = 0;
                } else if (topPos > document.documentElement.clientHeight - that.defaults.height) {
                    topPos = document.documentElement.clientHeight - that.defaults.height;
                }
                prompt.style.top = topPos + "px";
                prompt.style.left = leftPos + "px";
            }
        });

        that.addHandler(document, "mouseup", function() {
            that.isDown = false;
        });
    },
    getPosition: function(obj) { //获取元素在页面里的位置和宽高
        var top = 0,
            left = 0,
            width = obj.offsetWidth,
            height = obj.offsetHeight;

        while (obj.offsetParent) {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }

        return {
            "top": top,
            "left": left,
            "width": width,
            "height": height
        };
    },
    addHandler: function(node, type, handler) {
        return node.addEventListener ?
            node.addEventListener(type, handler, false) : //非ie 添加事件
            node.attachEvent('on' + type, handler); //ie添加事件
    },
    IE6: function() {
        return !!window.ActiveXObject && !window.XMLHttpRequest;
    }

}

/*

document.getElementById("bt4").onclick = function(){
    var str = "<h1>需要实现的状态</h1>" +
        "<p>1.是否有遮罩层</p>" +
        "<p>2.是否有title</p>" +
        "<p>3.alert & confirm</p>" +
        "<p>4.自定义弹出框里面的html</p>" +
        "<p>5.拖拽</p>" +
        "<select name='IE6'>" +
            "<option>1</option>" +
            "<option>2</option>" +
            "<option>3</option>" +
        "</select>" +
        "<br>" +
        "<h2>可以自己添加修改css样式</h2>" +
        "<iframe src='http://www.baidu.com' width='900' height='200'></iframe>" +
        "<h6>也可以自己添加方法</h6>";
    Prompt.init({
        title :"自定义html内容的弹出框",
        shade : true,
        opacity : 20,
        width :1000,
        height: 500,
        html : str
    });
}

*/