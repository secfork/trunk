var Accounts = require('../../../../account');

// 连接数据库
// NOTE: 
//		create connection must before all beyonds.
Accounts.createDbConnection({
	"host" : "localhost",
	"user" : "root",
	"password" : "123456",
	"database" : "thinglinx",
	"connectionLimit" : 1,
	"multipleStatements" : true	
});

