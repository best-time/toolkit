/**
 * Created by 16040500 on 2016/5/6.
 */
 
 /*
 .text-overflow{
	display:block;                     /*内联对象需加
	width:31em;
	word-break:keep-all;           /* 不换行 
	white-space:nowrap;          /* 不换行 
	overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 
	text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。
	}
	
	模拟ios开关
	class: mui-switch / mui-switch mui-switch-animbg on
	.auto-off {
          text-align: right;
          margin-right: pxToRem(30px);

          .mui-switch {
            display: inline-block;
            width: 51px;
            height: 29px;
            position: relative;
            top: pxToRem(15px);
            border: 1px solid #dfdfdf;
            background-color: #fdfdfd;
            box-shadow: #dfdfdf 0 0 0 0 inset;
            border-radius: 20px;
            background-clip: content-box;
            -webkit-appearance: none;
            user-select: none;
            outline: none;
          }
          .mui-switch:before {
            content: '';
            width: 29px;
            height: 29px;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 20px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          }
          .mui-switch.on {
            border-color: #4CD864;
            box-shadow: #4CD864 0 0 0 16px inset;
            background-color: #4CD864;
          }
          .mui-switch.on:before {
            left: 21px; }
          .mui-switch.mui-switch-animbg {
            transition: background-color ease 0.4s; }
          .mui-switch.mui-switch-animbg:before {
            transition: left 0.3s; }
          .mui-switch.mui-switch-animbg.on {
            box-shadow: #dfdfdf 0 0 0 0 inset;
            background-color: #4CD864;
            transition: border-color 0.4s, background-color ease 0.4s; }
          .mui-switch.mui-switch-animbg.on:before {
            transition: left 0.3s; }
          .mui-switch.mui-switch-anim {
            transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s; }
          .mui-switch.mui-switch-anim:before {
            transition: left 0.3s; }
          .mui-switch.mui-switch-anim.on {
            box-shadow: #4CD864 0 0 0 16px inset;
            background-color: #64bd63;
            transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s; }
          .mui-switch.mui-switch-anim.on:before {
            transition: left 0.3s; }
        }
 */

//=============================
//设置光标位置函数
function setCursorPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}
//获取光标位置函数
function getPositionForInput(ctrl) {
    var CaretPos = 0;
    if(ctrl.selectionStart || ctrl.selectionStart == '0') {// Firefox support
        CaretPos = ctrl.selectionStart;
    } else if (document.selection) { // IE Support
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    }
    return CaretPos;
}

$("#box5").on("keyup", function(e) { // 或者  input 事件
    console.debug(e.charCode ||  e.keyCode)
});
is_number = function (e) {
    var char_code = e.charCode ? e.charCode : e.keyCode;
    // 0为 48， 9 为57
    if (char_code < 48 || char_code > 57) {
        return false;
    } else {
        return true;
    }
};

//原生ajax
    function ajax(options){
        var xmlhttp = null;
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }
        else if (window.ActiveXObject){
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (xmlhttp!=null){
            xmlhttp.onreadystatechange = function ()
            {
                if (xmlhttp.readyState==4)
                {
                    if (xmlhttp.status==200)
                    {
                        if(options.success){
                            options.success(xmlhttp.responseText, xmlhttp);
                        }
                    }
                    else
                    {
                        if(options.failed){
                            options.failed(xmlhttp);
                        }
                    }
                }
            };
            xmlhttp.open("GET", options.url||'', true);
            xmlhttp.send(null);
        }
    }