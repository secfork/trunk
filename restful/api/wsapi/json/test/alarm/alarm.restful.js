require("../config/account_init");
var Alarm = require('../../../../alarm');
var Info = require('../../../../model_info');
var Accounts = require('../../../../account');
var benchrest = require('bench-rest');
var assert = require('assert');
var runOptions = require('../config/runOptions');
var base = "https://localhost:443";
var auth_url = base+"/v2/json/auth";
var tokens = require('../../../../authorization').tokens;

var alarms = Alarm.alarms
	, spaces = Alarm.spaces
	, querier = Alarm.querier
	, accounts = Accounts.Accounts
	, triggers = Info.Triggers;


var ack_id;
Alarm.createDbConnection(require('../../db/alarm_db_conn'));
Info.createDbConnection(require('../../db/thinglinx_db_conn'));

var 	accessKey;

var  	 alarms = Alarm.alarms
	, querier = Alarm.querier;  

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

var system_model = {
	"name":"system_1"+Date.now().valueOf()
}

var system_model_profile = {
	name:"sysmodel_profile_1"+Date.now().valueOf()
}

var system = {
	name:"system_1"+Date.now().valueOf(),
	state:0,
	comm_type:0,
	network:{
	  "cmway": "tcp",
	  "dtu": "Dtu_HongDian",
	  "port": "5223",
	  "realm": "localhost",
	  "simid": "18210000000"
	},
	sn:"test"+Date.now().valueOf()
};

var trigger_1 = {
	name : "trigger_1",
	// 触发且仅触发一次 type default to 1
	conditions : [
		{
			verb : null,
			exp : {
				left : { fn:"PV", args:"tag_1" },
				op : ">=",
				right : { fn:null, args:"5.0" }
			}
		}
	],
	action : "alarm"
};

var alarm_1 = {
	source : { },		
	fields : {
		class_id : 1,
		info:"this is test"
	}
}

function verifyAccesskey(all) {
  	assert.equal(null, all.body.err);
           	accessKey = all.body.ret.accessKey;
           	//account_id =  tokens.get("xiaodongceshi123456forever").account_id;
           	//console.log("accessKey:",accessKey," account_id:",account_id);
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

describe('create alarm space ',function(){
	it('should create alarm space without error',function(done){
		spaces.create(account_1.id,function(err,ret){
			try{
				assert.equal(null,err);
			}catch(e){
				assert.equal("SPACE_EXIST",err);
			}
			done();
		});

	})
});

describe('create system model', function () {
	it("should create system model without error", function(done){
		var url = base+"/v2/json/sysmodels?accesskey="+accessKey;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:system_model,
		    	afterHooks: [ 
		    	function (all) {
		    		system_model.id = all.body.ret;
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
		var url = base+"/v2/json/systems"+"?accesskey="+accessKey;
		system.model = system_model.id;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:system,
		    	afterHooks: [ 
		    	function (all) {
		    		system.id= all.body.ret;
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
		var url = base+"/v2/json/profiles"+"?accesskey="+accessKey;
		system_model_profile.system_model = system_model.id;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:system_model_profile,
		    	afterHooks: [ 
		    	function (all) {
		    		system_model_profile.id= all.body.ret;
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


describe("Create TRIGGER " + trigger_1.name, function(){
	it("should create without error", function(done){
		trigger_1.profile = system_model_profile.id;
		triggers.create(trigger_1, function(err, trigger_id){
			assert.equal(null, err);
			assert.equal(false, !trigger_id);
			trigger_1.id = trigger_id;
			done();
		});
	});
});



describe("Create ALARM " , function(){
	it("should create alarm without error", function(done){
		alarm_1.source = {
			account_id:account_1.id,  
			system_id:system.id
		};
		alarm_1.fields = {
			trigger_id : trigger_1.id,
		},

		alarms.createAlarm(alarm_1, function(err, alarm_id){
			assert.equal(null, err);
			assert.equal(false, !alarm_id);
			alarm_1.id = alarm_id;
			done();
		});
	});
});

describe('read current alarm ', function (done) {
	it("should read without error", function(done){
		var url = base+"/v2/json/systems/"+system.id+"/alarms?accesskey="+accessKey;
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

describe('read alarm historical', function () {
	it("should read without error", function(done){
		var url = base+"/v2/json/systems/"+system.id+"/alarmhistory?accesskey="+accessKey;
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

describe('ACKNOWLEDGE ALARM AND CLOSE IT', function () {
	it("should ack /close without error", function(done){
		var url = base+"/v2/json/systems/"+system.id+"/alarm/ack?accesskey="+accessKey+"&id="+alarm_1.id;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:{"message":"ack this Alarm"},
		    	afterHooks: [ 
		    	function (all) {
		    		ack_id = all.body.ret;
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

describe('get ack message', function () {
	it("should get ack message without error", function(done){
		var url = base+"/v2/json/systems/"+system.id+"/alarm/ack?accesskey="+accessKey+"&id="+ack_id;
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

describe("Delete Trigger  " + trigger_1.name, function(){
	it("should delete without error", function(done){
		triggers.drop(trigger_1.profile, trigger_1.id, function(err){
			assert.equal(null, err);
			done();
		});
	});
});

describe('delete system by system id ', function () {
	it("should delete system without error", function(done){//debugger
		var url = base+"/v2/json/systems/"+system.id+"?accesskey="+accessKey;
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
		    	console.log("::::",err);
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
		var url = base+"/v2/json/profiles/"+system_model_profile.id+"?accesskey="+accessKey;
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
		    	console.log(err);
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
		var url = base+"/v2/json/sysmodels/"+system_model.id+"?accesskey="+accessKey;
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


describe('delete alarm space ',function(){
	it('should delete alarm space without error',function(done){
		spaces.drop(account_1.id,function(err,ret){
			assert.equal(null,err);
			done();
		});

	})
});

describe("Delete account", function(){
	it("should without error delete account", function(done){
		accounts.drop(account_1.id, function(err){
			assert.equal(null, err);
			done();
		});
	});
});









