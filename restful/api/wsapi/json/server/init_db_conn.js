var MongoClient = require('mongodb').MongoClient
	, Syalias = require('../../../syalias');

// 连接数据库
// NOTE: 
//		create connection must before all modules loading

// do connect to db.thinglinx
// var thinglinx_conn_pool_ = mysql.createPool(require('../db/thinglinx_db_conn'));

// do connect to db.alarm
// var alarm_conn_pool_ = mysql.createPool(require('../db/alarm_db_conn'));

// do connect ot db.tigasedb
// var tigasedb_conn_pool_ = mysql.createPool(require('../db/tigase_db_conn'));

// do connect to redis
// var live_redis_conn_ = redis.createClient(redis_connection_options.port,redis_connection_options.addr,{auth_pass:redis_connection_options.auth_pass});

// xmpp connection
// var xmpp_conn_ = Devlink.createXmppConnection(require('../appconfig/xmppconnectionoptions'));

// mongodb connection
var mongodb_db_ = MongoClient;

//////////////////////////////////////////////////////////////////
// set connections

// Authorization
// Auth.setDbConnection(thinglinx_conn_pool_);
// Auth.setRedisConnection(live_redis_conn_);

// Account
// Accounts.setDbConnection(thinglinx_conn_pool_);

// Model && Information
// Info.setDbConnection(thinglinx_conn_pool_);

// Alarm
// Alarm.setDbConnection(alarm_conn_pool_);

// Live Snapshot
// System values and status
// Live.setRedisConnection(live_redis_conn_);

//Devlink
// Devlink.setDbConnection(tigasedb_conn_pool_);

// Syalias
Syalias.setDbConnection(mongodb_db_)

/////////////////////////////////////////////////////////////
//
// get connections 
//
exports.getConnection = function(db){
	switch(db){
		// case "thinglinx":
			// return thinglinx_conn_pool_;
		// case "alarm":
			// return alarm_conn_pool_;
		// case "live":
			// return live_redis_conn_;
		// case "tigasedb":
			// return tigasedb_conn_pool_;
		// case "xmpp":
			// return xmpp_conn_;
		case "mongodb" : 
			return mongodb_db_;
		default:
			throw new Error("NO DB Connected");
	}
};

