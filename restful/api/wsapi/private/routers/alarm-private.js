var express = require('express')
	, services = require('../server/alarm')
	, initCommands = require('../../common/init_commands')
	, router = express.Router();

var commands = [

	///////////////////////////////////////////////////////////
	// ALARM SPACE

	{ // CREATE SPACE	
		"method":"post",
		"res":"/account/:account_id/create",
		"op":{
			"exec":services.createSpace
		}
	},
	{ // GET SPACE BY ACCOUNT ID		
		"method":"get",
		"res":"/account/:account_id/get",
		"op":{
			"exec":services.getSpace
		}
	},
	{ // SET SPACE BY ACCOUNT ID
		"method":"put",
		"res":"/account/:account_id/set",
		"op":{
			"exec":services.setSpace
		}
	},
	{ // DROP SPACE BY ACCOUT ID
		"method":"delete",
		"res":"/account/:account_id/drop",
		"op":{
			"exec":services.dropSpace
		}
	},
	{ // GET ALARM CLASSES
		"method":"get",
		"res":"/account/:account_id/getclasses",
		"op":{
			"exec":services.getClasses
		}
	},
	{ // SET ALARM CLASS
		"method":"put",
		"res":"/account/:account_id/setclass",
		"op":{
			"exec":services.setClass
		}
	},
	{ // GET ALARM SEVERITIES
		"method":"get",
		"res":"/getseverity",
		"op":{
			"exec":services.getSeverity
		}
	},

	///////////////////////////////////////////////////////////
	// ALARMS

	{ // CREATE AN NEW ALARM
		"method":"post",
		"res":"/account/:account_id/newalarm",
		"op":{
			"exec":services.createAlarm
		}
	},

	{ // CLOSE ALARM 
		"method":"put",
		"res":"/account/:account_id/closealarm",
		"op":{
			"exec":services.closeAlarm
		}
	},
	{ // CLEAR ALARM
		"method":"put",
		"res":"/account/:account_id/clearalarm",
		"op":{
			"exec":services.clearAlarm
		}
	},
	{ // ACKNOWLEDGE ALARM / AND CLOSE IT
		"method":"put",
		"res":"/account/:account_id/ackalarm",
		"op":{
			"exec":services.ackAlarm
		}
	},
	{ // GET ACK MESSAGE
		"method":"get",
		"res":"/acks/:ack_id",
		"op":{
			"exec":services.getAckMessage
		}
	},

	///////////////////////////////////////////////////////
	// ALARM QUERY

	{ // GET CURRENTLY ALARMS
		"method":"get",
		"res":"/account/:account_id/getalarms",
		"op":{
			"exec":services.getAlarms
		}
	},
	{ // GET ALARM HISTORY
		"method":"get",
		"res":"/account/:account_id/getalarmhistory",
		"op":{
			"exec":services.getAlarmHistory
		}
	},
	{ // GET ALARM SYSTEMS
		"method":"get",
		"res":"/account/:account_id/getalarmsystems",
		"op":{
			"exec":services.getCurrentAlarmSystems
		}
	},

	///////////////////////////////////////////////////////
	// ALARM DELETE
	{ // DELETE ALARM HISTORY
		"method":"get",
		"res":"/account/:account_id/deletealarms",
		"op":{
			"exec":services.deleteAlarmHistory
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