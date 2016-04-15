var   Info = require('../../../model_info')
	, tokens = require('../../../authorization').tokens
	, escape_array = require('../../utils/escape_array')
	, prepare_options = require('../../utils/prepare_options');

//连接数据库
Info.createDbConnection(require('../db/thinglinx_db_conn'));

var  	assignDaserver = Info.AssignDaserver 
	, systems = Info.Systems
	, updates = Info.Updates;


//assign daserver
exports.assignDaserver = function (req,cb) {
	assignDaserver.assignDaserver(req.params.system_id,cb);
}

//get need update systems
exports.updatingSystems = function(req,cb){
	var ids = [];
	if(Array.isArray(req.query.id))
		ids = req.query.id;
	else
		ids.push(req.query.id);
	updates.updatingSystems(ids,cb);
}

//根据id和name对system进行模糊查询
exports.fuzzyFindSystems  = function(req,cb){
	var account_id = req.query.account_id;
	var options = prepare_options(req.query);
	var cond = {"uuid":req.query.uuid,"name":req.query.name};
	systems.fuzzyFind(account_id,cond,options,cb);
}

//GET SYSTEM BY ID 
exports.getSystem = function(req,cb){
	var options = {
		"extend_model" : req.query.extend_model ? (req.query.extend_model === "true" ? true : false) : false,
		"extend_devices": req.query.extend_devices ? (req.query.extend_devices === "true" ? true : false) : false,
		"extend_profile" : req.query.extend_profile ? (req.query.extend_profile === "true" ? true : false) : false,
		"mini":req.query.mini ? (req.query.mini === "true" ? true : false) : false,
		"include_tags":req.query.include_tags ? (req.query.include_tags === "true" ? true : false) : false
	};
	systems.get(req.params.system_id,options , cb);
}

//GET MINI SYSTEM BY ID 
exports.getFormatSystem = function(req,cb){
	var options = {
		"extend_devices": req.query.extend_devices ? (req.query.extend_devices === "true" ? true : false) : false,
		"extend_profile" : req.query.extend_profile ? (req.query.extend_profile === "true" ? true : false) : false,
		"mini":req.query.mini ? (req.query.mini === "true" ? true : false) : false,
		"include_tags":req.query.include_tags ? (req.query.include_tags === "true" ? true : false) : false
	};
	systems.getFormatSystem(req.params.system_id,options , cb);
}

//READ SYSTEM'S STATES 
exports.getSystemStates = function(req, cb) {
	var ids = escape_array(req.query.id);
	systems.getSystemsStates(ids ,function(err,ret){
		if(err){
			cb(err);
		}else{
			cb(null, ret);
		}
	});
};