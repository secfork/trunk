var module = angular.module("controller.alertController" , []);

/**
 *	@name : alert controller
 *	@kind : controller
 *	@description :
 *		提示框 controller
 */
module.controller('alertController' , ['$scope' ,

	function($scope){

		$scope.state = false;
		$scope.info = "";

		$scope.close = function(){
			$scope.state = false;
		}
		$scope.open = function(){
			$scope.state = true;
		}

	}

]);
