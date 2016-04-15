var shortid = require('shortid');
var genId = require('gen-id')('XX');

function UniqueShortId(seed){
	var seed_;
	
	this.seed = function(seed){
		if (seed){
			seed_ = seed;
		}
		else{
			seed_ = genId.generate();
		}
	};

	this.generate = function(){
		return shortid.generate() + (seed_ ? seed_ : "");
	}

	this.seed(seed);
}

module.exports = UniqueShortId;