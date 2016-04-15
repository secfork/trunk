/**
 *	@name : application.common_filter
 *	@kind : filter
 *	@description : 
 *		通用的filter lib，提供指定的过滤功能
 *  filter命名规范 : $filter_
 */
 
var module = angular.module("application.common_filter" , []);


/**
 *	@name : $filter_json
 *	@kind : filter
 *	@description : 
 *		由于升级angularjs版本，v1.4.7 版本filter不在支持过滤json，本方法补充过滤json
 *	@use :   ng-repeat="list in pop_list | $filter_json:searchText" 
 * 			 pop_list = [ {name : xx , value :xx},...]
 *  		 会根据json中所有的value进行检索
 */
module.filter('$filter_json' ,  function(){

	return function(input, search) {
		if (!input) return input;
		if (!search) return input;
		var expected = ('' + search).toLowerCase();
		var result = {};
		angular.forEach(input, function(value, key) {
			angular.forEach(value , function(v , k){
				var actual = ('' + v).toLowerCase();
				if (actual.indexOf(expected) !== -1) {
					result[key] = value;
				}
			})
		});
		return result;
	}
	
});
