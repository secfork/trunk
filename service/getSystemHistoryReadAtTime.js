/*
 *	@name : get history read at time by system model
 *	@kind : datasource prototype
 *	@description : getSystemHistoryReadAtTime ProtoType
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
					[
						{"id":null,"pv":null,"ts":1448765481633,"rcv":null}
					],
					[
						{"id":1,"pv":null,"ts":1448765481633,"rcv":null}
					]
				]
				error :
				[]
				任何数据源返回的数据格式需要保持一致
		* index : 返回数据的游标，标志默认选中返回数据的行，默认值为0
		* options : 数据源向服务器发送数据请求时，需要配置一些参数 一些参数是必须填写的，一些参数是不必须填写的
					options存储请求所需要的所有参数
		* pull_data : 向服务器发送请求的数据，不一定每个数据都需要

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
	历史接口，实际返回的数据
	[
		[
			{"id":null,"pv":null,"ts":1448765481633,"rcv":null}
		],
		[
			{"id":1,"pv":null,"ts":1448765481633,"rcv":null}
		]
	]
*/

/**
	实际返回给组件的数据格式
	[
		{
			tag1 : {"id":null,"pv":null,"ts":1448765481633,"rcv":null},
			tag2 : {"id":null,"pv":null,"ts":1448765481633,"rcv":null},
			tag3 : {"id":null,"pv":null,"ts":1448765481633,"rcv":null},
			tag4 : {"id":null,"pv":null,"ts":1448765481633,"rcv":null}
		},
		{
			tag1 : {"id":null,"pv":null,"ts":1448765481633,"rcv":null},
			tag2 : {"id":null,"pv":null,"ts":1448765481633,"rcv":null},
			tag3 : {"id":null,"pv":null,"ts":1448765481633,"rcv":null},
			tag4 : {"id":null,"pv":null,"ts":1448765481633,"rcv":null}
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
					id :
					{
						"type" : "number",
						"default" : ""
					},
					pv :
					{
						"type" : "number",
						"default" : 0
					},
					ts :
					{
						"type" : "date",
						"default" : ""
					},
					rcv :
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
					id :
					{
						"type" : "number",
						"default" : ""
					},
					pv :
					{
						"type" : "number",
						"default" : 0
					},
					ts :
					{
						"type" : "date",
						"default" : ""
					},
					rcv :
					{
						"type" : "date",
						"default" : ""
					}
				}
			}
		}

*/

var module = angular.module("getSystemHistoryReadAtTime" , []);

module.service('$getSystemHistoryReadAtTime' , function($rootScope , $_getAccessKey , $http , $datasource_factory , $service_progress , $unique_id , $console , $filter){

	this.ds_prototype = function(){
		// public property
		this.name = "";
		this.type;
		this.parameters = [];
		this.ret = [];
		this.index = 0;
		this.options = [
			{"oname" : "tags" , "value" : [] , "type" : "string"},
			{"oname" : "t" , "value" : [] , "type" : "date"},
			{"oname" : "timestamp" , "value" : null , "type" : "string"},
			{"oname" : "mode" , "value" : null , "type" : "string"}
		];
		this.push_data;
		this.event_id;
		this.data_type = 1;
		this.directive = "";
	}

	this.ds_prototype.prototype.initLoad = function(){
		// init , load history data
		var _this = this;
		this.refresh(function(){

		})
	}

	// get parameters , ret : [{"name" : "" , "description" : "" , "value" : "" , "para_dependent" : []} , ...]
	this.ds_prototype.prototype.getParameters = function(callback){
		var _this = this;
		var system_model_list = $datasource_factory.find_by_type("GetSystemsByModel");
		var ret = [
			{"name" : "systemId" , "description" : "system id" , "value" : "" , "para_dependent" : ""}
		];
		callback(ret);
	}

	// get system history data field
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
						id :
						{
							"type" : "number",
							"default" : ""
						},
						pv :
						{
							"type" : "number",
							"default" : 0
						},
						ts :
						{
							"type" : "date",
							"default" : ""
						},
						rcv :
						{
							"type" : "date",
							"default" : ""
						}
					}
				}
			});
			$console.log(meta , 'getSystemHistoryReadAtTime meta format - getSystemHistoryReadAtTime.js 230');
			callback(meta);

		}


		if(_this.options[0].value.length != 0)
		{
			$console.log(_this.options[0].value , 'getSystemHistory tags options - getSystemHistory.js')
			getField(_this.options[0].value);
			return;
		}
	}

	// get table total number
	this.ds_prototype.prototype.getTotalNum = function(callback){
		callback(this.ret.length);
	}

	// get all data by model uuid
	this.ds_prototype.prototype.getAllData = function(callback){
		var _this = this;
		if(this.ret.length == 0)
		{
			this.refresh(function(){
				callback(_this.ret)
			})
		}
		else
		{
			callback(this.ret);
		}
	}

	// get select row , must set id
	this.ds_prototype.prototype.getSelectedRows = function(idx , callback){
		if(this.ret.length == 0){
			callback(this.ret);
			return;
		}
		callback(this.ret[idx])
	}

	// refresh , get history data
	this.ds_prototype.prototype.refresh = function(callback){
		var _this = this;
		// if not set parameters
		if(this.parameters.length == 0){
			return;
		}

		// get system model
		var systemModel = $datasource_factory.find("getSystemsByModel");
		if(!systemModel){return;};

		var systemId = systemModel.ret[systemModel.index].uuid;

		if(systemId)
		{
			req(systemId , _this , callback);
		}
	}

	var req = function(systemId , _this , callback){
		// request history data
		var url = "/v2/json/systems/" + systemId + "/log/readattime?";
		$_getAccessKey.getAck(function(ack){
			url = url + ack + "&";

			$.each(_this.options[0].value , function(idx , val){
				var str = "tag=" + val.name + "&";
				url += str;
			});

			$.each(_this.options[1].value , function(idx , val){
				var str = "t=" + val + "&";
				url += str;
			});

			url += "timestamp=" + _this.options[2].value + "&";
			url += "mode=" + _this.options[3].value;

			$http.get(url).success(function( data , state ){
				if(!data.err && angular.isArray(data.ret)){
					var r = dataParse(data.ret , _this);
					_this.ret = r;
					$rootScope.$broadcast(_this.event_id , data.ret);
					callback();
				}
			});

		});

	}

	var dataParse = function(data , _this){
		var tags = _this.options[0].value;
		$.each(data , function(idx , val){
			$.each(val , function(cidx , cval){
				cval["rcv"] = $filter('date')(cval["rcv"] , 'yyyy-MM-dd HH:mm:ss');
				cval["ts"] = $filter('date')(cval["ts"] , 'yyyy-MM-dd HH:mm:ss');
			})
		});

		if(tags.length == 0){
			$console.log(data , "system read at time no tag , getSystemHistoryReadAtTime.js 333");
			return [];
		}else{
			var list = [];
			var limit = _this.options[1].value.length;//根据参数t
			for (var i = 0; i < limit; i++) {
				var json = {};
				$.each(tags,function(idx,val){
					json[val.name] = data[idx][i];
				});
				list.push(json);
			};

			$console.log(list , "system read at time no tag , getSystemHistoryReadAtTime.js 349")
			return list;
		}

		return [];
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
