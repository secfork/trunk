var dispatch = require('./dispatch');

module.exports = function(router, commands) {
	commands.forEach(function(cmd){
		router[cmd.method] (
			cmd.res, 
			function(request, response){
				dispatch(request, response, cmd.op);
			}
		);
	});	
};