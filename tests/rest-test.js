
/*
	layout.out test
*/
var tmi = getTestModularInstance();

var restModular = tmi.createModular("layout.out test");

var layout_out_json = {
	1: {url: "layout_1/data.json", type: "", thumbnail: ""},
	2: {url: "layout_2/data.json", type: "", thumbnail: ""},
	3: {url: "layout_3/data.json", type: "", thumbnail: ""},
	4: {url: "layout_4/data.json", type: "", thumbnail: ""},
	5: {url: "layout_5/data.json", type: "", thumbnail: ""},
	6: {url: "layout_6/data.json", type: "", thumbnail: ""}
}

tmi.ajax_get("/v5/json/syalias/layout.get" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(JSON.stringify(data.ret) == JSON.stringify(layout_out_json)){
		ret = "数据返回正确";
	}
	tmi.createTestMessage(restModular , "/v2/json/syalias/layout.get" , "Paramter is null" , ret);
})

tmi.ajax_get("/v5/json/syalias/layout.get?id=1" , function(data){
	var str = "{\"content\":\"<div class='container'><div class='item col-7' view-selector  droppable selectable style='height:700px;'></div>\"}";
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(JSON.stringify(data.ret) == str){
		ret = "数据返回正确";
	}
	tmi.createTestMessage(restModular , "/v5/json/syalias/layout.get?id=1" , "id=1" , ret);
})

tmi.ajax_get("/v5/json/syalias/layout.get?id=11" , function(data){
	var str = "{\"content\":\"<div class='container'><div class='item col-7' view-selector  droppable selectable style='height:700px;'></div>\"}";
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(JSON.stringify(data.ret) == str){
		ret = "数据返回正确";
	}
	tmi.createTestMessage(restModular , "/v5/json/syalias/layout.get?id=11" , "id=11" , ret);
})

tmi.ajax_get("/v5/json/syalias/layout.get?id=all" , function(data){
	var str = "{\"content\":\"<div class='container'><div class='item col-7' view-selector  droppable selectable style='height:700px;'></div>\"}";
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(JSON.stringify(data.ret) == str){
		ret = "数据返回正确";
	}
	tmi.createTestMessage(restModular , "/v5/json/syalias/layout.get?id=all" , "id=all" , ret);
})

tmi.ajax_get("/v5/json/syalias/layout.get?xxx" , function(data){
	var str = "{\"content\":\"<div class='container'><div class='item col-7' view-selector  droppable selectable style='height:700px;'></div>\"}";
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(JSON.stringify(data.ret) == JSON.stringify(layout_out_json)){
		ret = "数据返回正确";
	}
	tmi.createTestMessage(restModular , "/v5/json/syalias/layout.get?xxx" , "xxx" , ret);
})

tmi.ajax_get("/v5/json/syalias/layout.get?id=1&id=2" , function(data){
	var str = "{\"content\":\"<div class='container'><div class='item col-7' view-selector  droppable selectable style='height:700px;'></div>\"}";
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(JSON.stringify(data.ret) == JSON.stringify(layout_out_json)){
		ret = "数据返回正确";
	}
	tmi.createTestMessage(restModular , "/v5/json/syalias/layout.get?id=1&id=2" , "id=1&id=2" , ret);
})

tmi.ajax_get("/v5/json/syalias/layout.get?<>?!@#$%^&" , function(data){
	var str = "{\"content\":\"<div class='container'><div class='item col-7' view-selector  droppable selectable style='height:700px;'></div>\"}";
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(JSON.stringify(data.ret) == JSON.stringify(layout_out_json)){
		ret = "数据返回正确";
	}
	tmi.createTestMessage(restModular , "/v5/json/syalias/layout.get?<>?!@#$%^&" , "<>?!@#$%^&" , ret);
})

tmi.ajax_get("/v5/json/syalias/layout.get?id=7" , function(data){
	var str = "{\"content\":\"<div class='container'><div class='item col-7' view-selector  droppable selectable style='height:700px;'></div>\"}";
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(JSON.stringify(data.ret) == JSON.stringify(layout_out_json)){
		ret = "数据返回正确";
	}
	tmi.createTestMessage(restModular , "/v5/json/syalias/layout.get?id=7" , "id=7" , ret);
})

/*
	component.get test
*/

var tmi_2 = getTestModularInstance();

var restModular_2 = tmi_2.createModular("component.get test");

tmi_2.ajax_get("/v5/json/syalias/component.get" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'object' && data.ret){
		ret = "数据返回正确";
	}
	tmi_2.createTestMessage(restModular_2 , "/v5/json/syalias/component.get" , "Paramter is null" , ret);
})

tmi_2.ajax_get("/v5/json/syalias/component.get?id=1" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'object' && data.ret){
		ret = "数据返回正确";
	}
	tmi_2.createTestMessage(restModular_2 , "/v5/json/syalias/component.get?id=1" , "id=1" , ret);
})

tmi_2.ajax_get("/v5/json/syalias/component.get?id=11" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'object' && data.ret){
		ret = "数据返回正确";
	}
	tmi_2.createTestMessage(restModular_2 , "/v5/json/syalias/component.get?id=11" , "id=11" , ret);
})

tmi_2.ajax_get("/v5/json/syalias/component.get?id=all" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'object' && data.ret){
		ret = "数据返回正确";
	}
	tmi_2.createTestMessage(restModular_2 , "/v5/json/syalias/component.get?id=all" , "id=all" , ret);
})

tmi_2.ajax_get("/v5/json/syalias/component.get?xxx" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'object' && data.ret){
		ret = "数据返回正确";
	}
	tmi_2.createTestMessage(restModular_2 , "/v5/json/syalias/component.get?xxx" , "xxx" , ret);
})

tmi_2.ajax_get("/v5/json/syalias/component.get?id=1&id=2" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'object' && data.ret){
		ret = "数据返回正确";
	}
	tmi_2.createTestMessage(restModular_2 , "/v5/json/syalias/component.get?id=1&id=2" , "id=1&id=2" , ret);
})

tmi_2.ajax_get("/v5/json/syalias/component.get?<>?!@#$%^&" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'object' && data.ret){
		ret = "数据返回正确";
	}
	tmi_2.createTestMessage(restModular_2 , "/v5/json/syalias/component.get?<>?!@#$%^&" , "<>?!@#$%^&" , ret);
})

tmi_2.ajax_get("/v5/json/syalias/component.get?id=14" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'object' && data.ret){
		ret = "数据返回正确";
	}
	tmi_2.createTestMessage(restModular_2 , "/v5/json/syalias/component.get?id=14" , "id=14" , ret);
})

/*
	project.create && project.del test
*/

var tmi_3 = getTestModularInstance();

var restModular_3 = tmi_3.createModular("project.create && project.del test");

tmi_3.ajax_put("/v5/json/syalias/project.create" , {} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {name : "prj_1"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{name : 'prj_1'}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {account : "xiaoming"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{account : 'xiaoming'}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {aa : "prj_1" , bb : "xiaoming"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{aa : 'prj_1' , bb : 'xiaoming'}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {bb : "xiaoming"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{bb : 'xiaoming'}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {name : "prj_2" , account : "xiaoming"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{name : 'prj_2' , account : 'xiaoming'}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {name : true , account : false , "lala" : "lala"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{name : true , account : false , lala : 'lala'}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {name : "123" , account : "123"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
		project_del(data.ret);
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{name : \"123\" , account : \"123\"}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {name : "?<>?!@#$%^&" , account : "?<>?!@#$%^&"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
		project_del(data.ret);
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{name : \"?<>?!@#$%^&\" , account : \"?<>?!@#$%^&\"}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {name : "prj_1" , account : "xiaoming" , "lala" : "lala"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
		project_del(data.ret);
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{name : \"prj_1\" , account : \"xiaoming\" , \"lala\" : \"lala\"}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {name : "prj_3" , account : "xiaoming"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
		project_del(data.ret);
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{name : 'prj_3' , account : 'xiaoming'}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.create" , {name : "" , account : "xiaoming"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		ret = "数据返回正确";
		project_del(data.ret);
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.create" , "{name : '' , account : 'xiaoming'}" , ret);
})

function project_del(pid){
	tmi_3.ajax_put("/v5/json/syalias/project.del" , {id : pid} , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(!data.ret && !data.err){
			ret = "数据删除正确";
		}
		tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.del" , pid , ret);
	})
} 

tmi_3.ajax_put("/v5/json/syalias/project.del" , {} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(!data.ret && !data.err){
		ret = "数据删除正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.del" , "{}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.del" , {id : ""} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(!data.ret && !data.err){
		ret = "数据删除正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.del" , "{id : ''}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.del" , {id : "eerer" , id : "N1DsZUORYM"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(!data.ret && !data.err){
		ret = "数据删除正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.del" , "{id : 'eerer' , id : 'N1DsZUORYM'}" , ret);
})

tmi_3.ajax_put("/v5/json/syalias/project.del" , {id : "!@#$%^&"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(!data.ret && !data.err){
		ret = "数据删除正确";
	}
	tmi_3.createTestMessage(restModular_3 , "/v5/json/syalias/project.del" , "{id : '!@#$%^&'}" , ret);
})



/*
	project.rename
*/

var tmi_4 = getTestModularInstance();

var restModular_4 = tmi_4.createModular("project.rename test");

tmi_4.ajax_put("/v5/json/syalias/project.create" , {name : "test_rename" , account : "test_rename"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		project_rename(data.ret , "prj_2");
		project_rename(data.ret , "");
		project_rename("" , "");
		project_rename();
		project_rename(data.ret , "");
		project_rename(data.ret , true);
		project_rename(data.ret , false);
		project_rename(data.ret , "!@#$%^&");
		project_del(data.ret);
	}
})

function project_rename(id , name){
	tmi_4.ajax_put("/v5/json/syalias/project.rename" , {'id' : id , 'name' : name} , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(!data.ret && !data.err){
			ret = "项目修改名称成功";
		}
		tmi_4.createTestMessage(restModular_4 , "/v5/json/syalias/project.rename" , "{id : "+id+" , name : "+name+"}" , ret);
	})
}


/*
	project.list
*/

var tmi_5 = getTestModularInstance();

var restModular_5 = tmi_5.createModular("project.list test");

function project_list(account){
	var url = "/v5/json/syalias/project.list?account=" + account;
	tmi_5.ajax_get(url , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(typeof data.ret == 'object' && data.ret){
			ret = "数据返回正确";
		}
		tmi_5.createTestMessage(restModular_5 , "/v5/json/syalias/project.list" , account , ret);
	})
}

project_list("xiaoming");
project_list("?<>?!@#$%^&");
project_list(2);
project_list(true);
project_list(false);
project_list("xxzxx");


/*
	page.save
*/


var tmi_6 = getTestModularInstance();

var restModular_6 = tmi_6.createModular("project.save test");

tmi_6.ajax_put("/v5/json/syalias/project.create" , {name : "test_pagesave" , account : "test_pagesave"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		var page_1 = {
			id : data.ret,
			name : "page_1",
			content : "<div>page_1_1</div>",
			type : "init",
			doc_type : "page",
			operator : "xiaoming",
			locked : false
		}
		page_save(page_1);
		
		var page_2 = {
			id : data.ret,
			name : "page_1",
			content : "<div>page_1_1</div>",
			type : "init",
			doc_type : "page",
			operator : "xiaoming",
			locked : false
		}
		page_save(page_2);
		
		var page_3 = {
			id : "xxx",
			name : "page_1",
			content : "<div>page_1_1</div>",
			type : "init",
			doc_type : "page",
			operator : "xiaoming",
			locked : false
		}
		page_save(page_3);
		
		var page_4 = {};
		page_save(page_4);
		
		project_del(data.ret);
	}
});

function page_save(d){
	tmi_6.ajax_post("/v5/json/syalias/page.save" , d , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(typeof data.ret == 'object' && data.ret){
			ret = "数据返回正确";
		}
		tmi_6.createTestMessage(restModular_6 , "/v5/json/syalias/page.save" , JSON.stringify(d) , ret);
	});
}


/*
	page.del
*/


var tmi_7 = getTestModularInstance();

var restModular_7 = tmi_7.createModular("page.del test");

tmi_7.ajax_put("/v5/json/syalias/project.create" , {name : "test_pagedel" , account : "test_pagedel"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		var page_1 = {
			id : data.ret,
			name : "page_1",
			content : "<div>page_1_1</div>",
			type : "init",
			doc_type : "page",
			operator : "xiaoming",
			locked : false
		}
		page_save(page_1);
		
		
		page_del(data.ret , "page_2"); 
		page_del(data.ret , "page_3");
		page_del(data.ret , "xx");
		page_del(data.ret , "");
		page_del("" , "page_1");
		page_del("" , "");
		page_del(data.ret , "page_1"); 
		
		project_del(data.ret);
	}
});

function page_del(id , pname){
	tmi_7.ajax_put("/v5/json/syalias/page.del" , {'id' : id , 'name' : pname} , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(!data.err && !data.ret){
			ret = "数据返回正确";
		}
		tmi_7.createTestMessage(restModular_7 , "/v5/json/syalias/page.del" , {'id' : id , 'name' : pname} , ret);
	});
}


/*
	page.get
*/


var tmi_8 = getTestModularInstance();

var restModular_8 = tmi_8.createModular("page.get test");

tmi_8.ajax_put("/v5/json/syalias/project.create" , {name : "test_pageget" , account : "test_pageget"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		var page_1 = {
			id : data.ret,
			name : "page_1",
			content : "<div>page_1_1</div>",
			type : "init",
			doc_type : "page",
			operator : "xiaoming",
			locked : false
		}
		page_save(page_1);
		
		
		
		page_get(data.ret , "page_2"); 
		page_get(data.ret , ""); 
		page_get("" , "page_1"); 
		page_get("" , ""); 
		page_get(data.ret , "page_1"); 
		
		project_del(data.ret);
	}
});

function page_get(id , name){
	var url = "/v5/json/syalias/page.get?id=" + id + "&name=" + name;
	tmi_8.ajax_get(url , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(typeof data.ret == 'object' && data.ret){
			ret = "数据返回正确";
		}
		tmi_8.createTestMessage(restModular_8 , "/v5/json/syalias/page.get" , id+" "+name , ret);
	})
}


/*
	page.list
*/


var tmi_9 = getTestModularInstance();

var restModular_9 = tmi_9.createModular("page.list test");

tmi_9.ajax_put("/v5/json/syalias/project.create" , {name : "test_pagelist" , account : "test_pagelist"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		var page_1 = {
			id : data.ret,
			name : "page_1",
			content : "<div>page_1_1</div>",
			type : "init",
			doc_type : "page",
			operator : "xiaoming",
			locked : false
		}
		page_save(page_1);
		
		
		
		page_list(data.ret); 
		page_list(""); 
		page_list("xxx"); 
		
		project_del(data.ret);
	}
});

function page_list(id){
	var url = "/v5/json/syalias/pages.list?id=" + id;
	tmi_9.ajax_get(url , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(typeof data.ret == 'object' && data.ret){
			ret = "数据返回正确";
		}
		tmi_9.createTestMessage(restModular_9 , "/v5/json/syalias/pages.list" , id , ret);
	})
}


/*
	page.rename
*/

var tmi_10 = getTestModularInstance();

var restModular_10 = tmi_10.createModular("page.rename test");

tmi_10.ajax_put("/v5/json/syalias/project.create" , {name : "test_pagerename" , account : "test_pagerename"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		var page_1 = {
			id : data.ret,
			name : "page_1",
			content : "<div>page_1_1</div>",
			type : "init",
			doc_type : "page",
			operator : "xiaoming",
			locked : false
		}
		page_save(page_1);
		

		page_rename(data.ret , "" , ""); 
		page_rename("" , "page_1" , "page_2"); 
		page_rename(data.ret , "" , "page_2"); 
		page_rename(data.ret , "page_1" , ""); 
		page_rename(data.ret , "page_1" , "page_2"); 
		
		project_del(data.ret);
	}
});

function page_rename(id , oname , nname){
	tmi_10.ajax_put("/v5/json/syalias/page.rename" , {id : id , oname : oname , nname : nname} , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(!data.err && data.ret){
			ret = "数据返回正确";
		}
		tmi_10.createTestMessage(restModular_10 , "/v5/json/syalias/pages.list" , id , ret);
	})
}



/*
	datasource.save
*/


var tmi_11 = getTestModularInstance();

var restModular_11 = tmi_11.createModular("datasource.save test");

tmi_11.ajax_put("/v5/json/syalias/project.create" , {name : "test_ds_save" , account : "test_ds_save"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		
		
		var page_2 = {
			id : data.ret,
			name : "datasource_1",
			parameters : "123123",
			type : "aaa",
			doc_type : "datasource",
			dependent : "123aaa",
			locked : false
		}
		ds_save(page_2);
		
		var page_3 = {
			id : "xxx",
			name : "datasource_1",
			parameters : "bb",
			type : "d",
			doc_type : "d",
			dependent : "123aaa",
			locked : false
		}
		ds_save(page_3);
		
		var page_4 = {};
		ds_save(page_4);
		
		var page_1 = {
			id : data.ret,
			name : "datasource_1",
			parameters : "123123",
			type : "aaa",
			doc_type : "datasource",
			dependent : "123aaa",
			locked : false
		}
		ds_save(page_1);
		
		project_del(data.ret);
	}
});

function ds_save(d){
	tmi_11.ajax_post("/v5/json/syalias/datasource.save" , d , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(!data.err && !data.ret){
			ret = "数据返回正确";
		}
		tmi_11.createTestMessage(restModular_11 , "/v5/json/syalias/datasource.save" , JSON.stringify(d) , ret);
	});
}


/*
	datasource.del
*/


var tmi_12 = getTestModularInstance();

var restModular_12 = tmi_12.createModular("datasource.del test");

tmi_12.ajax_put("/v5/json/syalias/project.create" , {name : "test_datasource_del" , account : "test_datasource_del"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		var page_1 = {
			id : data.ret,
			name : "datasource_1",
			parameters : "123123",
			type : "aaa",
			doc_type : "datasource",
			dependent : "123aaa",
			locked : false
		}
		ds_save(page_1);
		
		
		ds_del(data.ret , "page_3");
		ds_del(data.ret , "xx");
		ds_del(data.ret , "");
		ds_del("" , "page_1");
		ds_del("" , "");
		ds_del(data.ret , "datasource_1"); 
		
		project_del(data.ret);
	}
});

function ds_del(id , pname){
	tmi_12.ajax_put("/v5/json/syalias/datasource.del" , {'id' : id , 'name' : pname} , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(!data.err && !data.ret){
			ret = "数据返回正确";
		}
		tmi_12.createTestMessage(restModular_12 , "/v5/json/syalias/datasource.del" , {'id' : id , 'name' : pname} , ret);
	});
}



/*
	datasource.get
*/


var tmi_13 = getTestModularInstance();

var restModular_13 = tmi_13.createModular("datasource.get test");

tmi_13.ajax_put("/v5/json/syalias/project.create" , {name : "test_ds_get" , account : "test_ds_get"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		var page_1 = {
			id : data.ret,
			name : "datasource_1",
			parameters : "123123",
			type : "aaa",
			doc_type : "datasource",
			dependent : "123aaa",
			locked : false
		}
		ds_save(page_1);
		
		
		ds_get(data.ret , "page_2"); 
		ds_get(data.ret , ""); 
		ds_get("" , "page_1"); 
		ds_get("" , ""); 
		ds_get(data.ret , "datasource_1"); 
		
		project_del(data.ret);
	}
});

function ds_get(id , name){
	var url = "/v5/json/syalias/datasource.get?id=" + id + "&name=" + name;
	tmi_13.ajax_get(url , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(typeof data.ret == 'object' && data.ret){
			ret = "数据返回正确";
		}
		tmi_13.createTestMessage(restModular_13 , "/v5/json/syalias/page.get" , id+" "+name , ret);
	})
}



/*
	datasource.list
*/


var tmi_14 = getTestModularInstance();

var restModular_14 = tmi_14.createModular("datasource.list test");

tmi_14.ajax_put("/v5/json/syalias/project.create" , {name : "test_ds_list" , account : "test_ds_list"} , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'string' && data.ret){
		var page_1 = {
			id : data.ret,
			name : "datasource_1",
			parameters : "123123",
			type : "aaa",
			doc_type : "datasource",
			dependent : "123aaa",
			locked : false
		}
		ds_save(page_1);
		
		
		ds_list(""); 
		ds_list("xxx"); 
		ds_list(data.ret); 
		
		
		project_del(data.ret);
	}
});

function ds_list(id){
	var url = "/v5/json/syalias/datasource.list?id=" + id;
	tmi_14.ajax_get(url , function(data){
		var ret = "数据返回错误";
		if(data.err){
			ret = data.err ;
		}
		if(typeof data.ret == 'object' && data.ret){
			ret = "数据返回正确";
		}
		tmi_14.createTestMessage(restModular_14 , "/v5/json/syalias/datasource.list" , id , ret);
	})
}

/*
	datasource.query
*/
var tmi_15 = getTestModularInstance();

var restModular_15 = tmi_15.createModular("datasource.query test");

tmi_15.ajax_get("/v5/json/syalias/datasourcetype.query" , function(data){
	var ret = "数据返回错误";
	if(data.err){
		ret = data.err ;
	}
	if(typeof data.ret == 'object' && data.ret){
		ret = "数据返回正确";
	}
	tmi_15.createTestMessage(restModular_15 , "/v5/json/syalias/datasourcetype.query" , null , ret);
})


