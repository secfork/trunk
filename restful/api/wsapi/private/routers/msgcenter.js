var express = require('express')
	, services = require('../server/msgcenter')
	, initCommands = require('../../common/init_commands')
	, router = express.Router();

var commands = [
	{
		"method":"post",
		"res":"/account/:account_id/mailsetting",
		"op":{
			"exec":services.createMailsetting
		}
	},
	{
		"method":"get",
		"res":"/account/:account_id/mailsetting",
		"op":{
			"exec":services.getMailsetting
		}
	},
	{
		"method":"put",
		"res":"/account/:account_id/mailsetting",
		"op":{
			"exec":services.setMailsetting
		}
	},
	{
		"method":"delete",
		"res":"/account/:account_id/mailsetting",
		"op":{
			"exec":services.dropMailsetting
		}
	},
	{
		"method":"post",
		"res":"/account/:account_id/smssetting",
		"op":{
			"exec":services.createSmssetting
		}
	},
	{
		"method":"get",
		"res":"/account/:account_id/smssetting",
		"op":{
			"exec":services.getSmssetting
		}
	},
	{
		"method":"put",
		"res":"/account/:account_id/smssetting",
		"op":{
			"exec":services.setSmssetting
		}
	},
	{
		"method":"delete",
		"res":"/account/:account_id/smssetting",
		"op":{
			"exec":services.dropSmssetting
		}
	},
	{
		"method":"post",
		"res":"/msgcenter/services",
		"op":{
			"exec":services.createSupport
		}
	},
	{
		"method":"get",
		"res":"/msgcenter/services/:service_name",
		"op":{
			"exec":services.getSupport
		}
	},
	{
		"method":"put",
		"res":"/msgcenter/services/:service_name",
		"op":{
			"exec":services.setSupport
		}
	},
	{
		"method":"delete",
		"res":"/msgcenter/services/:service_name",
		"op":{
			"exec":services.dropSupport
		}
	},
	{
		"method":"get",
		"res":"/query/msgcenter/services",
		"op":{
			"exec":services.listSupports
		}
	},
	{
		"method":"post",
		"res":"/systems/:system_id/message/send",
		"op":{
			"exec":services.send
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