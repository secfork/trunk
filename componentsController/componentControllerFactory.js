/**
 *	@name : component service factory
 *	@kind : service factory
 *	@description : 加载所有组件使用的controller
 */

var module = angular.module("componentsController.factory" , []);

module.service('$componentsControllerFactory' , ['$ocLazyLoad' , '$_componentControllerGet' , function( $ocLazyLoad , $_componentControllerGet){

	// component controller factory
	var componentControllerFactory = {
		// 标记当前所有组件依赖的controller是否加载完成
		state : false,
		// 初始化所有组件所需要的controller
		init : function(callback){
			var _this = this;
			$_componentControllerGet(function(data){
				if(data)
				{
					var fileNameList = data;
					$ocLazyLoad.load([fileNameList]).then(function () {
						_this.state = true;
						callback(true);
					}, function (e) {
						callback(false);
					});
				}
			})
		}

	}

	return componentControllerFactory ;

}]);
