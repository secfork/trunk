require("../config/account_init");
var assert = require('assert');
var request = require('request');
var base = require('../config/baseUrl');
var auth_url = base+"/v2/json/auth/user";
var base_url = base+"/v2/json/users";
var query_url = base+"/v2/json/query/users";
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
var user_1 = {
	"username":"user_test"+ Date.now().valueOf() ,
	"password":"xxxxx1",
	"is_super_user":1
};
var user_2 = {
	"username":"user_2_" + Date.now().valueOf(),
	"password":"xxxxx2"
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

describe("create user "+user_1.username, function(){
	it("should create user without error", function(done){
		request.post({
			url:base_url+"?accesskey="+accessKey,
			json:user_1,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			user_1.id = verifyData(body).ret;
			done();
		});
	});
});

describe("create user "+user_2.username, function(){
	it("should create user without error", function(done){
		request.post({
			url:base_url+"?accesskey="+accessKey,
			json:user_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			user_2.id = verifyData(body).ret;
			done();
		});
	});
});

describe("get user "+user_1.username, function(){
	it("should get user without error", function(done){
		request.get({
			url:base_url+"/"+user_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("modify user "+user_2.username, function(){
	it("should modify user without error", function(done){
		user_2.desc = "test for set user_2";
		request.put({
			url:base_url+"/"+user_2.id+"?accesskey="+accessKey,
			json:user_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("get user by username "+user_2.username, function(){
	it("should get user without error", function(done){
		request.get({
			url:base_url+"?accesskey="+accessKey+"&name="+user_2.username,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("query user ", function(){
	it("should query user without error", function(done){
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

describe("delete user "+user_1.name, function(){
	it("should delete user without error", function(done){
		request.del({
			url:base_url+"/"+user_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("delete user "+user_2.name, function(){
	it("should delete user without error", function(done){
		request.del({
			url:base_url+"/"+user_2.id+"?accesskey="+accessKey,
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