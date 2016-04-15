/*
 *	@name : get systems live data
 *	@kind : datasource prototype
 *	@description : getSystemsLive ProtoType
 *  @return : [ { } ]
 */

/**
	datasource properties :
		* name : 数据源名称
		* type : 数据源类型 ，为下面任意一种数据源类型
				[
					{ name : "GetSystemsByModel" , service : "getSystemsByModel" , description : "a"} ,
					{ name : "GetSystemLive" , service : "getSystemLive" , description : "a"} ,
					{ name : "GetSystemHistory" , service : "getSystemHistory" , description : "a"} ,
					{ name : "GetSystemWrite" , service : "getSystemWrite" , description : "a"}
				]
		* parameters : 创建数据源需要的参数，不同的数据源，创建时需要填写的参数也不一致
					   每个数据源的parameters，参考该数据源的getConfigParameters方法
		* ret : 发送请求后，获取系统模型数据的返回值
				所有数据源返回的数据都是二维数组，但是每个二维数组的数据格式都不一致，需要根据meta进行配置
				success :
				[
					{
						tag1 : {"pv":10001,"src":1446443626000} ,
						tag2 : {"pv":10001,"src":1446443626000} ,
						tag3 : {"pv":10001,"src":1446443626000} ,
						tag4 : {"pv":10001,"src":1446443626000} ,
					}
				]
				error :
				[]
				任何数据源返回的数据格式需要保持一致
		* index : 返回数据的游标，标志默认选中返回数据的行，默认值为0
		* options : 数据源向服务器发送数据请求时，需要配置一些参数 一些参数是必须填写的，一些参数是不必须填写的
					options存储请求所需要的所有参数
		* pull_data : 向服务器发送请求的数据，不一定每个数据都需要
				[
					{"name" : "tag_name" , "value" : ..}
					..
				]
		* event_id : 事件推送id，如果数据源中获取的数据发生变化，所有监听这个id的处理都会接收到变化推送标志，用户可以在接受到这个
					 表示后，在重新获取当前数据源数据，event_id不允许用户自动改变，event_id可以通过回调获取
		* rdata_type : 0/1 表示当前数据源获取的数据类型，如果获取的数据为空，rdata_type = 0，如果获取的数据为二维数组 rdata_type = 1
		* directive : 数据源参数配置页面，所有的数据源都已经将数据源请求参数配置写入到一个页面中，直接引入这个标签就可以直接在页面上配置请求参数

	datasource method :
		* initLoad : 初始化加载数据，默认让所有数据源，在初始化的时候都获取一次数据，但不是每个数据源都会初始化加载数据，参数不正确是获取不到数据的
					 组件用户可以忽略本方法
		* getParameters : 获取数据源配置项，需要的参数列表，组件用户可以忽略
		* getMeta : 获取数据后，数据源会将获取的数据转化成二维数组，本方法会返回数据格式描述，描述返回的二维数组的数据格式以及数据类型
		* getTotalNum : 获取数据总量
		* getAllData : 返回数据列表中所有数据，ret
		* getSelectedRows : 选择数据列表中任何一行的数据
		* refresh : 更新数据列表中的数据

	datasource event :
		* data_changed : 数据发生变化，会发送数据变化事件
*/


/**
	实时数据 数据格式
	{
		"err":null,
		"ret":{
			"HR_2":{
				"pv":10001,
				"src":1446443626000
			},
			"HR_4":{
				"pv":1151,
				"src":1446443626000
			},
			"HR_6":{
				"pv":9565.7021484375,
				"src":1446443626000
			},
		}
	}
*/


/**
	实际返回给组件的数据格式
	[
		{
			tag1 : {"pv":10001,"src":1446443626000} ,
			tag2 : {"pv":10001,"src":1446443626000} ,
			tag3 : {"pv":10001,"src":1446443626000} ,
			tag4 : {"pv":10001,"src":1446443626000} ,
		}
	]



	数据类型描述
	var meta =
		{
			"tag1" :
			{
				"type" : "Object",
				"default" : "",
				"field" :
				{
					pv :
					{
						"type" : "number",
						"default" : 0
					},
					src :
					{
						"type" : "date",
						"default" : ""
					}
				}
			},
			"tag2" :
			{
				"type" : "Object",
				"default" : "",
				"field" :
				{
					pv :
					{
						"type" : "number",
						"default" : 0
					},
					src :
					{
						"type" : "date",
						"default" : ""
					}
				}
			},
			"tag3" :
			{
				"type" : "Object",
				"default" : "",
				"field" :
				{
					pv :
					{
						"type" : "number",
						"default" : 0
					},
					src :
					{
						"type" : "date",
						"default" : ""
					}
				}
			},
			"tag4" :
			{
				"type" : "Object",
				"default" : 0,
				"field" :
				{
					pv :
					{
						"type" : "number",
						"default" : 0
					},
					src :
					{
						"type" : "date",
						"default" : ""
					}
				}
			}
		}

*/

var module = angular.module("getSystemLive" , []);

module.service('$getSystemLive' , function($_getAccessKey , $http , $datasource_factory , $unique_id , $timeout , $rootScope , $service_progress , $console , $filter){

	this.ds_prototype = function(){
		// public property
		this.name = "";
		this.type;
		this.parameters = [];
		this.ret = [];
		this.index = 0;
		this.options = [{"oname" : "tags" , "value" : [] , "type" : "string"}];
		this.push_data;
		this.event_id = $unique_id();
		this.data_type = 1;
		this.directive = "<div get-system-live id='datasource_directive'></div>";
	}

	this.ds_prototype.prototype.initLoad = function(){
		this.refresh(this , function(ret){});
	}

	// get parameters , ret : [{"name" : "" , "description" : "" , "value" : "" , "para_dependent" : []} , ...]
	this.ds_prototype.prototype.getParameters = function(callback){
		var _this = this;
		var system_model_list = $datasource_factory.find_by_type("GetSystemsByModel");
		var ret = [
			{"name" : "SystemModelName" , "description" : "system model name" , "value" : "" , "para_dependent" : system_model_list},
			{"name" : "AutoLoadTime" , "description" : "datasource init load" , "value" : "" , "para_dependent" : [{name : 30000 , description : '30000ms'} , {name : 60000 , description : '60000ms'} , {name : 300000 , description : '300000ms'} , {name : 600000 , description : '600000ms'}]}
		];
		callback(ret);
	}

	// get system live data field
	this.ds_prototype.prototype.getMeta = function(callback){

		var meta = {};
		var _this = this;

		var getField = function(data){
			$.each(data , function(idx , val){
				meta[val.name] = {
					"type" : val.type,
					"default" : "",
					"field" :
					{
						pv :
						{
							"type" : "number",
							"default" : 0
						},
						src :
						{
							"type" : "date",
							"default" : ""
						}
					}
				}
			});
			callback(meta);

		}

		if(_this.options[0].value.length != 0)
		{
			getField(_this.options[0].value);
			return;
		}

		var ds = $datasource_factory.find(_this.parameters[0].value);
		if(!ds){
			return;
		}

		$.each(ds.parameters[0].para_dependent , function(idx , val){
			if(ds.parameters[0].value == val.name){
				var uuid = val.uuid;

				$_getAccessKey.getAck(function(ack){
					var url = "/v2/json/sysmodels/"+uuid+"/tags?" + ack ;
					$service_progress.start();
					$http.get(url).success(function( data , state ){
						$service_progress.stop();
						if(!data.err){
							var ret = [];
							$.each(data.ret , function(idx , val){
								ret.push(val)
							});
							getField(ret);
						}
					});
				});

			}
		})


	}

	// get table total number
	this.ds_prototype.prototype.getTotalNum = function(callback){
		callback(this.ret.length);
	}

	// get live table all data
	this.ds_prototype.prototype.getAllData = function(callback){
		callback(this.ret);
	}

	// get live table row data
	this.ds_prototype.prototype.getSelectedRows = function(idx , callback){
		if(this.ret[idx]){
			var _this = this;
			if(_this.options[0].value.length == 0){
				callback(_this.ret);
				return;
			}

			var ret = [];
			$.each(_this.options[0].value , function(idx , val){
				$.each(_this.ret[0] , function(ridx , rval){
					if(ridx == val){
						var json = {};
						json[ridx] = rval;
						ret.push(json);
					}
				})
			});
			callback(ret)
			return;
		}
		callback([]);
		return;
	}

	// refresh , when function run over , call callback function
	this.ds_prototype.prototype.refresh = function(t , callback){
		var _this = this;
		$timeout(function(){
			getData(_this , callback);
			call_self(_this , callback);
		} , _this.parameters[1].value)
	}
	var getData = function(_this , callback){
		if(!_this.parameters){call_self(_this) ; return;}
		if(!_this.parameters[0].value){call_self(_this) ; return;}
		var ds = $datasource_factory.find(_this.parameters[0].value);
		if(!ds){
			return;
		}
		var system = ds.ret[ds.index]
		if(!system){call_self(_this) ; return;};

		var tag = "";
		$.each(_this.options[0].value , function(idx , val){
			tag += "&tag="+val.name;
		})

		$_getAccessKey.getAck(function(ack){
			var url = "/v2/json/systems/"+system.uuid+"/live?" + ack + tag ;
			$service_progress.start();
			$http.get(url).success(function( data , state ){
				$service_progress.stop();
				if(!data.err){
					var r = dataFilter(data.ret , tag , _this);
					var list = [];
					list.push(r)
					_this.ret = list;
					callback(r);
					$rootScope.$broadcast(_this.event_id , data.ret);
				}
			});
		});

	}
	var call_self = function(_this , callback){
		_this.refresh(_this , callback);
	}
	var dataFilter = function(data , tag , _this){
		if(!tag){
			$.each(data , function(idx , val){
				$.each(val , function(cidx , cval){
					if(cidx == "src"){
						val[cidx] = $filter('date')(cval , 'yyyy-MM-dd HH:mm:ss')
					}
				})
			})
			return data;
		}else{
			var json = {};
			$.each(_this.options[0].value , function(idx , val){
				data[idx]["src"] = $filter('date')(data[idx]["src"] , 'yyyy-MM-dd HH:mm:ss');
				json[val.name] = data[idx];
			});
			return json;
		}
	}

	// event , watch ret data changed
	this.ds_prototype.prototype.dataChanged = function(){
		if(!this.event_id){
			this.event_id = $unique_id();
			return this.event_id;
		}
		return this.event_id;
	}


});
