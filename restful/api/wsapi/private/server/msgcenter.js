var   MessageCenter = require('../../../message_center')
	, tokens = require('../../../authorization').tokens;

//连接数据库
MessageCenter.createDbConnection(require('../db/thinglinx_db_conn'));

var MailSettings = MessageCenter.MailSettings
	, SmsSettings= MessageCenter.SmsSettings
	, Supports  = MessageCenter.Supports
	, Send = MessageCenter.Send;

exports.send = function(req,cb){
	Send.sendPublic(req.params.system_id,req.body,cb);
}
//CREATE MAIL SETTING
exports.createMailsetting = function (req,cb) {
	var fields = {};
	for (var key in req.body){
		fields[key] = req.body[key];
	}
	fields ["account"]=req.params.account_id;
	MailSettings.create(fields,cb);
}

//GET MAIL SETTING 
exports.getMailsetting = function(req,cb){
	MailSettings.get(req.params.account_id,cb);
}

//SET MAIL SETTING
exports.setMailsetting = function(req,cb){
	var fields = {};
	for (var key in req.body){
		fields[key] = req.body[key];
	}
	MailSettings.set(req.params.account_id,fields,cb);
}

//DROP MAIL SETTING 
exports.dropMailsetting = function(req,cb){
	MailSettings.drop(req.params.account_id,cb);
}

//CREATE SMS SETTING
exports.createSmssetting = function (req,cb) {
	var fields = {};
	for (var key in req.body){
		fields[key] = req.body[key];
	}
	fields ["account"]=req.params.account_id;
	SmsSettings.create(fields,cb);
}

//GET SMS SETTING 
exports.getSmssetting = function(req,cb){
	SmsSettings.get(req.params.account_id,cb);
}

//SET SMS SETTING
exports.setSmssetting = function(req,cb){
	var fields = {};
	for (var key in req.body){
		fields[key] = req.body[key];
	}
	SmsSettings.set(req.params.account_id,fields,cb);
}

//DROP SMS SETTING
exports.dropSmssetting = function(req,cb){
	SmsSettings.drop(req.params.account_id,cb);
}

//CREATE SUPPORT SERVICE OF MESSAGE CENTER
exports.createSupport = function(req,cb){
	Supports.create(req.body,cb);
}

//LIST SUPPORT SERVICES OF MESSAGE CENTER
exports.listSupports= function(req,cb){
	Supports.find({}, {}, cb);
}

//GET  SUPPORT SERVICE OF MESSAGE CENTER
exports.getSupport = function(req,cb){
	Supports.get(req.params.service_name,cb);
}

//SET  SUPPORT SERVICE OF MESSAGE CENTER
exports.setSupport = function(req,cb){
	Supports.set(req.params.service_name,req.body,cb);
}

//DROP SUPPORT SERVICES OF MESSAGE CENTER
exports.dropSupport = function(req,cb){
	Supports.drop(req.params.service_name,cb);
}	