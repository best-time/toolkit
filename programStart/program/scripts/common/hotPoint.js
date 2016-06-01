//创建在页面引入外部js文件的script标签的方法开始
window._loadAsyncJs = function (src) {
	var _src = src;
	var _scripts = document.getElementsByTagName('script');
	for (var i = 0; i < _scripts.length; i++) {
		if (_scripts[i].src == _src) {
			return;
		}
	}
	var _script = document.createElement('script');
	_script.type = 'text/javascript';
	_script.async = true;
	_script.src = _src;
	var _s = _scripts[0];
	_s.parentNode.insertBefore(_script, _s);
}
//创建在页面引入外部js文件的script标签的方法结束

//判断环境，设置js文件路径开始
function _getJsFilePath(js_file) {
	var _hostName = document.location.hostname;
	// 一般生产环境的域名
	var _prd_reg = ".suning.com";
	// 一般pre环境的域名
	var _pre_reg = "pre.cnsuning.com";
	// 一般sit环境的域名
	var _sit_reg = "sit.cnsuning.com";
	//以上为一般情况下各种环境(sit,pre,prd)的域名格式，如果自己系统环境的域名格式不同，请根据实际情况制定

	var sa_src = "";
	if (sa.env=="prd" || _hostName.indexOf(_prd_reg) != -1) {
		sa_src = ("https:" == document.location.protocol) ? "https://imgssl.suning.com" : "http://script.suning.cn";
	} else if (sa.env=="pre"|| _hostName.indexOf(_pre_reg) != -1) {//sit系统
		sa_src = ("https:" == document.location.protocol) ? "https://preimgssl.suning.com" : "http://prescript.suning.cn";
	} else if (sa.env=="sit" || _hostName.indexOf(_sit_reg) != -1) {
		sa_src = ("https:" == document.location.protocol) ? "https://sit1imgssl.suning.com" : "http://sit1script.suning.cn";
	} else {
		sa_src = ("https:" == document.location.protocol) ? "https://imgssl.suning.com" : "http://script.suning.cn";
	}
	sa_src = sa_src + "/javascript/sn_da/" + js_file;
	return sa_src;
}
//判断环境，设置js文件路径结束

//调用方法，加载js文件开始
var sa = sa || {};
(function () {
	//sa.env="prd"; //env的取值范围"prd、pre和sit",请根据实际环境配置！上线前请配置prd
	_loadAsyncJs(_getJsFilePath("sa_noga.js"));
})();
//调用方法，加载js文件结束