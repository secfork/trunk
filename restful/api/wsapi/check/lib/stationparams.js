exports.getStationParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"alllevel":{check_type:"bool_type"}
	},
	"params":{
		"station_uuid":{ check_type:"uuid_type",notnull:true}
	}
};

exports.getStationDevicesParams = {
	"params":{
		"station_uuid":{ check_type:"uuid_type",notnull:true}
	},
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"include_points":{ check_type:"bool_type"},
		"template_id":{check_type:"unsignednumber_type"},
		"name":{check_type:"string64_type"},
		"profile_id":{check_type:"unsignednumber_type"},
		"offset":{check_type:"unsignedint_type"},
		"desc" : {check_type:"string256_type"},
		"params":{check_type:"string65535_type"},
		"network":{check_type:"string65535_type"},
		"dev_cycle":{ check_type:"unsignedsmallint_type"},
		"dev_timeout":{ check_type:"unsignedsmallint_type"},
		"dev_retry":{ check_type:"unsignedsmallint_type"},
		"create_time":{check_type:"date_type"}
	}
};

exports.getDevicePointsParams = {
	"params":{
		"station_uuid":{ check_type:"uuid_type", notnull:true},
		"device_id":{ check_type:"unsignednumber_type", notnull:true}
	},
	"query":{
		"point_id":{check_type:"unsignednumber_type"},
		"template_id":{check_type:"unsignednumber_type"},
		"name":{check_type:"string64_type"},
		"offset":{check_type:"unsignedint_type"},
		"type":{check_type:"string16_type"},
		"desc" : {check_type:"string256_type"},
		"params":{check_type:"string65535_type"},
		"group":{check_type:"string64_type"},
		"scale":{check_type:"float_type"},
		"deviation":{check_type:"float_type"}
	}
};

exports.getPointsLiveParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"id":{check_type:"id_type"},
		"t":{check_type:"unsignednumber_type"}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type", notnull:true}	
	}
};

exports.sendCommandParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
	}
};

exports.readRawParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"start":{check_type:"unsignednumber_type",notnull:true},
		"end":{check_type:"unsignednumber_type"},
		"limit":{check_type:"unsignednumber_type"},
		"timestamp":{check_type:"unsignednumber_type"},
		"bound":{check_type:"bool_type"},
		"id":{check_type:"id_type",notnull:true}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
	}
};

exports.readIntervalParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"start":{check_type:"unsignednumber_type",notnull:true},
		"end":{check_type:"unsignednumber_type"},
		"timestamp":{check_type:"unsignednumber_type"},
		"id":{check_type:"id_type",notnull:true},
		"count":{check_type:"unsignednumber_type",notnull:true},
		"mode":{check_type:"unsignednumber_type"}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
	}
};

exports.readAtTimeParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"id":{check_type:"id_type",notnull:true},
		"timestamp":{check_type:"unsignednumber_type"},
		"t":{check_type:"unsignednumber_type",notnull:true},
		"mode":{check_type:"unsignednumber_type"}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
	}
};

exports.readProcessParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"start":{check_type:"unsignednumber_type",notnull:true},
		"end":{check_type:"unsignednumber_type"},
		"id":{check_type:"id_type",notnull:true},
		"timestamp":{check_type:"unsignednumber_type"},
		"interval":{check_type:"unsignednumber_type"},
		"stats":{check_type:"stats_type",notnull:true}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
	}
};

exports.getAlarmsParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"type":{check_type:"alarm_type"},///
		"severity":{check_type:"severity_type"},///
		"class_id":{check_type:"classid_type"},//
		"offset":{check_type:"unsignednumber_type"},
		"limit":{check_type:"unsignednumber_type"},
		"calc_sum":{check_type:"bool_type"},
		"sorts":{check_type:"string64_type"}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
	}
};

exports.getAlarmHistoryParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"start":{check_type:"unsignednumber_type"},
		"end":{check_type:"unsignednumber_type"},
		"device_id":{check_type:"unsignednumber_type"},
		"type":{check_type:"alarm_type"},///
		"severity":{check_type:"severity_type"},///
		"class_id":{check_type:"classid_type"},//
		"offset":{check_type:"unsignednumber_type"},
		"limit":{check_type:"unsignednumber_type"},
		"calc_sum":{check_type:"bool_type"},
		"sorts":{check_type:"string64_type"}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
	}
};

exports.ackAlarmParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"id":{check_type:"unsignednumber_type",notnull:true},
		"user_id":{check_type:"unsignednumber_type"},
		"message":{check_type:"string1024_type"}////
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
	}
};

exports.getAckMessageParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"id":{check_type:"unsignednumber_type",notnull:true}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
		
	}
};

exports.updatingStationsParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true},
		"id":{check_type:"unsignednumber_type",notnull:true}
	}
};

exports.appendParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true}
	},
	"params":{
		"station_uuid":{check_type:"uuid_type",notnull:true}
	}
};
