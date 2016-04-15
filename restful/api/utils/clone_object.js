module.exports = function (dest, source, is_create) {
	// add or set
	for (var key in source) {
		dest[key] = source[key];
	}

	if (is_create)
		return;

	// remove
	for (var key in dest) {
		if (!source.hasOwnProperty(key))
			delete dest[key];
	}	
};