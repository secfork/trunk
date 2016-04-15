var auto_id = 1 ;

var testModularInstance ;

function testModular(){
	
	var aid = 0;
	
	var createId = function(str){
		var id ;
		if(str == "mo"){
			id = "modular" + aid;
			aid++;
			return id;
		}else{
			id = "message" + aid;
			aid++;
			return id;
		}
	}
	
	this.createModular = function(modular_name){
		var mid = createId("mo");
		var modular = "<div id='"+mid+"' class='Test-Modular' style='position:relative;float:left;margin: 0 0 2px 0;background-color:#51414B;width:100%;min-height:100px;'><span style='position:relative;float:left;width:99%;height:40px;font-size:27px;font-weight:600;font-family:\"微软雅黑\";background-color:#A63E5F;margin:5px 5px 5px 5px;color:#F1F1F1;padding: 0 0 5px 5px;'>"+modular_name+"</span></div>";
		$('body').append(modular);
		return mid;
	}
	
	this.createTestMessage = function(mid , interface_name , interface_paramters , interface_result){
		var meid = createId("me");
		var message = "<div id='"+meid+"' class='Test-Message' style='position:relative;float:left;width:98%;margin:10px 5px 10px 5px;background-color:#535A6C;color:#FFF;font-family:\"微软雅黑\";'><span style='position:relative;float:left;width:98%;height:33%;margin:8px 5px 5px 5px;background-color:#71968E;padding-left:5px;'>"+interface_name+"</span><span style='position:relative;float:left;width:98%;height:33%;margin:8px 5px 5px 5px;background-color:#71968E;padding-left:5px;'>"+interface_paramters+"</span><span style='position:relative;float:left;width:98%;height:33%;margin:8px 5px 8px 5px;background-color:#71968E;padding-left:5px;'>"+interface_result+"</span></div>";
		$("#" + mid).append(message);
	}
	
	this.ajax_get = function(url , callback){
		$.ajax({
			type: "GET",
			url : url ,
			success : function(data){
				callback(data)
			},
			error : function(x , t , e){
				callback(e);
			}
		});
	}
	
	this.ajax_post = function(url , data , callback){
		$.ajax({
			type: "POST",
			url: url,
			dataType : "json",
			data : JSON.stringify( data ) ,
			contentType:"application/json; charset=utf-8",
			success : function(data){
				callback(data)
			},
			error : function(x , t , e){
				callback(e);
			}
		});
	}
	
	this.ajax_put = function(url , data , callback){
		$.ajax({
			type: "PUT",
			url : url ,
			dataType : "json",
			data : JSON.stringify( data ) ,
			contentType:"application/json; charset=utf-8",
			success : function(data){
				callback(data)
			},
			error : function(x , t , e){
				callback(e);
			}
		});
	}
	
}

function getTestModularInstance(){
	if(testModularInstance){
		return testModularInstance;
	}
	testModularInstance = new testModular();
	return testModularInstance;
}













