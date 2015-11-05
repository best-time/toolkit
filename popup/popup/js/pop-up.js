var Prompt = {
  $: function(id) {
    return document.getElementById(id)
  },
  add: function() {
    this.createShade(); //生成遮罩层
    this.createPrompt(); //生成弹窗的div块
  },
  init: function(option) {    //初始化参数
  this.add()
    var title = this.title = option.title || false, //标题
      shade = this.shade = option.shade || false, //是否显示遮罩
      opacity = this.opacity = option.opacity || 20, //遮罩透明度
      width = this.width = option.width || 500, //弹窗宽度
      height = this.height = option.height || 300, //弹窗高度
      _temp = this._temp = option.html || "",
      ConfirmFun = this.ConfirmFun = option.ConfirmFun || false,
      CancelFun = this.CancelFun = option.CancelFun || false;
    this.editTitle();
    this.editHtml();
    if (ConfirmFun) {
      this.showBottom();
    } else {
      this.hideBottom();
    }
    this.show();
  },
  editTitle: function() { //  生成title的div块
    var prompt_title = this.$("prompt_title");
    if (this.title) {
      prompt_title.innerHTML = this.title;
      //添加拖拽方法
      this.drag();
      prompt_title.style.display = "block";
    } else {
      prompt_title.style.display = "none";
    }
  },
  editHtml: function() {
    var prompt_body = this.$("prompt_body");
    prompt_body.innerHTML = this._temp;
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

    if (that.CancelFun) {
      prompt_bottom.innerHTML = "<a class='butn' id='ConfirmFun'>确定</a><a class='butn' id='CancelFun'>取消</a>";
      that.addHandler(that.$("ConfirmFun"), "click", function() {
        that.hide();
        that.ConfirmFun();
      });

      that.addHandler(that.$("CancelFun"), "click", function() {
        that.hide();
        that.CancelFun();
      });
    } else {
      prompt_bottom.innerHTML = "<a class='butn' id='ConfirmFun'>确定</a>";
      that.addHandler(that.$("ConfirmFun"), "click", function() {
        that.hide();
        that.ConfirmFun();
      });
    }
    prompt_bottom.style.display = "block";
  },
  hideBottom: function() {
    this.$("prompt_bottom").innerHTML = "";
    this.$("prompt_bottom").style.display = "none";
  },
  show: function() {
    var promptDiv = Prompt.$("prompt"),
      shadeDiv = Prompt.$("shadeDiv"),
      bodyHeight = document.documentElement.clientHeight || document.body.clientHeight;
    promptDiv.style.display = "block";
    promptDiv.style.width = this.width + "px";
    promptDiv.style.height = this.height + "px";
    promptDiv.style.left = (this.bodyWidth / 2 - this.width / 2) + "px";
    promptDiv.style.top = (bodyHeight / 2 - this.height / 2) + "px";
    if (this.shade) {
      shadeDiv.style.display = "block";
      if (document.all) {
        shadeDiv.filters.alpha.opacity = this.opacity;
        shadeDiv.style.zoom = 1;
      } else {
        shadeDiv.style.opacity = this.opacity / 100;
      }
    }
    if (this.IE6()) {
      promptDiv.appendChild(this.createIframe()); //ie6添加iframe
    }
  },
  hide: function() {
    Prompt.$("prompt").style.display = "none";
    Prompt.$("shadeDiv").style.display = "none";
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
      width = this.width;
      height = this.height;
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

    that.addHandler(prompt_title, "mousedown", function(event) {
      var event = window.event || event;
      if (event.button == 0 || event.button == 1) { //鼠标左键chrome=0 ie=1
        (!window.ActiveXObject) ? event.preventDefault(): event.returnValue = false; //取消默认行为
        mouseX = event.clientX;
        mouseY = event.clientY;
        objY = parseInt(prompt.style.top);
        objX = parseInt(prompt.style.left);
        // console.log(objX, objY);
        // console.log(mouseX, mouseY);
        that.isDown = true;
      }
    });

    that.addHandler(document, "mousemove", function(event) {
      if (that.isDown) {
        var event = window.event || event;
        // (!window.ActiveXObject) ? event.preventDefault() : event.returnValue = false; //取消默认行为
        prompt.style.top = event.clientY - mouseY + objY + "px";
        prompt.style.left = event.clientX - mouseX + objX + "px";
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
    return node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
  },
  IE6: function() {
    return !!window.ActiveXObject && !window.XMLHttpRequest;
  }

}

/*Prompt.add();

document.getElementById("bt1").onclick = function(){
    Prompt.init({
        title : "我是个alert弹出框",
        shade : true,
        opacity : 20,
        width : 800,
        height : 150,
        html : "我是个alert弹出框我是个alert弹出框我是个alert弹出框我是个alert弹出框我是个alert弹出框我是个alert弹出框!"
    });
}

document.getElementById("bt2").onclick = function(){
    Prompt.init({
        height: 200,
        html : "没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!",
        ConfirmFun : a1,
        CancelFun : a2 
    });
}

document.getElementById("bt3").onclick = function(){
    Prompt.init({
        title : "有确定按钮的弹出框",
        height: 200,
        html : "没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!没有标题和遮罩的confirm弹出框!",
        ConfirmFun :  a1
    });
}

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


function a1(){
    Prompt.init({
        title : "我是确认弹出框",
        shade : true,
        height : 150,
        html : "我是确认弹出框!"
    });
}

function a2(){
    Prompt.init({
        title : "我是取消的弹出框",
        shade : true,
        opacity : 20,
        width : 200,
        height : 150,
        html : "我是取消的弹出框"
    });
}
*/