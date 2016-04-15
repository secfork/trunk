require("../config/account_init");
var assert = require('assert');
var request = require('request');
var base = require('../config/baseUrl');
var auth_url = base+"/v2/json/auth/user";
var base_url = base+"/v2/json/regions";
var query_url = base+"/v2/json/query/regions";
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
	//console.log(body);
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


var region_1 = {
	"name":"region_test" + Date.now().valueOf()
};
var region_2 = {
	"name":"region_" + Date.now().valueOf()
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

describe("create region "+region_1.name, function(){
	it("should create region without error", function(done){
		request.post({
			url:base_url+"?accesskey="+accessKey,
			json:region_1,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			region_1.id = verifyData(body).ret;
			done();
		});
	});
});

describe("create region "+region_2.name, function(){
	it("should create region without error", function(done){
		request.post({
			url:base_url+"?accesskey="+accessKey,
			json:region_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			region_2.id = verifyData(body).ret;
			done();
		});
	});
});

describe("get region "+region_1.name, function(){
	it("should get region without error", function(done){
		request.get({
			url:base_url+"/"+region_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("modify region "+region_2.name, function(){
	it("should modify region without error", function(done){
		region_2.desc = "test for set region_2";
		request.put({
			url:base_url+"/"+region_2.id+"?accesskey="+accessKey,
			json:region_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("get region by name "+region_2.name, function(){
	it("should get region without error", function(done){
		request.get({
			url:base_url+"?accesskey="+accessKey+"&name="+region_2.name,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("query region ", function(){
	it("should query region without error", function(done){
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

describe("delete region "+region_1.name, function(){
	it("should delete region without error", function(done){
		request.del({
			url:base_url+"/"+region_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("delete region "+region_2.name, function(){
	it("should delete region without error", function(done){
		request.del({
			url:base_url+"/"+region_2.id+"?accesskey="+accessKey,
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



