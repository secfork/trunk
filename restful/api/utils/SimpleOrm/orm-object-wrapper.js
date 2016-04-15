var EventEmitter = require('events').EventEmitter
	, async = require('async');

//
// @orm - object of Orm
// @object_id_key - string, key name of obejct identify.
//
function OrmObjectWrapper(orm, object_id_key, dbhelper) {

	this.create = function(fields, cb) {
		dbhelper.execTransactionSeries(function(connection, commit, rollback){
			var session = orm.bind(connection);
			async.waterfall([
				function(callback){
					session.createObject(fields, function(err, results){
						callback(err, results);
					});
				},
				function(results, callback){
					commit(function(err){
						// 注意：这里返回的err为commit返回的err，所以需要需要调用err.code
						callback( err ? err.code : null, results);
					});
				}
			],
			function(err, results){
				if (err){
					rollback();
					cb && cb(err == "ER_DUP_ENTRY" ? "OBJECT_EXIST" : err);
				}
				else {
					cb && cb(null, results);	// results == id
				}			
			});
		});			
	};

	this.get = function(id, cb) {
		dbhelper.getConnection(function(err, connection){
			var session = orm.bind(connection);
			var object_id = {};
			object_id[object_id_key] = id;

			session.getObjects({"and":[{"=":object_id}]}, function(err, results){
				//
				// release connection
				//
				connection.release();

				if (err) {
					cb && cb(err, null);
				}
				else{
					results.length ? 
						cb && cb(null, results[0])
						: cb && cb("OBJECT_NOT_EXIST", null);
				}
			});
		});		
	}

	this.set = function(id, fields, cb) {
		dbhelper.execTransactionSeries(function(connection, commit, rollback){
			var session = orm.bind(connection);
			var object_id = {};
			object_id[object_id_key] = id;

			async.waterfall([
				function(callback){
					session.setObjects({"and":[{"=":object_id}]}, fields, function(err, results){
						callback(err, results);
					});
				},
				function(results, callback){
					commit(function(err){
						// 注意：这里返回的err为commit返回的err，所以需要需要调用err.code
						callback( err ? err.code : null, results);
					});
				}
			],
			function(err, results){
				if (err){
					rollback();
					cb && cb(err);
				}
				else {
					results > 0 ? cb && cb(null) : cb && cb("OBJECT_NOT_EXIST");
				}			
			});
		});			
	}

	this.drop = function(id, cb) {
		dbhelper.execTransactionSeries(function(connection, commit, rollback){
			var session = orm.bind(connection);
			var object_id = {};
			object_id[object_id_key] = id;
			var sel = {"and":[{"=":object_id}]};

			async.waterfall([
				function(callback){
					session.getObjectsForUpdate(sel, [object_id_key], function(err, results){
						if (err)
							callback(err);
						else if (!results.length) {
							callback("OBJECT_NOT_EXIST");
						}
						else{
							callback(null);
						}
					});
				},
				function(callback){
					session.deleteObjects(sel, function(err, results){
						callback(err, results);
					});
				},
				function(results, callback){
					commit(function(err){
						// 注意：这里返回的err为commit返回的err，所以需要需要调用err.code
						callback( err ? err.code : null, results);
					});
				}
			],
			function(err, results){
				if (err){
					rollback();
					cb && cb(err, null);
				}
				else{
					results > 0 ? cb && cb(null, results) : cb && cb("OBJECT_NOT_EXIST", null);
				}
			});
		});			
	}
}

module.exports = OrmObjectWrapper;

