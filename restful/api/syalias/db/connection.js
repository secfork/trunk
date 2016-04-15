var mysql = require('mysql') ,
	async = require('async');

//
// mysql database connection options
//

var mongodb_url = "mongodb://localhost:27017/DB";
var component_url = "/usr/local/nginx/html/syalias/trunk/restful/component/";
var layout_url = "/usr/local/nginx/html/syalias/trunk/restful/layout/";
var images_url = "/usr/local/nginx/html/syalias/trunk/img/jir/";
var componentController_url = "/usr/local/nginx/html/syalias/trunk/restful/componentController/"

var publicLoginInterface = "https://172.18.16.254:443/v2/json/auth/user";
var publicLogoutInterface = "https://172.18.16.254:443/v2/json/auth/logout"
var privateLoginInterface = "http://172.18.16.254:3000/auth/user";

var pool_;

exports.getComponentUrl = function(){
	return component_url;
}

exports.getLayoutUrl = function(){
	return layout_url;
}

exports.getConnectionPool = function(callback) {
	pool_.connect(mongodb_url , function(err, database) {
		if(err) {console.log("Mongodb create connection error.") ; return ;};
		callback(database) ;
	});

};

exports.setConnectionPool = function(pool) {
	pool_ = pool;
};

exports.getImagesUrl = function(){
	return images_url;
}

exports.getPublicLoginInterface = function(){
	return publicLoginInterface;
}

exports.getPublicLogoutInterface = function(){
	return publicLogoutInterface;
}

exports.getPrivateLoginInterface = function(){
	return privateLoginInterface;
}

exports.getComponentController = function(){
	return componentController_url;
}
