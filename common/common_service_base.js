/**
 *	@name : application.common_service_base
 *	@kind : service
 *	@description :
 *		common service base 向系统提供基础服务，一些通用的服务，都封装到本service中
 */

var module = angular.module("application.common_service_base" , []);


/**
 *	@name : service_clock
 *	@kind : service
 *	@description :
 *	系统向component&controller提供时间触发器
 *	$service_clock 提供不同时间周期的时钟，按照定义的周期发送固定名称的事件，如果component&controller有需要，可以直接根据名字相应
 *	$service_clock : 提供的时间周期包括
 *	* 刷新周期 : 100ms , 响应事件名称 "100ms"
 *	* 刷新周期 : 300ms , 响应事件名称 "300ms"
 *	* 刷新周期 : 500ms , 响应事件名称 "500ms"
 *	* 刷新周期 : 30000ms , 响应事件名称 "30000ms"
 */
module.service('$service_clock' , ['$rootScope' , '$timeout' , function($rootScope , $timeout){
	this.clock = {
		ms_100 : function(){
			var msg_emit = function(){
				$timeout(function(){
					$rootScope.$broadcast("100ms" , "100ms");
					msg_emit();
				} , 100);
			}
			msg_emit();
		},
		ms_500 : function(){
			var msg_emit = function(){
				$timeout(function(){
					$rootScope.$broadcast("500ms" , "500ms");
					msg_emit();
				} , 500);
			}
			msg_emit();
		},
		// 5分钟
		ms_300000 : function(){
			var msg_emit = function(){
				$timeout(function(){
					$rootScope.$broadcast("300000ms" , "300000ms");
					msg_emit();
				} , 300000);
			}
			msg_emit();
		},
		// 1小时
		ms_3600000 : function(){
			var msg_emit = function(){
				$timeout(function(){
					$rootScope.$broadcast("3600000ms" , "3600000ms");
					msg_emit();
				} , 3600000);
			}
			msg_emit();
		}

	}
	this.clock.ms_100();
	this.clock.ms_500();
	this.clock.ms_300000();
	this.clock.ms_3600000();
}]);


/**
 *	@name : $service_hint
 *	@kind : service
 *	@description :
 *	系统提供工具类，用来设置提示信息
 */
module.service('$service_hint' , ['$timeout' , function($timeout){
	var _this = this;
	this.hint_widget = function(message){
		// if dy_hint not exist
		// if(!$("#dy_warning").length){
		// 	$timeout(function(){
		// 		_this.hint_widget(message);
		// 		return ;
		// 	},300);
		// }
		// if dy_hint exist
		// $("#dy_warning").finish();
		// $("#dy_warning").find("span").html(message);
		// $("#dy_warning").css("display" , "block");
		// $("#dy_warning").delay(10000).slideUp(1000);
	}
}]);


/**
 *	@name : $service_progress
 *	@kind : service
 *	@description :
 *	进度条控制服务，提供用户可以开启控制条，关闭进度条
 */
 module.service('$service_progress' , ['$timeout' , function($timeout){
	var _this = this;
	var progress_widget ;
	var statue = false;
	this.widget_load = function(){
		if(!$("#dy_progress").length || $("#dy_progress").length == 0){
			$timeout(function(){
				_this.widget_load();
				return ;
			},300);
			return ;
		}
		progress_widget = $("#dy_progress");
		// if progress widget exist
		progress_widget.css("background-color" , "#0081FF");
		if(!statue){
			statue = true;
			left_loop();
		}
	}
	var left_loop = function(){
		progress_widget.css("width" , "0%");
		if(!statue){return}
		progress_widget.animate ({
            width: '100%',
        }, 5000, 'linear', function() {
            right_loop();
        });
	}
	var right_loop = function(){
		progress_widget.css("width" , "100%");
		if(!statue){return}
		progress_widget.animate ({
            width: '0%',
        }, 5000, 'linear', function() {
            left_loop();
        });
	}
	this.start = function(){
		//_this.stop();
		// get progress widget
		_this.widget_load();
	}
	this.stop = function(){
		if(!progress_widget){
			return;
		}
		statue = false;
		progress_widget.stop();
		progress_widget.css("width" , "0%");
	}
}]);


/**
 *	@name : $service_undo
 *	@kind : service
 *	@description :
 *	提供 undo redo方法
 */
module.service('$service_undo' , ['$rootScope' , '$compile' , '$timeout' , function($rootScope , $compile , $timeout){

	this.service_undo_redo = function(){
		var _this = this;
		var undoManager = new UndoManager();
		undoManager.setLimit(10);
		var mult_id = 100;
		this.operation = {};

		var add_operate = function(id , context) {
			_this.operation[id] = context;
		};

		var remove_operate = function(id) {
			delete _this.operation[id];
		};


		var create_operate = function (id , context) {
			// first creation
			add_operate(id , context);

			// make undo-able
			undoManager.add({
				undo: function() {
					remove_operate(id)
				},
				redo: function() {
					add_operate(id, context);
				}
			});
		}

		this.mult_operate = function(){
			var container = $("#dy_container").clone();
			container.find("[type='dy_component']").remove();
			container.find(".free-transform").remove();
			container.find(".ui-resizable-handle").remove();
			container.find(".halo").remove();
			container.find("div[type=dy_component]").remove();
			container.find("script").remove();
			var content = container.get(0).outerHTML;

			create_operate(mult_id  , content);
			mult_id++;
		}

		this.undo = function(){
			undoManager.undo();
		}

		this.redo = function(){
			undoManager.redo();
		}

		this.redraw = function(){
			if( Object.keys(_this.operation).length == 0 ){
				return;
			}
			$("#dy_container").remove();
			var content = _this.operation[Object.keys(_this.operation).sort().pop()];
			var content_compile = $compile( content )( $("body").scope() );
			$("body").append(content_compile);

			$timeout(function(){
				$("body").scope().element_list = []
				$.each($(".row") , function(idx , val){
					var page_id = $(val).attr("id");
					var active = "unactive";
					var home = null;
					if($(val).css('display') == 'none'){
						active = "unactive";
					}else{
						active = "active";
					}
					if($(val).attr("dy-home")){
						home = "init";
					}
					var pjson = {
						"page_name" : page_id,
						"state" : active ,
						"home" : home ,
						"child" : []
					}
					$.each($(val).find("div[type=dy_component]") , function(cidx , cval){
						var component_id = $(cval).attr("id");
						var component_name = $(cval).attr("name");
						var cjson = {"component_id" : component_id , "component_name" : component_name , "state" : "unactive" , "locked" : false};
						pjson["child"].push(cjson);
					})
					$("body").scope().element_list.push(pjson)
				})
			} , 1000);

		}
	}

	var service_undo_redo = new this.service_undo_redo()
	return service_undo_redo;

}]);

// 解析url路径参数
module.service('$urlParams' ,  function(){

	var urlParams = function(name){
		var results = new RegExp('[?&]' + name + '=([^&]+)').exec(window.location.href);
		if(!results){return null;}
		return results[1] ;
	}

	return urlParams

});

// 系统提供唯一id标识
module.service('$unique_id' ,  function(){
	var last_name = 0;
	var unique_id = function(){
		var first_name = "s" ;
		var middle_name = "e" ;
		var date = new Date();
		var time = date.getTime() + "";
		time = time.substr(5, 13);
		var single_name = first_name + "_" + middle_name + "_" + time + "_" + last_name;
		last_name ++ ;
		return single_name;
	}

	return unique_id;

});

// 校验用户输入信息是否合法
module.service('$input_validate' ,  function($rootScope){
	var regex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

	var input_validate = function(str , id){
		var result = regex.exec(str);
		if(result)
		{
			var res = true;
			var pageList = $("#uiEditorPanelPages").scope().pageList;
			$.each(pageList , function(idx , val){
				if(val.name == str)
				{
					if(id && val.id==id)
					{
						res = true;
					}
					else
					{
						res = false;
					}
				}
			})
			return res;
		}else{
			return false;
		}

	}

	return input_validate ;

});

/*
	设置系统信息提示服务，如果服务被设置为开启状态，控制台将打印err信息
	如果不开启服务状态，控制台将不打印系统err信息
*/
module.service('$console' ,  function(){
	var sys_console_state = true;
	var system_console = function(){
		this.log = function(message , label){
			if(sys_console_state){
				if(angular.isObject(message)){
					console.log(message , label);
					return;
				}
				console.log('%c ' + message + ' --> ' + label + ' ' , 'background: #222; color: #FEFF00');
			}
		}
	}
	return new system_console();
});

/*
	中/英 切换
*/
module.service('$language' ,  function($ocLazyLoad){
	var clang = "en";
	var language = function(callback){
		if(clang == "en"){
			var path = "l10n/en.js";
			lazyLoad(path , callback);
		}else{
			var path = "l10n/ch.js";
			lazyLoad(path , callback);
		}
	}
	var lazyLoad = function(path , callback){
		$ocLazyLoad.load([path]).then(function () {
			callback(glanguage);
		}, function (e) {
			callback(false);
		});
	}
	return language;
});
