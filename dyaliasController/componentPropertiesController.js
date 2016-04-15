/**
 *	@name : component properties controller
 *	@kind : controller
 *	@description : 组件显示属性列表
 */
var module = angular.module("controller.componentPropertiesController" , []);

module.controller('componentPropertiesController' , ['$scope' , '$element' , '$timeout' , '$compile' ,

	function($scope , $element , $timeout ,$compile){

		$scope.regist = function( id , directive ){
			// 获取当前选中的组件 scope
			var componentScope = $("#" + id).scope();
			// 获取组件的data
			var cbase = componentScope.base;
			var cstyle = componentScope.style;
			var cdata = componentScope.data;
			// 创建组件属性列表
			$element.empty();
			// 将组件属性列表添加到属性栏中
			var contentCompile = $compile( directive )( $scope );
			$element.append(contentCompile);
			// 属性列表编辑完成后 , 获取组件属性 scope
			$timeout( function(){
				 var componentPropertiesScope = $(contentCompile).scope();
				 if (!componentPropertiesScope) {
					 return;
				 }
				 componentPropertiesScope.base = cbase;
				 componentPropertiesScope.style = cstyle;
				 componentPropertiesScope.data = cdata;
			} , 0);
		}

	}

]);
