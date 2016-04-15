var async = require('async'),
	connection = require("../db/connection"),
	fs = require("fs"),
	fse = require('fs-extra'),
	unique_short_id = require("../../utils/unique_short_id"),
	request = require("request");

var bucket = "thinglinx-test";
var co = require('co');
var OSS = require('ali-oss');
var client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'kp74z938xM97OCnV',
  accessKeySecret: 'WmMdAKOWdjm0dr5UHtssXFmNyjeqqC',
  bucket: 'thinglinx-test'
});

co(function* () {
  var result = yield client.listBuckets();
	console.log(" * ali oss - bucket list ");
  // console.log(result);
}).catch(function (err) {
  console.log(err);
});

co(function* () {
  client.useBucket('thinglinx-test');
  var result = yield client.list({
    'max-keys': 100
  });
	console.log(" * ali oss - file list ");
  // console.log(result);

	var pre = yield client.list({
		'prefix': '10087'
	})
	console.log(" * ali oss - lixq - 10086 ");
	// console.log(pre);
}).catch(function (err) {
  console.log(err);
});


var express = require('express');
var app = express();
var cookieParser = require('cookie-parser')
app.use(cookieParser())



function readJson(path , cb , callback){

	fs.readFile(path , function(err , data){
		// 读取url下文件，如果读取错误，抛出异常
		if(err){cb("file not exist" , null) ; return ;}
		// 正确读取文件后，将读取的data交给callback处理
		var rdata ;
		try{
			rdata = JSON.parse(data);
		}catch(err){
			cb("relationship file error" , null)
			return ;
		}
		callback(rdata);
	});

}

// layout.get interface
exports.layoutGet = function(field , cb){
	// 获取layout配置路径
	var layout_url = connection.getLayoutUrl();

	// 获取 layout 配置列表(relationship.json)
	async.waterfall([
		function(callback){
			var path = layout_url + "relationship.json" ;
			readJson(path , cb , function(rdata){
				callback(null , rdata);
			})
		},
		function(rdata , callback){
			// 如果用户没有传入id，默认用户需要获取layout列表，如果传入id，默认获取当前指定id的内容
			if(!field.query["id"]){
				cb(null , rdata);
				return;
			}

			var paras = field.query.id ;
			var rlist = [] ;
			if(Object.prototype.toString.call( paras ) === '[object Array]'){
				cb("Para Error" , null);
				return ;
			}else{
				// 如果用户获取某一个指定id，匹配relationship.json，获取url并返回data.json
				if(!rdata[paras]){cb("Para Error" , null);return;}
				var data_path = layout_url + rdata[paras].url;
				readJson(data_path , cb , function(data){
					callback(null , data);
					return ;
				})
			}

		}
	], function(err, results){
		cb("" , results);
	});

}


// component.get interface
exports.componentGet = function(field , cb){
	// 获取 component 配置路径
	var component_url = connection.getComponentUrl();
	// 获取 component 配置列表(component.json)
	async.waterfall([
		function(callback){
			var path = component_url + "relationship.json" ;
			readJson(path , cb , function(rdata){
				callback(null , rdata);
			})
		},
		function(rdata , callback){
			// 如果用户没有传入id，默认用户需要获取layout列表，如果传入id，默认获取当前指定id的内容
			if(!field.query["id"]){
				cb(null , rdata);
				return;
			}

			var paras = field.query.id ;
			var rlist = [] ;
			if(Object.prototype.toString.call( paras ) === '[object Array]'){
				cb("Para Error" , null);
				return ;
			}else{
				// 如果用户获取某一个指定id，匹配relationship.json，获取url并返回data.json
				if(!rdata[paras]){cb("Para Error" , null);return;}
				var data_path = component_url + rdata[paras].url;
				readJson(data_path , cb , function(data){
					callback(null , data);
					return ;
				})
			}

		}
	], function(err, results){
		cb("" , results);
	});

}


// search project by system model uuid || account id
exports.projectSearch = function(field , cb){
	var systemModelUuid , accountId;

	if(!field.query)
	{
		cb("Search Parameters Error" , null);
		return;
	}

	if(field.query.smid && !field.query.acid)
	{
		systemModelUuid = field.query.smid;
		connection.getConnectionPool(function(db){
			async.waterfall([
				// 查找用户输入的新的项目名称是否与其他项目名称重复，如果项目名称重复，提示用户
				function(callback){
					db.collection("abstracts" , function(err , col){
						if(err){
							cb("Connect Abstracts Error" , null);
							callback("Connect Abstracts Error" , null);
							db.close();
						}
						col.find({"systemModelUuid" : systemModelUuid}).toArray(function(err , data){
							if(data.length == 0){
								cb(null , null);
								callback(null , null);
								db.close();
							}else{
								cb(null , data);
								db.close();
							}
						})
					});
				}
			], function(err, results){
				console.log(err)
			});
		});
	}

	if(field.query.acid && !field.query.smid)
	{
		accountId = field.query.acid;
		connection.getConnectionPool(function(db){
			async.waterfall([
				// 查找用户输入的新的项目名称是否与其他项目名称重复，如果项目名称重复，提示用户
				function(callback){
					db.collection("abstracts" , function(err , col){
						if(err){
							cb("Connect Abstracts Error" , null);
							callback("Connect Abstracts Error" , null);
							db.close();
						}
						col.find({"accountId" : accountId}).toArray(function(err , data){
							if(data.length == 0){
								cb(null , null);
								callback(null , null);
								db.close();
							}else{
								cb(null , data);
								db.close();
							}
						})
					});
				}
			], function(err, results){
				console.log(err)
			});
		});
	}

	if(field.query.smid && field.query.acid)
	{
		systemModelUuid = field.query.smid;
		accountId = field.query.acid;
		connection.getConnectionPool(function(db){
			async.waterfall([
				// 查找用户输入的新的项目名称是否与其他项目名称重复，如果项目名称重复，提示用户
				function(callback){
					db.collection("abstracts" , function(err , col){
						if(err){
							cb("Connect Abstracts Error" , null);
							callback("Connect Abstracts Error" , null);
							db.close();
						}
						col.find({"accountId" : accountId , "systemModelUuid" : systemModelUuid}).toArray(function(err , data){
							if(data.length == 0){
								cb(null , null);
								callback(null , null);
								db.close();
							}else{
								cb(null , data);
								db.close();
							}
						})
					});
				}
			], function(err, results){
				console.log(err)
			});
		});
	}

}

// project create
exports.projectCreate = function(field , cb){
	// get create project name
	/*
		创建项目，会记录一下字段
		name : 项目名称
		description : 项目描述
		createTime : 项目创建时间
		modifyTime : 项目最后一次修改时间
		systemModelUuid : 项目对应系统模型
		accountId : 创建项目的 account id
	*/
	var short_id;

	if(!field.body){
		cb("Project Create Interface Paramters Set Error , Please Set name , description , createTime , modifyTime , systemModelUuid , accountId " , null);
		return;
	}

	short_id = new unique_short_id().generate();

	var json = {
		name : field.body.name,
		description : field.body.description,
		createTime : field.body.createTime,
		modifyTime : field.body.modifyTime,
		systemModelUuid : field.body.systemModelUuid,
		accountId : field.body.accountId,
		valid : false,
		uuid : short_id
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 连接 abstracts , 在 abstracts 中添加 project
			function(callback){
				db.collection("abstracts" , function(err , col){
					if(err){
						cb("Connect Abstracts Error" , null);
						callback("Connect Abstracts Error" , null);
						db.close();
					}
					callback(null , col);
				});
			},
			// 向 abstracts 中插入 document ，描述项目信息
			function(col , callback){
				col.insert( json , function(err, r) {
					if(!err){
						callback()
					}else{
						cb("Create Abstracts Error" , null);
						callback("Create Abstracts Error" , null);
						db.close();
						return;
					}
				});
			},
			// abstracts创建完成后，创建项目，创建好项目后，需要继续创建项目描述
			function(callback){
				db.createCollection(json.uuid , function(err, collection) {
					if(err){
						cb("Create Project Collection Error" , null);
						callback("Create Project Collection Error" , null);
						db.close();
					}else{
						callback()
					}
				});
			},
			// 创建项目描述
			function(callback){
				db.collection(json.uuid , function(err , col){
					if(err){
						cb("Connect Abstracts Error" , null);
						callback("Connect Abstracts Error" , null);
						db.close();
					}
					var pro_desc = {
						"doc_type" : "project_desc",
						"project_locked" : false
					}
					// Insert a Description (document) , desc project info
					col.insert(pro_desc , function(err, result) {
						if(err){
							cb("Create Project Description Error" , null);
							callback("Create Project Description Error" , null);
							db.close();
						}else{
							callback()
						}
					});
				});

			},
			// 如果项目与项目描述都成功的创建，则将 abstracts 中该项目的 valid 更改为 true
			function(callback){
				db.collection("abstracts" , function(err , col){
					if(err){
						cb("Connect Abstracts Error" , null);
						callback("Connect Abstracts Error" , null);
						db.close();
					}
					json.valid = true;
					col.findAndModify({"uuid" : json.uuid} , [] , {$set:json} , {new:true} , function(err , doc){
						if(err){
							cb("FindAndModify Error" , null) ;
							callback("FindAndModify Error" , null) ;
							db.close();
						}
						cb(null , json.uuid)
						db.close();
					});
				});
			}
		], function(err, results){
			console.log(err)
		});
	});


}


// project delete
exports.projectDel = function(field , cb){

	// 根据 system model uuid 删除对应的 project
	var systemModelUuid ;
	if(field.body && field.body.systemModelUuid){
		systemModelUuid = field.body.systemModelUuid;
	}else{
		cb("Project Delete Interface Paramters Set Error , Please Set System Model UUID" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查找 abstracts 中是否存在 当前需要删除 systemModelUuid 的 document
			function(callback){
				db.collection("abstracts" , function(err , col){
					if(err){
						cb("Connect Abstracts Error" , null);
						callback("Connect Abstracts Error" , null);
						db.close();
					}
					col.find({"systemModelUuid" : systemModelUuid}).toArray(function(err , data){
						if(data.length == 0){
							callback(null , false);
						}else{
							// 删除项目时，还需要连同该项目的图片一同删除（未测试）
							var uuid = data[0].uuid;
							var delList = [];
							co(function* () {
							  client.useBucket(bucket);
							  var imageListJson = yield client.list({
									'prefix': uuid
								})

								for (var i = 0; i < imageListJson.objects.length; i++) {
									delList.push(imageListJson.objects[i].name);
								}

								var result = yield client.deleteMulti(delList);

							}).catch(function (err) {
							  console.log(err);

							});
							callback(null , data[0].uuid , true);
						}
					})
				});
			},
			// 如果存在这个 document ，删除当前这个文档，如果不存在这个问题，则跳过这步
			function(uuid , state , callback){
				if(!state){
					callback()
				}else{
					db.collection("abstracts" , function(err , col){
						if(err){
							cb("Connect Abstracts Error" , null);
							callback("Connect Abstracts Error" , null);
							db.close();
						}
						col.remove({"systemModelUuid" : systemModelUuid} , function(err , data){
							if(err){
								cb("Delete Project Error" , null);
								callback("Delete Project Error" , null);
								db.close();
							}else{
								callback(null , uuid);
							}
						})
					});
				}
			},
			// 查找 collections 中是否存在 当前这个 id 的 collection
			function(uuid , callback){
				db.listCollections({name : uuid}).toArray(function(err,result) {
					if(err){
						cb("Project Delete Failed" , null);
						callback("Project Delete Failed" , null);
						db.close();
					}

					if(result.length != 0){
						if(result){
							callback(null , uuid)
						}
					}else{
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}

				});
			},
			// 如果存在这个 collection，删除当前的 collection，如果不存在则跳过这步
			function(uuid , callback){
				var collection = db.collection(uuid);
				collection.drop(function(err, r) {
					if(err){
						cb("Project Delete Error" , null);
						callback("Project Delete Error" , null);
						db.close();
					}
					cb(null , null);
					db.close();
				});
			}
		], function(err, results){
			console.log(err)
		});
	});
}


// project rename
exports.projectUpdate = function(field , cb){
	// get rename project id
	var id , new_name;
	if(!field.body){
		cb("Update Project Error : parameter not exist" , null);
		return;
	}

	var updateJson = {
		systemModelUuid : field.body.systemModelUuid,
		name : field.body.name,
		description : field.body.description,
		modifyTime : field.body.modifyTime
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查找用户输入的新的项目名称是否与其他项目名称重复，如果项目名称重复，提示用户
			function(callback){
				db.collection("abstracts" , function(err , col){
					if(err){
						cb("Connect Abstracts Error" , null);
						callback("Connect Abstracts Error" , null);
						db.close();
					}
					callback();
				});
			},
			// 如果项目名称没有重复，直接根据id，在abstracts中找到需要修改的document，重新设置abstracts docuement name
			function(callback){
				db.collection("abstracts" , function(err , col){
					if(err){
						cb("Connect Abstracts Error" , null);
						callback("Connect Abstracts Error" , null);
						db.close();
					}
					col.findAndModify({"systemModelUuid" : updateJson.systemModelUuid} , [] , {$set:{name : updateJson.name , description : updateJson.description , modifyTime : updateJson.modifyTime}} , {new:true} , function(err , doc){
						if(err){
							cb("FindAndModify Error" , null);
							callback("FindAndModify Error" , null);
							db.close();
						}
						cb(null , null);
						db.close();
					});
				});

			}
		], function(err, results){
			console.log(err)
		});
	});


}


// project list
exports.projectList = function(field , cb){
	// get delete project id
	var account ;
	if(field.query && field.query.account){
		account = field.query.account;
	}else{
		cb("Project List Interface Paramters Set Error , Please Set Account" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查找用户输入的新的项目名称是否与其他项目名称重复，如果项目名称重复，提示用户
			function(callback){
				db.collection("abstracts" , function(err , col){
					if(err){
						cb("Connect Abstracts Error" , null);
						callback("Connect Abstracts Error" , null);
						db.close();
					}
					col.find({"account" : account}).toArray(function(err , data){
						if(data.length == 0){
							cb("This account have no project" , null);
							callback("This account have no project" , null);
							db.close();
						}else{
							cb(null , data);
							db.close();
						}
					})
				});
			}
		], function(err, results){
			console.log(err)
		});
	});

}


// page save
exports.pageSave = function(field , cb){
	var content ;
	if(field.body){
		content = field.body;
	}else{
		cb("Page save Interface Paramters Set Error , Please Set Page Content" , null);
		return;
	}

	if(typeof content.id == "undefined"){
		cb("Please set project id" , null);
		return;
	}

	if(typeof content.name == "undefined"){
		cb("Please set page name" , null);
		return;
	}

	if(typeof content.content == "undefined"){
		cb("Please set page content" , null);
		return;
	}

	if(typeof content.type == "undefined"){
		cb("Please set page type" , null);
		return;
	}

	if(typeof content.doc_type == "undefined"){
		cb("Please set doc_type" , null);
		return;
	}

	if(typeof content.operator == "undefined"){
		cb("Please set page operator" , null);
		return;
	}

	if(typeof content.locked == "undefined"){
		cb("Please set page locked" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 检查当前项目是否存在
			function(callback){
				db.listCollections({name : content.id}).toArray(function(err,result) {
					if(err){
						cb("Project not exist" , null);
						callback("Project not exist" , null);
						db.close();
					}

					if(result.length != 0){
						if(result){
							callback()
						}
					}else{
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}

				});
			},
			// 如果当前 project 存在，则遍历是否存在同名的 page
			function(callback){
				db.collection(content.id , function(err , col){
					if(err){
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}
					col.find({"name" : content.name , "doc_type" : "page"}).toArray(function(err , data){
						if(data.length != 0){
							callback("" , true);
						}else{
							callback("" , false);
						}
					})
				});

			},
			// 如果当前页面已经存在，覆盖当前页面，如果当前页面没有存在，创建一个新的页面
			function(value , callback){
				// 如果当前页面已经存在，则覆盖重新修改这个页面内容
				if(value){
					db.collection(content.id , function(err , col){
						if(err){
							cb("Project Collection not exist" , null);
							callback("Project Collection not exist" , null);
							db.close();
						}
						delete content.id;
						col.findAndModify({"name" : content.name , "doc_type" : "page"} , [] , {$set:content} , {new:true} , function(err , doc){
							if(err){
								cb("FindAndModify Error" , null) ;
								callback("FindAndModify Error" , null) ;
								db.close();
							}
							cb("" , "Page save Success!")
							db.close();
						});
					});

				}else{
				// 如果这个页面不存在，则新建一个页面
					db.collection(content.id , function(err , col){
						if(err){
							cb("Project Collection not exist" , null);
							callback("Project Collection not exist" , null);
							db.close();
						}
						delete content.id;
						col.insert( content , function(err, r) {
							if(err){
								cb("Page save err" , null);
								callback("Page save err" , null);
								db.close();
							}else{
								cb(null , null)
								db.close();
							}
						});
					});

				}
			}
		], function(err, results){
			console.log(err)
		});
	});

}


// page delete
exports.pageDel = function(field , cb){
	var id , page_name;
	if(field.body && field.body.id){
		id = field.body.id;
	}else{
		cb("Page Del Interface Paramters Set Error , Please Set Project id" , null);
		return;
	}

	if(field.body && field.body.name){
		page_name = field.body.name;
	}else{
		cb("Page Del Interface Paramters Set Error , Please Set Page name" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查询当前用户需要删除的页面是否存在
			function(callback){

				db.collection(id , function(err , col){
					if(err){
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}
					col.find({"name" : page_name , "doc_type" : "page"}).toArray(function(err , data){
						if(data.length != 0){
							callback()
						}else{
							cb("Delete Page Not Exist" , null);
							callback("Delete Page Not Exist" , null);
							db.close();
						}
					})
				});

			},
			// 如果页面存在，直接删除
			function(callback){
				db.collection(id , function(err , col){
					if(err){
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}
					col.remove({"name" : page_name} , function(err , data){
						if(err){
							cb("Delete Page Error" , null);
							callback("Delete Page Error" , null);
							db.close();
						}else{
							cb(null , null);
						}
					})
				});
			}
		], function(err, results){
			console.log(err)
		});
	});

}


// page get
exports.pageGet = function(field , cb){
	var id , page_name;
	if(field.query && field.query.id){
		id = field.query.id;
	}else{
		cb("Page Get Interface Paramters Set Error , Please Set Project id" , null);
		return;
	}

	if(field.query && field.query.name){
		page_name = field.query.name;
	}else{
		cb("Page Get Interface Paramters Set Error , Please Set Page name" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查询当前获取的页面是否存在，如果存在直接返回给用户当前页面的document
			function(callback){
				db.collection(id , function(err , col){
					if(err){
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}
					col.find({"name" : page_name , "doc_type" : "page"}).toArray(function(err , data){
						if(data.length != 0){
							cb(null , data)
						}else{
							cb("Page Not Exist" , null);
							callback("Page Not Exist" , null);
							db.close();
						}
					})
				});
			}
		], function(err, results){
			console.log(err)
		});
	});
}


// page list
exports.pageList = function(field , cb){
	var id;
	if(field.query && field.query.id){
		id = field.query.id;
	}else{
		cb("Page List Interface Paramters Set Error , Please Set Project id" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查询当前获取的页面是否存在，如果存在直接返回给用户当前页面的document
			function(callback){
				db.collection(id , function(err , col){
					if(err){
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}
					col.find({"doc_type" : "page"}).toArray(function(err , data){
						if(data.length != 0){
							cb(null , data)
						}else{
							cb("Pages Is Null" , null);
							callback("Pages Is Null" , null);
							db.close();
						}
					})
				});
			}
		], function(err, results){
			console.log(err)
		});
	});
}


// page rename
exports.pageRename = function(field , cb){
	// get rename page old name & new name & project id
	var id , oname , nname;
	if(field.body && field.body.id){
		id = field.body.id;
	}else{
		cb("Please set project id before rename page" , null);
		return;
	}

	if(field.body && field.body.oname){
		oname = field.body.oname;
	}else{
		cb("Page Rename Interface Paramters Set Error , Please Set Page Old Name" , null);
		return;
	}

	if(field.body && field.body.nname){
		nname = field.body.nname;
	}else{
		cb("Page Rename Interface Paramters Set Error , Please Set Page New Name" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查询当前用户需要删除的页面是否存在
			function(callback){

				db.collection(id , function(err , col){
					if(err){
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}
					col.find({"name" : nname , "doc_type" : "page"}).toArray(function(err , data){
						if(data.length != 0){
							cb("Page name conflict" , false);
							callback("Page name conflict" , false);
							db.close();
						}else{
							callback(null , col);
						}
					})

				});


			},
			function(col , callback){
				col.findAndModify({"name" : oname , "doc_type" : "page"} , [] , {$set:{"name" : nname}} , {new:true} , function(err , doc){
					if(err){
						cb("FindAndModify Error" , false) ;
						callback("FindAndModify Error" , null) ;
						db.close();
					}
					if(doc && !doc.value){
						cb("FindAndModify Error" , false);
						callback("FindAndModify Error" , null) ;
						db.close();
					}else{
						cb("" , true)
						db.close();
					}
				});
			}
		], function(err, results){
			console.log(err)
		});
	});
}


// page set init
exports.pageSetInit = function(field , cb){
	// 获取系统id 原始的init page name = init old name = ioname 和新设置的init page name = init new name = inname
	var id , ioname , inname;
	if(field.body && field.body.id){
		id = field.body.id;
	}else{
		cb("Please set project id before set page init" , null);
		return;
	}

	if(field.body && field.body.ioname){
		ioname = field.body.ioname;
	}else{
		cb("Page Set Init Interface Paramters Set Error , Please Set Page Old Name" , null);
		return;
	}

	if(field.body && field.body.inname){
		inname = field.body.inname;
	}else{
		cb("Page Set Init Interface Paramters Set Error , Please Set Page New Name" , null);
		return;
	}
	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查询当前用户需要删除的页面是否存在
			function(callback){
				db.collection(id , function(err , col){
					if(err){
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
						return;
					}
					callback(null , col);
				});
			},
			function(col , callback){
				col.findAndModify({"name" : ioname , "doc_type" : "page"} , [] , {$set:{"type" : ""}} , {new:true} , function(err , doc){
					if(err){
						cb("FindAndModify Error" , false) ;
						callback("FindAndModify Error" , null) ;
						db.close();
					}
					if(doc && !doc.value){
						cb("FindAndModify Error" , false);
						callback("FindAndModify Error" , null) ;
						db.close();
					}else{
						callback(null , col);
					}
				});
			},
			function(col , callback){
				col.findAndModify({"name" : inname , "doc_type" : "page"} , [] , {$set:{"type" : "init"}} , {new:true} , function(err , doc){
					if(err){
						cb("FindAndModify Error" , false) ;
						callback("FindAndModify Error" , null) ;
						db.close();
					}
					if(doc && !doc.value){
						cb("FindAndModify Error" , false);
						callback("FindAndModify Error" , null) ;
						db.close();
					}else{
						cb("" , true)
						db.close();
					}
				});
			}
		], function(err, results){
			console.log(err)
		});
	});
}


// datasource save
exports.datasourceSave = function(field , cb){
	var content ;
	if(field.body){
		content = field.body;
	}else{
		cb("Datasource save Interface Paramters Set Error , Please Set Datasource Content" , null);
		return;
	}

	if(typeof content.id == "undefined"){
		cb("Please set project id" , null);
		return;
	}

	if(typeof content.name == "undefined"){
		cb("Please set datasource name" , null);
		return;
	}

	if(typeof content.doc_type == "undefined"){
		cb("Please set doc_type" , null);
		return;
	}

	if(typeof content.locked == "undefined"){
		cb("Please set datasource locked" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 检查当前项目是否存在
			function(callback){
				db.listCollections({name : content.id}).toArray(function(err,result) {
					if(err){
						cb("Project not exist" , null);
						callback("Project not exist" , null);
						db.close();
					}

					if(result.length != 0){
						if(result){
							callback()
						}
					}else{
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}

				});
			},
			// 如果当前 project 存在，则遍历是否存在同名的 datasource
			function(callback){
				db.collection(content.id , function(err , col){
					if(err){
						cb("Project Collection not exist" , null);
						callback("Project Collection not exist" , null);
						db.close();
					}
					col.find({"name" : content.name , "doc_type" : "datasource"}).toArray(function(err , data){
						if(data.length != 0){
							callback("" , true);
						}else{
							callback("" , false);
						}
					})
				});
			},
			// 如果当前datasource已经存在，覆盖当前datasource，如果当前datasource没有存在，创建一个新的datasource
			function(value , callback){
				// 如果当前页面已经存在，则覆盖重新修改这个页面内容
				if(value){
					db.collection(content.id , function(err , col){
						if(err){
							cb("Project Collection not exist" , null);
							callback("Project Collection not exist" , null);
							db.close();
						}
						delete content.id;
						col.findAndModify({"name" : content.name , "doc_type" : "datasource"} , [] , {$set:content} , {new:true} , function(err , doc){
							if(err){
								cb("FindAndModify Error" , null) ;
								callback("FindAndModify Error" , null) ;
								db.close();
							}
							cb(null , null);
							db.close();
						});
					});
				}else{
				// 如果这个datasource不存在，则新建一个datasource
					db.collection(content.id , function(err , col){
						if(err){
							cb("Project Collection not exist" , null);
							callback("Project Collection not exist" , null);
							db.close();
						}
						delete content.id;
						col.insert( content , function(err, r) {
							if(err){
								cb("datasource save err" , null);
								callback("datasource save err" , null);
								db.close();
							}else{
								cb(null , null)
								db.close();
							}
						});
					});
				}
			}
		], function(err, results){
			console.log(err)
		});
	});

}


// datasource delete
exports.datasourceDel = function(field , cb){
	var id , datasource_name;
	if(field.body && field.body.id){
		id = field.body.id;
	}else{
		cb("Datasource Del Interface Paramters Set Error , Please Set Project id" , null);
		return;
	}

	if(field.body && field.body.name){
		datasource_name = field.body.name;
	}else{
		cb("Datasource Del Interface Paramters Set Error , Please Set Datasource name" , null);
		return;
	}


	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查询当前用户需要删除的datasource是否存在
			function(callback){
				db.collection(id , function(err , col){
					if(err){
						cb("Project not exist" , null);
						callback("Project not exist" , null);
						db.close();
					}
					col.find({"name" : datasource_name , "doc_type" : "datasource"}).toArray(function(err , data){
						if(data.length != 0){
							callback()
						}else{
							cb("Delete Datasource Not Exist" , null);
							callback("Delete Datasource Not Exist" , null);
							db.close();
						}
					})
				});
			},
			// 如果datasource存在，直接删除
			function(callback){
				db.collection(id , function(err , col){
					if(err){
						cb("Project not exist" , null);
						callback("Project not exist" , null);
						db.close();
					}
					col.remove({"name" : datasource_name} , function(err , data){
						if(err){
							cb("Delete Datasource Error" , null);
							callback("Delete Datasource Error" , null);
							db.close();
						}else{
							cb(null , null);
						}
					})
				});
			}
		], function(err, results){
			console.log(err)
		});
	});

}


// datasource get
exports.datasourceGet = function(field , cb){
	var id , datasource_name;
	if(field.query && field.query.id){
		id = field.query.id;
	}else{
		cb("Datasource Get Interface Paramters Set Error , Please Set Project id" , null);
		return;
	}

	if(field.query && field.query.name){
		datasource_name = field.query.name;
	}else{
		cb("Datasource Get Interface Paramters Set Error , Please Set Datasource name" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查询当前获取的datasource是否存在，如果存在直接返回给用户当前datasource的document
			function(callback){
				db.collection(id , function(err , col){
					if(err){
						cb("Project not exist" , null);
						callback("Project not exist" , null);
						db.close();
					}
					col.find({"name" : datasource_name , "doc_type" : "datasource"}).toArray(function(err , data){
						if(err){
							cb("Find Datasource Fail" , null);
							callback("Find Datasource Fail" , null);
							db.close();
						}
						if(data.length != 0){
							cb(null , data);
							db.close();
						}else{
							cb("Datasource Not Exist" , null);
							callback("Datasource Not Exist" , null);
							db.close();
						}
					})
				});
			}
		], function(err, results){
			console.log(err)
		});
	});
}


// datasource list
exports.datasourceList = function(field , cb){
	var id;
	if(field.query && field.query.id){
		id = field.query.id;
	}else{
		cb("Datasource List Interface Paramters Set Error , Please Set Project id" , null);
		return;
	}

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查询当前获取的页面是否存在，如果存在直接返回给用户当前页面的document
			function(callback){
				db.collection(id , function(err , col){
					if(err){
						cb("Project not exist" , null);
						callback("Project not exist" , null);
						db.close();
					}
					col.find({"doc_type" : "datasource"}).toArray(function(err , data){
						if(data.length != 0){
							cb(null , data);
							db.close();
						}else{
							cb("Datasource Is Null" , null);
							callback("Datasource Is Null" , null);
							db.close();
						}
					})
				});
			}
		], function(err, results){
			console.log(err)
		});
	});
}


// datasource type query
exports.datasourceTypeQuery = function(field , cb){

	connection.getConnectionPool(function(db){
		async.waterfall([
			// 查询当前获取的页面是否存在，如果存在直接返回给用户当前页面的document
			function(callback){
				db.collection("abstracts" , function(err , col){
					if(err){
						cb("Project not exist" , null);
						callback("Project not exist" , null);
						db.close();
					}
					col.find({"type" : "datasource_type"}).toArray(function(err , data){
						if(data.length != 0){
							cb(null , data[0].datasource_type);
							db.close();
						}else{
							cb("Datasource Is Null" , null);
							callback("Datasource Is Null" , null);
							db.close();
						}
					})
				});
			}
		], function(err, results){
			console.log(err)
		});
	});
}


// get accesskey
/**
	user data 存储系统中所有登陆的用户
	用户第一次访问系统，会自动记录到userData中
	如果超过30分钟没有访问，会将用户从登陆系统中剔除
	{
		sessionId : "", // session id
		accessKey : "", // accesskey
		expiredTime : "", // accesskey 过期时间
		visitTime : "", // 用户最后一次访问时间
		username : "", // 用户名
		password : "", // 密码
		autoUpdate : function(){}, // 自动更新程序，当ack过期时，会自动更新ack
		autoClose : function(){} //  自动关闭程序，如果用户长时间没有更新ack，自动关闭本条记录
	}
*/
var userData = [];
exports.ackGet = function(field , cb){
	/**
		获取访问用户输入的信息，包括 session id || accesskey
		如果用户第一次登陆，没有session id时，需要传入accesskey创建一个内存对象，以便下次获取新的accesskey
		如果用户已经登陆过，需要获取新的ack时，需要传入已经获取到的sessionId
	*/
	var sid , ack;
	if(field.headers.cookie){
		var valueList = field.headers.cookie.split("=")[1].split("%7C");
		ack = valueList[0];
		sid = valueList[1];
	}
	if(field.query && field.query.sid){
		sid = field.query.sid;
	}else if(field.query && field.query.ack){
		ack = field.query.ack;
	}else{
		cb("Get AccessKey Paramters Error" , null);
		return;
	}

	/**
		如果用户使用session id登陆，直接返回给用户当前内存中存储的accesskey
		如果用户当前使用了session id登陆，但是内容并没有存储对应session id
		直接返回用户 session id error
	*/
	if(sid){
		for(var i in userData){
			if(userData[i].sessionId == sid){

				request.post({
					url:connection.getPrivateLoginInterface(),
					json : {
						account : userData[i].company,
						username : userData[i].username,
						password : userData[i].password
					},
					rejectUnauthorized: false
				},function(e , r , b){
					if(e){
						cb(e , null);
						return;
					}else{
						console.log(b);
						userData[i].visitTime = new Date().getTime();
						userData[i].accessKey = b.ret.accesskey;
						userData[i].expiredTime = b.ret.expires;

						var cookieValue = userData[i].accessKey + "|" + userData[i].sessionId;
						var exp = new Date(userData[i].expiredTime + 1000 * 60 * 60 * 8);
						cookieValue = cookieValue + "|" + userData[i].expiredTime;
						field.res.cookie('syalias_ack', cookieValue , { expires : exp })
						cb(null , null)
					}
				})

				// userData[i].visitTime = new Date().getTime();
				//
				// var cookieValue = userData[i].accessKey + "|" + userData[i].sessionId;
				// var exp = new Date(userData[i].expiredTime + 1000 * 60 * 60 * 8);
				// cookieValue = cookieValue + "|" + userData[i].expiredTime;
				// field.res.cookie('syalias_ack', cookieValue , { expires : exp })
				// cb(null , null)
				return;
			}
		}
		cb("Session Id Error" , "");
		return;
	}

	/**
		如果用户第一次登陆，当前系统还没用创建对应用户的session id
		则创建一个session id，返回给用户 sid和ack
	*/
	if(ack){
		var privateUrl = connection.getPrivateLoginInterface() + "?accesskey=" + ack;
		request.get({
			url : privateUrl
		},function(err , res , body){
			if(body.err){
				callback(false)
			}else{
				/*
					私有接口，通过ack获取 username ， password ， company
					{
					    "err":null,
					    "ret":{
					        "account":"company_name_1_1449461382821",
					        "username":"admin_1_1449461382822",
					        "password":"e10adc3949ba59abbe56e057f20f883e"
					    }
					}
				*/
				var sbody = JSON.parse(body);
				if(sbody.err)
				{
					cb(sbody.err , null);
					return;
				}
				request.post({
					url : connection.getPrivateLoginInterface(),
					json : {
						account : sbody.ret.account,
						username : sbody.ret.username,
						password : sbody.ret.password
					},
					rejectUnauthorized: false
				},function(e , r , b){
					if(e){
						cb("err" , null);
						return;
					};
					if(body.err){
						cb(b.err , null);
					}else{
						/*
							如果登陆成功，会返回 ack和ext
							body.ret.accesskey;
							body.ret.expires;
							通过 ack 再次调用私有接口，获取用户的 company ， username ，password
						*/
						privateLogin(field , b.ret.accesskey , b.ret.expires , function(r){
							if(!r)
							{
								cb("login err" , null);
							}
							else
							{
								cb(null , null);
							}
						});

					}
				});
			}
		});
	}
}

// login 用户使用syalias系统登录
exports.login = function(field , cb){
	var company , username , password;
	if(field.body && field.body.company){
		company = field.body.company;
	}else{
		cb("company is null" , null);
		return;
	}

	if(field.body && field.body.username){
		username = field.body.username;
	}else{
		cb("username is null" , null);
		return;
	}

	if(field.body && field.body.password){
		password = field.body.password;
	}else{
		cb("password is null" , null);
		return;
	}
	request.post({
		url : connection.getPublicLoginInterface(),
		json : {
			account : company,
			username : username,
			password : password
		},
		rejectUnauthorized: false
	},function(err , res , body){
		if(err){
			cb("err" , null);
			return;
		};
		if(body.err){
			cb(body.err , null);
		}else{
			/*
				如果登陆成功，会返回 ack和ext
				body.ret.accesskey;
				body.ret.expires;
				通过 ack 再次调用私有接口，获取用户的 company ， username ，password
				console.log("1. 通过明文登陆，获取的ack -> " + body.ret.accesskey);
			*/
			privateLogin(field , body.ret.accesskey , body.ret.expires , function(r){
				if(!r)
				{
					cb("login err" , null);
				}
				else
				{
					cb(null , null);
				}
			});

		}
	});

}

// 根据 ack 通过私有接口登陆系统，获取新的 ack ， 同时记录  company ， username ，password (密码是密文)
var privateLogin = function(field , ack , expires , callback){
	if(!ack){ return false; }
	var privateUrl = connection.getPrivateLoginInterface() + "?accesskey=" + ack;
	request.get({
		url : privateUrl
	},function(err , res , body){
		if(body.err){
			callback(false)
		}else{
			/*
				私有接口，通过ack获取 username ， password ， company
				{
				    "err":null,
				    "ret":{
				        "account":"company_name_1_1449461382821",
				        "username":"admin_1_1449461382822",
				        "password":"e10adc3949ba59abbe56e057f20f883e"
				    }
				}
			*/
			var sbody = JSON.parse(body)

			var userMessage = {
				sessionId : "",
				accessKey : "",
				expiredTime : null,
				visitTime : null,
				username : "",
				password : "",
				company : "",
				index : null,
				autoUpdateTimeout : null,
				autoCloseTimeout : null,
				autoUpdate : function(){
					// var _this = this;
					// var expiredTime = parseFloat(this.expiredTime);
					// var nowTime = new Date().getTime();
					// if(expiredTime - nowTime >= 0){
					// 	_this.autoUpdateTimeout = setTimeout(function(){
					// 		console.log("时间周期");
					// 		console.log(new Date(expiredTime));
					// 		console.log(new Date(nowTime));
					// 		request.post({
					// 			url:connection.getPrivateLoginInterface(),
					// 			json : {
					// 				account : _this.company,
					// 				username : _this.username,
					// 				password : _this.password
					// 			},
					// 			rejectUnauthorized: false
					// 		},function(e , r , b){
					// 			if(body.e){
					// 				cb(body.e , null);
					// 				return;
					// 			}else{
					// 				_this.accessKey = b.ret.accesskey;
					// 				_this.expiredTime = b.ret.expires;
					// 				_this.autoUpdate();
					// 			}
					// 		})
					// 	} , expiredTime - nowTime)
					// }else{
					// 	request.post({
					// 		url:connection.getPrivateLoginInterface(),
					// 		json : {
					// 			account : _this.company,
					// 			username : _this.username,
					// 			password : _this.password
					// 		},
					// 		rejectUnauthorized: false
					// 	},function(e , r , b){
					// 		if(body.e){
					// 			cb(body.e , null);
					// 			return;
					// 		}else{
					// 			_this.accessKey = b.ret.accesskey;
					// 			_this.expiredTime = b.ret.expires;
					// 			_this.autoUpdate();
					// 		}
					// 	})
					// }
				},
				autoClose : function(){
					var _this = this;
					var visitTime = parseFloat(this.visitTime);
					var nowTime = new Date().getTime();
					if(nowTime - visitTime < 900000){
						_this.autoCloseTimeout = setTimeout(function(){
							_this.autoClose();
						} , 900000)
					}else{
						clearTimeout(_this.autoUpdateTimeout);
						clearTimeout(_this.autoCloseTimeout);
						userData.splice(_this.index , 1);
					}
				}
			}

			userMessage.sessionId = new unique_short_id().generate();
			userMessage.accessKey = ack;
			userMessage.expiredTime = expires;


			userMessage.company = sbody.ret.account;
			userMessage.username = sbody.ret.username;
			userMessage.password = sbody.ret.password;
			userMessage.index = userData.length;
			userMessage.visitTime = new Date().getTime();
			userMessage.autoUpdate();
			userMessage.autoClose();
			userData.push(userMessage);

			// field.res.cookie('ack', userMessage.accessKey , { maxAge: 60000 })
			// field.res.cookie('sid', userMessage.sessionId , { maxAge: 60000 })
			// field.res.cookie('ext', userMessage.expiredTime , { maxAge: 60000 })

			// console.log(new Date())
			// console.log(userMessage.expiredTime)
			// console.log(new Date(userMessage.expiredTime).toLocaleTimeString())
			// console.log(new Date(userMessage.expiredTime).toLocaleString())
			// console.log(new Date(userMessage.expiredTime).toString())

			var cookieValue = userMessage.accessKey + "|" + userMessage.sessionId;
			var exp = new Date(userMessage.expiredTime + 1000 * 60 * 60 * 8);
			cookieValue = cookieValue + "|" + userMessage.expiredTime;
			field.res.cookie('syalias_ack', cookieValue , { expires : exp })

			callback(true);

		}
	});
}

// logout 用户使用syalias系统登出
exports.logout = function(field , cb){
	var ack;
	if(field.query && field.query.ack){
		ack = field.query.ack;
	}else{
		cb("Get AccessKey Paramters Error" , null);
		return;
	}

	var idx;
	for(var i in userData){
		if(userData[i].accessKey == ack){
			idx = userData[i].index;
		}
	}

	request.post({
		url:connection.getPublicLogoutInterface() + "?accesskey=" + ack,
		json : null,
		rejectUnauthorized: false
	},function(err , res , body){
		if(err){
			cb(err , null);
		}else{
			delete userData[idx];
			cb(null , null);
		}
	});
}

/*
	下面的借口提供OSS图片处理，包括图片的上传，遍历，删除
	图片包括 目录+文件名称 ： 10087/NJB5oxKVxO8_x5w3ks
	目录以项目名称为单位，名称使用短码自动生成，最后生成图片的url为
	http://thinglinx-test.oss-cn-beijing.aliyuncs.com/10087/NJB5oxKVxO8_x5w3ks
*/
// 上传图片
exports.imagesUpload = function(req , res){

	// 获取项目名称
	var fname;
	if(req.query){
		fname = req.query.fname;
	}
	if (!fname) {
		res.send(500, 'fname not esist');
		return;
	}
	// 获取上传的图片 将图片从临时文件上传到指定目录下，并且对上传的图片进行重命名
	var imageTempUrl = req.files.file.path;
	// 创建图片名称短码
	var shortId = new unique_short_id().generate();
	// 上传图片目录+名称
	var objectKey = fname + "/" + shortId;

	co(function*() {
	  var result = yield client.put(objectKey, imageTempUrl);
	  // 如果图片上传成功，删除临时文件
	  fse.unlink(imageTempUrl, function(err) {
	    if (err) {
	      res.send(500, 'upload delete temp file error');
	      return;
	    }
	    res.json({err : null , ret : result});
			return;
	  })
	}).catch(function(err) {
	  res.send(500, 'upload error');
	});

}

// 删除上传单张图片
exports.deleteImage = function(field , cb){
	var imageName;
	if(field.query){
		imageName = field.query.imageName;
	}else{
		cb("ImageName Not Exist" , null);
		return;
	}

	// 获取上传图片目录
	co(function*() {
	  var result = yield client.delete(imageName);
	  console.log(result);
		cb("" , "");
	}).catch(function(err) {
	  console.log(err);
		cb("delete image error" , "");
	});

}

// 一次性删除多张OSS图片
exports.deleteImageMulti = function(field , cb){
	var imageList;
	if(field.query){
		imageList = field.body;
	}else{
		cb("imageList Not Exist" , null);
		return;
	}

	// 获取上传图片目录
	co(function*() {
	  var result = yield client.deleteMulti(imageList);
	  console.log(result);
		cb("" , "");
	}).catch(function(err) {
	  console.log(err);
		cb("delete multi image error" , "");
	});

}

// 遍历项目文件夹下所有的图片
exports.imagesList = function(field , cb){
	var fname;
	if(field.query){
		fname = field.query.fname;
	}
	if (!fname) {
		cb("fname not esist" , "");
		return;
	}

	co(function* () {
	  client.useBucket(bucket);
	  var imageListJson = yield client.list({
			'prefix': fname
		})
		console.log(" * Restful imagesList interface ");
		cb("" , imageListJson.objects);
	}).catch(function (err) {
		cb(err , null);
	  console.log(err);
	});

}

// 获取component controller(废弃)
exports.componentController = function(field , cb){
	// 获取 component controller 配置路径
	var componentControllerUrl = connection.getComponentController();

	// 获取 component controller  配置列表(data.json)
	async.waterfall([
		function(callback){
			var path = componentControllerUrl + "data.json" ;
			readJson(path , cb , function(rdata){
				cb(null , rdata.content);
			})
		}
	], function(err, results){
		cb("" , results);
	});
}
