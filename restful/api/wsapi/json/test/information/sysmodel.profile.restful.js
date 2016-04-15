require("../config/account_init");
var Accounts = require('../../../../account');
var  accounts = Accounts.Accounts;
var benchrest = require('bench-rest');
var assert = require('assert');
var runOptions = require('../config/runOptions');
var base = require('../config/baseUrl');

var base_url = base +"/v2/json/profiles",
	system_url = base+"/v2/json/systems",
 	auth_url = base+"/v2/json/auth";

var 	accessKey,
 	sysmodel_name = "sysmodel_name_1_test"+Date.now().valueOf(),
 	sysmodel_id,
 	system_id,
 	system_sn = "abc1234"+Date.now().valueOf(),
 	system_name = "system_name_1_test"+Date.now().valueOf(),
 	sysmodel_profile_name = "sysmodel_profile_name_1_test"+Date.now().valueOf(),
 	sysmodel_profile_id,
 	tag_1_name = "sysmodel_tag_1_name"+Date.now().valueOf(),
 	tag_1_id,
 	sysmodel_profile_tag_1_name = "sysmodel_profile_tag_1_name"+Date.now().valueOf(),
 	sysmodel_profile_tag_1_id,
 	sysmodel_profile_trigger_1_name = "sysmodel_profile_trigger_1_name"+Date.now().valueOf(),
 	sysmodel_profile_trigger_1_id;

 var profile_message = {
 	"user_id":1,
 	"name":"profile_message_1"+Date.now().valueOf(),
	"user_category":0,
	"message_params":"xxxx"
 } 
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
		var url = base_url+"?accesskey="+accessKey;
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


describe('get  system model profile  ', function () {
	it("should get  system model profile without error", function(done){
		var url = base_url+"/"+sysmodel_profile_id+"?accesskey="+accessKey;
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

describe('get  system model profiles  ', function () {
	it("should get  system models profile without error", function(done){
		var url = base_url+"/?accesskey="+accessKey+"&system_model="+sysmodel_id;
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


describe('modify system model profile  ', function () {
	it("should modify system model profile without error", function(done){
		var url = base_url+"/"+sysmodel_profile_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"desc":"test for modify system model profile"},
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

//////////////////////////////////////////////////////////////////
//tags
/////////////////////////////////////////////////////////////////
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

describe('get tag  from system model  ', function () {
	it("should get  tag from system  model without error", function(done){
		var url = base+"/v2/json/sysmodels/"+sysmodel_id+"/tags/"+tag_1_id+"?accesskey="+accessKey;
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

describe('get  tags from system model  ', function () {
	it("should get  tags from system model  without error", function(done){
		var url = base+"/v2/json/sysmodels/"+sysmodel_id+"/tags?accesskey="+accessKey;
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

describe('modify tag from system model   ', function () {
	it("should  modify tag from system model  without error", function(done){
		var url = base+"/v2/json/sysmodels/"+sysmodel_id+"/tags/"+tag_1_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"desc":"test for modify tag from system model"},
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



///////////////////////////////////////////////////////////////////////////
//LOG PROFILE OF SYSTEM MODEL TAG
////////////////////////////////////////////////////////////////////////
describe('set log profile of system model tag  ', function () {
	it("shouldset log profile of system model tag   without error", function(done){
		var url = base_url+"/"+sysmodel_profile_id+"/tags/"+tag_1_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false, json:{"name":sysmodel_profile_tag_1_name,"save_log":"1"},
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

describe('get  system model tag with log profile  ', function () {
	it("should get  system model tag with log profile without error", function(done){
		var url = base_url+"/"+sysmodel_profile_id+"/tags/"+tag_1_id+"?accesskey="+accessKey;
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

describe('get  system model tags with log profile    ', function () {
	it("should get  system model tags with log profile without error", function(done){
		var url = base_url+"/"+sysmodel_profile_id+"/tags/?accesskey="+accessKey;
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



describe('delete tag from system model profile', function () {
	it("delete tag form system model profile without error", function(done){//debugger
		var url = base_url+"/"+sysmodel_profile_id+"/tags/"+tag_1_id+"?accesskey="+accessKey;
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//trigger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
describe('add trigger to system model profile ', function () {
	it("should add trigger to system model profile   without error", function(done){
		var url = base_url+"/"+sysmodel_profile_id+"/triggers?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:{"name":sysmodel_profile_trigger_1_name},
		    	afterHooks: [ 
		    	function (all) {
		    		sysmodel_profile_trigger_1_id= all.body.ret;
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

describe('get  trigger from system model profile  ', function () {
	it("should get  trigger from system model profile without error", function(done){
		var url = base_url+"/"+sysmodel_profile_id+"/triggers/"+sysmodel_profile_trigger_1_id+"?accesskey="+accessKey;
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

describe('get  triggers from system model profile  ', function () {
	it("should get  triggers from system model profile without error", function(done){
		var url = base_url+"/"+sysmodel_profile_id+"/triggers?accesskey="+accessKey;
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

describe('modify trigger from  system model profile  ', function () {
	it("should  modify trigger form  system model profile without error", function(done){
		var url = base_url+"/"+sysmodel_profile_id+"/triggers/"+sysmodel_profile_trigger_1_id+"?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"desc":"test for modify trigger from system model profile"},
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

//////////////////////////////////////////////////////////////////////////////////
describe('create profile message   ', function () {
	it("should create profile message  without error", function(done){
		var url = base+"/v2/json/profiles/"+sysmodel_profile_id+"/messages"+"?accesskey="+accessKey;
		profile_message.trigger_id =  sysmodel_profile_trigger_1_id;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:profile_message,
		    	afterHooks: [ 
		    	function (all) {
		    		profile_message.id= all.body.ret;
           				return verifyData(all);
		    	}
		    	]}],   
		  };
		benchrest(flow, runOptions)
		    .on('error', function (err, ctxName) { 
		    	//console.log("err:::",err);
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

describe('get  profile message   ', function () {
	it("should get  profile message  without error", function(done){
		var url = base+"/v2/json/profiles/"+sysmodel_profile_id+"/messages/"+profile_message.id+"?accesskey="+accessKey;
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

describe('modify  profile message   ', function () {
	it("should modify  profile message  without error", function(done){
		var url = base+"/v2/json/profiles/"+sysmodel_profile_id+"/messages/"+profile_message.id+"?accesskey="+accessKey;
		profile_message.message_params="#####12345xxxxxx";
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:profile_message,
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


describe('get  profile messages', function () {
	it("should get  profile messages without error", function(done){
		var url =base+"/v2/json/profiles/"+sysmodel_profile_id+"/messages/?accesskey="+accessKey;
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


describe('delete profile messags', function () {
	it("delete profile messages without error", function(done){//debugger
		var url =base+ "/v2/json/profiles/"+sysmodel_profile_id+"/messages/"+profile_message.id+"?accesskey="+accessKey;
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

describe('delete trigger from system model profile', function () {
	it("delete trigger form system model profile without error", function(done){//debugger
		var url = base_url+"/"+sysmodel_profile_id+"/triggers/"+sysmodel_profile_trigger_1_id+"?accesskey="+accessKey;
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
		var url = base_url+"/"+sysmodel_profile_id+"?accesskey="+accessKey;
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

describe("Delete account", function(){
	it("should without error delete account", function(done){
		accounts.drop(account_1.id, function(err){
			assert.equal(null, err);
			done();
		});
	});
});