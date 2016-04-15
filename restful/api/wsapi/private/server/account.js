var   Accounts = require('../../../account')
	, escape_array = require('../../utils/escape_array')
	, prepare_options = require('../../utils/prepare_options')
	, prepare_fields = require('../../utils/prepare_fields')
	, prepare_conds = require('../../utils/prepare_conds');

//连接数据库
Accounts.createDbConnection(require('../db/thinglinx_db_conn'));

var  accounts = Accounts.Accounts
	,users = Accounts.Users;
	

//create account 
exports.createAccount = function(req, cb) {
	accounts.create(req.body,cb);
};

//get account by id 
exports.getAccount =  function(req,cb){
	accounts.get(req.params.account_id,cb);
}

//modify account by id 
exports.setAccount = function(req,cb){
	accounts.set(req.params.account_id,req.body,cb);
}

//drop account by id 
exports.dropAccount = function(req,cb){
	accounts.drop(req.params.account_id,cb);
}

//query account 
exports.listAccounts = function(req,cb){
	var options = prepare_options(req.query);
	var cond = prepare_conds(req.query);
	accounts.find(cond,options,cb);

}
