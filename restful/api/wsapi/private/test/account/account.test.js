var assert = require('assert');
var request = require('request');
var base_url = "http://localhost:3000/accounts";
var query_url = "http://localhost:3000/query/accounts/";
var account_1 = {
	"name":"account_1_" + Date.now().valueOf(),
	"company_name":"company_name_1_" + Date.now().valueOf(),
	"admin":{
		"username":"admin_1_"+ Date.now().valueOf(),
		"password":"123123"
	}
};

var account_2 = {
	"name":"account_2_" + Date.now().valueOf(),
	"company_name":"company_name_2_" + Date.now().valueOf(),
	"admin":{
		"username":"admin_2_"+ Date.now().valueOf(),
		"password":"123123"
	}
};
function verifyData(all) {
	var body;
	if(typeof all =='string'){
		body = JSON.parse(all);
	}
	if(typeof all =='object')
		body = all;
	assert.equal(null, body.err);
	console.log(body);
	return body;
}
describe("Create account "+account_1.name, function(){
	it("should create account without error", function(done){
		request.post({
			url:base_url,
			json:account_1
		},function(err,res,body){
			assert.equal(null,err);
			account_1.id = verifyData(body).ret;
			done();
		});
	});
});

describe("Create account "+account_2.name, function(){
	it("should create account without error", function(done){
		request.post({
			url:base_url,
			json:account_2
		},function(err,res,body){
			assert.equal(null,err);
			account_2.id = verifyData(body).ret;
			done();
		});
	});
});

describe("get account ", function(){
	it("should get account without error", function(done){
		request.get({
			url:base_url+"/"+account_1.id,
			json:account_1
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("set account ", function(){
	it("should set account without error", function(done){
		account_1.desc = "test for set";
		request.put({
			url:base_url+"/"+account_1.id,
			json:account_1
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("query account ", function(){
	it("should query account without error", function(done){
		request.get({
			url:query_url
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("Delete account", function(){
	it("should without error delete account", function(done){
		request.del({
			url:base_url+"/"+account_1.id
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});

describe("Delete account", function(){
	it("should without error delete account", function(done){
		request.del({
			url:base_url+"/"+account_2.id
		},function(err,res,body){
			assert.equal(null,err);
			verifyData(body);
			done();
		});
	});
});
