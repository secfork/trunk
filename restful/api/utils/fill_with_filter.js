var copy = require('copy-to');

//
// 1 - 表示直接赋值
// 2 - 表示需要将字符串转换为object
//
function fill_with_filter(obj, filter) {
	var ret = {};
	if (!filter) {
		copy(obj).to(ret);
		return ret;
	}
	
	for (var key in filter) {

		// 不能简单的写if(obj[key])这样的语句，因为obj[key]可能存在但是为false或<0
		if (obj.hasOwnProperty(key)) {
			var val = obj[key];
			var type = filter[key];

			switch(type) {
				case 1:
					ret[key] = val;
					break;					
				case 2:
					ret[key] = str_to_obj(val);		// val must be a string
					break;			
				default:
					break;
			}
		}
	}
	return ret;
}

function str_to_obj(str) {
	if (!str || str == "null")
		return {};
	
	try {
		return JSON.parse(str);
	}
	catch(ex){
		return {};
	}
}

module.exports = fill_with_filter;