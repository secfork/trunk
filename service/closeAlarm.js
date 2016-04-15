/*
 *	@name : close alarm
 *	@kind : datasource prototype
 *	@description : close alarm ProtoType
 *  @return : null
 *  暂时不处理关闭报警
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
		* ret : []
		* index : 返回数据的游标，标志默认选中返回数据的行，默认值为0
		* options : 数据源向服务器发送数据请求时，需要配置一些参数 一些参数是必须填写的，一些参数是不必须填写的
					options存储请求所需要的所有参数
		* pull_data : 向服务器发送请求的数据，不一定每个数据都需要
					{"tag_name" : "value" , ....}
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
	return null
	meta null
*/

var module = angular.module("closeAlarm" , []);

module.service('$closeAlarm' , function($rootScope , $_getAccessKey , $http , $datasource_factory ,$unique_id , $service_progress){

	this.ds_prototype = function(){
		// public property
		this.name = "";
		this.type;
		this.parameters = [];
		this.ret = [];
		this.index = 0;
		this.options = [
			{"oname" : "ids" , "value" : [] , "op" : [{"name" : "3" , "value" : 3}]}
		];
		this.push_data;
		this.event_id;
		this.data_type = 0;
		this.directive = "<div get-system-write id='datasource_directive'></div>";
	}

	this.ds_prototype.prototype.initLoad = function(){
		// init , not do anything
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

	// get system history data field
	this.ds_prototype.prototype.getMeta = function(callback){
		var meta = [];
		callback(meta);
	}

	// get table total number
	this.ds_prototype.prototype.getTotalNum = function(callback){
		callback(this.ret.length);
	}

	// get all data by model uuid
	this.ds_prototype.prototype.getAllData = function(callback){
		callback([])
	}

	// get select row , must set id
	this.ds_prototype.prototype.getSelectedRows = function(idx , callback){
		callback([])
	}

	// refresh , get history data
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
				uuid = system.uuid;
				req(uuid , _this , callback);
			})
		}

	}

	var req = function(uuid , _this , callback){

		$_getAccessKey.getAck(function(ack){
			var url = "/v2/json/systems/"+ uuid +"/alarm/ack?" + ack ;
			$service_progress.start();
			if(_this.options[0].value.length != 0){
				$service_progress.stop();
				$.each(_this.options[0].value , function(idx , val){
					url += "&id=" + val;
				})
			}


			$http.put(url,{}).success(function( data , state ){
				if(!data.err){
					_this.ret = data.ret;
					$rootScope.$broadcast(_this.event_id , data.ret);
					callback(true)
				}else{
					callback(false)
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
