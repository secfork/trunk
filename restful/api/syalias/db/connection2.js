var mysql = require('mysql') ,
	async = require('async');

//
// mysql database connection options
//

var mongodb_url = "mongodb://localhost:27017/DB";
var component_url = "/root/nodejs/athena/component/";
var layout_url = "/root/nodejs/athena/layout/";
var images_url = "/root/nodejs/athena/uploadImages/";

var publicLoginInterface = "https://10.165.71.177:777/v2/json/auth/user";
var publicLogoutInterface = "https://10.165.71.177:777/v2/json/auth/logout"
var privateLoginInterface = "http://10.165.71.177:3001/auth/user";

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
