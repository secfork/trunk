/*
 *	@name : get systems by model
 *	@kind : datasource prototype
 *	@description : getSystemsByModel ProtoType
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
					{name : val , uuid : val , desc : val , longitude : val , latitude : val , pos_type : val , create_time : val , region : val},
					{name : val , uuid : val , desc : val , longitude : val , latitude : val , pos_type : val , create_time : val , region : val},
					{name : val , uuid : val , desc : val , longitude : val , latitude : val , pos_type : val , create_time : val , region : val},
					....
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
	获取系统，实际返回的数据
	{
		"err":null,
		"ret":[
			{
				"uuid":"NkT0GrOee1P",
				"name":"Motor_1",
				"desc":null,
				"model":"VyDZZH_ggj1",
				"region_id":82,
				"profile":"V1xw-Wr_elj1",
				"state":1,
				"network":"{\"daserver\":{\"type\":\"DTU\",\"params\":{\"driverid\":\"DTU_ETUNG\",\"simid\":\"201510150000001\"}}}",
				"gateway":null,
				"account_id":25,
				"daserver_id":"ETung_1",
				"longitude":0,
				"latitude":0,
				"pos_type":0,
				"version":32,
				"create_time":"2015-10-15T07:20:02.000Z",
				"last_modify_time":"2015-11-07T07:22:07.000Z",
				"last_sync_time":"2015-11-07T01:41:11.000Z",
				"field_1":null,
				"field_2":null,
				"field_3":null,
				"field_4":null,
				"field_5":null,
				"pic_url":"25.0/NkT0GrOee1P=6mxscvfo.jpeg"
			}
		]
	}

	getSystemByModel会自动过滤掉其中以下字段
	["account_id" , "daserver_id" , "field_1" , "field_2" , "field_3" , "field_4" , "field_5" , "gateway" , "last_modify_time" , "last_sync_time" , "model" , "network" , "pic_url" , "profile" , "state" , "version"]
*/

/**
	实际返回给组件的数据格式
	[
		{name : val , uuid : val , desc : val , longitude : val , latitude : val , pos_type : val , create_time : val , region : val},
		{name : val , uuid : val , desc : val , longitude : val , latitude : val , pos_type : val , create_time : val , region : val},
		{name : val , uuid : val , desc : val , longitude : val , latitude : val , pos_type : val , create_time : val , region : val},
		....
	]



	数据类型描述
	var meta =
		{
			"name" :
			{
				"type" : "string",
				"default" : ""
			},
			"uuid" :
			{
				"type" : "string",
				"default" : ""
			},
			"desc" :
			{
				"type" : "string",
				"default" : ""
			},
			"longitude" :
			{
				"type" : "number",
				"default" : 0
			},
			"latitude" :
			{
				"type" : "number",
				"default" : 0
			},
			"pos_type" :
			{
				"type" : "string",
				"default" : ""
			},
			"create_time" :
			{
				"type" : "date",
				"default" : null
			},
			"region" :
			{
				"type" : "string",
				"default" : ""
			}
		}

*/

var module = angular.module("getSystemsByModel" , []);

module.service('$getSystemsByModel' , function($rootScope , $_getAccessKey , $http , $unique_id , $service_progress , $console , $filter){

	// constructor
	this.ds_prototype = function(){
		// public properties
		this.name = "";
		this.type; // {name:'GetSystemsByModel' , service:'getSystemsByModel' , 'description':'a'};
		this.parameters = []; // [{'description':'system model',name:'SystemModel' , para_dependent:[{account_id:25,....}]} , ...]
		this.ret = [];
		this.index = 3;
		this.options = [
			{"oname" : "state" , "value" : 1 , "type" : "number"},
			{"oname" : "sorts" , "value" : null , "type" : "string"},
			{"oname" : "offset" , "value" : null , "type" : "number"},
			{"oname" : "limit" , "value" : null , "type" : "number"}
		];
		this.push_data;
		this.event_id;
		this.rdata_type = 1;
		/**
			directive,标注当前数据源连接directive page名称
			这样，options就不需要再描述接口需要的参数了，都通过页面来描述
			options只需要接收输入参数
		*/
		this.directive = "<div get-systems-by-model id='datasource_directive'></div>";
	}

	// init load data
	this.ds_prototype.prototype.initLoad = function(){
		// 如果用户设置初始化加载数据，默认创建了数据源之后，发送一次请求，将数据缓存到ret中
		if(this.parameters[1].value){
			this.refresh(function(data){
			});
		}
	}

	// get parameters , ret : [{"name" : "" , "description" : "" , "value" : "" , "para_dependent" : []} , ...]
	this.ds_prototype.prototype.getParameters = function(callback){
		var _this = this;
		$_getAccessKey.getAck(function(ack){
			var url = "/v2/json/query/sysmodels?" + ack;
			$http.get(url).success(function(data , state){
				if(!data.err && angular.isArray(data.ret)){
					var ret = [
						{"name" : "SystemModel" , "description" : "system model" , "value" : "" , "para_dependent" : data.ret},
						{"name" : "InitLoad" , "description" : "datasource init load" , "value" : true , "para_dependent" : [{name : true} , {name : false}]}
					];
					callback(ret);
				}
			})
		});
	}

	// get table field
	this.ds_prototype.prototype.getMeta = function(callback){

		var meta =
		{
			"name" :
			{
				"type" : "string",
				"default" : "",
				"required" : true
			},
			"uuid" :
			{
				"type" : "string",
				"default" : "",
				"required" : true
			},
			"desc" :
			{
				"type" : "string",
				"default" : "",
				"required" : true
			},
			"longitude" :
			{
				"type" : "number",
				"default" : 0,
				"required" : true
			},
			"latitude" :
			{
				"type" : "number",
				"default" : 0,
				"required" : true
			},
			"pos_type" :
			{
				"type" : "string",
				"default" : "",
				"required" : true
			},
			"create_time" :
			{
				"type" : "date",
				"default" : null,
				"required" : true
			},
			"region" :
			{
				"type" : "string",
				"default" : "",
				"required" : true
			}
		}
		callback(meta);
	}

	// get systems total number
	this.ds_prototype.prototype.getTotalNum = function(callback){
		var _this = this;
		$.each(this.parameters[0].para_dependent , function(idx , val){
			if(_this.parameters[0].value == val.name){
				var uuid = val.uuid;
				$_getAccessKey.getAck(function(ack){
					var url = "/v2/json/query/systems?model=" + uuid + "&" +  ack + "&calc_sum=true" ;
					$service_progress.start();
					$http.get(url).success(function( data , state ){
						$service_progress.stop();
						if(!data.err ){
							callback(data.ret);
						}
					})
				})

			}
		})
	}

	// get all data by model uuid
	this.ds_prototype.prototype.getAllData = function(callback){
		var _this = this;
		// if ret exist , return ret
		if(this.ret.length != 0){
			callback(_this.ret);
			return;
		}

		// if not set parameters
		if(this.parameters.length == 0){
			callback(_this.ret);
			return;
		}

		// if ret is null,request data to this.ret , and return , else return this.ret
		if(!this.parameters[1].value){
			callback(_this.ret);
			return;
		}else{
			this.refresh(function(state){
				callback(_this.ret);
				return;
			})
		}
	}

	// get select row , must set id
	this.ds_prototype.prototype.getSelectedRows = function(idx , callback){
		this.index = idx;
		var _this = this;
		// if not set parameters
		if(this.parameters.length == 0){
			callback(_this.ret);
			return;
		}

		// if ret is null,request data to this.ret , and return , else return this.ret
		if(!this.parameters[1].value){
			callback([]);
		}else{
			this.refresh(function(state){
				callback(_this.ret[_this.index]);
			})
		}
	}

	// refresh , when function run over , call callback function
	this.ds_prototype.prototype.refresh = function(callback){
		var _this = this;
		// if not set parameters
		if(this.parameters.length == 0){
			callback(false);
			return;
		}

		$.each(_this.parameters[0].para_dependent , function(idx , val){
			if(_this.parameters[0].value == val.name){
				var uuid = val.uuid;
				// if parameters already set
				$_getAccessKey.getAck(function(ack){
					var url = "/v2/json/query/systems?model=" + uuid + "&" + ack ;
					if(_this.options[0].value){
						url += "&state=" + _this.options[0].value;
					}
					if(_this.options[1].value){
						url += "&sorts=" + _this.options[1].value;
					}
					if(_this.options[2].value){
						url += "&offset=" + _this.options[2].value;
					}
					if(_this.options[3].value){
						url += "&limit=" + _this.options[3].value;
					}
					$service_progress.start();
					$http.get(url).success(function( data , state ){
						$service_progress.stop();
						if(!data.err && angular.isArray(data.ret)){
							// 匹配系统区域
							matchRegion(data.ret , function(data){
								// if data changed , publish dataChanged event
								if(_this.event_id){
									$rootScope.$broadcast(_this.event_id , "dataChanged");
								}else{
									_this.dataChanged();
									$rootScope.$broadcast(_this.event_id , "dataChanged");
								}
								// data filter
								var df = dataFilter(data)
								_this.ret = df;

								// 如果用户给定系统名称,自动选中当前系统
								var systemName;
								var query = window.location.search.substring(1);
								var vars = query.split("&");
								for (var i=0;i<vars.length;i++) {
									var pair = vars[i].split("=");
									if (pair[0] == "systemName") {
										systemName = pair[1];
									}
								}
								$.each(_this.ret , function( i , v ){
									if(systemName && v.name == systemName)
									{
										_this.index = i;
									}
								})
								callback(true);
							})
						}
					})
				})

			}
		})

	}

	var filterList = ["account_id" , "daserver_id" , "field_1" , "field_2" , "field_3" , "field_4" , "field_5" , "gateway" , "last_modify_time" , "last_sync_time" , "model" , "network" , "pic_url" , "profile" , "state" , "version"];

	var dataFilter = function(data){
		$.each(data , function(idx , val){
			$.each(val , function(cidx , cval){
				$.each(filterList , function(ifl , vfl){
					if(cidx == vfl){
						delete val[cidx];
					}
					if(cidx == "create_time"){
						val[cidx] = $filter('date')(cval , 'yyyy-MM-dd HH:mm:ss')
					}
				})
			})

		})

		return data;
	}

	var matchRegion = function(data , callback){
		$_getAccessKey.getAck(function(ack){
			var url = "/v2/json/query/regions?" + ack ;
			$http.get(url).success(function( rdata , state ){
				if(!rdata.err && angular.isArray(rdata.ret)){
					$.each(data , function(idx , val){
						$.each(val , function(cidx , cval){
							if(cidx == "region_id"){
								$.each(rdata.ret , function(ridx , rval){
									if(rval.id == cval){
										delete val[cidx];
										val["region"] = rval.name;
									}
								})
							}
						})
					})
					callback(data)
				}
			});
		});
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
