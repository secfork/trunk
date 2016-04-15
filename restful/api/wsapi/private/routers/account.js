var express = require('express')
	, services = require('../server/account')
	, initCommands = require('../../common/init_commands')
	, router = express.Router();


var commands = [
	{ 
		"method":"post",
		"res":"/accounts",
		"op":{
			"exec":services.createAccount
		}
	},
	{ 
		"method":"get",
		"res":"/accounts/:account_id",
		"op":{
			"exec":services.getAccount
		}
	},
	{
		"method":"put",
		"res":"/accounts/:account_id",
		"op":{
			"exec":services.setAccount
		}

	},
	{
		"method":"delete",
		"res":"/accounts/:account_id",
		"op":{
			"exec":services.dropAccount
		}

	},
	{
		"method":"get",
		"res":"/query/accounts",
		"op":{
			"exec":services.listAccounts
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