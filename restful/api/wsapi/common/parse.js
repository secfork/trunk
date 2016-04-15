
// 
// op - operation command name, string
// message为Buffer对象
// callback的形式为(err, commands)，commands为command queue
// 
exports.parse = function(op, message, callback){
	// TODO
	var error=null;
	var cmd_struct = {};
	try{
		cmd_struct.param = JSON.parse(message);
		cmd_struct.op = op;

		// TODO
		// Validate parameters here
		// 这里只是简单的校验
		if ((typeof cmd_struct.op !== 'string') || (typeof cmd_struct.param === 'undefined')){
			error = 'BAD REQUEST';
		}
	}
	catch(err){
		error = 'BAD_REQUEST';
	}

	if(typeof callback === 'function'){
		setImmediate(function(){
			callback(error, cmd_struct);
		});
	}
};

//
// callback(message), message - string
//
exports.encodeReply = function(err, ret, callback) {
	setImmediate(function(){
		callback(JSON.stringify({
			'err' : err,
			'ret' : ret
		}));
	});
};

//
// message - string
// callback(err, ret)
//
exports.parseReply = function(message, callback) {
	setImmediate(function(){
		try{
			var reply = JSON.parse(message);
		}
		catch(err){
			callback("PARSE_REPLY_MESSAGE_ERROR", null);
			return;
		}

		if (typeof reply.err === 'undefined' || typeof reply.ret === 'undefined'){
			callback && callback(message, null);
		}
		else{
			callback && callback(reply.err, reply.ret);
		}

	});
};