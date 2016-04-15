// get accesskey
exports.authenticateUserParams = {
	"body":{
		"account":{check_type:"unsignednumber_type",notnull:true},
		"username":{check_type:"string64_type",notnull:true},
		"password":{check_type:"password_type",notnull:true}
	}
};

//get accesskey of box
//参数未确定，后期修改
exports.authenticateBoxParams = {
	"body":{
		"account":{check_type:"unsignednumber_type",notnull:true},
		"cert":{check_type:"password_type",notnull:true}
	}
};

//authenization logout
exports.logoutParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true}
	}
};