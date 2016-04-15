var express = require('express')
	, services = require('../server/live')
	, initCommands = require('../../common/init_commands')
	, router = express.Router();

var commands = [
	{
		// append
		"method":"post",
		"res":"/systems/:system_id/write",
		"op":{
			"exec":services.append,
			"check":undefined,
			"auth" :undefined
		}
	},
	// GET METHODS
	{
		// GET SYSTEM'S LIVE DATA
		"method":"get",
		"res":"/systems/:system_id",
		"op":{
			"exec":services.getSystemAllValues
		}
	},
	{
		// GET SYSTEM'S LIVE DATA BY TAG
		"method":"get",
		"res":"/systems/:system_id/tags/:tag_name",
		"op":{
			"exec":services.getSystemValue
		}
	},
	{
		// GET SYSTEM'S LIVE DATA BY TAG 
		"method":"get",
		"res":"/systems/:system_id/tags",
		"op":{
			"exec":services.getSystemValues
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