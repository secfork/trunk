var express = require('express')
	, initCommands = require('../../common/init_commands')
	, syalias = require('../server/syalias')
	, router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var commands = [

	{
		"method":"get",
		"res":"/syalias/layout.get",
		"op":{
			"exec" : syalias.layoutGet
		}
	},
	{
		"method":"get",
		"res":"/syalias/component.get",
		"op":{
			"exec" : syalias.componentGet
		}
	},
	{
		"method":"get",
		"res":"/syalias/project.search",
		"op":{
			"exec" : syalias.projectSearch
		}
	},
	{
		"method":"put",
		"res":"/syalias/project.create",
		"op":{
			"exec" : syalias.projectCreate
		}
	},
	{
		"method":"put",
		"res":"/syalias/project.del",
		"op":{
			"exec" : syalias.projectDel
		}
	},
	{
		"method":"put",
		"res":"/syalias/project.update",
		"op":{
			"exec" : syalias.projectUpdate
		}
	},
	{
		"method":"get",
		"res":"/syalias/project.list",
		"op":{
			"exec" : syalias.projectList
		}
	},
	{
		"method":"post",
		"res":"/syalias/page.save",
		"op":{
			"exec" : syalias.pageSave
		}
	},
	{
		"method":"put",
		"res":"/syalias/page.del",
		"op":{
			"exec" : syalias.pageDel
		}
	},
	{
		"method":"get",
		"res":"/syalias/page.get",
		"op":{
			"exec" : syalias.pageGet
		}
	},
	{
		"method":"get",
		"res":"/syalias/pages.list",
		"op":{
			"exec" : syalias.pageList
		}
	},
	{
		"method":"put",
		"res":"/syalias/page.rename",
		"op":{
			"exec" : syalias.pageRename
		}
	},
	{
		"method":"post",
		"res":"/syalias/page.init",
		"op":{
			"exec" : syalias.pageSetInit
		}
	},
	{
		"method":"post",
		"res":"/syalias/datasource.save",
		"op":{
			"exec" : syalias.datasourceSave
		}
	},
	{
		"method":"put",
		"res":"/syalias/datasource.del",
		"op":{
			"exec" : syalias.datasourceDel
		}
	},
	{
		"method":"get",
		"res":"/syalias/datasource.get",
		"op":{
			"exec" : syalias.datasourceGet
		}
	},
	{
		"method":"get",
		"res":"/syalias/datasource.list",
		"op":{
			"exec" : syalias.datasourceList
		}
	},
	{
		"method":"get",
		"res":"/syalias/datasourcetype.query",
		"op":{
			"exec" : syalias.datasourceTypeQuery
		}
	},
	{
		"method":"get",
		"res":"/syalias/ack.get",
		"op":{
			"exec" : syalias.ackGet
		}
	},
	{
		"method":"post",
		"res":"/syalias/login",
		"op":{
			"exec" : syalias.login
		}
	},
	{
		"method":"get",
		"res":"/syalias/logout",
		"op":{
			"exec" : syalias.logout
		}
	},
	{
		"method":"post",
		"res":"/syalias/imagesUpload",
		"op":{
			"exec" : syalias.imagesUpload
		}
	},
	{
		"method":"get",
		"res":"/syalias/deleteImage",
		"op":{
			"exec" : syalias.deleteImage
		}
	},
	{
		"method":"post",
		"res":"/syalias/deleteImageMulti",
		"op":{
			"exec" : syalias.deleteImageMulti
		}
	},
	{
		"method":"get",
		"res":"/syalias/imagesList",
		"op":{
			"exec" : syalias.imagesList
		}
	},
	{
		"method":"get",
		"res":"/syalias/componentController.get",
		"op":{
			"exec" : syalias.componentController
		}
	}
];

/**********************************************
 *                                            *
 *      Initialize server commands            *
 *                                            *
 **********************************************/
router.post("/syalias/imagesUpload" , multipartMiddleware , syalias.imagesUpload);

initCommands(router, commands);
module.exports = router;
