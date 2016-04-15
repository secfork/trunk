var   API_PRIVILEGE = require('./api_privilege')
	, privileges = require('../../../privilege')
	, auth = require('./auth');

function parseResource(options){ 
	if(options.isaccount){
		return 0;
	}else if(options.region_id){
		return 1;
	}else{
		return undefined;
	}
}

//对group_id是否是在这个account下的判断，放在了程序实现中，这里不再判断
//对region_id的判断也是如此
exports.addResource = function(req,cb) {
	var token = req.scopes.access_token;
	return cb(auth.check( token, API_PRIVILEGE.ADD_RESOURCE, token.scopes.account.privilege));
}

//对account_id,group_id,region_id的判断均在程序里
exports.getResWithPermission = function(req,cb){
	return cb(true);
}

exports.getResourceGroupsWithPermissions = function(req,cb){
	var token = req.scopes.access_token;
	return cb(auth.check( token, API_PRIVILEGE.GET_RESOURCE_PERMISSIONS, token.scopes.account.privilege));
	
	
}

exports.dropResource = function(req,cb){
	var token = req.scopes.access_token;
	return cb(auth.check( token, API_PRIVILEGE.DROP_RESOURCE, token.scopes.account.privilege));

	
}
