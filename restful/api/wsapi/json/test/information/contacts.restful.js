require("../config/account_init");
var Accounts = require('../../../../account');
var  accounts = Accounts.Accounts;
 var benchrest = require('bench-rest');
 var assert = require('assert');
var runOptions = require('../config/runOptions');
var base = require('../config/baseUrl');

var auth_url = base+"/v2/json/auth"

var accessKey;

var contact_1 = {
	"last_name":"yin",
	"first_name":"Godfrey",
	"email":"testUser1@emample.com",
	"tel":"123",
	"mail_notice":1,
	"sms_notice":1,
	"mobile_phone":18801044236
}

var contact_2 = {
	"last_name":"xxx",
	"first_name":"huahua",
	"email":"testUser2@emample.com",
	"tel":"1234",
	"mail_notice":1,
	"sms_notice":1,
	"mobile_phone":18801044236
}

var system_model = {
	name:"system_model_"+Date.now().valueOf()
}
var system = {
	"name":"system_"+Date.now().valueOf(),
	"sn":"sn/abc_"+Date.now().valueOf()
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
	return all;
}

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
		    done();
		 });   
	});
});

describe('create system ', function () {
	it("should create system without error", function(done){
		var url = base+"/v2/json/systems?accesskey="+accessKey;
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

describe('create contact ', function () {
	it("should create contact without error", function(done){
		var url = base+"/v2/json/contacts?accesskey="+accessKey;
		contact_1.system_id = system.id;
		var flow = {
			main: [{ post: url, rejectUnauthorized: false, json:contact_1,
		    	afterHooks: [ 
		    	function (all) {
		    		contact_1.id= all.body.ret;
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

describe('get  contact by id ', function () {
	it("should get contact without error", function(done){
		var url = base+"/v2/json/contacts/"+contact_1.id+"?accesskey="+accessKey;
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


describe('get  contact by system id ', function () {
	it("should get contact by system id without error", function(done){
		var url = base+"/v2/json/systems/"+system.id+"/contact?accesskey="+accessKey;
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

describe('modify  contact by id ', function () {
	it("should modify contact without error", function(done){
		var url = base+"/v2/json/contacts/"+contact_1.id+"?accesskey="+accessKey;
		var flow = {
			main: [{ get: url, rejectUnauthorized: false,json:contact_1,
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


describe('modify  contact by system id ', function () {
	it("should modify contact by system id without error", function(done){
		var url = base+"/v2/json/systems/"+system.id+"/contact?accesskey="+accessKey;
		var flow = {
			main: [{ put: url, rejectUnauthorized: false,json:contact_1,
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
describe('list  contacts ', function () {
	it("should list contacts by system id without error", function(done){
		var url = base+"/v2/json/query/contacts?accesskey="+accessKey;
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

describe('drop  contact by id ', function () {
	it("should drop contact without error", function(done){
		var url = base+"/v2/json/contacts/"+contact_1.id+"?accesskey="+accessKey;
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


describe('drop  contact by system id ', function () {
	it("should drop contact by system id without error", function(done){
		var url = base+"/v2/json/systems/"+system.id+"/contact?accesskey="+accessKey;
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
		    	assert.equal("ER_CONTACT_NOT_EXISTS", err);
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
	it("should delete system model without error", function(done){//debugger
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
		    	assert.equal(null, err);
		    	done();
		     })
		    .on('end', function (stats, errorCount){
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