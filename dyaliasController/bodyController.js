var module = angular.module("controller.bodyController" , []);

/**
 *	@name : dy main controller
 *	@kind : function
 *	@description :
 *		main controller 在 dyalias 系统中作为一个全局的 controller ， 绑定在 dyalias.html <html>标签上
 *		main controller $scope 是 dyalias 系统中作用域在大的scope，可以在任意page或者component中调用
 *		main controller中属性和方法都可以被其他的controller所调用
 *		系统中所有元素操作，都添加到main controller中，主要操作包括，复制，粘贴，全选，选中view外层区域，取消选中
 */
module.controller('bodyController' , ['$scope' , '$rootScope' , '$http' , '$urlParams' , '$_pageSave' , '$compile' ,  '$service_progress' , '$timeout' , '$service_hint' , '$service_undo' , '$console' , '$language' , '$_getAccessKey' , '$service_clock' , '$componentsControllerFactory' , '$injector' , '$datasource_factory' ,

	function($scope , $rootScope , $http , $urlParams , $_pageSave , $compile , $service_progress , $timeout , $service_hint , $service_undo , $console , $language , $_getAccessKey , $service_clock , $componentsControllerFactory , $injector , $datasource_factory){

		// 定义变量，控制初始化加载进度条显示/隐藏
		$scope.loading = false;
		$scope.imagePlayerState = false;
		$scope.runSystemName = "dyalias";

		/*	初始化操作
			*	初始化 , 加载组件所需的Controller
			* 	初始化 cookie
			*	初始化系统UI语言
		*/
		$componentsControllerFactory.init(function(ret){
			if(ret)
			{
				$console.log("Component Controller Files Load Success" , "Good !!!");
			}
			else
			{
				$console.log("Component Controller Files Load Fail" , "Bad !!!");
			}
		})

		$_getAccessKey.init("dyalias");

		$language(function(data){
			$scope.glanguage = data;
		})

		/*	创建系统全局变量	*/
		// currentSelectElement , 当前选中的元素 , 可以选中一个view区域 , 也可以选择是一个栅格 , 也可以是一个组件
		$scope.currentSelectElement = {"name" : null};
    // 组态标志
    $scope.use_system = "dyalias" ;

		// 通知服务
		$scope.rootBroadcast = function(name , params){
			$rootScope.$broadcast(name , params);
		}

		//  系统初始化 , 主动加载数据源对象
		$datasource_factory.init(function(){
			$scope.loading = true;
		});

		// 动态添加元素列表
		$scope.toggleElementList = function(){
			$("#elementListTreeOuter").empty();
			var eletree = $compile('<div element-tree ng-model="elementList"></div>')($("#elementListTreeOuter").scope());
			$("#elementListTreeOuter").append(eletree);
		}
	}

]);
