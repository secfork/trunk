require("../config/account_init");
var assert = require('assert');
var request = require('request');
var base = require('../config/baseUrl');
var auth_url = base+"/v2/json/auth/user";
var base_url = base+"/v2/json/groups";
var query_url = base+"/v2/json/query/groups";
var Accounts = require('../../../../account');
var accounts = Accounts.Accounts;
var users = Accounts.Users;
var accounts_permission = Accounts.AccountsPermission;
var users_in_group = Accounts.UsersInGroup;
var accessKey;
var accessKey_1;

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
	"password":"xxxxx1"
};

var normal_user = {
	  "account":account_1.name,
	  "username":user_1.username,
	  "password":user_1.password
};

var group_1 = {
	"name":"group_test" + Date.now().valueOf()
};

var group_2 = {
	"name":"group_" + Date.now().valueOf()
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
			accessKey_1 = verifyData(body).ret.accessKey;
			done();
		});
	});
});


describe("Create user "+user_1.username, function(){
	it("should create user without error", function(done){
		user_1["account_id"] = account_1.id;
		users.create(user_1, function(err, user_id){
			console.log("err:%s,result:%s",err,user_id);
			assert.equal(null, err);
			assert.equal(false, !user_id);
			user_1.id = user_id;
			done();
		});
	});
});



describe("create group "+group_1.name, function(){
	it("should create group without error", function(done){
		request.post({
			url:base_url+"?accesskey="+accessKey_1,
			json:group_1,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			group_1.id = verifyData(body).ret;
			done();
		});
	});
});

describe("add account permission", function(){
	it("should add account permission without error", function(done){
		var fields = {
			"id":account_1.id,
			"group_id":group_1.id,
			"privilege":["GROUP_MANAGE","USER_MANAGE"]
		};
		accounts_permission.add(-1,fields, function(err, resource_id){
			console.log("err:%s,result:%s",err,resource_id);
			assert.equal(null, err);
			done();
		});
	});
});

describe("add user in group ", function(){
	it("should add user in group without error", function(done){
		var fields = {
			"group_id":group_1.id,
			"user_id":user_1.id
		};
		users_in_group.add(fields, function(err, result){
			console.log("err:%s,result:%s",err,result);
			assert.equal(null, err);
			done();
		});
	});
});

describe("get accessKey ", function(){
	it("should get accessKey without error", function(done){
		request.post({
			url:auth_url,
			json:normal_user,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			accessKey = verifyData(body).ret.accessKey;
			done();
		});
	});
});

describe("create group "+group_2.name, function(){
	it("should create group without error", function(done){
		request.post({
			url:base_url+"?accesskey="+accessKey,
			json:group_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			group_2.id = verifyData(body).ret;
			done();
		});
	});
});

describe("get group "+group_1.name, function(){
	it("should get group without error", function(done){
		request.get({
			url:base_url+"/"+group_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("modify group "+group_2.name, function(){
	it("should modify group without error", function(done){
		group_2.desc = "test for set group_2";
		request.put({
			url:base_url+"/"+group_2.id+"?accesskey="+accessKey,
			json:group_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("get group by name "+group_2.name, function(){
	it("should get group without error", function(done){
		request.get({
			url:base_url+"?accesskey="+accessKey+"&name="+group_2.name,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("query group ", function(){
	it("should query group without error", function(done){
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

describe("delete group "+group_1.name, function(){
	it("should delete group without error", function(done){
		request.del({
			url:base_url+"/"+group_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("delete group "+group_2.name, function(){
	it("should delete group without error", function(done){
		request.del({
			url:base_url+"/"+group_2.id+"?accesskey="+accessKey,
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


