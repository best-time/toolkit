/**
 * 工具类.
 * @type 
 */
var ToolUtils = {}

//定义map     
function Map() {
	this.container = {};
}

//将key-value放入map中     
Map.prototype.put = function(key, value) {
	try {

		if (key != null && key != "")
			this.container[key] = value;

	} catch (e) {
		return e;
	}
};

//根据key从map中取出对应的value     
Map.prototype.get = function(key) {
	try {
		return this.container[key];

	} catch (e) {
		return e;
	}
};

//判断map中是否包含指定的key     
Map.prototype.containsKey = function(key) {

	try {
		for (var p in this.container) {
			if (this.p == key)
				return true;
		}

		return false;

	} catch (e) {
		return e;
	}

}

//判断map中是否包含指定的value     
Map.prototype.containsValue = function(value) {
	try {

		for (var p in this.container) {
			if (this.container[p] === value)
				return true;
		}

		return false;

	} catch (e) {
		return e;
	}
};

//删除map中指定的key     
Map.prototype.remove = function(key) {
	try {

		delete this.container[key];

	} catch (e) {
		return e;
	}
};

//清空map     
Map.prototype.clear = function() {
	try {
		delete this.container;
		this.container = {};

	} catch (e) {
		return e;
	}
};

//判断map是否为空     
Map.prototype.isEmpty = function() {

	if (this.keyArray().length == 0)
		return true;
	else
		return false;
};

//获取map的大小     
Map.prototype.size = function() {

	return this.keyArray().length;
}

//返回map中的key值数组     
Map.prototype.keyArray = function() {

	var keys = [];
	for (var p in this.container) {
		keys.push(p);
	}

	return keys;
}

//返回map中的value值数组     
Map.prototype.valueArray = function() {

	var values = new Array();
	var keys = this.keyArray();
	for (var i = 0; i < keys.length; i++) {
		values.push(this.container[keys[i]]);
	}

	return values;
}