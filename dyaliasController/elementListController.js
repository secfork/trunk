/**
 *	@name : element list controller
 *	@kind : controller
 *	@description : 显示元素列表
 */
var module = angular.module("controller.elementListController" , []);

module.controller('elementListController' , ['$scope' , '$compile' ,

	function($scope , $compile){


		/*
		 	$scope.elementList 元素列表 , 显示当前所有存在的元素 , 每个元素以json形式表现
			$scope.elementList = [
				{
					id : xx
					name : xx
					display : true
					locked : false
					logo : xx
				},
				....
			]
			elementList 存储的是组件的 base 信息
		*/
		$scope.elementList = [];

		$scope.currentSelectedElementId;

		$scope.findElement = function(elementList , id , callback){
			if(elementList.length == 0)
			{
				return;
			}
			$.each(elementList ,  function(idx , val){
				if(val.id == id)
				{
					callback(idx , val , elementList)
				}
				else
				{
					$scope.findElement(val.children , id , callback);
				}
			})
		}

		// 注册功能由组件新添加到系统时 , 自动调用 , 并将组件的base json传入到参数中
		$scope.regist = function(eleBase){
			eleBase.children = [];
			if(eleBase.parentId == "dyaliasDrawArea" || !eleBase.parentId)
			{
				$scope.elementList.push(eleBase);
			}
			else
			{
				$scope.findElement($scope.elementList , eleBase.parentId , function(idx , ele , elist){
					if(ele)
					{
						ele.children.push(eleBase);
					}
				})
			}
		}

		$scope.setDisplay = function(base){
			$.each($scope.elementList , function(idx , val){
				if(val.id == base.id)
				{
					if(val.display == 'flex')
					{
						val.display = "none";
					}
					else
					{
						val.display = "flex";
					}
				}
			})
		}

		$scope.elementDelete = function(id){
			//面板上删除元素
			$("#" + id).remove();
			//elementList中删除
			// deleElement($scope.elementList,id);
		}

		$scope.elementSelected = function(json){

			var id = json.id;
			var pname = json.name;
			//广播选中
			$scope.$parent.rootBroadcast("COMPONENT_SELECTED" , id);
			//可添加元素,选中
			$scope.$parent.currentSelectElement.name = id;
			//元素列表,选中
			$scope.currentSelectedElementId = id;
			//页面列表,选中
			var pageScope = $('#uiEditorPanelPages').scope();
			// 如果是页面
			if(json.parentId==null){
				$.each(pageScope.pageList , function(idx , val){
					if(val.name == pname)
					{
						val.state = "active";
						$("#" + val.id).scope().base.display = "flex";
						oldName = pname;
					}
					else
					{
						val.state = "unactive";
						$("#" + val.id).scope().base.display = "none";
						val.editor = true;
					}
				})
			}
		}

	}

]);
