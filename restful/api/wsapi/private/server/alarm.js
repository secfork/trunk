var Alarm = require('../../../alarm')
	, escape_array = require('../../utils/escape_array');

// 连接数据库
// NOTE: 
//		create connection must before all beyonds.
Alarm.createDbConnection(require('../db/alarm_db_conn'));

var spaces = Alarm.spaces
	, alarms = Alarm.alarms
	, querier = Alarm.querier;


//////////////////////////////////////////////////////////////////////////////////////
// 	SPACE
//////////////////////////////////////////////////////////////////////////////////////

// CREATE SPACE
exports.createSpace = function(req, cb) {
	spaces.create(req.params.account_id, cb);
}

// GET SPACE BY ACCOUNT ID
exports.getSpace = function(req, cb) {
	spaces.get(req.params.account_id, cb);
};

// SET STATION BY STATION ID
exports.setSpace = function(req, cb) {
	spaces.set(req.params.account_id, req.body, cb);
};

// DROP SPACE BY ACCOUT ID
exports.dropSpace = function(req, cb) {
	spaces.drop(req.params.account_id, cb);
};

// GET ALARM CLASSES
exports.getClasses = function(req, cb) {
	spaces.getClasses(req.params.account_id, req.query, cb);
};

// SET ALARM CLASS
exports.setClass = function(req, cb) {
	spaces.setClass(req.params.account_id, req.query.class_id, req.body, cb);
};

// GET SEVERITY
exports.getSeverity = function(req, cb) {
	spaces.getSeverity(req.query, cb);
};

//////////////////////////////////////////////////////////////////////////////////////
// 	ALARMS
//////////////////////////////////////////////////////////////////////////////////////

exports.createAlarm = function(req, cb) {
	var alarms_obj = req.body;
	if (!alarms_obj.source || !alarms_obj.fields) {
		cb("BAD_PARAMETERS");
		return;
	}

	alarms.createAlarm(alarms_obj, cb);
};

exports.closeAlarm = function(req, cb) {
	alarms.closeAlarm(req.params.account_id, req.query.id, cb);
};

exports.clearAlarm = function(req, cb) {
	var source = {};
	source.account_id = req.params.account_id;
	source.device_id = req.query.device_id;
	if (!source.account_id || !source.account_id || !req.query.trigger_id){
		cb("BAD_PARAMETERS");
		return;
	}
	
	alarms.clearAlarmState(req.query.trigger_id, source, cb);
};

exports.ackAlarm = function(req, cb) {
	var ack_obj = {};
	["user_id", "message"].forEach(function(key){
		if (req.body.hasOwnProperty(key)){
			ack_obj[key] = req.body[key];
		}
	});

	alarms.ackAlarm(req.params.account_id, req.query.id, ack_obj, cb);
};

exports.getAckMessage = function(req, cb) {
	alarms.getAckMessage(req.params.ack_id, cb);
};


///////////////////////////////////////////////////////
// ALARM QUERY

function prepare_options(query) {
	return {
		"sorts" : escape_array(query.sorts),
		"offset" : parseInt(query.offset),
		"limit" : parseInt(query.limit),
		"calc_sum" : (query.calc_sum == "true" ? true : false)
	};	
};

// 
// field_names - array
//
function prepare_fields(query, field_names) {
	var ret_fields_ = {};
	field_names.forEach(function(field_name){
		if (query.hasOwnProperty(field_name)){
			ret_fields_[field_name] = query[field_name];
		}
	});

	return ret_fields_;
}

function prepare_conditions(req){
	var conditions = {
		source : prepare_fields(req.query, ["account_id","system_id"]),
		fields : prepare_fields(req.query, ["id","class_id","type","info","severity","timestamp","close_time","ack_id"])
	};
	["timestamp", "close_time"].forEach(function(key){
		if (conditions.fields.hasOwnProperty(key)){
			conditions.fields[key] = new Date(conditions.fields[key]);
		}
	});
	return conditions;
}

exports.getAlarms = function(req, cb) {
	var conditions = prepare_conditions(req);
	conditions.source.account_id = req.params.account_id;
	querier.getAlarms(conditions, prepare_options(req.query), cb);
};

exports.getAlarmHistory = function(req, cb) {
	var conditions = prepare_conditions(req);
	conditions.source.account_id = req.params.account_id;
	querier.getAlarmHistory(req.query.start, req.query.end, conditions, prepare_options(req.query), cb);
};

exports.deleteAlarmHistory = function(req, cb) {
	alarms.deleteAlarmHistory(req.params.account_id, req.query.start, req.query.end, cb);
};

exports.getCurrentAlarmSystems = function(req, cb) {
	querier.getCurrentAlarmSystems(req.params.account_id, prepare_options(req.query), cb);
};