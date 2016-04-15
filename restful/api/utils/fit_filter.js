module.exports = function (obj, filter) {
	var ret = {};
	for (var key in filter) {
		// 不能简单的写if(obj[key])这样的语句，因为obj[key]可能存在但是为false或<0
		if (obj.hasOwnProperty(key)) ret[key] = obj[key];
	}
	return ret;
};