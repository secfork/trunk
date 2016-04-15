//参数检查方法后期可继续优化
var checks = require('../../utils/patterns');
function parse(check,value,args){
	if(Array.isArray(value)){
		for(var i in value){
			if(!check(value[i],args.notnull))
				return false;
		}
	}else{
		if(!check(value,args.notnull))
			return false;
	}
	return true;
}

//参数检查
exports.paramsCheck = function(req,params) {
	for(var key in params){
		for(var param in params[key]){
			var args = params[key][param];
			var check = checks.paramsCheck[args.check_type];
			if(!parse(check,req[key][param],args))
				return false;
		}	
	}
	return true;
}
