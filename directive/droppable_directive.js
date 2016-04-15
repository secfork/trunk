var module = angular.module("dyaliasApp.dy_droppable" , []);
// 组件绑定拖拽功能
module.directive('droppable' , function($document , $compile) {
    
	return function(scope, element, attr) {
		
		move_component = function( parent , item ){
			// 如果组件拖拽前后在同一个view下，什么都不做
			if( parent.is(item.parent()) ){
				return ;
			}else{
				/**
					如果组件拖拽到另一个view下
					首先，在另一个view下复制一个组件
					删除之前view中的组件					
				*/ 
				var old_name = item.children()[0].id ;
				// copy
				var item_directive = item.clone().empty();
				var dom = $compile( item_directive )( scope );
				dom.css("left" ,  "0");
				dom.css("top" ,  "0");
				parent.append(dom) ;
				
				setTimeout(function(){
					var new_name = dom.children()[0].id;
					scope.$apply(function(){				
						$.each(scope.element_list , function(idx , val){
							$.each(val.child , function(cidx , cval){
								cval.state = "unactive";
								if(cval.component_name == old_name){
									cval.component_name = new_name;
								}
							})
						})					
					});
				} , 500)
				
				// delete
				item.remove();
			}
			
		}
		
		element.droppable({
			accept: ".dy_component_model",
			over : function(evt , ui){
				$("div").removeClass( "dropp_view" );
				$( this ).addClass( "dropp_view" );
			},
			drop: function( event, ui ) {	
				$("div").removeClass( "dropp_view" );
				move_component( $(this) , ui.draggable );
			}
		})
			
		
    };

});


