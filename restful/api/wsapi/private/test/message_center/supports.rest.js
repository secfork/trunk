var benchrest = require('bench-rest');
var assert = require('assert');

var base = "http://localhost:3000/msgcenter";
var query = "http://localhost:3000/query/msgcenter";

var runOptions={
    limit: 10,     // concurrent connections
    iterations: 1  // number of iterations to perform
  };


var support_service_mail = {
	"service_name":"mail",
	"support":1
}
var support_service_sms= {
	"service_name":"sms",
	"support":1
}
var support_service_wechat = {
	"service_name":"wechat",
	"support":0
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

 describe('create support service ', function () {
	it("should support service without error", function(done){
		var url = base+"/services";
		var flow = {
			main: [{ post: url, json:support_service_mail,
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

 describe('get support service mail  ', function () {
	it("should get sms setting without error", function(done){
		var url = base+"/services/"+support_service_mail.service_name;
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

 describe('list support service   ', function () {
	it("should list support service  without error", function(done){
		var url = query+"/services";
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
 describe('set support service  ', function () {
	it("should set  support service  without error", function(done){
		var url = base+"/services/"+support_service_mail.service_name;
		support_service_mail.support=0;
		var flow = {
			main: [{ put: url,json:support_service_mail,
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

 describe('drop support service of mail ', function () {
	it("should drop support service of mail  without error", function(done){
		var url = base+"/services/"+support_service_mail.service_name;
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