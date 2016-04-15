 require("./init");
 var Info = require('../../../../model_info');
 var benchrest = require('bench-rest');
 var assert = require('assert');
var runOptions = require('./runOptions');
var Systems = Info.Systems;
var Profiles = Info.Profiles;
var Daservers = Info.Daservers;
var SystemModels = Info.SystemModels;


var 	private_url = require('./privateUrl')+"/info";
	
var account_id = 1;
var new_sys_model = {
	name : "system_model_" + Date.now().valueOf(),
	account_id : account_id,
	mode : 1	// Managed 
};

var new_system_1 = {
	name : "system_" + Date.now().valueOf(),
	account_id : account_id,
	sn : "sn_"+Date.now().valueOf()
};



var profile_1 = {
	name : "profile_1"
};
var daserver_1 = {
	"name":"daserver_1",
	"desc":"test"
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

describe("Create System Model " +new_sys_model.name, function(){
	it("should create without error", function(done){
		SystemModels.create(new_sys_model, function(err, sys_model_id){
			assert.equal(null, err);
			assert.equal(false, !sys_model_id);
			new_sys_model.uuid = sys_model_id;
			done();
		});
	});
});

describe("Create System "+new_system_1, function(){
	it("should create without error", function(done){
		new_system_1.model=new_sys_model.uuid;
		Systems.create(new_system_1, function(err, new_system_id){
			assert.equal(null, err);
			assert.equal(false, !new_system_id);

			new_system_1.uuid = new_system_id;

			done();
		});
	});
});

var new_system_2 = {
	name : "system2_" + Date.now().valueOf(),
	account_id : account_id,
	sn : "sn2_"+Date.now().valueOf()
};
describe("Create System "+new_system_2.name, function(){
	it("should create without error", function(done){
		new_system_2.model=new_sys_model.uuid;
		Systems.create(new_system_2, function(err, new_system_id){
			assert.equal(null, err);
			assert.equal(false, !new_system_id);

			new_system_2.uuid = new_system_id;

			done();
		});
	});
});

describe("Set System model comm_type "+new_system_2.name, function(){
	it("should Set System model comm_type without error", function(done){
		var fields = {
			"comm_type":1
		}
		SystemModels.set(new_sys_model.uuid,fields, function(err, ret){
			assert.equal(null, err);
			done();
		});
	});
});

describe("Create Profile " + profile_1.name, function(){
	it("should create without error", function(done){
		profile_1.system_model = new_sys_model.uuid;
		Profiles.create(profile_1, function(err, profile_id){
			assert.equal(null, err);
			assert.equal(false, !profile_id);

			profile_1.uuid = profile_id;
			done();
		});
	});
});
describe("Create daserver " + daserver_1.name, function(){
	it("should create without error", function(done){
		Daservers.create(daserver_1, function(err, daserver_id){
			assert.equal(null, err);
			assert.equal(false, !daserver_1);

			daserver_1.id = daserver_id;
			done();
		});
	});
});



describe('assign daserver  ', function (done) {
	it("should assign daserver without error", function(done){
		var url = private_url+"/systems/"+new_system_1.uuid+"/assign";
		var flow = {
			main: [{ put: url,
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

describe('get need update systems ', function (done) {
	it("should get need update systems without error", function(done){
		var url = private_url+"/needupdate/systems?id="+new_system_1.uuid+"&id="+new_system_2.uuid;
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

describe("Delete System "+new_system_1.name, function(){
	it("should delete without error", function(done){
		Systems.drop(new_system_1.uuid, function(err){
			assert.equal(null, err);
			done();
		});
	});
});

describe("Delete System "+new_system_2, function(){
	it("should delete without error", function(done){
		Systems.drop(new_system_2.uuid, function(err){
			assert.equal(null, err);
			done();
		});
	});
});

describe("Delete Profile " + profile_1.name, function(){
		it("should delete without error", function(done){
			Profiles.drop(profile_1.uuid, function(err){
				assert.equal(null, err);
				done();
			});
		});
	});


describe("Delete daserver "+daserver_1.name, function(){
	it("should delete without error", function(done){
		Daservers.drop(daserver_1.id, function(err){
			assert.equal(null, err);
			done();
		});
	});
});

describe("Delete System Model", function(){
	it("should delete without error", function(done){
		SystemModels.drop(new_sys_model.uuid, function(err){
			assert.equal(null, err);
			done();
		});
	});
});

