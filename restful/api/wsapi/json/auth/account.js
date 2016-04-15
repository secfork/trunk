var   API_PRIVILEGE = require('./api_privilege')
	, privileges = require('../../../privilege')
	, auth = require('./auth')
	, accounts = require('../server/account')
	, roles = require('../server/roles');



function groupAuth (req,cb) {
	var token = req.scopes.access_token;
	accounts.getGroup(req, function(err,group) {
		if (err) {
			return cb(false);
		}
		else {
			return cb(token.account_id == group.account_id);
		}
	});
}

// GROUP
exports.createGroup = function (req, cb) {
	var token = req.scopes.access_token;
	return cb(auth.check (token, API_PRIVILEGE.CREATE_GROUP, token.scopes.account.privilege));
};

exports.getGroup =  function (req,cb) {
	groupAuth (req,cb);
}


exports.setGroup = function (req, cb) {
	var token = req.scopes.access_token;
	if (auth.check( token, API_PRIVILEGE.MODIFY_GROUP, token.scopes.account.privilege)){
		return groupAuth(req,cb);
	}
	else {
		return cb(false);
	}
}


exports.dropGroup = function ( req, cb ) {
	var token = req.scopes.access_token;
	if (auth.check(token, API_PRIVILEGE.DROP_GROUP, token.scopes.account.privilege)){
		return groupAuth(req,cb)
	}
	else {
		return cb(false);
	}
}

//具有用户组管理权限的用户，才能列出所有的用户组
exports.listGroups = function (req, cb){
	var token = req.scopes.access_token;
	//超级用户具能列出所有用户组
	//具有区域管理权限的，可以列出全部用户组
	if (token.type == "super" || privileges.compare(token.scopes.account.privilege,privileges.GROUP_MANAGE)){
		return cb(true);
	}
	//不具备用户组管理权限，只能获取当前用户组
	var group_ids = token.group_ids;
	req.scopes["conditions"]  = {};
	if(group_ids.length){
		req.scopes["conditions"]["id"]  = group_ids;
	}
	return cb(true);
}


//REGIONS

function regionAuth (req,cb) {
	var token = req.scopes.access_token;
	accounts.getRegion(req, function(err,region) {
		if (err) {
			return cb(false);
		}
		else {
			return cb(token.account_id == region.account_id);
		}
	});
}


exports.createRegion = function (req, cb) {
	var token = req.scopes.access_token;
	return cb(auth.check (token, API_PRIVILEGE.CREATE_REGION, token.scopes.account.privilege));	
};

exports.getRegion =  function( req,cb ) {
	regionAuth(req,cb);
}


exports.setRegion = function( req,cb ) {
	var token = req.scopes.access_token;
	if (auth.check( token, API_PRIVILEGE.MODIFY_REGION, token.scopes.account.privilege)){
		return regionAuth(req,cb)
	}
	else {
		return cb(false);
	}	
}

 
exports.dropRegion = function(req,cb) {
	var token = req.scopes.access_token;
	if (auth.check(token, API_PRIVILEGE.DROP_REGION, token.scopes.account.privilege)) {
		return regionAuth(req,cb)
	}
	else {
		return cb(false);
	}	
}

exports.listRegions = function(req,cb){
	var token = req.scopes.access_token;
	//超级用户具能列出所有区域
	//具有区域管理权限的，可以获取全部区域信息
	if (token.type == "super" || privileges.compare(token.scopes.account.privilege,privileges.REGION_MANAGE)){
		return cb(true);
	}
	//不具备区域管理权限，只能获取当前区域
	req.scopes["conditions"]  = { "id":[] };
	for (var region_id in token.scopes.regions) {
		req.scopes["conditions"].id.push(region_id);
	}
	return cb(true);

}

//USER IN GROUPS 
function userAuth (req,cb) {
	var token = req.scopes.access_token;
	accounts.getUser(req, function(err,user) {
		if (err) {
			return cb(false);
		}
		else {
			return cb(token.account_id == user.account_id);
		}
	});
}

exports.addUser = function( req,cb ) {
	var token = req.scopes.access_token;
	if (auth.check( token, API_PRIVILEGE.ADD_USER, token.scopes.account.privilege)){
		return userAuth(req,cb);
	}
	else {
		return cb(false);
	}	
}

exports.dropUserInGroup = function( req,cb ) {
	var token = req.scopes.access_token;
	if (auth.check( token, API_PRIVILEGE.DROP_USER_IN_GROUP, token.scopes.account.privilege)){
		return userAuth(req,cb);
	}
	else {
		return cb(false);
	}	
}

exports.findUsersInGroup = function( req,cb ) {
	var token = req.scopes.access_token;
	return cb(auth.check (token, API_PRIVILEGE.FIND_USERS_IN_GROUP, token.scopes.account.privilege));
}

//USERS
exports.createUser = function (req, cb) {
	var token = req.scopes.access_token;
	return cb(auth.check (token, API_PRIVILEGE.CREATE_USER, token.scopes.account.privilege));			
};


exports.getUser =  function (req,cb) {
	userAuth(req,cb);
}


exports.setUser = function( req,cb ) {
	var token = req.scopes.access_token;
	if (auth.check( token, API_PRIVILEGE.MODIFY_USER, token.scopes.account.privilege)){
		return userAuth(req,cb)
	}
	else {
		return cb(false);
	}	
}


exports.dropUser = function (req,cb) {
	var token = req.scopes.access_token;
	if (auth.check( token, API_PRIVILEGE.DROP_USER, token.scopes.account.privilege)){
		return userAuth(req,cb)
	}
	else {
		return cb(false);
	}	
}

exports.listUsers = function (req,cb) {
	var token = req.scopes.access_token;
	return cb(auth.check (token, API_PRIVILEGE.LIST_USERS, privileges.All));	
}


//ROLES

function roleAuth (req,cb) {
	var token = req.scopes.access_token;
	roles.getRole(req, function(err,role) {
		if (err) {
			return cb(false);
		}
		else {
			return cb(token.account_id == role.account_id);
		}
	});
}

exports.createRole = function (req, cb) {
	var token = req.scopes.access_token;
	return cb(auth.check (token, API_PRIVILEGE.CREATE_ROLE, token.scopes.account.privilege));
};


exports.getRole =  function (req,cb){
	roleAuth(req,cb);
}

exports.setRole = function (req,cb) {
	var token = req.scopes.access_token;
	if (auth.check( token, API_PRIVILEGE.MODIFY_ROLE, token.scopes.account.privilege)){
		return roleAuth(req,cb)
	}
	else {
		return cb(false);
	}	
}
 
exports.dropRole = function (req,cb) {
	var token = req.scopes.access_token;
	if (auth.check( token, API_PRIVILEGE.DROP_ROLE, token.scopes.account.privilege)){
		return roleAuth(req,cb)
	}
	else {
		return cb(false);
	}	
}

exports.listRoles = function (req,cb) {
	var token = req.scopes.access_token;
	return cb(auth.check (token, API_PRIVILEGE.LIST_ROLES, privileges.All));
}



