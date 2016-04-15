/**
 *	@name : syalias system interface
 *	@kind : object
 *	@description : 提供用户引用 syalias 接口，允许用户跳转页面以及处理一些其他操作
 */
(function(){
	
	this.SYALIAS = {
		
		angular : "" ,
		
		init : function(ifame_id){
			if(ifame_id){
				this.angular = window.frames[ifame_id].angular.element("html").scope();
			}
		},
		
		goto_page : function(page_name){
			if(this.angular){
				this.angular.jump_to_page(page_name);
			}
		},
		
		get_datasource : function(datasource_name , callback){
			var _this = this;
			if(this.angular){
				if(!this.angular.datasource_load){
					setTimeout(function(){
						_this.get_datasource(datasource_name , callback);
						
					} , 200);
				}else{
					var datasource_factory = this.angular.get_datasource_factory(); 
					var ret ;
					$.each(datasource_factory.source , function(idx , val){
						if(val.name == datasource_name){
							ret = val;
						}
					});
					callback(ret);
				}
			}
		}
		
	}
	
})(window)

