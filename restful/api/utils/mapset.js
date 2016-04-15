module.exports = function map_set(arr, keys) {
	var fields = {};

	if (keys.length == 1) {
		arr.forEach(function(row){
			fields[ row[keys[0]] ] = row;
		});
	}
	else { // keys.length > 1
		var key_ = keys[0], sub_fields_ = {};

		// slice by key1
		arr.forEach(function(row){
			var field_name_ = row[key_];

			if (!sub_fields_.hasOwnProperty(field_name_))
				sub_fields_[field_name_] = [];

			sub_fields_[field_name_].push(row);
		});

		// Recursive call map_set
		for (var fil_name in sub_fields_) {
			fields[fil_name] = arguments.callee(sub_fields_[fil_name], keys.slice(1));
		}
	}

	return fields;
};