require("../config/account_init");
var assert = require('assert');
var request = require('request');
var base = require('../config/baseUrl');
var auth_url = base+"/v2/json/auth/user";
var user_url = base+"/v2/json/users";
var group_url = base+"/v2/json/groups";
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
var user_1 = {
	"username":"user_test"+ Date.now().valueOf() ,
	"password":"xxxxx1",
	"is_super_user":1
};
var user_2 = {
	"username":"user_2_" + Date.now().valueOf(),
	"password":"xxxxx2"
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
			accessKey = verifyData(body).ret.accessKey;
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

describe("create group "+group_2.name, function(){
	it("should create group without error", function(done){
		request.post({
			url:group_url+"?accesskey="+accessKey,
			json:group_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			group_2.id = verifyData(body).ret;
			done();
		});
	});
});



describe("create user "+user_1.name, function(){
	it("should create user without error", function(done){
		request.post({
			url:user_url+"?accesskey="+accessKey,
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
			url:user_url+"?accesskey="+accessKey,
			json:user_2,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			user_2.id = verifyData(body).ret;
			done();
		});
	});
});

describe("add user in group  ", function(){
	it("should add user in group without error", function(done){
		request.put({
			url:group_url+"/"+group_1.id+"/users/"+user_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});

describe("add user in group  ", function(){
	it("should add user in group without error", function(done){
		request.put({
			url:group_url+"/"+group_1.id+"/users/"+user_2.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});

describe("get users in group  ", function(){
	it("should get user in group without error", function(done){
		request.get({
			url:group_url+"/"+group_1.id+"/users?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});

describe("delete user in group  ", function(){
	it("should delete user in group without error", function(done){
		request.del({
			url:group_url+"/"+group_1.id+"/users/"+user_2.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body).ret;
			done();
		});
	});
});

describe("delete user "+user_1.username, function(){
	it("should delete user without error", function(done){
		request.del({
			url:user_url+"/"+user_1.id+"?accesskey="+accessKey,
			rejectUnauthorized: false
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("delete user "+user_2.username, function(){
	it("should delete user without error", function(done){
		request.del({
			url:user_url+"/"+user_2.id+"?accesskey="+accessKey,
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
			url:group_url+"/"+group_1.id+"?accesskey="+accessKey,
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
			url:group_url+"/"+group_2.id+"?accesskey="+accessKey,
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



