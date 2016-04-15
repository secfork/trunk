//目前没有对body的内容检查，格式固定后可进行检查
exports.appendParams = {
	"query":{
		"accesskey":{check_type:"accessKey_type",notnull:true}
	},
	"params":{
		"station_uuid":{ check_type:"uuid_type",notnull:true}
	}
};