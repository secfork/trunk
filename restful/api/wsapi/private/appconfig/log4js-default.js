module.exports = {
	"appenders" : [
		/*
		{
			"type" : "logLevelFilter",
			"level" : "DEBUG",			
			"appender" : {
				"type" : "console"
			}
		},
		*/
		{
			"type" : "logLevelFilter",
			"level" : "INFO",			
			"appender" : {
				"type" : "file",
				"filename" : "private/log/serv.log",
				"maxLogSize" : 1048576,
				"backups" : 10
			}
		}		
	]
};