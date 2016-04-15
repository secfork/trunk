var module = angular.module("directive.selectorDirective" , []);
// view 绑定选定功能
module.directive('selectorDirective' , function($document , $compile) {
	return function(scope, element, attr) {
		element.on('click' , function(evt){
			// 获取当前选中元素名字
			var currSelectElementName = $(this).attr("id");
			// 取消click事件冒泡，只允许用户选择最顶层(能够选择到的)元素
			evt.stopPropagation() ;

			// 当前元素选中 , 通知其他元素取消选中
			scope.$parent.rootBroadcast("COMPONENT_SELECTED" , currSelectElementName);

			// 记录当前选中的模块
			scope.$parent.currentSelectElement.name = currSelectElementName;

			//元素列表对应模块同步选中
			$('#elementListTreeOuter').scope().currentSelectedElementId = currSelectElementName;

		});
    	};
});
