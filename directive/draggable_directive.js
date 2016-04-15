/**
 *	@name : dyalias application draggable directive
 *	@kind : directive
 *	@description : component draggable directive
 */
var module = angular.module("dyaliasApp.dy_draggable" , []);
// 组件绑定拖拽功能
module.directive('draggable' , function($document , $compile) {
	return function(scope, element, attr) {

		var set_component_state = function(pname , cname , multiSelect){

			$.each(scope.element_list , function(idx , val){
				if(val.page_name == pname)
				{
					$.each(val.child , function(cidx , cval){
						if(multiSelect){
							if(cval.state != "active"){
								if(scope.reference == "" || scope.$parent.reference == ""){
									scope.reference = cname;
									scope.$parent.reference = cname;
								}
								if(cval.component_id == cname){
									cval.state = "active";
								}
							}else{
								if(cval.component_id == cname){
									scope.reference == ""
									scope.$parent.reference = "";
									cval.state = "unactive";
								}
							}
						}else{
							scope.reference = cname;
							scope.$parent.reference = cname;
							if(cval.component_id == cname){
								cval.state = "active";
							}else{
								cval.state = "unactive";
							}
						}
					})

					return;
				}
			})

		}

		element.on('click' , function(evt){
			// 点击view模块，隐藏左侧工具栏
                  //scope.$parent.closeLeftToolBar();

			$("#view_edit").css("display" , "none");

			var pageId = $(this).parent().parent().attr("id");
			var componentId = $(this).children().attr("id");

			// 取消click事件冒泡，只允许用户选择最顶层(能够选择到的)元素
			evt.stopPropagation() ;

			// 选中模型后，取消其他模型z-index临时提升
			$("div").removeClass("selected");

			// 提升当前组件所在view的z-index
			$(this).parent().addClass('selected');

			// 提升当前组件自身的 zIndex
			$(this).addClass("selected");

			// 如果点击模型后，取消除自身以外所有模型的属性栏开启状态
			scope.$broadcast("COMPONENT_CLOSE_PROPERTY" , componentId);

			// 设置元素列表中，当前点击组件变为反选状态

			scope.$apply(function(){

				var multiSelect = false;
				if(!scope.ctrlDown){
					multiSelect = false;
				}else{
					multiSelect = true;
				}

				set_component_state(pageId , componentId , multiSelect);

			});

		});


    };

});
