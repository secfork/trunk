require("../config/account_init");
var assert = require('assert');
var request = require('request');
var base = require('../config/baseUrl');
var auth_url = base+"/v2/json/auth/user";
var region_url = base+"/v2/json/regions";
var user_url = base+"/v2/json/users";
var group_url = base+"/v2/json/groups";
var privilege_url = base+"/v2/json/permission/groups";

var accessKey;

var Accounts = require('../../../../account');
var accounts = Accounts.Accounts
	users = Accounts.Users;

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
	"name":"company_name_" + Date.now().valueOf(),
	"admin":{
		"username":"admin_1_"+ Date.now().valueOf(),
		"password":"xxxxxxxx"
	}
};
 var user = {
	  "account":account_1.name,
	  "username":account_1.admin.username,
	  "password":account_1.admin.password
};

var account_2 = {
	"name":"company_name_1_" + Date.now().valueOf(),
	"admin":{
		"username":"admin_2_"+ Date.now().valueOf(),
		"password":"xxxxxxxx"
	}
};

var region_1 = {
	"name":"region_test" + Date.now().valueOf()
};

var group_1 = {
	"name":"group_test" + Date.now().valueOf()
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

describe("Create account "+account_2.name, function(){
	it("should create account without error", function(done){
		accounts.create(account_2, function(err, account_id){
			//console.log("err:%s,result:%s",err,account_id);
			assert.equal(null, err);
			assert.equal(false, !account_id);
			account_2.id = account_id;
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
			url:region_url+"?accesskey="+accessKey,
			json:region_1,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			region_1.id = verifyData(body).ret;
			done();
		});
	});
});

describe("create group "+group_1.name, function(){
	it("should create group without error", function(done){
		request.post({
			url:group_url+"?accesskey="+accessKey,
			json:group_1,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			group_1.id = verifyData(body).ret;
			done();
		});
	});
});

describe("add account resource ", function(){
	it("should create group without error", function(done){
		request.put({
			url:privilege_url+"/"+group_1.id+"?accesskey="+accessKey+"&isaccount=true",
			json:{"privilege":["REGION_MANAGE"]},
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});
describe("add region resource ", function(){
	it("should add region resource without error", function(done){
		request.put({
			url:privilege_url+"/"+group_1.id+"?accesskey="+accessKey+"&region_id="+region_1.id,
			json:{"privilege":["REGION_MANAGE"]},
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});

describe("get region  resource ", function(){
	it("should get region   resource without error", function(done){
		request.get({
			url:privilege_url+"/"+group_1.id+"?accesskey="+accessKey+"&region_id="+region_1.id,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});

describe("get account   resource ", function(){
	it("should get account   resource without error", function(done){
		request.get({
			url:privilege_url+"/"+group_1.id+"?accesskey="+accessKey+"&isaccount=true",
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});

describe("query account   resource ", function(){
	it("should query account   resource without error", function(done){
		request.get({
			url:privilege_url+"?accesskey="+accessKey+"&isaccount=true",
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});

describe("query region   resource ", function(){
	it("should query region   resource without error", function(done){
		request.get({
			url:privilege_url+"?accesskey="+accessKey+"&region_id="+region_1.id,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});

describe("delete region  resource ", function(){
	it("should delete region   resource without error", function(done){
		request.del({
			url:privilege_url+"/"+group_1.id+"?accesskey="+accessKey+"&region_id="+region_1.id,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			 verifyData(body).ret;
			done();
		});
	});
});

describe("delete account   resource ", function(){
	it("should delete account   resource without error", function(done){
		request.del({
			url:privilege_url+"/"+group_1.id+"?accesskey="+accessKey+"&isaccount=true",
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});


describe("Delete account", function(){
	it("should without error delete account", function(done){
		accounts.drop(account_2.id, function(err){
			assert.equal(null, err);
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
