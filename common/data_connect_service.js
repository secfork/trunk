/**
 *	@name : COMMON data connect service
 *	@kind : service
 *	@description :  本module，主要负责对接restful接口，将restful接口封装成service
 *					本service中，包括对接平台的restful接口&对接系统接口
 *					本module统一对service命名，'$_' + '驼峰命名'
 */

var module = angular.module("common.data_connect_service" , []);

var interface_version = "/v6";

/**
	get thinglinx accesskey
	accesskey format :
	{
		accessKey : "xxx" ,
		sessionId : "xxx" ,
		expiredTime : "xxx"
	}
*/
module.service('$_logout' , function($http , $console){
	var logout = function(){
		var mes = getCookieOrUrlAckMessage();
		var accessKey,sessionId;
		if(mes){
			accessKey = mes.ack;
			sessionId = mes.sid;
		}
		if(!accessKey){
			window.location.href = "login.html";
			return;
		}
		var url = interface_version + '/json/syalias/logout?ack=' + accessKey;
		$http.get(url).
			success(function(data, status, headers, config){
				if(!data.err){
					window.location.href = "login.html";
					return;
				}
			}).
			error(function(data, status, headers, config){
				$console.log('Logout Error');
			});
	}
	return logout;
})


// 获取url ack
var getUrlAckMessage = function(){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (pair[0] == "ack") {
			return pair[1];
		}
	}
}

// get thinglinx accesskey
module.service("$_getAccessKey" , function($rootScope , $http , $console){

	var getAccessKey = function(){
		/**
			properties
			* ack 获取数据需要的钥匙
			* sid 当ack过期 根据session id获取获取新 ack
			* ext expiredTime,过期时间，根据当前ack的过期时间自动更新ack
		*/
		this.accessKey;
		this.sessionId;
		this.expiredTime;
		this.systemName;
		var _this = this;

		this.init = function(sname){
			_this.systemName = sname;
			_this.reqAck();
			$rootScope.$on("300000ms" , function(){
				_this.reqAck();
			});
		};

		this.getAck = function(callback){
			var ack = "accesskey=";
			var cookieList = document.cookie.split(";");
			$.each(cookieList , function(idx , val){
				var vs = val.split("=");
				if(vs[0] == "syalias_ack")
				{
					_this.accessKey = vs[1].split("%7C")[0];
					_this.sessionId = vs[1].split("%7C")[1];
					_this.expiredTime = vs[1].split("%7C")[2];
					ack +=  _this.accessKey;
				}
			})
			callback(ack);
		};
		/**
			get方法提供系统可用的ack
		*/
		this.reqAck = function(){
			// 如果cookie不存在 并且在url中没有获取ack 直接跳转到登陆页面
			if(!document.cookie && !getUrlAckMessage())
			{
				if(_this.systemName == "dyalias")
				{
					window.location.href = "login.html";debugger
				}
				return;
			}

			// 如果cookie存在
			if(document.cookie)
			{
				// 获取cookie中的 ack和sid
				// _this.getCookie(function(){});
				// 根据sid重写cookie
				var cookieList = document.cookie.split(";");
				$.each(cookieList , function(idx , val){
					var vs = val.split("=");
					if(vs[0] == "syalias_ack")
					{
						_this.accessKey = vs[1].split("%7C")[0];
						_this.sessionId = vs[1].split("%7C")[1];
						_this.expiredTime = vs[1].split("%7C")[2];
					}
				})
				var url = interface_version + '/json/syalias/ack.get?sid=' + _this.sessionId;
				$http.get(url).
					success(function(data, status, headers, config){
						if(data.err)
						{
							if(_this.systemName == "dyalias")
							{
								window.location.href = "login.html";debugger
							}
							return;
						}
						$console.log('Get Ack Success');
					}).
					error(function(data, status, headers, config){
						$console.log('Get Ack Error');
						return;
					});
			}

			// 如果cookie不存在 url中的ack存在
			if(getUrlAckMessage())
			{
				var url = interface_version + '/json/syalias/ack.get?ack=' + getUrlAckMessage();
				$http.get(url).
					success(function(data, status, headers, config){
						$console.log('Get Ack Success');
					}).
					error(function(data, status, headers, config){
						$console.log('Get Ack Error');
					});
			}

		};


	}

	var gak = new getAccessKey()

	return gak;

})


var getProjectId = function(){
	var projectId ;
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (pair[0] == "uuid") {
			projectId = pair[1]
		}
	}
    return projectId;
}


/*
	/v2/json/syalias/layout.get
*/
module.service('$_layoutGet' ,  function($http){

	var layoutGet = function(page_id , callback){
		// if sdata is empty , don't save
		if( arguments.length ==0 || typeof page_id != "number" ){
			console.log(" _layoutGet args error ") ;
			return ;
		}

		// layout.get url
		var url = interface_version + '/json/syalias/layout.get?id=' + page_id;
		// post save request
		$http.get(url).
			success(function(data, status, headers, config){
				if(data.err){
					console.log('系统获取布局错误');
					callback(null);
				}else{
					callback(data.ret);
				}
			}).
			error(function(data, status, headers, config){
				console.log(data);
			});

	}

	return layoutGet;

});


/*
	/v2/json/syalias/page.save
*/
module.service('$_pageSave' ,  function($http){

	var pageSave = function(sdata , callback){ // sdata must be array
		// if sdata is empty , don't save
		if( !Array.isArray(sdata) && sdata.length == 0 && arguments.length !=0){
			console.log(" common_save args type error / length is zero") ;
			return ;
		}

		// page.save url
		var save_url = interface_version + "/json/syalias/page.save";
		sdata["id"] = getProjectId();

		// post save request
		$http.post(save_url , sdata).success(function(d , s){
			if(d.err){
				console.log("Page Save Error");
				callback(false);
			}else{
				callback(true);
			}
		});

	}

	return pageSave;

});

/*
	/v2/json/syalias/page.init
*/
module.service('$_pageInit' ,  function($http){

	var pageInit = function(sdata , callback){ // sdata must be array
		// if sdata is empty , don't save
		if( !Array.isArray(sdata) && sdata.length == 0 && arguments.length !=0){
			console.log(" page_init args type error / length is zero") ;
			return ;
		}

		// page.init url
		var init_url = interface_version + "/json/syalias/page.init";
		sdata["id"] = getProjectId();

		// post save request
		$http.post(init_url , sdata).success(function(d , s){
			if(d.err){
				console.log("Page Init Error");
				callback(false);
			}else{
				callback(true);
			}
		});

	}

	return pageInit;

});

/*
	/v2/json/syalias/pages.list
*/
module.service('$_pagesList' ,  function($http){

	var pagesList = function(callback){
		var project_id = getProjectId();
		// get pages list url
		var url = interface_version + '/json/syalias/pages.list?id=' + project_id ;
		// post save request
		$http.get(url).
			success(function(data, status, headers, config){
				if(data.err){
					callback(null);
				}else{
					callback(data.ret);
				}
			}).
			error(function(data, status, headers, config){
				console.log(data);
			});

	}

	return pagesList;

});


/*
	/v2/json/syalias/page.rename
*/
module.service('$_pageRename' ,  function($http){

	var pagesList = function(data , callback){
		var project_id = getProjectId();
		data["id"] = project_id;
		// get pages list url
		var url = interface_version + '/json/syalias/page.rename' ;
		// post save request
		$http.put(url , data).
			success(function(data, status, headers, config){
				if(!data.err){
					callback(true);
				}else{
					callback(false);
				}
			}).
			error(function(data, status, headers, config){
				callback(false)
			});

	}

	return pagesList;

});


/*
	/v2/json/syalias/page.del
*/
module.service('$_pageDel' ,  function($http){

	var pageDel = function(data , callback){ // page name is specify dele page name
		var project_id = getProjectId();
		data["id"] = project_id;
		// page delete url
		var url = interface_version + "/json/syalias/page.del";
		// post save request
		$http.put(url , data).success(function(res , status){
			if(res.err){
				console.log('Page Delete Error');
				callback(false);
			}else{
				callback(true);
			}
		})

	}

	return pageDel;

});


/*
	/v2/json/syalias/component.get
*/
module.service('$_componentGet' , [ '$http' , function($http){
	var componentGet = function(cid , callback){
		var url = interface_version + "/json/syalias/component.get?id=" + cid;
		$http.get(url).success(function(data , status){
			if(!data.err){
				callback(data);
			}
		});
	};
	return componentGet;
}]);


/*
	/v2/json/syalias/datasource.list
*/
module.service('$_datasourceList' ,  function($http){

	var datasourceList = function(callback){
		var pid = getProjectId();
		var url = interface_version + '/json/syalias/datasource.list?id=' + pid;
		// post save request
		$http.get(url).success(function(d , s){
			if(!d.err){
				callback(d.ret , "");
			}else{
				callback("" , d.err);
			}
		});

	}
	return datasourceList;

});


/*
	GET /v2/json/syalias/datasourcetype.query
*/
module.service('$_getDatasourceType' , [ '$http' , function($http){
	// 本服务用于获取数据源的类型
	var getDatasourceType = function(callback){
		// get request
		var url = interface_version + "/json/syalias/datasourcetype.query";
		$http.get(url).success(function(d , s){
			if(!d.err){
				callback(d.ret) ;
			}
		});
	}
	return getDatasourceType
}]);


/*
	/v2/json/syalias/datasource.save
*/
module.service('$_datasourceSave' ,  function($http){

	var datasourceSave = function(data , callback){
		data["id"] = getProjectId();
		data["doc_type"] = "datasource";
		data["locked"] = "false";
		var url = interface_version + '/json/syalias/datasource.save';
		// post save request
		$http.post(url , data).success(function(d , s){
			if(!d.err){
				callback(true);
			}else{
				callback(false);
			}
		});

	}

	return datasourceSave;

});


/*
	/v2/json/syalias/page.del
*/
module.service('$_datasourceDelete' ,  function($http){

	var datasourceDelete = function(name , callback){
		var data = {
			id : getProjectId(),
			name : name
		}
		var url = interface_version + '/json/syalias/datasource.del';
		// post save request
		$http.put(url , data ).success(function(d , s){
			if(!d.err){
				callback(true);
			}else{
				callback(false);
			}
		});

	}

	return datasourceDelete;

});


/*
	/v2/json/syalias/imagesUpload
*/
module.service('$_imagesUpload', function($http) {

  var imagesUpload = function(file, callback) {
    var url;
    var name = getProjectId();
    if (name) {
      url = interface_version + '/json/syalias/imagesUpload?fname=' + name;
    } else {
      return;
    }
    // post save request https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
		// http://stackoverflow.com/questions/13963022/angularjs-how-to-implement-a-simple-file-upload-with-multipart-form
    var fd = new FormData();
    fd.append('file', file[0]);
    $http.post(url, fd, {
				withCredentials: true,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
      .success(function(d) {
				callback(d);
			})
      .error(function() {});
  }

  return imagesUpload;

});


/*
	/v2/json/syalias/deleteImageFolder
*/
module.service('$_deleteImage' ,  function($http){

	var deleteImage = function(name , callback){

		var url = interface_version + '/json/syalias/deleteImage?imageName=' + name;
		// post save request
		$http.get(url).success(function(d , s){
			if(!d.err){
				callback(true);
			}else{
				callback(false);
			}
		});

	}

	return deleteImage;

});


/*
	/v2/json/syalias/deleteImageMulti
*/
module.service('$_deleteImageMulti' ,  function($http){

	var deleteImageMulti = function(nameList , callback){

		var url = interface_version + '/json/syalias/deleteImageMulti';

		$http.post(url , nameList).success(function(d , s){
			if(!d.err){
				callback(true);
			}else{
				callback(false);
			}
		});


	}

	return deleteImageMulti;

});


/*
	/v2/json/syalias/imagesList
*/
module.service('$_imagesList' ,  function($http){

	var imagesList = function(name , callback){

		var url = interface_version + '/json/syalias/imagesList?fname=' + name;
		// post save request
		$http.get(url).success(function(d , s){
			if(!d.err){
				callback(true);
			}else{
				callback(false);
			}
		});

	}

	return imagesList;

});

/*
	/v2/json/syalias/componentController.get
*/
module.service('$_componentControllerGet' ,  function($http){

	var componentControllerGet = function(callback){

		var url = interface_version + '/json/syalias/componentController.get';
		// get request
		$http.get(url).success(function(d , s){
			if(!d.err){
				callback(d.ret);
			}else{
				callback(null);
			}
		});

	}

	return componentControllerGet;

});
