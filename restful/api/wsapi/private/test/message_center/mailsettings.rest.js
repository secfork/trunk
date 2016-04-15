var benchrest = require('bench-rest');
var assert = require('assert');

var base = "http://localhost:3000/";

var runOptions={
    limit: 10,     // concurrent connections
    iterations: 1  // number of iterations to perform
  };


var mail_server_params ={
		"host":"smtp.qiye.163.com",
		"port": 25,
		"secure":false,
		"maxConnections": 5,
		"maxMessages": 10
}

var mail_server_setting = {
	"mail":"thinglinx@sunwayland.com.cn ",
	"passwd":"admin",
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

 describe('get mail setting ', function () {
	it("should get mail setting without error", function(done){
		var url = base+"account/"+account_id+"/mailsetting";
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
 describe('set mail setting ', function () {
	it("should set mail setting without error", function(done){
		var url = base+"account/"+account_id+"/mailsetting";
		mail_server_setting.passwd="baijing4";
		var flow = {
			main: [{ put: url,json:mail_server_setting,
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
