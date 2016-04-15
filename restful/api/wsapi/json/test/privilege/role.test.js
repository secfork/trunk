require("../config/account_init");
var assert = require('assert');
var request = require('request');
var base = require('../config/baseUrl');
var auth_url = base+"/v2/json/auth/user";
var base_url = base+"/v2/json/roles";
var query_url = base+"/v2/json/query/roles";
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


var role_1 = {
	"name":"role_test" + Date.now().valueOf(),
	"role_category":0
};
var role_2 = {
	"name":"role_" + Date.now().valueOf(),
	"role_category":1
};

describe("Create account "+account_1.name, function(){
	it("should create account without error", function(done){
		accounts.create(account_1, function(err, account_id){
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


describe("create role "+role_1.name, function(){
	it("should create role without error", function(done){
		request.post({
			url:base_url+"?accesskey="+accessKey,
			json:role_1,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			role_1.id = verifyData(body).ret;
			done();
		});
	});
});

describe("create role "+role_2.name, function(){
	it("should create role without error", function(done){
		request.post({
			url:base_url+"?accesskey="+accessKey,
			json:role_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			role_2.id = verifyData(body).ret;
			done();
		});
	});
});

describe("get role "+role_1.name, function(){
	it("should get role without error", function(done){
		request.get({
			url:base_url+"/"+role_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("modify role "+role_2.name, function(){
	it("should modify role without error", function(done){
		role_2.desc = "test for set role_2";
		request.put({
			url:base_url+"/"+role_2.id+"?accesskey="+accessKey,
			json:role_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("get role by name "+role_2.name, function(){
	it("should get role without error", function(done){
		request.get({
			url:base_url+"?accesskey="+accessKey+"&name="+role_2.name,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("query role ", function(){
	it("should query role without error", function(done){
		request.get({
			url:query_url+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("delete role "+role_1.name, function(){
	it("should delete role without error", function(done){
		request.del({
			url:base_url+"/"+role_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("delete role "+role_2.name, function(){
	it("should delete role without error", function(done){
		request.del({
			url:base_url+"/"+role_2.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("Delete account", function(){
	it("should without error delete account", function(done){
		accounts.drop(account_1.id, function(err){
			assert.equal(null, err);
			done();
		});
	});
});

