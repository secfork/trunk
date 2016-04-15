var Live = require('../../../live')
	, redisConnectOptions = require('../db/live_redis_conn')
	, escape_array = require('../../utils/escape_array');
	
Live.createRedisConnection(redisConnectOptions);
var sp_shot = Live.SystemValues;

exports.getSystemAllValues = function(req, cb) {
	sp_shot.getSystemAllValues(req.params.system_id, cb);
};

exports.getSystemValue = function(req, cb) {
	sp_shot.getSystemValue(req.params.system_id, req.params.tag_name, cb);
};

exports.getSystemValues = function(req, cb) {
	var ids = escape_array(req.query.tag);
	if (!ids.length)
		sp_shot.getSystemValues(req.params.system_id, cb);
	else
		sp_shot.getSystemValues(req.params.system_id, ids, cb);
};
 	
// 
// Initialize Stream API
//
var StreamAPI = require('../../../stream').StreamAPI
 	, os = require('os')
    , ioUrl = require('../appconfig/stream-client-iourl.js');

var stream = new StreamAPI(ioUrl);

exports.append = function(req, cb) {
	var system_id = req.params.system_id
	var fields = req.body;
	fields['sender'] = os.hostname();
	var topic = system_id+'.real';
	var event_class = 'athena.real';
	stream.write(topic, event_class, fields);
	cb();
}
