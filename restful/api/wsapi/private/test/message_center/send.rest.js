var benchrest = require('bench-rest');
var assert = require('assert');
var Info = require("../../../../model_info")
	,Contacts = Info.Contacts
	,SystemModels  = Info.SystemModels
	, Systems = Info.Systems;
var Msg =  require("../../../../message_center");	


Info.createDbConnection({
	"host" : "localhost",
	"user" : "root",
	"password" : "123456",
	"database" : "thinglinx",
	"connectionLimit" : 1,
	"multipleStatements" : true	
});

var account_id = 1;
var new_sys_model = {
	name : "system_model_" + Date.now().valueOf(),
	account_id : account_id,
	mode : 1	// Managed 
};

var new_system = {
	name : "system_" + Date.now().valueOf(),
	account_id : account_id,
	sn : "sn:"+Date.now().valueOf()
};
var contact_1 = {
	"last_name":"yin",
	"first_name":"Godfrey",
	"email":"testUser1@emample.com",
	"tel":"123",
	"mail_notice":1,
	"sms_notice":1,
	"phnoe":18801044236
}

var base = "http://localhost:3000/";

var runOptions={
    limit: 10,     // concurrent connections
    iterations: 1  // number of iterations to perform
  };

var send_params = {
	user_category:2,
	message:"test message"
};

var sms_sp_setting = {
	"sms_sp_host":"http://www.stongnet.com/sdkhttp/sendsms.aspx?reg=101100-WEB-HUAX-070187&pwd=HOJPMRPH&sourceadd=111",
	"sms_sp_msg_fields":"content",
	"signer":"【thinglinx】",
	"sms_sp_phone_fields":"phone"
}

var mail_server_params ={
		"host":"localhost",
		"port": 2525,
		"secure":false,
		"maxConnections": 5,
		"maxMessages": 1000
}

var mail_server_setting = {
	"mail":"testuser",
	"passwd":"testpass",
	"mail_server_params":mail_server_params
}
function verifyData(all) {
	var body;
	if(typeof all.body =='string'){
		body = JSON.parse(all.body);
	}
	if(typeof all.body =='object')
		body = all.body;
	assert.equal(null, body.err);
	console.log(body);
	return all;
}

var  account_id = 1;

 describe('create mail setting ', function () {
	it("should create mail setting without error", function(done){
		var url = base+"account/"+account_id+"/mailsetting";
		var flow = {
			main: [{ post: url, json:mail_server_setting,
		    	afterHooks: [ 
		    	function (all) {
		    		mail_server_setting.id = all.body.ret;
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
describe('create sms setting ', function () {
	it("should create sms setting without error", function(done){
		var url = base+"account/"+account_id+"/smssetting";
		var flow = {
			main: [{ post: url, json:sms_sp_setting,
		    	afterHooks: [ 
		    	function (all) {
		    		sms_sp_setting.id = all.body.ret;
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


describe("Create System Model", function(){
	it("should create without error", function(done){
		SystemModels.create(new_sys_model, function(err, sys_model_id){
			assert.equal(null, err);
			assert.equal(false, !sys_model_id);

			new_sys_model.uuid = sys_model_id;
			done();
		});
	});
});

describe("Create System", function(){
	it("should create without error", function(done){
		new_system.model=new_sys_model.uuid;
		Systems.create(new_system, function(err, new_system_id){
			assert.equal(null, err);
			assert.equal(false, !new_system_id);
			new_system.uuid = new_system_id;
			done();
		});
	});
});
describe("Create  first contact", function(){
	it("should create without error", function(done){
		contact_1.system_id = new_system.uuid;
		Contacts.create(contact_1,function(err,contact_id){
			contact_1.id = contact_id;
			console.log("err:%s,ret:%s",err,contact_id);
			assert.equal(null,err);
			done();
		});
	});
});
describe('send message ', function () {
	it("should send message without error", function(done){
		var url = base+"systems/"+new_system.uuid+"/message/send";
		var flow = {
			main: [{ post: url, json:send_params,
		    	afterHooks: [ 
		    	function (all) {
				assert.equal('ECONNREFUSED',all.body.err);
				return all;
           				//return verifyData(all);
		    	}
		    	]}],   
		  };
		benchrest(flow, runOptions)
		    .on('error', function (err, ctxName) { 
		    	console.log("::::::",err);
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


describe('drop sms setting ', function () {
	it("should drop sms setting without error", function(done){
		var url = base+"account/"+account_id+"/smssetting";
		var flow = {
			main: [{ del: url,
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
 

 describe('drop mail setting ', function () {
	it("should drop mail setting without error", function(done){
		var url = base+"account/"+account_id+"/mailsetting";
		var flow = {
			main: [{ del: url,
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
 
 describe("Delete System Model", function(){
	it("should return error ER_SYSTEM_MODEL_REF", function(done){
		SystemModels.drop(new_sys_model.uuid, function(err){
			assert.equal("ER_SYSTEM_MODEL_REF", err);
			done();
		});
	});
});

describe("delete   contact by system_id.", function(){
	it("should delete without error", function(done){
		Contacts.dropBySystemId(new_system.uuid,function(err,ret){
			console.log("err:%s,ret:%s",err,ret);
			assert.equal(null,err);
			done();
		});
	});
});
describe("Delete System", function(){
	it("should delete without error", function(done){
		Systems.drop(new_system.uuid, function(err){
			assert.equal(null, err);
			done();
		});
	});
});