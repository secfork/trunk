require("../config/account_init");
var Accounts = require('../../../../account');
var  accounts = Accounts.Accounts;
var benchrest = require('bench-rest');
var assert = require('assert');
var runOptions = require('../config/runOptions');
var base = require('../config/baseUrl');

var base_url = base+"/v2/json/devmodels";
var query_url = base+"/v2/json/query/devmodels"
var auth_url = base+"/v2/json/auth"

var accessKey,
 	devmodel_name = "devmodel_name_1_test"+Date.now().valueOf(),
 	devmodel_id,
 	point_1_name = "point_1_name"+Date.now().valueOf(),
 	point_1_id;
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
	if(typeof all.body =='object'){
		body = all.body;
	}
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
describe('create device model', function () {
	it("should create device model without error", function(done){
		var url = base_url+"?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{"name":devmodel_name},
		    	afterHooks: [ 
		    	function (all) {
		    		devmodel_id = all.body.ret;
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

describe('get  device model  ', function () {
	it("should get device model without error", function(done){
		var url = base_url+"/"+devmodel_id+"?accesskey="+accessKey;
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
describe('modify device  model ', function () {
	it("should modify device model without error", function(done){
		var url = base_url+"/"+devmodel_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"desc":"test for modify device model"},
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

describe('query device models  ', function () {
	it("should device models without error", function(done){
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

///////////////////////////////////////////////////////////////////////////
//points
////////////////////////////////////////////////////////////////////////
describe('add point to device model ', function () {
	it("should add point to device model  without error", function(done){
		var url = base_url+"/"+devmodel_id+"/points?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{"name":point_1_name},
		    	afterHooks: [ 
		    	function (all) {
		    		point_1_id = all.body.ret;
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

describe('get point  from device model  ', function () {
	it("should get  device model without error", function(done){
		var url = base_url+"/"+devmodel_id+"/points/"+point_1_id+"?accesskey="+accessKey;
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

describe('get  points from device model  ', function () {
	it("should get  points fron device model without error", function(done){
		var url = base_url+"/"+devmodel_id+"/points/?accesskey="+accessKey;
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

describe('modify point from device model   ', function () {
	it("should  modify point form device model without error", function(done){
		var url = base_url+"/"+devmodel_id+"/points/"+point_1_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"desc":"test for modifypoint from device model"},
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
		     	 done();
		 });   
	});
});

describe('delete point from device model', function () {
	it("delete point from device model without error", function(done){//debugger
		var url = base_url+"/"+devmodel_id+"/points/"+point_1_id+"?accesskey="+accessKey;
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

describe('delete device model', function () {
	it("should delete device model without error", function(done){//debugger
		var url = base_url+"/"+devmodel_id+"?accesskey="+accessKey;
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
