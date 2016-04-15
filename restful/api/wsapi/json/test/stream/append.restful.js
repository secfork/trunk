require("../config/account_init");
var Accounts = require('../../../../account');
var accounts = Accounts.Accounts;
var benchrest = require('bench-rest');
var assert = require('assert');
var runOptions = require('../config/runOptions');
var base = "https://localhost:443"

var base_url = base+"/v2/json/systems";

var auth_url = base+"/v2/json/auth",
	devmodel_url = base+"/v2/json/devmodels",
	query_url =base+"/v2/json/query/systems",
	profile_url = base +"/v2/json/profiles";

var accessKey,
 	sysmodel_name = "sysmodel_name_1_test"+Date.now().valueOf(),
 	sysmodel_id,
 	system_id,
 	system_sn = "abc1234"+Date.now().valueOf(),
 	system_name = "system_name_1_test"+Date.now().valueOf(),
 	devmodel_name = "devmodel_name_1_test"+Date.now().valueOf(),
 	sysmodel_profile_name = "sysmodel_profile_name_1_test"+Date.now().valueOf(),
 	sysmodel_profile_id,
 	devmodel_id,
 	point_1_name = "point_1_name"+Date.now().valueOf(),
 	point_1_id,
 	device_name = "sysmodel_device_name_1_test"+Date.now().valueOf(),
 	device_id,
 	tag_1_name = "sysmodel_tag_1_name"+Date.now().valueOf(),
 	tag_1_id,
 	sysmodel_profile_tag_1_name = "sysmodel_profile_tag_1_name"+Date.now().valueOf(),
 	sysmodel_profile_tag_1_id;

function verifyAccesskey(all) {
  	assert.equal(null, all.body.err);
           	accessKey = all.body.ret.accessKey;
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
		      //console.log('stats', stats);
		      done();
		 });   
	});
});


describe('create system model profile ', function () {
	it("should create system model profile   without error", function(done){
		var url = profile_url+"?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{"name":sysmodel_profile_name,"system_model":sysmodel_id},
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
		      //console.log('stats', stats);
		      done();
		 });   
	});
});

describe('add tag to system model ', function () {
	it("should add tag to system model  without error", function(done){
		var url = base+"/v2/json/sysmodels/"+sysmodel_id+"/tags?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{"name":tag_1_name,"type":"Number"},
		    	afterHooks: [ 
		    	function (all) {
		    		tag_1_id = all.body.ret;
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

describe('set log profile of system model tag  ', function () {
	it("shouldset log profile of system model tag   without error", function(done){
		var url = base+"/v2/json/profiles"+"/"+sysmodel_profile_id+"/tags/"+tag_1_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false, json:{"name":sysmodel_profile_tag_1_name},
		    	afterHooks: [ 
		    	function (all) {
		    		sysmodel_profile_tag_1_id= all.body.ret;
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





describe('create system ', function () {
	it("should create system without error", function(done){
		var url = base_url+"?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{"name":system_name,"model":sysmodel_id,"sn":system_sn,"profile":sysmodel_profile_id},
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
		      //console.log('stats', stats);
		      done();
		 });   
	});
});

describe('create device model', function () {
	it("should create device model without error", function(done){
		var url = devmodel_url+"?accesskey="+accessKey;
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



describe('add device  to system model ', function () {
	it("should add device  to system model  without error", function(done){
		var url = base+"/v2/json/sysmodels/"+sysmodel_id+"/devices?accesskey="+accessKey;;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{"name":device_name,"device_model":devmodel_id},
		    	afterHooks: [ 
		    	function (all) {
		    		device_id = all.body.ret;
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

describe('add point to device model ', function () {
	it("should add point to device model  without error", function(done){
		var url = base+"/v2/json/devmodels/"+devmodel_id+"/points?accesskey="+accessKey;
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

describe('append log data ', function () {
	it("should append log data  without error", function(done){
		var url = base+"/v2/json/systems/"+system_id+"/live?accesskey="+accessKey;
		//var url = "http://localhost:3000/live/systems/"+system_id+"/write"
		var logData = {
		        "data":{
		                "sysmodel_tag_1_name" : 30
		        },
		        "quality" : {
		                "point_1_name" : "BAD"
		        },
		        "source" : 1425539410851
		}

		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:logData,
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




describe('delete point from device model', function () {
	it("delete point from device model without error", function(done){//debugger
		var url = base+"/v2/json/devmodels/"+devmodel_id+"/points/"+point_1_id+"?accesskey="+accessKey;
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
describe('delete tag from system model profile', function () {
	it("delete tag form system model profile without error", function(done){//debugger
		var url = base +"/v2/json/profiles"+"/"+sysmodel_profile_id+"/tags/"+tag_1_id+"?accesskey="+accessKey;
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

describe('delete tag from system  model', function () {
	it("delete tag from system model without error", function(done){//debugger
		var url = base+"/v2/json/sysmodels/"+sysmodel_id+"/tags/"+tag_1_id+"?accesskey="+accessKey;
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

describe('delete system by system id ', function () {
	it("should delete system without error", function(done){//debugger
		var url = base_url+"/"+system_id+"?accesskey="+accessKey;
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
		      //console.log('stats', stats);
		      done();
		 });   
	});
});






describe('delete device from system model', function () {
	it("delete device from sytem model without error", function(done){//debugger
		var url = base+"/v2/json/sysmodels/"+sysmodel_id+"/devices/"+device_id+"?accesskey="+accessKey;
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
		      //console.log('stats', stats);
		      done();
		 });   
	});
});

describe('delete device model', function () {
	it("should delete system without error", function(done){//debugger
		var url = devmodel_url+"/"+devmodel_id+"?accesskey="+accessKey;
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
