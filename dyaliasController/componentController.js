/**
 *	@name : component controller
 *	@kind : controller
 *	@description : 页面上显示所有组件,并且允许用户添加组件
 */
var module = angular.module("controller.componentController" , []);

module.controller('componentController' , ['$scope' , '$element' , '$http' , '$compile' , 'uiLoad' , '$timeout' , '$service_hint' , '$_componentGet' , '$componentsControllerFactory' , '$console' ,

	function($scope , $element , $http , $compile , uiLoad , $timeout , $service_hint , $_componentGet , $componentsControllerFactory , $console){

		// this controller init , load component relationship
		$scope.components_relationship ;
		$scope.component_list = [];

		$_componentGet("" , function(data){
			$scope.components_relationship = data.ret;
			$scope.get_all_components(data.ret);
		})

		$scope.add_component = function(sid){
			var id = parseInt(sid) + 1;
			// 如果没有模块选中 , 则不能添加模块
			if(!$scope.$parent.currentSelectElement.name)
			{
				$service_hint.hint_widget("选择需要添加的模块");
				return;
			}

			$_componentGet(id , function(data, status){
				if(!data || data.err){return;}

				var dom_str = data.ret.content;
				var controller = data.ret.controller;

				if($componentsControllerFactory.state)
				{
					var dom = $compile( dom_str )( $("#dyaliasDrawArea").scope() );

					// 将组件添加到指定的view模块中
					//$($scope.view_selected.content).append(dom);
					$("#" + $scope.$parent.currentSelectElement.name).append(dom);
					$console.log("组件创建成功");
				}
				else
				{
					$componentsControllerFactory.init(function(args){
						if(args)
						{
							var dom = $compile( dom_str )( $("#dyaliasDrawArea").scope() );

							// 将组件添加到指定的view模块中
							//$($scope.view_selected.content).append(dom);
							$("#" + $scope.$parent.currentSelectElement.name).append(dom);
							$console.log("组件创建成功");
						}
						else
						{
							$console.log("页面列表初始化失败")
						}
					})
				}

			});

		}


		// 初始化，加载所有的组件信息，展示在组件列表中
		$scope.get_all_components = function(data){

			$(".componentList").mCustomScrollbar({axis:"yx"});
			if($scope.component_list.length == 0){
				$.each(data , function(idx , val){
					$scope.component_list.push(val);
				})
			}
		}

	}

]);
