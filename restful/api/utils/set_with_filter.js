//
// 1 - 表示直接赋值
// 2 - 表示需要将字符串转换为object
//
module.exports = function (dest, source, filter) {
	for (var key in filter) {
		if (source.hasOwnProperty(key)) {
			var val = source[key];
			var type = filter[key];

			switch(type) {
				case 1:
					dest[key] = val;
					break;				
				case 2:
					dest[key] = str_to_obj(val);		// val must be a string
					break;
				default:
					break;
			}			
		}
	}
};

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