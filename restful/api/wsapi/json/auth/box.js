var   API_PRIVILEGE = require('./api_privilege')
	, privileges = require('../../../privilege')
	, auth = require('./auth');

exports.bindBoxToSystem = function (req, cb){
	var token = req.scopes.access_token;
	return cb(true);
	
};

exports.getBoundBoxInfo = function (req, cb){
	return cb(true);
};

exports.getBoundBoxInfoBySn = function (req, cb){
	var token = req.scopes.access_token;
	return cb(true);
	
};

exports.unbindBoxToSystem = function (req, cb){
	var token = req.scopes.access_token;
	return cb(true);
	
};
