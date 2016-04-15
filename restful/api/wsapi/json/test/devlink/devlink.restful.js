require("../config/init");
require("../config/account_init");
var benchrest = require('bench-rest');
var Accounts = require('../../../../account');
var assert = require('assert');
var runOptions = require('../config/runOptions');
var base = require('../config/baseUrl');
var Info = require('../../../../model_info')
var daservers = Info.Daservers;
var accounts = Accounts.Accounts;
var assignDaserver = Info.AssignDaserver;

var accessKey,
 	sysmodel_name = "sysmodel_name_1_test"+Date.now().valueOf(),
 	sysmodel_id,
 	system_id,
 	system_sn = "abc1234"+Date.now().valueOf(),
 	system_name = "system_name_1_test"+Date.now().valueOf(),
 	sysmodel_profile_name = "sysmodel_profile_name_1_test"+Date.now().valueOf(),
 	sysmodel_profile_id;

var profile_url = base +"/v2/json/profiles",
	system_url = base+"/v2/json/systems",
 	auth_url = base+"/v2/json/auth";

var daserver_1 = {
	"name":"daserver_1"+Date.now().valueOf(),
	"desc":"test",
	"xmpp_user":"test_002@athena.com/gloox"
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

function verifyAccesskey(all) {
  	//assert.equal(null, all.body.err);
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
	try{
		assert.equal(null, body.err);
	}catch(e){
		assert.equal('ER_SEND_MESSAGE_ERROR',body.err);
	}
	
	//console.log(body);
	return all;
}

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
		      done();
		 });   
	});
});


describe("Create daserver " + daserver_1.name, function(){
	it("should create without error", function(done){
		daservers.create(daserver_1, function(err, daserver_id){
			assert.equal(null, err);
			assert.equal(false, !daserver_1);

			daserver_1.id = daserver_id;
			done();
		});
	});
});


describe('create system model', function () {
	it("should create system model without error", function(done){
		var url = base+"/v2/json/sysmodels?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{"name":sysmodel_name},
		    	afterHooks: [ 
		    	function (all) {
		    		sysmodel_id = all.body.ret;
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


describe('create system model profile ', function () {
	it("should create system model profile   without error", function(done){
		var url = profile_url+"?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{
				"name":sysmodel_profile_name,
				"system_model":sysmodel_id},
		    	afterHooks: [ 
		    	function (all) {
		    		sysmodel_profile_id= all.body.ret;
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
var system_network = {
	"daserver":{
		"type":"DTU",
		"params":{
			"driver_id":"Dtu_HongDian",
	                            	"driver_ver":"1.0.0.0",
	                            	"simid":"18210030001",//++
	                           	 "cmway":"211.100.14.158",
	                            	"port":5223
	             }  
	}
}
describe('create system ', function () {
	it("should create system without error", function(done){
		var url = base+"/v2/json/systems?accesskey="+accessKey;
		system_network.daserver.daserver_id=daserver_1.id;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{
				"name":system_name,"model":sysmodel_id,
				"sn":system_sn,
				"profile":sysmodel_profile_id,
				"network":system_network},
		    	afterHooks: [ 
		    	function (all) {
		    		system_id= all.body.ret;
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

describe('set system comm_type ', function () {
	it("should set system comm_type  without error", function(done){
		var url = base+"/v2/json/sysmodels/"+sysmodel_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"desc":"test for modify system","comm_type":1},
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

describe("Assign  daserver " + daserver_1.name, function(){
	it("should assign daserver without error", function(done){
		assignDaserver.assignDaserver(system_id, function(err, ret){
			assert.equal(null, err);
			done();
		});
	});
});

//update systems
describe('update system ', function () {
	it("should update system without error", function(done){
		var url = base+"/v2/json/systems/"+system_id+"/update?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,
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

//write value
var data =[
        {"name":"CO_0", "value":32},
        {"name":"CO_1", "value":32.0}
];

describe('write value to daserver ', function () {
	it("should write value to daserver without error", function(done){
		var url = base+"/v2/json/systems/"+system_id+"/live/write?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false,json:data,
		    	afterHooks: [ 
		    	function (all) {
		    		assert.equal('ER_SYSTEM_NO_TAGS',all.body.err);
           				return all;
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

describe('set system active ', function () {
	it("should set system active  without error", function(done){
		var url = base+"/v2/json/systems/"+system_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"desc":"test for modify system","state":1},
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

//start collect
describe('start collect report to daserver ', function () {
	it("should start collect report  to daserver without error", function(done){
		var url = base+"/v2/json/systems/"+system_id+"/start?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,
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

//stop collect
describe('stop collect report to daserver ', function () {
	it("should stop collect report  to daserver without error", function(done){
		var url = base+"/v2/json/systems/"+system_id+"/stop?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,
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

describe('set system active ', function () {
	it("should set system active  without error", function(done){
		var url = base+"/v2/json/systems/"+system_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"desc":"test for modify system","state":1},
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

//call data
describe('call data report to daserver ', function () {
	it("should call data report  to daserver without error", function(done){
		var url = base+"/v2/json/systems/"+system_id+"/call?accesskey="+accessKey;
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
		      done();
		 });   
	});
});

//delete systems
describe('delete system report to daserver ', function () {
	it("should delete system report  to daserver without error", function(done){
		var url = base+"/v2/json/systems/"+system_id+"/delete?accesskey="+accessKey;
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
		      done();
		 });   
	});
});

describe('delete system by system id ', function () {
	it("should delete system without error", function(done){//debugger
		var url = base+"/v2/json/systems/"+system_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ del: url, rejectUnauthorized: false,
		    	afterHooks: [ 
		    	function (all) {
		    		return all;
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

describe("Delete daserver "+daserver_1.name, function(){
	it("should delete without error", function(done){
		daservers.drop(daserver_1.id, function(err){
			assert.equal(null, err);
			done();
		});
	});
});

describe('delete system model profile', function () {
	it("delete system model profile without error", function(done){//debugger
		var url = profile_url+"/"+sysmodel_profile_id+"?accesskey="+accessKey;
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
		      done();
		 });   
	});
});

describe('delete system model', function () {
	it("should delete system model without error", function(done){
		var url = base+"/v2/json/sysmodels/"+sysmodel_id+"?accesskey="+accessKey;
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
		    	assert.equal(null || undefined, err);
		    	done();
		     })
		    .on('end', function (stats, errorCount) {
		     assert.equal(0, errorCount);
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
