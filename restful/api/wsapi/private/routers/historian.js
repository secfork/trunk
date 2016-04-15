var express = require('express')
	, services = require('../server/historian')
	, initCommands = require('../../common/init_commands')
	, router = express.Router();

var commands = [
	{
		// ALL POST METHODS
		"method":"post",
		"res":"/systems/:system_id/:op",
		"op":{
			"exec":services.post
		}
	},
	{
		// ALL GET METHODS
		"method":"get",
		"res":"/systems/:system_id/:op",
		"op":{
			"exec":services.get
		}
	},
	{
		// ALL SET METHODS
		"method":"put",
		"res":"/systems/:system_id/:op",
		"op":{
			"exec":services.put
		}
	},
	{
		// ALL DELETE METHODS
		"method":"delete",
		"res":"/systems/:system_id/:op",
		"op":{
			"exec":services.delete
		}
	}
];

/**********************************************
 *                                            *
 *      Initialize server commands            *
 *                                            *
 *********************************************/

initCommands(router, commands);
module.exports = router;
