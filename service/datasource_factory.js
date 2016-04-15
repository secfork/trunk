/**
 *	@name : factory datasource
 *	@kind : factory
 *	@description : 向系统提供datasource，包括创建好的datasource，创建datasource，添加datasource，删除datasource，查询datasource，同步datasource，初始化加载datasource
 */

var module = angular.module("factory.datasource" , []);


module.factory('$datasource_factory' , ['$rootScope' , '$injector' , '$ocLazyLoad' , '$service_hint' , '$_datasourceSave' , '$_datasourceDelete' , '$_datasourceList' , '$timeout' , '$http' , '$_getAccessKey' , function($rootScope , $injector , $ocLazyLoad , $service_hint , $_datasourceSave , $_datasourceDelete ,  $_datasourceList , $timeout , $http , $_getAccessKey){

	//ds_manager
	var datasource = {

		// datasource array , save all datasouce
		source : [] ,

		// current need edit datasource index
		index : null ,

		/*
			init load datasource
			系统初始化时,判断是否存在 GetSystemByModelAutoCreate(这个数据源是系统默认创建的) 数据源
			如果已经存在这个数据源,则不在创建,如果不存在这个数据源,则创建一个
		*/
		init : function(callback){

			var _this = this;

			_this.create("getSystemsByModel" , function(datasource_prototype){
				if(!datasource_prototype){return;}
				datasource_prototype.getParameters(function( systemModel ){
					// 如果url中存在配置的系统名称，直接设置parameter.value为系统名称，否则默认选择第一个为默认系统
					var systemModelName;
					var query = window.location.search.substring(1);
					var vars = query.split("&");
					for (var i=0;i<vars.length;i++) {
						var pair = vars[i].split("=");
						if (pair[0] == "systemModelName") {
							systemModelName = pair[1];
						}
					}
					if(systemModelName) {
						systemModel[0].value = systemModelName;
					}
					else {
						systemModel[0].value = systemModel[0].para_dependent[0].name;
					}

					// 获取url systemName 如果获取到 ， 直接匹配index
					var systemName;
					var query = window.location.search.substring(1);
					var vars = query.split("&");
					for (var i=0;i<vars.length;i++) {
						var pair = vars[i].split("=");
						if (pair[0] == "systemName") {
							systemName = pair[1];
						}
					}

					datasource_prototype.name = "getSystemsByModel";
					datasource_prototype.type = {
						name : "GetSystemsByModel",
						service : "getSystemsByModel",
						description : "a"
					} ;
					datasource_prototype.parameters = systemModel;
					datasource_prototype.options = [
						{"oname" : "state" , "value" : 1 , "type" : "number"},
						{"oname" : "sorts" , "value" : null , "type" : "string"},
						{"oname" : "offset" , "value" : null , "type" : "number"},
						{"oname" : "limit" , "value" : null , "type" : "number"}
					];
					_this.add(datasource_prototype);
					datasource_prototype.getAllData(function(ret){
						if(systemName){
							$.each(ret , function(idx , val){
								if(val.name == systemName){
									datasource_prototype.index = idx;
								}
							})
						}
						getSystemLive();
					})


				})
			})

			// 获取实时数据源
			var getSystemLive = function(){

				_this.create("getSystemLive" , function(datasource_prototype){
					if(!datasource_prototype){return;}
					datasource_prototype.getParameters(function( systemModel ){
						systemModel[0].value = "getSystemsByModel";
						systemModel[1].value = 0;
						datasource_prototype.name = "getSystemLive";
						datasource_prototype.type = {
							name : "GetSystemLive",
							service : "getSystemLive",
							description : "a"
						} ;
						datasource_prototype.parameters = systemModel;
						_this.add(datasource_prototype);
						$timeout(function () {
								datasource_prototype.getAllData(function(sret){
									datasource_prototype.parameters[1].value = 30000;
									getSystemHistoryReadInterval();
								})
						}, 500);

					})
				})

			}

			// 获取历史数据源( read interval )
			var getSystemHistoryReadInterval = function(){
				_this.create("getSystemHistoryReadInterval" , function(datasource_prototype){
					if(!datasource_prototype){return;}
					datasource_prototype.getParameters(function( systemModel ){
						systemModel[0].value = "getSystemsByModel";
						datasource_prototype.name = "getSystemHistoryReadInterval";
						datasource_prototype.type = {
							name : "getSystemHistoryReadInterval",
							service : "getSystemHistoryReadInterval",
							description : "a"
						} ;
						datasource_prototype.parameters = systemModel;
						_this.add(datasource_prototype);
						getSystemHistoryReadAtTime();
					})
				})
			}

			// 获取历史数据源( read at time )
			var getSystemHistoryReadAtTime = function(){
				_this.create("getSystemHistoryReadAtTime" , function(datasource_prototype){
					if(!datasource_prototype){return;}
					datasource_prototype.getParameters(function( systemModel ){
						datasource_prototype.name = "getSystemHistoryReadAtTime";
						datasource_prototype.type = {
							name : "getSystemHistoryReadAtTime",
							service : "getSystemHistoryReadAtTime",
							description : "a"
						} ;
						datasource_prototype.parameters = systemModel;
						_this.add(datasource_prototype);
						getSystemAlarms();
					})
				})
			}

			// 获取报警数据源
			var getSystemAlarms = function(){
				_this.create("getSystemAlarms" , function(datasource_prototype){
					if(!datasource_prototype){return;}
					datasource_prototype.getParameters(function( systemModel ){
						systemModel[0].value = "getSystemsByModel";
						datasource_prototype.name = "getSystemAlarms";
						datasource_prototype.type = {
							name : "getSystemAlarms",
							service : "getSystemAlarms",
							description : "a"
						} ;
						datasource_prototype.parameters = systemModel;
						_this.add(datasource_prototype);
						getSystemWrite();
					})
				})
			}

			// 获取下置数据源
			var getSystemWrite = function(){
				_this.create("getSystemWrite" , function(datasource_prototype){
					if(!datasource_prototype){return;}
					datasource_prototype.getParameters(function( systemModel ){
						systemModel[0].value = "getSystemsByModel";
						datasource_prototype.name = "getSystemWrite";
						datasource_prototype.type = {
							name : "getSystemWrite",
							service : "getSystemWrite",
							description : "a"
						} ;
						datasource_prototype.parameters = systemModel;
						_this.add(datasource_prototype);
						closeAlarm();
					})
				})
			}

			// 关闭报警数据源
			var closeAlarm = function(){
				_this.create("closeAlarm" , function(datasource_prototype){
					if(!datasource_prototype){return;}
					datasource_prototype.getParameters(function( systemModel ){
						systemModel[0].value = "getSystemsByModel";
						datasource_prototype.name = "closeAlarm";
						datasource_prototype.type = {
							name : "closeAlarm",
							service : "closeAlarm",
							description : "a"
						} ;
						datasource_prototype.parameters = systemModel;
						_this.add(datasource_prototype);
						callSystemRealTimeData();
					})
				})
			}

			// 召唤系统
			var callSystemRealTimeData = function(){
				_this.create("callSystemRealTimeData" , function(datasource_prototype){
					if(!datasource_prototype){return;}
					datasource_prototype.getParameters(function( systemModel ){
						systemModel[0].value = "getSystemsByModel";
						datasource_prototype.name = "callSystemRealTimeData";
						datasource_prototype.type = {
							name : "callSystemRealTimeData",
							service : "callSystemRealTimeData",
							description : "a"
						} ;
						datasource_prototype.parameters = systemModel;
						_this.add(datasource_prototype);
						callback();
					})
				})
			}

		},

		// create datasource 创建datasource，但是当前的datasource并没有添加到source中，只是创建没有确认添加
		create : function( datasource_name , callback){
			var proto_path = "service/" + datasource_name + ".js"
			var service_name = "$" + datasource_name ;

			$ocLazyLoad.load([proto_path]).then(function () {
				var datasource_instance = $injector.get(service_name) ;
				callback(new datasource_instance.ds_prototype());
			}, function (e) {
				callback(false);
				$service_hint.hint_widget('数据源类型加载错误');
			});
		},

		add : function(datasource){
			var _this = this ;
			this.source.push(datasource);
			datasource.initLoad();

			// 需要同步数据到数据库中，暂时没有支持接口，没有实现
			$_datasourceSave(datasource , function(d){
				if(d){
					$service_hint.hint_widget('数据源保存成功');
					$rootScope.$broadcast("datasource_changed" , _this.source);
				}else{
					$service_hint.hint_widget('数据源保存失败');
				}
			})
		},

		// remove specify datasource by name
		remove : function(name){
			var _this = this ;
			$.each(_this.source , function(idx , val){
				if(angular.isUndefined(val)){
					return ;
				}
				if(val.name == name){
					_this.source.splice(idx , 1);
				}
			})

			$_datasourceDelete(name , function(ret){
				if(ret){
					$service_hint.hint_widget('数据源删除成功');
					$rootScope.$broadcast("datasource_changed" , _this.source);
				}else{
					$service_hint.hint_widget('数据源删除失败');
				}
			});

		},

		find : function(name){
			var dthis = this ;
			var ret ;
			$.each(dthis.source , function( idx , val ){
				if(val.name == name){
					ret = val ;
				}
			})
			return ret ;
		},

		find_by_type : function(type){
			var _this = this;
			var ret = [];
			$.each(_this.source , function(idx , val){
				if(val.type.name == type){
					var json = {name : "" , value : ""};
					json.name = val.name;
					ret.push(json);
				}
			})
			return ret;
		},

		check_ds_index : function(name){
			var dthis = this ;
			$.each(dthis.source , function( idx , val ){
				if(val.name == name){
					dthis.index = idx;
				}
			})
			$rootScope.$broadcast("datasource_index_changed" , "");
		},

		// 获取当前系统的所有的点
		getTags : function(callback){
			var sm = this.find("getSystemsByModel");
			if(!sm){
				callback([]);
			}
			var uuid;
			$.each(sm.parameters[0].para_dependent , function(idx , val){
				if(sm.parameters[0].value == val.name){
					uuid = val.uuid;
				}
			});
			$_getAccessKey.getAck(function(ack){
				var url = "/v2/json/sysmodels/"+uuid+"/tags?" + ack ;
				$http.get(url).success(function( data , state ){
					if(!data.err){
						callback(data.ret)
					}
				});
			});

		}

	}

	return datasource ;

}]);
