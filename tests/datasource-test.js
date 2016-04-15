'use strict';

var app = angular.module("test" , [
	
	'oc.lazyLoad',
	'application.common_service_base',
	'common.data_connect_service',
	'factory.datasource',
	"syaliasApp.service"
	
]);


app.controller('test_datasourceServiceTest' , ['$scope' , '$datasource_factory' ,
	
	function($scope , $datasource_factory){
		var tmi_ds_init = getTestModularInstance();

		var restModular_ds_init = tmi_ds_init.createModular("Datasource Factory Init Test");
		
		var datasourceFactory = $datasource_factory;
		
		/*
			Datasource Factory Init Test
		*/
		datasourceFactory.init(function(data){
			var source = datasourceFactory.source;
			if(data){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Init" , "NULL" , "数据源初始化成功");
				getDataTest();
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Init" , "NULL" , "数据源初始化失败");
			}
		});
		
		/*
			Datasource Factory Create Test
		*/
		datasourceFactory.create("" , function(d){
			if(d){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "NULL" , "创建数据源成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "NULL" , "创建数据源失败");
			}
		});
		
		datasourceFactory.create("aaa" , function(d){
			if(d){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "aaa" , "创建数据源成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "aaa" , "创建数据源失败");
			}
		})
		
		datasourceFactory.create("callSystemRealTimeData" , function(d){
			if(d){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "callSystemRealTimeData" , "创建数据源成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "callSystemRealTimeData" , "创建数据源失败");
			}
		})
		
		datasourceFactory.create("closeAlarm" , function(d){
			if(d){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "closeAlarm" , "创建数据源成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "closeAlarm" , "创建数据源失败");
			}
		})
		
		datasourceFactory.create("getSystemAlarms" , function(d){
			if(d){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemAlarms" , "创建数据源成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemAlarms" , "创建数据源失败");
			}
		})
		
		datasourceFactory.create("getSystemHistory" , function(d){
			if(d){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemHistory" , "创建数据源成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemHistory" , "创建数据源失败");
			}
		})
		
		datasourceFactory.create("getSystemLive" , function(d){
			if(d){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemLive" , "创建数据源成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemLive" , "创建数据源失败");
			}
		})
		
		datasourceFactory.create("getSystemsByModel" , function(d){
			if(d){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemsByModel" , "创建数据源成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemsByModel" , "创建数据源失败");
			}
		})
		
		datasourceFactory.create("getSystemWrite" , function(d){
			if(d){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemWrite" , "创建数据源成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create" , "getSystemWrite" , "创建数据源失败");
			}
		})
		
		/*
			Datasource Factory Create - Add - Remove - Find - FindByType - Check-ds-index
		*/
		datasourceFactory.create("getSystemsByModel" , function(d){
			if(d){
				d.name = "gt";
				d.type = "getSystemsByModel";
				d.parameters = [{} , {value : false}];
				datasourceFactory.add(d);
				ds_find("gt");
				ds_find_by_type("getSystemsByModel");
				ds_check_ds_index("gt");
				ds_remove("gt");
				ds_find("gt");
				
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Create - Add - Remove - Find - FindByType - Check-ds-index" , "getSystemsByModel" , "数据创建失败");
			}
		})
		
		function ds_find(name){
			var ret = datasourceFactory.find(name);
			if(ret){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Find" , "getSystemsByModel" , "获取数据成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Find" , "getSystemsByModel" , "获取数据失败");
			}
		}
		
		function ds_find_by_type(type){
			var ret = datasourceFactory.find_by_type(type);
			if(ret){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Find By Type" , "getSystemsByModel" , "根据数据源获取类型成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory Find By Type" , "getSystemsByModel" , "根据数据源获取类型失败");
			}
		}
		
		function ds_check_ds_index(name){
			datasourceFactory.check_ds_index(name);
			if(datasourceFactory.index == datasourceFactory.length - 1){
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory check ds index" , "getSystemsByModel" , "设置数据源index成功");
			}else{
				tmi_ds_init.createTestMessage(restModular_ds_init , "Datasource Factory check ds index" , "getSystemsByModel" , "设置数据源index失败");
			}
		}
		
		function ds_remove(name){
			datasourceFactory.remove(name)
		}
		
		/*
			首先，创建好所有测试需要的数据源，sm ，sl ，sh ，sw ，sa ，ca ，cd
			直接测试已经创建好的数据源，是否能够获取数据
		*/
		var getDataTest = function(){
			var systemModel = datasourceFactory.find("sm");
			console.log(systemModel)
			systemModel.getTableField(function(d){
				console.log(d)
			})
			systemModel.refresh(function(d){
				if(d){
					systemModel.getAllData(function(adata){
						console.log(adata);
						getAlarm()
					})
				}
			});
			
			var getAlarm = function(){
				var systemAlarm = datasourceFactory.find("sa");
				console.log(systemAlarm)
				// systemAlarm.options[8].value = "1444030393000";
				// systemAlarm.options[9].value = "1445326381720";
				systemAlarm.refresh(function(d){
					systemAlarm.getTableField(function(d){
						console.log(" alarm get table field ");
						console.log(d)
					})
					if(d){
						systemAlarm.getAllData(function(adata){
							console.log(adata)
						})
					}
				});
			}
			
		};
		
		
		
	}
	
]);