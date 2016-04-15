require("../config/account_init");
var assert = require('assert');
var request = require('request');
var base = require('../config/baseUrl');
var auth_url = base+"/v2/json/auth/user";
var Accounts = require('../../../../account');
var accounts = Accounts.Accounts;
var qs = require('querystring');
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
			//console.log(accessKey);
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
	name : "system_" + Date.now().valueOf()
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
// Testing code for boxes
//

var box_sn = "SN:/" + Date.now().valueOf();
var box_ticket;

// bind box to system
describe("binding box to system", function(){
	it("should without error", function(done){
		var info = {
			"sn" : box_sn,
			"privilege" : ["READ_DATA", "WRITE_DATA"]
		};

		request.post({
			url:base +"/v2/json/systems/"+new_system.uuid+"/bind?accesskey="+accessKey,
			json:info,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			box_ticket = verifyData(body).ret;
			done();
		});
	});
});

// get bound box info by system id
describe("get binding information", function(){
	it("should without error", function(done){
		request.get({
			url:base +"/v2/json/systems/"+new_system.uuid+"/bind?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			assert.equal(box_ticket, verifyData(body).ret.ticket);
			assert.equal(box_sn, verifyData(body).ret.sn);
			//console.log(body)
			done();
		});
	});
});

// get bound box info by sn
describe("get binding information by s/n", function(){
	it("should without error", function(done){
		request.get({
			url:base +"/v2/json/boxes/"+qs.escape(box_sn)+"/bind?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			assert.equal(box_ticket, verifyData(body).ret.ticket);
			assert.equal(new_system.uuid, verifyData(body).ret.system_id);
			//console.log(body)
			done();
		});
	});
});

// unbind box 
describe("unbind box", function(){
	it("should without error", function(done){
		request.post({
			url:base +"/v2/json/systems/"+new_system.uuid+"/unbind?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(null, err);
			done();
		});
	});
});

// get bound box info by system id
describe("get binding information", function(){
	it("should return ER_SYSTEM_HAS_NOT_BOUND", function(done){
		request.get({
			url:base +"/v2/json/systems/"+new_system.uuid+"/bind?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res, body){
			assert.equal(true, err == "ER_SYSTEM_HAS_NOT_BOUND" || err == null );
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