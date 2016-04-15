/*
 *	@name : get systems alarm data
 *	@kind : datasource prototype
 *	@description : getSystemsAlarm ProtoType
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
					{ack_id: null,active: "活跃",class_id:0,close_time: "0000-00-00 00:00:00",desc: "报警了",id: 1782,region: "LiuZ",severity: 2,system_id: "NkT0GrOee1P",timestamp: "2015-11-01 16:25:59",type: null},
					{ack_id: null,active: "活跃",class_id:0,close_time: "0000-00-00 00:00:00",desc: "报警了",id: 1782,region: "LiuZ",severity: 2,system_id: "NkT0GrOee1P",timestamp: "2015-11-01 16:25:59",type: null}
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
	报警接口，实际返回的数据
	[
		{
			ack_id: null,
			active: "活跃",
			class_id: 0,
			close_time: "0000-00-00 00:00:00",
			desc: "报警了",
			id: 1782,
			region: "LiuZ",
			severity: 2,
			system_id: "NkT0GrOee1P",
			timestamp: "2015-11-01 16:25:59",
			type: null
		},
		{
			ack_id: null,
			active: "活跃",
			class_id: 0,
			close_time: "0000-00-00 00:00:00",
			desc: "报警了",
			id: 1782,
			region: "LiuZ",
			severity: 2,
			system_id: "NkT0GrOee1P",
			timestamp: "2015-11-01 16:25:59",
			type: null
		}
	]
*/

/**
	实际返回给组件的数据格式
	[
		{ack_id: null,active: "活跃",class_id:0,close_time: "0000-00-00 00:00:00",desc: "报警了",id: 1782,region: "LiuZ",severity: 2,system_id: "NkT0GrOee1P",timestamp: "2015-11-01 16:25:59",type: null},
		{ack_id: null,active: "活跃",class_id:0,close_time: "0000-00-00 00:00:00",desc: "报警了",id: 1782,region: "LiuZ",severity: 2,system_id: "NkT0GrOee1P",timestamp: "2015-11-01 16:25:59",type: null}
	]



	数据类型描述
	var meta =
		{
			"ack_id" :
			{
				"type" : "number",
				"default" : ""
			},
			"active" :
			{
				"type" : "string",
				"default" : ""
			},
			"class_id" :
			{
				"type" : "number",
				"default" : ""
			},
			"close_time" :
			{
				"type" : "date",
				"default" : ""
			},
			"desc" :
			{
				"type" : "string",
				"default" : ""
			},
			"id" :
			{
				"type" : "number",
				"default" : ""
			},
			"region" :
			{
				"type" : "string",
				"default" : ""
			},
			"severity" :
			{
				"type" : "number",
				"default" : ""
			},
			"system_id" :
			{
				"type" : "number",
				"default" : ""
			},
			"timestamp" :
			{
				"type" : "number",
				"default" : ""
			},
			"type" :
			{
				"type" : "number",
				"default" : ""
			},
		}

*/

var module = angular.module("getSystemAlarms" , []);

module.service('$getSystemAlarms' , function($_getAccessKey , $http , $datasource_factory , $unique_id , $timeout , $rootScope , $service_progress , $filter , $console){

	this.ds_prototype = function(){
		// public property
		this.name = "";
		this.type;
		this.parameters = [];
		this.ret = [];
		this.index = 0;
		this.options = [
			{"oname" : "start" , "value" : new Date().getTime() - 86400000 * 7 , "type" : "date"},
			{"oname" : "end" , "value" : new Date().getTime() , "type" : "date"},
			{"oname" : "limit" , "value" : null , "type" : "number"},
			{"oname" : "offset" , "value" : null , "type" : "number"},
			{"oname" : "class_id" , "value" : null , "type" : "number"},
			{"oname" : "type" , "value" : null , "type" : "number"},
			{"oname" : "severity" , "value" : null , "type" : "number"},
			{"oname" : "timestamp" , "value" : null , "type" : "string"},
			{"oname" : "calc_sum" , "value" : null , "type" : "boolean"}
		];
		this.push_data;
		this.event_id;
		this.data_type = 1;
		this.directive = "<div get-system-alarms id='datasource_directive'></div>";
	}

	this.ds_prototype.prototype.initLoad = function(){
		this.refresh(function(){});
	}

	// get parameters , ret : [{"name" : "" , "description" : "" , "value" : "" , "para_dependent" : []} , ...]
	this.ds_prototype.prototype.getParameters = function(callback){
		var _this = this;
		var system_model_list = $datasource_factory.find_by_type("GetSystemsByModel");
		var ret = [
			{"name" : "SystemModelName" , "description" : "system model name" , "value" : "" , "para_dependent" : system_model_list}
		];
		callback(ret);
	}

	// get system live data field
	this.ds_prototype.prototype.getMeta = function(callback){
		var meta = {
			"ack_id" :
			{
				"type" : "number",
				"default" : ""
			},
			"active" :
			{
				"type" : "string",
				"default" : ""
			},
			"class_id" :
			{
				"type" : "number",
				"default" : ""
			},
			"close_time" :
			{
				"type" : "date",
				"default" : ""
			},
			"desc" :
			{
				"type" : "string",
				"default" : ""
			},
			"id" :
			{
				"type" : "number",
				"default" : ""
			},
			"region" :
			{
				"type" : "string",
				"default" : ""
			},
			"severity" :
			{
				"type" : "number",
				"default" : ""
			},
			"system_id" :
			{
				"type" : "number",
				"default" : ""
			},
			"timestamp" :
			{
				"type" : "number",
				"default" : ""
			},
			"type" :
			{
				"type" : "number",
				"default" : ""
			},
		};
		callback(meta);
	}

	// get table total number
	this.ds_prototype.prototype.getTotalNum = function(callback){
		callback(this.ret.length);
	}

	// get live table all data
	this.ds_prototype.prototype.getAllData = function(callback){
		callback(this.ret);
		return;
	}

	// get live table row data
	this.ds_prototype.prototype.getSelectedRows = function(idx , callback){
		if(this.ret[idx]){
			callback(this.ret[idx]);
			return;
		}
		callback([]);
		return;
	}

	// refresh , when function run over , call callback function
	this.ds_prototype.prototype.refresh = function(callback){
		var _this = this;
		// if not set parameters
		if(this.parameters.length == 0){
			return;
		}

		// get system uuid
		var ds = $datasource_factory.find(_this.parameters[0].value);
		if(!ds){return;}

		var system;
		var uuid;
		if(ds.ret.length != 0)
		{
			system = ds.ret[ds.index];
			uuid = system.uuid;
			req(uuid , _this , callback);
		}
		else
		{
			ds.getAllData(function(data){
				system = data[ds.index];
				if(!system){return};
				uuid = system.uuid;
				req(uuid , _this , callback);
			})
		}

	}

	var req = function(uuid , _this , callback){
		var url ;
		$_getAccessKey.getAck(function(ack){
			url = "/v2/json/systems/"+ uuid +"/alarmhistory?" + ack ;
			if(_this.options[0].value){
				url += "&start=" + new Date(_this.options[0].value).getTime();
			}
			if(_this.options[1].value){
				url += "&end=" + new Date(_this.options[1].value).getTime();
			}
			if(_this.options[2].value){
				url += "&limit=" + _this.options[2].value;
			}
			if(_this.options[3].value){
				url += "&offset=" + _this.options[3].value;
			}
			if(_this.options[4].value){
				url += "&class_id=" + _this.options[4].value;
			}
			if(_this.options[5].value){
				url += "&type=" + _this.options[5].value;
			}
			if(_this.options[6].value){
				url += "&severity=" + _this.options[6].value;
			}
			if(_this.options[7].value){
				url += "&timestamp=" + _this.options[7].value;
			}
			if(_this.options[8].value){
				url += "&calc_sum=" + _this.options[8].value;
			}

			$service_progress.start();
			$http.get(url).success(function( data , state ){
				$service_progress.stop();
				if(!data.err && angular.isArray(data.ret)){
					dataParse(data.ret , function(d){
						_this.ret = d;
						$rootScope.$broadcast(_this.event_id , data.ret);
						callback(d)
					})
				}
			});
		});
	}

	var dataParse = function(data , callback){
		$.each(data , function(idx , val){
			delete val['account_id'];
			delete val['info'];
			delete val['source_id'];
			delete val['trigger_id'];

			if(val['active'] == "0"){
				val['active'] = "cleared";
			}else if(val['active'] == "-1"){
				val['active'] = "关闭";
			}else{
				val['active'] = "活跃";
			}

			switch(val['severity']){
				case "0" :
					val['severity'] = "警告";
					break;
				case "1" :
					val['severity'] = "一般的";
					break;
				case "2" :
					val['severity'] = "重要的";
					break;
				case "3" :
					val['severity'] = "紧急的";
					break;
				case "4" :
					val['severity'] = "不确定的";
					break;
			}

			val['close_time'] = $filter('date')(val["close_time"] , 'yyyy-MM-dd HH:mm:ss');
			val['timestamp'] = $filter('date')(val["timestamp"] , 'yyyy-MM-dd HH:mm:ss');


		});
		matchRegion(data , function(d){
			callback(d)
		})
	}

	var matchRegion = function(data , callback){
		$_getAccessKey.getAck(function(ack){
			var url = "/v2/json/query/regions?" + ack ;
			$http.get(url).success(function( rdata , state ){
				if(!rdata.err && angular.isArray(rdata.ret)){
					$.each(data , function(idx , val){
						$.each(rdata.ret , function(ridx , rval){
							if(rval.id == val['region_id']){
								delete val['region_id'];
								val["region"] = rval.name;
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
