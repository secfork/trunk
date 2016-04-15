var dbconnection = require('./db/connection');

exports.createDbConnection = function(options) {
	// if (!options)
		// throw new Error("RDS connection options needed.");

	// return dbconnection.createConnection(options);
};

exports.closeDbConnection = function() {
	// var pool_ = dbconnection.getConnectionPool();
	// if (pool_){
		// pool_.end();
	// }
};

exports.setDbConnection = function(pool) {
	dbconnection.setConnectionPool(pool);
};


exports.Service = require('./lib/service');