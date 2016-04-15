var express = require('express')
	, services = require('../server/info')
	, initCommands = require('../../common/init_commands')
	, router = express.Router();


var commands = [
	{
		// GET SYSTEM BY SYSTEM_ID 
		"method":"get",
		"res":"/systems/:system_id",
		"op":{
			"exec":services.getSystem ,
			"check":undefined,
			"auth" :undefined
		}
	},
	{
		// GET FORMAT SYSTEM BY SYSTEM_ID 
		"method":"get",
		"res":"/systems/:system_id/format",
		"op":{
			"exec":services.getFormatSystem,
			"check":undefined,
			"auth" :undefined
		}
	},
	{
			// READ SYSTEM STATES BY SYSTEM_ID 
			"method":"get",
			"res":"/states/systems",
			"op":{
				"exec":services.getSystemStates ,
				"check":undefined,
				"auth" :undefined
			}
	},
	{ // assign daserver to system
		"method":"put",
		"res":"/systems/:system_id/assign",
		"op":{
			"exec":services.assignDaserver
		}
	},
	{ // get updating system
		"method":"get",
		"res":"/needupdate/systems",
		"op":{
			"exec":services.updatingSystems
		}
	},
	//query system by uuid or name
	{
		"method":"get",
		"res":"/query/systems",
		"op":{
			"exec":services.fuzzyFindSystems
		}

	}	
];
/**********************************************
 *                                            *
 *      Initialize server commands            *
 *                                            *
 **********************************************/

initCommands(router, commands);
module.exports = router;