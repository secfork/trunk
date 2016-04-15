
var Syalias = require('../../../syalias')
	, async = require('async')
	, service = Syalias.Service
	, escape_array = require('../../utils/escape_array')
	, prepare_options = require('../../utils/prepare_options')
	, prepare_fields = require('../../utils/prepare_fields')
	, prepare_conds = require('../../utils/prepare_conds');


// get layout by id
exports.layoutGet =  function(req,cb){
	service.layoutGet(req , cb);
}

// get component by id
exports.componentGet = function(req , cb){
	service.componentGet(req , cb);
}

// search project by system model uuid || account id
exports.projectSearch = function(req , cb){
	service.projectSearch(req , cb);
}

// create project
exports.projectCreate = function(req , cb){
	service.projectCreate(req , cb);
}

// delete project
exports.projectDel = function(req , cb){
	service.projectDel(req , cb);
}

// rename project
exports.projectUpdate = function(req , cb){
	service.projectUpdate(req , cb);
}

// project list
exports.projectList = function(req , cb){
	service.projectList(req , cb);
}

// page save
exports.pageSave = function(req , cb){
	service.pageSave(req , cb);
}

// page del
exports.pageDel = function(req , cb){
	service.pageDel(req , cb);
}

// page get
exports.pageGet = function(req , cb){
	service.pageGet(req , cb);
}

// page list
exports.pageList = function(req , cb){
	service.pageList(req , cb);
}

// page rename
exports.pageRename = function(req , cb){
	service.pageRename(req , cb);
}

// page set init
exports.pageSetInit = function(req , cb){
	service.pageSetInit(req , cb);
}

// datasource save
exports.datasourceSave = function(req , cb){
	service.datasourceSave(req , cb);
}

// datasource del
exports.datasourceDel = function(req , cb){
	service.datasourceDel(req , cb);
}

// datasource get
exports.datasourceGet = function(req , cb){
	service.datasourceGet(req , cb);
}

// datasource list
exports.datasourceList = function(req , cb){
	service.datasourceList(req , cb);
}

// datasource type query
exports.datasourceTypeQuery = function(req , cb){
	service.datasourceTypeQuery(req , cb);
}

// ack get
exports.ackGet = function(req , cb){
	service.ackGet(req , cb);
}

// login
exports.login = function(req , cb){
	service.login(req , cb);
}

// logout
exports.logout = function(req , cb){
	service.logout(req , cb);
}

// images upload
exports.imagesUpload = function(req , res){
	service.imagesUpload(req , res);
}

// delete image
exports.deleteImage = function(req , cb){
	service.deleteImage(req , cb);
}

// delete multi images
exports.deleteImageMulti = function(req , cb){
	service.deleteImageMulti(req , cb);
}

// image list
exports.imagesList = function(req , cb){
	service.imagesList(req , cb);
}

// get component controller
exports.componentController = function(req , cb){
	service.componentController(req , cb);
}
