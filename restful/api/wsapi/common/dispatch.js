var parser_ = require('./parse')
	, async = require('async');

// 
// 分配消息处理器
// @req - 请求对象
// @res - 返回对象
// @op - 操作结构，包括：
//		auth - function，用于验证权限的函数。
//				函数原型（req, callback)，callback原型(is_authed)
//		check - function，用于验证输入参数的函数。
//				函数原型（req, callback)，callback原型(is_checked)
//		exec - function，用于执行命令的函数。
//				函数原型（req, callback)，callback原型(err, ret)
//

module.exports = function(req, res, op) {
	if (!op || typeof op !== "object"){
		sendResponse(res, "NOT_IMPLEMENT", null);
		return;
	}

	async.waterfall([
		// authority
		function(callback){
			if (!op.auth){ // if op.auth has no implement, we just go on.
				callback(null);
				return;
			}

			setImmediate(function(){
				op.auth(req, function(authed){
					if (!(authed==true))
						callback("ER_AUTH_FAILURE");
					else
						callback(null);
				});
			});
		},

		// check invalid params
		function(callback){
			if (!op.check){ // if op.check has no implement, we just go on.
				callback(null);
				return;
			}
			setImmediate(function(){
				op.check(req, function(is_checked){
					if (!is_checked)
						callback("BAD_REQUEST_PARAMS");
					else
						callback(null);
				});
			});
		},

		// do command
		function(callback){
			if (!op.exec){ // if op.exec has no implement, there is something wrong!
				callback("COMMAND_NOT_EXIST");
				return;
			}

			setImmediate(function(){
				op.exec(req, function(err, ret){
					callback(err, ret);
				});
			});
		}
	],

	// finally
	function(err, results){
		if (err)
			var ret = null;
		else
			var ret = (typeof results === "undefined") ? null : results;

		// send back to client
		sendResponse(res, (err ? err : null), ret);
	});
}

function sendResponse (res, err, ret) {
	parser_.encodeReply(err, ret, function(reply){
		res.set('Content-Type', 'application/json');
		res.send(reply);
	});
}