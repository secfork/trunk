require("../config/account_init");
var assert = require('assert');
var request = require('request');
var base = require('../config/baseUrl');
var auth_url = base+"/v2/json/auth/user";
var Accounts = require('../../../../account');
var accounts = Accounts.Accounts;
var accessKey;

function verifyData(all) {
	var body;
	if(typeof all =='string'){
		body = JSON.parse(all);
	}
	if(typeof all =='object')
		body = all;
	//console.log(body);
	assert.equal(null, body.err);
	return body;
}
var account_1 = {
	"name":"company_name_1_" + Date.now().valueOf(),
	"admin":{
		"username":"admin_1_"+ Date.now().valueOf(),
		"password":"123456"
	}
};
var user = {
	  "account":account_1.name,
	  "username":account_1.admin.username,
	  "password":account_1.admin.password
};

describe("Create account "+account_1.name, function(){
	it("should create account without error", function(done){
		accounts.create(account_1, function(err, account_id){
			//console.log("err:%s,result:%s",err,account_id);
			assert.equal(null, err);
			assert.equal(false, !account_id);
			account_1.id = account_id;
			done();
		});
	});
});

describe("get accessKey ", function(){
	it("should get accessKey without error", function(done){
		request.post({
			url:auth_url,
			json:user,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			accessKey = verifyData(body).ret.accessKey;
			done();
		});
	});
});

//////////////////////////////////////////////////////////////////////////////////////

var new_sys_model = {
	name : "system_model_" + Date.now().valueOf(),
	mode : 1	// Managed 
};

var new_system = {
	name : "system_" + Date.now().valueOf(),
	sn : "sn:"+Date.now().valueOf()
};

// create system model
describe("create system model", function(){
	it("should without error", function(done){
		new_sys_model.account_id = account_1.id;

		request.post({
			url:base +"/v2/json/sysmodels?accesskey="+accessKey,
			json:new_sys_model,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			new_sys_model.uuid = verifyData(body).ret;
			done();
		});
	});
});

// create system
describe("create system", function(){
	it("should without error", function(done){
		new_system.account_id = account_1.id;
		new_system.model = new_sys_model.uuid;

		request.post({
			url:base +"/v2/json/systems?accesskey="+accessKey,
			json:new_system,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null, err);
			new_system.uuid = verifyData(body).ret;
			done();
		});
	});
});

/////////////////////////////////////////////////////////////////////////////////
//
// Testing code for tickets
//

var ticket_1, ticket_2, ticket_3;

// assign ticket to system
describe("assign ticket_1 to system", function(){
	it("should without error", function(done){
		var fields = {
			"system_id" : new_system.uuid,
			"privilege" : ["READ_DATA", "WRITE_DATA"]
		};

		request.post({
			url:base +"/v2/json/systems/"+new_system.uuid+"/tickets?accesskey="+accessKey,
			json:fields,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			assert.equal(null, verifyData(body).err);
			ticket_1 = verifyData(body).ret;
			//console.log(ticket_1);
			done();
		});
	});
});

// assign ticket to system
describe("assign ticket_2 to system", function(){
	it("should without error", function(done){
		var fields = {
			"system_id" : new_system.uuid,
			"privilege" : ["READ_DATA", "NOT_EXISTS"],
			"expire" : 100
		};

		request.post({
			url:base +"/v2/json/systems/"+new_system.uuid+"/tickets?accesskey="+accessKey,
			json:fields,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			assert.equal(null, verifyData(body).err);
			ticket_2 = verifyData(body).ret;
			//console.log(ticket_2);
			done();
		});
	});
});

// assign ticket to system
describe("assign ticket_3 to system", function(){
	it("should without error", function(done){
		var fields = {
			"system_id" : new_system.uuid,
			// "privilege" : ["READ_DATA", "NOT_EXISTS"],
			// "expire" : 100
		};

		request.post({
			url:base +"/v2/json/systems/"+new_system.uuid+"/tickets?accesskey="+accessKey,
			json:fields,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			assert.equal(null, verifyData(body).err);
			ticket_3 = verifyData(body).ret;
			//console.log(ticket_3);
			done();
		});
	});
});

// auth ticket 
var ak_for_auth_ticket;
describe("auth ticket", function(){
	it("should without error", function(done){
		var fields = {
			"ticket" : ticket_1
		};
		request.post({
			url:base +"/v2/json/auth/ticket",
			json:fields,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			assert.equal(null, verifyData(body).err);
			assert.equal(false, !body.ret.accesskey);
			assert.equal(false, !body.ret.expires);

			ak_for_auth_ticket = body.ret.accesskey;
			//console.dir(body);
			done();
		});
	});
});

// auth ticket 
describe("auth ticket", function(){
	it("should return ER_AUTH_FAILURE", function(done){
		var fields = {
			"ticket" : "NOT_EXISTS"
		};
		request.post({
			url:base +"/v2/json/auth/ticket",
			json:fields,
			rejectUnauthorized: false
		},function(err, res, body){
			assert.equal(null, err);
			assert.equal("ER_AUTH_FAILURE", body.err);
			//console.dir(body);
			done();
		});
	});
});

// get tickets of system
describe("get tickets of system", function(){
	it("should without error", function(done){
		request.get({
			url:base +"/v2/json/systems/"+new_system.uuid+"/tickets?accesskey="+ak_for_auth_ticket,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			assert.equal(null, verifyData(body).err);
			assert.equal(3, verifyData(body).ret.length);
			//console.dir(verifyData(body).ret);
			done();
		});
	});
});

// delete ticket to system
describe("delete ticket_3 of system", function(){
	it("should without error", function(done) {
		var fields = {
			"ticket" : ticket_3
		};

		request.del({
			url:base +"/v2/json/systems/"+new_system.uuid+"/tickets?accesskey="+accessKey,
			json:fields,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			assert.equal(null, verifyData(body).err);
			done();
		});
	});
});

// delete ticket to system
describe("delete ticket_1 of system", function(){
	it("should without error", function(done) {
		var fields = {
			"ticket" : ticket_1
		};

		request.del({
			url:base +"/v2/json/systems/"+new_system.uuid+"/tickets?accesskey="+accessKey,
			json:fields,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			assert.equal(null, verifyData(body).err);
			done();
		});
	});
});

// auth ticket 
describe("auth ticket", function(){
	it("should return ER_AUTH_FAILURE", function(done){
		var fields = {
			"ticket" : ticket_1
		};
		request.post({
			url:base +"/v2/json/auth/ticket",
			json:fields,
			rejectUnauthorized: false
		},function(err, res, body){
			assert.equal(null, err);
			assert.equal("ER_AUTH_FAILURE", body.err);
			//console.dir(body);
			done();
		});
	});
});

////////////////////////////////////////////////////////////////////////////////

// delete system
describe("delete system", function(){
	it("should without error", function(done){
		request.del({
			url:base +"/v2/json/systems/"+new_system.uuid+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null, err);
			assert.equal(null, verifyData(body).err);
			done();
		});
	});
});

// delete system model
describe("delete system model", function(){
	it("should without error", function(done){
		request.del({
			url:base +"/v2/json/sysmodels/"+new_sys_model.uuid+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null, err);
			assert.equal(null, verifyData(body).err);
			done();
		});
	});
});

/////////////////////////////////////////////////////////////////////////////////////

describe("Delete account", function(){
	it("should without error delete account", function(done){
		accounts.drop(account_1.id, function(err){
			assert.equal(null, err);
			done();
		});
	});
});