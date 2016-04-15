var module = angular.module("dyaliasApp.dy_selectable" , []);
// 组件绑定拖拽功能
module.directive('selectable' , function($document , $compile , $timeout) {

	return function(scope, element, attr) {

		// 框选元素列表
		var mult_ele_list = [];
		var isRef = false;

		element_selected = function(m){
			if(scope.$parent.element_list.length == 0){return;}
			$timeout(function(){
				$.each(scope.$parent.element_list , function(idx , val){
					$.each(val.child , function(cidx , cval){
						$.each(m , function(zidx , zval){
							if(cval.component_id == zval){
								cval["state"] = "active";
							}
						})
					})
				})
			} , 500)
		}

		element.selectable({
			delay: 150,
			cancel : ".dy_widget_property_frame",
			start: function( event, ui ) {
				// 初始框选时，先将框选列表至空
				mult_ele_list = [];
				isRef = false;
			},
			selecting: function( event, ui ) {
				var cname ;
				if(ui.selecting.id){
					cname = ui.selecting.id;
				}else{
					return;
				}
				if(cname == "set_property"){
					return;
				}
				if(!isRef){
					scope.reference = cname;
					scope.$parent.reference = cname;
					isRef = true;
					mult_ele_list.push(cname);
				}else{
					mult_ele_list.push(cname);
				}

			},
			stop: function( event, ui ) {
				element_selected(mult_ele_list);
			}
		})


    };

});
