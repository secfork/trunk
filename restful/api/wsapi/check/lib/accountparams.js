exports.listProjectsParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true}
	}
};

exports.listStationsParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"account":{check_type:"unsignednumber_type"},//
		"project":{check_type:"unsignednumber_type"},
		"state":{check_type:"state_type"},
		"offset":{check_type:"unsignednumber_type"},
		"limit":{check_type:"unsignednumber_type"},
		"calc_sum":{check_type:"bool_type"},
		"sorts":{check_type:"string64_type"}
	}
};

exports.listTemplatesParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"account":{check_type:"unsignednumber_type"},///
		"offset":{check_type:"unsignednumber_type"},
		"limit":{check_type:"unsignednumber_type"},
		"calc_sum":{check_type:"bool_type"},
		"sorts":{check_type:"string64_type"}
	}
};

exports.getTemplatePointsParams = {
	"params":{
		"template_id":{check_type:"unsignednumber_type", notnull:true}
	},
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"point_id":{check_type:"unsignednumber_type"},
		"point_name":{check_type:"string64_type"},
		"offset":{check_type:"unsignedint_type"},
		"type":{check_type:"string16_type"},
		"desc" : {check_type:"string256_type"},
		"params":{check_type:"string65535_type"},
		"group":{check_type:"string64_type"},
		"scale":{check_type:"float_type"},
		"deviation":{check_type:"float_type"}
	}
};

exports.listProfilesParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"account":{check_type:"unsignednumber_type"},
		"offset":{check_type:"unsignednumber_type"},
		"limit":{check_type:"unsignednumber_type"},
		"calc_sum":{check_type:"bool_type"},
		"sorts":{check_type:"string64_type"}
	}
};

exports.getTemplatesInProfileParams = {
	"params":{
		"profile_id":{check_type:"unsignednumber_type", notnull:true}
	},
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"template_id":{check_type:"unsignednumber_type"}
	}
};

exports.getPointsOfProfileParams = {
	"params":{
		"profile_id": { check_type:"unsignednumber_type", notnull:true},
		"template_id":{ check_type:"unsignednumber_type",notnull:true}
	},
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"point_id":{ check_type:"unsignednumber_type"},
		"name":{check_type:"string64_type"},
		"desc" : {check_type:"string256_type"},
		"scale":{check_type:"float_type"},
		"deviation":{check_type:"float_type"},
		"save_log":{check_type:"tinyint_type"},
		"log_cycle":{check_type:"unsignedint_type"},
		"log_type":{check_type:"log_type"}
	}
};

exports.getTriggersOfProfileParams = {
	"params":{
		"template_id":{check_type:"unsignednumber_type",notnull:true},
		"profile_id":{check_type:"unsignednumber_type", notnull:true}
	},
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"name":{check_type:"string64_type"},
		"desc" : {check_type:"string256_type"},
		"type":{check_type:"trigger_type"},
		"conditions":{check_type:"json_type"},
		"action":{check_type:"actions_type"},
		"params":{check_type:"string65535_type"},
		"create_time":{check_type:"date_type"}
	}
};

exports.getAlarmProfilesParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true}
	},
	"params":{
		"profile_id":{check_type:"unsignednumber_type", notnull:true},
		"template_id":{check_type:"unsignednumber_type", notnull:true}
	}
};
