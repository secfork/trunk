
/* 
	usage, eg.
	
	var parallel = require('run_arallel')
	 
	parallel([
	  function (callback) {
	    setTimeout(function () {
	      callback(null, 'one')
	    }, 200)
	  },
	  function (callback) {
	    setTimeout(function () {
	      callback(null, 'two')
	    }, 100)
	  }
	],
	// optional callback 
	function (err, results) {
	  // the results array will equal ['one','two'] even though 
	  // the second function had a shorter timeout. 
	})
*/
function run_parallel(tasks, cb) {
	var results = [], pending = tasks.length;
	
	function done(i, err, result){
		results[i] = result;
		if (--pending === 0 || err) {
			cb && cb(err, results);
			cb = null;
		}
	}

	if (!pending) { // empty
		cb && cb(null, results);
		cb = null;
	}
	else{
		tasks.forEach(function(task, i){
			task(done.bind(undefined, i));
		});
	}
}

module.exports = run_parallel;