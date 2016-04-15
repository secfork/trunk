var HisServ = require('../../../historian')
	, Topics = require('../../../common/topics')
	, escape_array = require('../../utils/escape_array');

// 连接数据库
// NOTE: 
//		create connection must before all beyonds.
var instance_ = new HisServ(require('../db/his_db_conn'));

var service_ = {};
var check_bind_action_ = true;

['post', 'get', 'put', 'delete'].forEach(function(action){
	exports[action] = function(req, cb){
		var op = req.params.op;
		var fn = service_[op];

		if (!fn){
			cb ("NOT_IMPLEMENT");
			return;
		}

		if (check_bind_action_ && fn.action !== req.method) {
			cb ("BAD_REQUEST_METHOD");
			return;
		}
		
		fn(req, cb);
	}
});

function escape_datetime(obj) {
	if (typeof obj === "undefined" || obj == null )
		return null;
	var tick = parseInt(obj);
	if (tick || tick === 0)
		return new Date(tick);
	else
		return null;
}

function bindAction(fn, action) {
	fn.action = action;
};

//
// CREATE A HISTORIAN SPACE
// 
service_.create = function (req, cb) {
	var topic = Topics.systemLogTopic(req.params.system_id);
	if (!topic) {
		cb ("BAD_REQUEST");
		return;
	}

	instance_.create(topic, function(err){
		var err_msg = err;
		if (err_msg == "TOPIC_EXIST")
			err_msg = "ER_SYSTEM_ALLREADY_SAVE_LOG";
		cb (err_msg);
	});
};
bindAction(service_.create, "POST");

//
// GET A HISTORIAN SPACE
// 
service_.get = function (req, cb) {
	var topic = Topics.systemLogTopic(req.params.system_id);
	if (!topic) {
		cb ("BAD_REQUEST");
		return;
	}

	instance_.get(topic, function(err, object){
		var err_msg = err;
		if (err_msg == "TOPIC_NOT_EXIST")
			err_msg = "ER_SYSTEM_NOT_SAVE_LOG";
		cb (err_msg, err ? null : object);
	});	
};
bindAction(service_.get, "GET");

//
// SET A HISTORIAN SPACE
// 
service_.set = function (req, cb) {
	var topic = Topics.systemLogTopic(req.params.system_id);
	if (!topic) {
		cb ("BAD_REQUEST");
		return;
	}

	instance_.set(topic, req.body, function(err, object){
		var err_msg = err;
		if (err_msg == "TOPIC_NOT_EXIST")
			err_msg = "ER_SYSTEM_NOT_SAVE_LOG";
		cb (err_msg);
	});
};
bindAction(service_.set, "SET");

//
// DROP A HISTORIAN SPACE
// 
service_.drop = function (req, cb) {
	var topic = Topics.systemLogTopic(req.params.system_id);
	if (!topic) {
		cb ("BAD_REQUEST");
		return;
	}		

	instance_.drop(topic, function(err, object){
		var err_msg = err;
		if (err_msg == "TOPIC_NOT_EXIST")
			err_msg = "ER_SYSTEM_NOT_SAVE_LOG";
		cb (err_msg);
	});
};
bindAction(service_.drop, "DELETE");

//
// INSERT LOG INTO HISTORIAN SPACE
// 
service_.insert = function (req, cb) {
	var topic = Topics.systemLogTopic(req.params.system_id);
	if (!topic) {
		cb ("BAD_REQUEST");
		return;
	}

	instance_.insert(topic, req.body, function(err, object){
		var err_msg = err;
		if (err_msg == "TOPIC_NOT_EXIST")
			err_msg = "ER_SYSTEM_NOT_SAVE_LOG";
		cb (err_msg);
	});
};
bindAction(service_.insert, "POST");

//
// READ RAW LOG DATA FROM HISTORIAN SPACE
// 
service_.readraw = function (req, cb) {
	var topic = Topics.systemLogTopic(req.params.system_id);
	if (!topic) {
		cb ("BAD_REQUEST");
		return;
	}

	var tag_ids_ = escape_array(req.query.id);
	var start_ = escape_datetime(req.query.start);
	var end_ = escape_datetime(req.query.end);

	if (!start_ || 
		!tag_ids_ || !tag_ids_.length){
		cb ("BAD_REQUEST");
		return;
	}

	var options_ = {
		limit : req.query.limit ? parseInt(req.query.limit) : null,
		timestamp : req.query.timestamp,
		bound : req.query.bound == "true" ? true : false
	};	

	instance_.readRaw(topic, tag_ids_, start_, end_, options_, function(err, results){
		var err_msg = err;
		if (err_msg == "TOPIC_NOT_EXIST")
			err_msg = "ER_SYSTEM_NOT_SAVE_LOG";

		cb (err_msg, err ? null : results);
	});
};
bindAction(service_.readraw, "GET");

//
// READ INTERVAL
// 
service_.readinterval = function (req, cb) {
	var topic = Topics.systemLogTopic(req.params.system_id);
	if (!topic) {
		cb ("BAD_REQUEST");
		return;
	}

	var tag_ids_ = escape_array(req.query.id);	// tag_ids
	var start_ = escape_datetime(req.query.start);
	var end_ = escape_datetime(req.query.end);

	var count_ = parseInt(req.query.count);	
	if (!start_ || !tag_ids_ || !tag_ids_.length || !count_) { 
		cb ("BAD_REQUEST");
		return;
	}

	var options_ = {
		timestamp : req.query.timestamp,
		mode : req.query.mode
	};		

	instance_.readInterval(topic, tag_ids_, start_, end_, count_, options_, function(err, results){
		var err_msg = err;
		if (err_msg == "TOPIC_NOT_EXIST")
			err_msg = "ER_SYSTEM_NOT_SAVE_LOG";

		cb (err_msg, err ? null : results);		
	});
}
bindAction(service_.readinterval, "GET");

//
// READ AT TIME
// 
service_.readattime = function (req, cb) {
	var topic = Topics.systemLogTopic(req.params.system_id);
	if (!topic) {
		cb ("BAD_REQUEST");
		return;
	}

	var tag_ids_ = escape_array(req.query.id);		// tag_ids
	var time_series_ = escape_array(req.query.t);	// timeseries
	if (!tag_ids_ || !tag_ids_.length ||
		!time_series_ || !time_series_.length) { 
		cb ("BAD_REQUEST");
		return;
	}

	var time_obj_series_ = toTimeObjs(time_series_);
	var options_ = {
		timestamp : req.query.timestamp,
		mode : req.query.mode
	};		

	instance_.readAtTime(topic, tag_ids_, time_obj_series_, options_, function(err, results){
		var err_msg = err;
		if (err_msg == "TOPIC_NOT_EXIST")
			err_msg = "ER_SYSTEM_NOT_SAVE_LOG";

		cb (err_msg, err ? null : results);		
	});
}
bindAction(service_.readattime, "GET");

function toTimeObjs(timeseries) {
	var ret = [];
	timeseries.forEach(function(tick){
		ret.push(new Date(parseInt(tick)));
	});

	return ret;	
}

service_.readaggregation = function(req, cb) {
	var topic = Topics.systemLogTopic(req.params.system_id);
	if (!topic) {
		cb ("BAD_REQUEST");
		return;
	}

	var tag_ids_ = escape_array(req.query.id);	// tag_ids
	var start_ = escape_datetime(req.query.start);
	var end_ = escape_datetime(req.query.end);
	if (!start_ || 
		!tag_ids_ || !tag_ids_.length){
		cb ("BAD_REQUEST");
		return;
	}
	
	var stats_	= escape_array(req.query.stats);	// aggeration
	var options_ = {
		timestamp : req.query.timestamp,
		interval : req.query.interval,
		aggregation : stats_.length ? stats_ : null,
		period : req.query.period,
		section : req.query.section
	};

	instance_.readAggregation(topic, tag_ids_, start_, end_, options_, function(err, results){
		var err_msg = err;
		if (err_msg == "TOPIC_NOT_EXIST")
			err_msg = "ER_SYSTEM_NOT_SAVE_LOG";

		cb (err_msg, err ? null : results);			
	});
}
bindAction(service_.readaggregation, "GET");

