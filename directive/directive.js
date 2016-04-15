/**
	系统 directive 类，完成通用的directive
*/
var module = angular.module("dyaliasApp.dy_directive" , []);

// 监测输入框 ng-model 输入数据在0-100以内的正整数
module.directive('inputLengthLimitOne' ,

	function(){

		return {
			restrict:'A',
			require:'ngModel',
			link:function(scope, element, attrs, ngModelCtrl) {

				if(!ngModelCtrl) {
					return;
				}

				ngModelCtrl.$parsers.push(function(val) {
					if (angular.isUndefined(val))
					{
						ngModelCtrl.$setViewValue(0);
						ngModelCtrl.$render();
						return 0;
					}
					if (!angular.isNumber(val))
					{
						ngModelCtrl.$setViewValue(0);
						ngModelCtrl.$render();
						return 0;
					}
					var reg = new RegExp("^(100|[1-9]\\d|\\d)$");
					var res = reg.test(val);
					if (!res)
					{
						ngModelCtrl.$setViewValue(0);
						ngModelCtrl.$render();
						return 0;
					}

					return val;
				});
			}
		}

	}

);


// 监测输入框 ng-model 输入数据在3-10以内的正整数
module.directive('inputLengthLimitTwo' ,

	function(){

		return {
			restrict:'A',
			require:'ngModel',
			link:function(scope, element, attrs, ngModelCtrl) {
				if(!ngModelCtrl) {
					return;
				}

				ngModelCtrl.$parsers.push(function(val) {
					if (angular.isUndefined(val))
					{
						ngModelCtrl.$setViewValue(0);
						ngModelCtrl.$render();
						return 0;
					}
					if (!angular.isNumber(val))
					{
						ngModelCtrl.$setViewValue(0);
						ngModelCtrl.$render();
						return 0;
					}
					var reg = new RegExp("[3-10]\\d|\\d");
					var res = reg.test(val);
					if (!res)
					{
						ngModelCtrl.$setViewValue(0);
						ngModelCtrl.$render();
						return 0;
					}
					return val;

				});
			}
		}

	}

);


// 监测输入框 ng-model 输入数据在0-1000以内的正整数
module.directive('inputLengthLimitThree' ,

	function(){

		return {
			restrict:'A',
			require:'ngModel',
			link:function(scope, element, attrs, ngModelCtrl) {
				if(!ngModelCtrl) {
					return;
				}

				ngModelCtrl.$parsers.push(function(val) {
					if (angular.isUndefined(val))
					{
						ngModelCtrl.$setViewValue(0);
						ngModelCtrl.$render();
						return 0;
					}
					if (!angular.isNumber(val))
					{
						ngModelCtrl.$setViewValue(0);
						ngModelCtrl.$render();
						return 0;
					}
					var reg = new RegExp("^([1-9][0-9]{0,2}|1000)$");
					var res = reg.test(val);

					if (!res)
					{
						ngModelCtrl.$setViewValue(0);
						ngModelCtrl.$render();
						return 0;
					}
					return val;

				});
			}
		}

	}

);


// 将输入的时间转化成1970年到当前时间毫秒数
module.directive('tranlateTime' ,

	function($filter){

		return {
			restrict:'A',
			require:'ngModel',
			link:function(scope, element, attrs, ngModelCtrl) {
				if(!ngModelCtrl) {
					return;
				}
				ngModelCtrl.$parsers.push(function(data) {
					return $filter('date')(data, "yyyy-MM-ddTHH:mm:ss");
				});
				ngModelCtrl.$formatters.push(function (data) {
					var a = $filter('date')(data, "yyyy-MM-ddTHH:mm:ss");
					return new Date(a);
				});
			}
		}

	}

);
