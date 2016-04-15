require("../config/account_init");
var Accounts = require('../../../../account');
var accounts = Accounts.Accounts;
var benchrest = require('bench-rest');
var assert = require('assert');
var runOptions = require('../config/runOptions');
var base = require('../config/baseUrl');

var base_url = base+"/v2/json/drivers";
var query_url = base+"/v2/json/query/drivers"
var auth_url = base+"/v2/json/auth"

var accessKey,
 	driver_1_name = "driver_name_1_test"+Date.now().valueOf(),
 	driver_1_id;
function verifyAccesskey(all) {
  	assert.equal(null, all.body.err);
           	accessKey = all.body.ret.accessKey;
           	//console.log("accessKey:",accessKey);
           	return all;
}
function verifyData(all) {
	var body;
	if(typeof all.body =='string'){
		body = JSON.parse(all.body);
	}
	if(typeof all.body =='object')
		body = all.body;
	assert.equal(null, body.err);
	//console.log(body);
	return all;
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
		accounts.create(account_1, function(err, id){
			//console.log("err:%s,result:%s",err,id);
			assert.equal(null, err);
			assert.equal(false, !id);
			account_1.id = id;
			done();
		});
	});
});

describe('get accessKey', function () {
	it("should get accessKey without error", function(done){
		var flow = {
			main: [{ post: auth_url+"/user", rejectUnauthorized: false, json:user,
		    	afterHooks: [ function (all) {return verifyAccesskey(all);}]}],   
		  };
		benchrest(flow, runOptions)
		    .on('error', function (err, ctxName) { 
		    	assert.equal(null, err);
		    	done();
		     })
		    .on('end', function (stats, errorCount) {
		     assert.equal(0, errorCount);
		      //console.log('stats', stats);
		      done();
		 });   
	});
});
describe('create driver', function () {
	it("should driver without error", function(done){
		var url = base_url+"?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{"name":driver_1_name},
		    	afterHooks: [ 
		    	function (all) {
		    		driver_1_id = all.body.ret;
           				return verifyData(all);
		    	}
		    	]}],   
		  };
		benchrest(flow, runOptions)
		    .on('error', function (err, ctxName) { 
		    	assert.equal(null, err);
		    	done();
		     })
		    .on('end', function (stats, errorCount) {
		     assert.equal(0, errorCount);
		      //console.log('stats', stats);
		      done();
		 });   
	});
});

describe('get  driver  ', function () {
	it("should get driver without error", function(done){
		var url = base_url+"/"+driver_1_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ get: url, rejectUnauthorized: false,
		    	afterHooks: [ 
		    	function (all) {
		    		return verifyData(all);
		    	}
		    	]}],   
		  };
		benchrest(flow, runOptions)
		    .on('error', function (err, ctxName) { 
		    	assert.equal(null, err);
		    	done();
		     })
		    .on('end', function (stats, errorCount) {
		     assert.equal(0, errorCount);
		      //console.log('stats', stats);
		      done();
		 });   
	});
});
describe('get  driver  by  name ', function () {
	it("should get driver  by name without error", function(done){
		var url = base_url+"?name="+driver_1_name+"&accesskey="+accessKey;
		var flow = {
			main: [{ get: url, rejectUnauthorized: false,
		    	afterHooks: [ 
		    	function (all) {
		    		return verifyData(all);
		    	}
		    	]}],   
		  };
		benchrest(flow, runOptions)
		    .on('error', function (err, ctxName) { 
		    	assert.equal(null, err);
		    	done();
		     })
		    .on('end', function (stats, errorCount) {
		     assert.equal(0, errorCount);
		      //console.log('stats', stats);
		      done();
		 });   
	});
});
describe('query drivers', function () {
	it("should query  by name without error", function(done){
		var url = query_url+"?accesskey="+accessKey;
		var flow = {
			main: [{ get: url, rejectUnauthorized: false,
		    	afterHooks: [ 
		    	function (all) {
		    		return verifyData(all);
		    	}
		    	]}],   
		  };
		benchrest(flow, runOptions)
		    .on('error', function (err, ctxName) { 
		    	assert.equal(null, err);
		    	done();
		     })
		    .on('end', function (stats, errorCount) {
		     assert.equal(0, errorCount);
		      //console.log('stats', stats);
		      done();
		 });   
	});
});
describe('modify driver ', function () {
	it("should modify driver without error", function(done){
		var url = base_url+"/"+driver_1_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"desc":"test for modify driver"},
		    	afterHooks: [ 
		    	function (all) {
		    		return verifyData(all);
		    	}
		    	]}],   
		  };
		benchrest(flow, runOptions)
		    .on('error', function (err, ctxName) { 
		    	assert.equal(null, err);
		    	done();
		     })
		    .on('end', function (stats, errorCount) {
		     assert.equal(0, errorCount);
		      //console.log('stats', stats);
		      done();
		 });   
	});
});



describe('delete driver ', function () {
	it("should delete driver without error", function(done){//debugger
		var url = base_url+"/"+driver_1_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ del: url, rejectUnauthorized: false,
		    	afterHooks: [ 
		    	function (all) {
		    		return verifyData(all);
		    	}
		    	]}],   
		  };
		benchrest(flow, runOptions)
		    .on('error', function (err, ctxName) { 
		    	assert.equal(null, err);
		    	done();
		     })
		    .on('end', function (stats, errorCount) {
		     assert.equal(0, errorCount);
		      //console.log('stats', stats);
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