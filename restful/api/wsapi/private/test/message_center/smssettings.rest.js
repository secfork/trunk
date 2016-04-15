var benchrest = require('bench-rest');
var assert = require('assert');

var base = "http://localhost:3000/";

var runOptions={
    limit: 10,     // concurrent connections
    iterations: 1  // number of iterations to perform
  };


var sms_sp_setting = {
	"sms_sp_host":"http://www.stongnet.com/sdkhttp/sendsms.aspx?reg=101100-WEB-HUAX-070187&pwd=HOJPMRPH&sourceadd=111",
	"sms_sp_msg_fields":"content",
	"signer":"【test】",
	"sms_sp_phone_fields":"phone"
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

 describe('get sms setting ', function () {
	it("should get sms setting without error", function(done){
		var url = base+"account/"+account_id+"/smssetting";
		var flow = {
			main: [{ get: url,
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
 describe('set sms setting ', function () {
	it("should set mail setting without error", function(done){
		var url = base+"account/"+account_id+"/smssetting";
		sms_sp_setting.signer="【ThingLinx】";
		var flow = {
			main: [{ put: url,json:sms_sp_setting,
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