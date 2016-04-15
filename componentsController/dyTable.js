/**
 *	@name : component controller rect
 *	@kind : controller
 *	@description : table组件通用controller
 */

var module = angular.module("componentsController.dyTable" , []);

module.controller('dyTable' , ['$scope' , '$unique_id' ,'$compile', '$element' , '$document' , '$datasource_factory' , '$console' , '$timeout' ,'$componentProperty','$rootScope','$ocLazyLoad',

    function($scope, $unique_id,$compile, $element ,$document, $datasource_factory , $console , $timeout,$componentProperty,$rootScope,$ocLazyLoad){
        /*	组件属性定义
         * base , 基本属性
         * style , 样式属性
         * data , 数据连接属性
         * directiveStr , 组件绑定设置属性的 directive
         */
        $ocLazyLoad.load(['lib/datetimepicker/css/bootstrap-datetimepicker.min.css','lib/datetimepicker/bootstrap-datetimepicker.min.js']).then(function(){
            $(".form_datetime").datetimepicker({
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-right"
            });
        })
        $scope.base = {
            "id": null,
            "name": "table",
            "locked" : false,
            "logo" : "img/icon/ic_crop_free_white_48dp.png",
            "display" : "flex",
            "parentId" :$element.parent().attr('id'),
            "children" :[]
        }

        $scope.style = {
            "display":"flex",
            "position": "relative",
            "width" : "400px",
            "height" :  "300px",
            "marginLeft" : "0px",
            "marginTop" : "0px",
            "marginRight" : "0px",
            "marginBottom" : "0px",
            "background":'rgba(0,0,0,0)',
            "flex": '0 0 auto',

            "timeCtrl": '0',//是否显示时间设置控件
            "tbBorder": '1',//报表是否有内边框
            "oddColor": "#f1f5f8",//奇数行颜色
            "evenColor": "#ebedd2",//偶数行颜色
        }

        $scope.data = {
            "ds":{//数据源
                "type": ['getSystemHistoryReadInterval'],
                "dsSelected":"getSystemHistoryReadInterval",
                "model": "",
                "sys": "",
            },
            "op":{//数据源参数
                "tags":[],
                "start":"",
                "end": "",
                "intval": "",
            },
            "tb":{//表格控制
                "head": "name",//表头使用：变量名/描述(name/desc)
                "type": "year",//年，月，日，周，自定义
                "isNow": '1',//1标示：当前，0标示：去年，上月，昨天，上周
                // "week": true,//布尔值，true标示；自然周，false标示：最近七天
                "day": "1",//可选范围1-28，最后一天
                "hour": 0,//可选范围0-23
                "minute": 0//可选范围0-59

            }
        };

        $scope.directiveStr = "<div prop-table></div>";


        $scope.thead = [];
        $scope.tbody = [];


        // 监听组件选中事件
        $rootScope.$on('COMPONENT_SELECTED' , function(evt , id){

            if($scope.id == id)
            {
                //显示反选框
                $element.addClass('selectedFrame');
                //设置组件属性
                $scope.setProperty();

            }else{
                //去掉反选框
                $element.removeClass('selectedFrame');
            }
        })

        // 组件选中后 , 同步组件属性栏与组件
        $scope.setProperty = function(){
            var propertyScope = $('#uiComponentProperties').scope();
            propertyScope.regist($scope.id,$scope.directiveStr);
        }

        // 数据写会到dom节点上
        $scope.writeBack = function(){
            var idata = {};
            idata.base = $scope.base;
            idata.style = $scope.style;
            idata.data = $scope.data;
            var idataString = JSON.stringify(idata);
            $element.attr("data", idataString);
        }


        // 初始化数据，获取标签data数据，初始化给$scope对象
        function componentDataInit(){
            var ida = $element.attr('data');
            var data = angular.fromJson(ida);
            //组件通用属性,连接属性，拓展属性
            $.each(data.base, function (idx,val) {
                $scope.base[idx] = val;
            });

            $.each(data.style, function (idx,val) {
                $scope.style[idx] = val;
            });


            if(data.data){
                $.each(data.data, function (idx,val) {
                    $scope.data[idx] = val;
                });
            }
            //对新建的组件，创建一个唯一系统id
            if($scope.base.id){
                $scope.id = $scope.base.id;
            }else{
                $scope.id = $unique_id();
                $scope.base.id = $scope.id;
                $scope.writeBack();
            }
            // 初始化 , 向元素列表中注入自身 base 属性 , 允许元素列表对组件 base 属性进行设置 , 除base属性外,还可以设置display
            var elementListScope = $("#uiEditorElementList").scope();
            if(elementListScope)
            {
                elementListScope.regist($scope.base);
            }

        }
        // 执行一次
        componentDataInit();




        $scope.showDate1 = function(){
            $element.find('.dtp1').datetimepicker('show');
        }
        $scope.showDate2 = function(){
            $element.find('.dtp2').datetimepicker('show');
        }
        $scope.intvalNum = 1;
        $scope.intvalUnit = 'day';
        $scope.query = function(intvalNum,intvalUnit){
            var start = $element.find('#dtp_input1').val();
            var end = $element.find('#dtp_input2').val();
            var intval;
            if(intvalUnit=='day'){
                intval = parseInt(intvalNum)*24*3600*1000;
            }else if (intvalUnit=="hour") {
                intval = parseInt(intvalNum)*3600*1000;
            }else{
                intval = parseInt(intvalNum)*60*1000;
            }
            if(start&&end){//如果设置了时间
                var startTime = new Date(start).getTime();
                var endTime = new Date(end).getTime();
                if(startTime<endTime&&endTime-startTime>intval){//如果开始早于结束，且有间隔
                    $scope.data.op.start = parseInt(startTime);
                    $scope.data.op.end = parseInt(endTime);
                    $scope.data.op.intval = intval;
                    dsInit();
                }
            }
        }



        // 数据源数据初始化
        var datasource;//数据源
        function dsInit(){
            var name = $scope.data.ds.dsSelected;
            var opTags = [];
            $.each($scope.data.op.tags,function(idx,val){
                var json = {name:val}
                opTags.push(json);  
            });
            //监听到系统加载完毕，组件内部的数据源才开始使用
            var stop = setInterval(function(){
                if($scope.loading){
                    //停止循环
                    clearInterval(stop);
                    // 设置参数
                    if($scope.data.tb.type=='year'){//如果类型是年
                        datasource = $datasource_factory.find('getSystemHistoryReadAtTime');
                        datasource.options[0].value = opTags;
                        datasource.options[1].value = $scope.data.op.intval;//时间戳集合，使用intval保存
                        datasource.options[2].value = "server_ts";
                        datasource.options[3].value = "last_value";
                    }else{//如果类型是其他
                        datasource = $datasource_factory.find('getSystemHistoryReadInterval');
                        datasource.options[0].value = opTags;
                        datasource.options[1].value = parseInt($scope.data.op.start);
                        datasource.options[2].value = parseInt($scope.data.op.end);
                        var count = parseInt($scope.data.op.end-$scope.data.op.start)/parseInt($scope.data.op.intval);
                        datasource.options[3].value = count;
                    }
                    // 获取数据
                    if (datasource) {
                        datasource.ret = [];
                        datasource.refresh(function(){});
                        datasource.getAllData(function(data){
                            //确定表头
                            $scope.thead = opTags;
                            //确定数据
                            $scope.tbody = data;
                        })
                    };
                }                
            },1000);            
        }
        // 数据源参数初始化
        function optionInit() {
            var start,end,intval;
            if ($scope.data.tb.type=='year'){//需要使用READ AT TIME接口
                var maxMonth;
                var t = [];
                if ($scope.data.tb.isNow=='1') {//如果是今年
                    var time = new Date();
                    maxMonth = time.getMonth()+1;
                    for (var i = 1; i <= maxMonth; i++) {
                        if($scope.data.tb.day=="最后一"){
                            if(i<12){
                                var timeStamp = new Date(time.getFullYear()+","+(i+1)).getTime();
                                timeStamp = timeStamp-24*3600*1000+parseInt($scope.data.tb.hour)*3600*1000;
                                if(timeStamp<time.getTime()){
                                    t.push(timeStamp)    
                                }                                
                            }
                        }else{
                            var timeStamp = new Date(time.getFullYear()+","+i+","+$scope.data.tb.day+" "+$scope.data.tb.hour+":0").getTime();
                            if(timeStamp<time.getTime()){
                                t.push(timeStamp);
                            }
                        }
                    };
                }else{//如果是去年
                    maxMonth = 12;
                    var time = new Date();
                    for (var i = 1; i <= maxMonth; i++) {
                        if($scope.data.tb.day=="最后一"){
                            if(i<12){
                                var timeStamp = new Date((time.getFullYear()-1)+","+(i+1)).getTime();
                                timeStamp = timeStamp-24*3600*1000+parseInt($scope.data.tb.hour)*3600*1000;
                                t.push(timeStamp);
                            }else{
                                var timeStamp = new Date(time.getFullYear()+"").getTime();
                                timeStamp = timeStamp-24*3600*1000+parseInt($scope.data.tb.hour)*3600*1000-8*3600*1000;
                                t.push(timeStamp);
                            }
                        }else{
                            var timeStamp = new Date((time.getFullYear()-1)+","+i+","+$scope.data.tb.day+" "+$scope.data.tb.hour+":0").getTime();
                            t.push(timeStamp);
                        }
                    };
                };
                start = t[0];
                intval = t;
                // 初始化显示时间
                $scope.showTime = new Date(t[0]).getFullYear()+"";

            }else if ($scope.data.tb.type=='month'){
                if ($scope.data.tb.isNow=='1') {//如果是当月
                    // intval
                    intval = 24*3600*1000;
                    // start
                    var time = new Date();
                    time.setDate(1);
                    time.setHours(parseInt($scope.data.tb.hour),parseInt($scope.data.tb.minute),0,0);
                    start = time.getTime();
                    // end
                    var time2 = new Date();
                    end = time2.getTime()-((time2.getTime()-start)%intval);
                }else{//如果是上月
                    // intval
                    intval = 24*3600*1000;
                    // start
                    var time = new Date();
                    start = new Date(time.getFullYear()+","+time.getMonth()+",1 "+$scope.data.tb.hour+":"+$scope.data.tb.minute).getTime();
                    // end
                    var nowMonth =  new Date(time.getFullYear()+","+(time.getMonth()+1)).getTime()
                    end = nowMonth-((nowMonth-start)%intval);
                }

                // 初始化显示时间
                var startStr = new Date(start);
                $scope.showTime = startStr.getFullYear()+"."+(startStr.getMonth()+1);

            }else if ($scope.data.tb.type=='week'){
                if($scope.data.tb.isNow=='1'){//如果是今天开始的前7天
                    // intval
                    intval = 24*3600*1000;
                    // start
                    var time = new Date();
                    start = new Date(time.getFullYear()+","+(time.getMonth()+1)+","+time.getDate()).getTime();
                    start = start -7*24*3600*1000+$scope.data.tb.hour*3600*1000+$scope.data.tb.minute*60*1000;
                    // end
                    end = start +7*24*3600*1000;
                }else{//如果是昨天开始的前七天
                    var time = new Date();
                    // intval
                    intval = 24*3600*1000;
                    //end
                    end = new Date(time.getFullYear()+","+(time.getMonth()+1)+","+time.getDate()).getTime();
                    end = end-24*3600*1000+$scope.data.tb.hour*3600*1000+$scope.data.tb.minute*60*1000;
                    //start
                    start = end-7*24*3600*1000;
                }

                // 初始化显示时间
                var startStr = new Date(start);
                var endStr = new Date(end);
                $scope.showTime = (startStr.getMonth()+1)+"."+startStr.getDate()+"-"+(endStr.getMonth()+1)+"."+endStr.getDate();

            }else if($scope.data.tb.type=='day'){
                if ($scope.data.tb.isNow=='1') {//如果是今天
                    // intval
                    intval = 3600*1000;
                    // start
                    var time = new Date();
                    time.setHours(0,parseInt($scope.data.tb.minute),0,0);
                    start = time.getTime();
                    // end
                    var time2 = new Date();
                    end = time2.getTime()-((time2.getTime()-start)%intval);
                }else{//如果是昨天
                    // intval
                    intval = 3600*1000;
                    // start
                    var time = new Date();
                    time.setHours(0,0,0,0)
                    start = time.getTime()-24*3600*1000+$scope.data.tb.minute*60*1000;
                    // end
                    end = start+23*3600*1000;
                }

                // 初始化显示时间
                var startStr = new Date(start);
                $scope.showTime = startStr.getFullYear()+"."+(startStr.getMonth()+1)+"."+startStr.getDate();

            }else if ($scope.data.tb.type=='auto'){


            };
            $scope.data.op.start = parseInt(start);
            $scope.data.op.end = parseInt(end);
            $scope.data.op.intval = intval;
        }

        $scope.refreshTable = function(){
            //设置参数
            optionInit();
            // 确定数据源，获取数据
            dsInit();
        }
        // 执行一次
        $scope.refreshTable();




        $scope.showTime;
        // 左移时间
        $scope.leftTime = function(){
            // 要传递给数据源参数
            var start,end,intval;
            // 当前数据源参数获取到的年月日等
            var startTime = new Date(parseInt($scope.data.op.start));
            var year = startTime.getFullYear();
            var month = startTime.getMonth()+1;
            var date = startTime.getDate();
            var hour = startTime.getHours();
            var minute = startTime.getMinutes();

            if($scope.data.tb.type=='year'){//年
                var t = [];
                if($scope.data.tb.day=='最后一'){//如果是最后一天
                    for (var i = 1; i <=12; i++) {
                        var time;
                        if(i<12){
                            time = new Date((year-1)+","+(i+1)+",1").getTime();
                            time = time-24*3600*1000+hour*3600*1000;
                        }else{
                            time = new Date(year+",1,1").getTime();
                            time = time-24*3600*1000+hour*3600*1000;
                        }
                        t.push(time);
                    };
                }else{
                    for (var i = 1; i <= 12; i++) {
                        var time = new Date((year-1)+","+i+","+date+" "+hour+":0:0").getTime();
                        t.push(time);
                    };
                }
                intval = t;
                start = t[0];

                // 初始化显示时间
                $scope.showTime = new Date(t[0]).getFullYear()+"";

            }else if ($scope.data.tb.type=='month') {
                if(month>1){
                    //start
                    start = new Date(year+","+(month-1)+",1 "+hour+":"+minute+":0").getTime();
                    // end
                    end = new Date(year+","+month+",1").getTime();
                    end = end-24*3600*1000+hour*3600*1000+minute*60*1000;  
                }else{
                    //start
                    start = new Date((year-1)+",12,1 "+hour+":"+minute+":0").getTime();
                    // end
                    end = new Date(year+",1,1").getTime();
                    end = end-24*3600*1000+hour*3600*1000+minute*60*1000;
                }
                // intval
                intval = 24*3600*1000;

                // 初始化显示时间
                var startStr = new Date(start);
                $scope.showTime = startStr.getFullYear()+"."+(startStr.getMonth()+1);

            }else if ($scope.data.tb.type=='week') {
                start = parseInt($scope.data.op.start)-24*3600*1000;
                end = start+7*24*3600*1000;
                intval = 24*3600*1000;

                // 初始化显示时间
                var startStr = new Date(start);
                var endStr = new Date(end);
                $scope.showTime = (startStr.getMonth()+1)+"."+startStr.getDate()+"-"+(endStr.getMonth()+1)+"."+endStr.getDate();

            }else if ($scope.data.tb.type=='day') {
                //start
                start = new Date(year+","+month+","+date+" "+hour+":"+minute+":0").getTime();
                start = start - 24*3600*1000;
                //end
                end = start + 23*3600*1000;
                // intval
                intval = 3600*1000;

                // 初始化显示时间
                var startStr = new Date(start);
                $scope.showTime = startStr.getFullYear()+"."+(startStr.getMonth()+1)+"."+startStr.getDate();
            }

            $scope.data.op.start = parseInt(start);
            $scope.data.op.end = parseInt(end);
            $scope.data.op.intval = intval;

            dsInit();
        }
        // 右移时间
        $scope.rightTime = function(){
            // 要传递给数据源参数
            var start,end,intval;
            // 当前数据源参数获取到的年月日等
            var startTime = new Date(parseInt($scope.data.op.start));
            var year = startTime.getFullYear();
            var month = startTime.getMonth()+1;
            var date = startTime.getDate();
            var hour = startTime.getHours();
            var minute = startTime.getMinutes();

            if($scope.data.tb.type=='year'){//年
                var t = [];
                var time = new Date();
                if(time.getFullYear()==year){//如果本来就是今年，返回
                    return;
                }

                var maxMonth;
                if(time.getFullYear()-year==1){//如果是去年到今年
                    maxMonth = time.getMonth()+1;
                }else{//如果是之前的年份
                    maxMonth = 12;
                }

                //循环添加时间戳
                for (var i = 1; i <= maxMonth; i++) {
                    var timeStamp
                    if($scope.data.tb.day=="最后一"){//如果是最后一天
                        if(i<12){
                            timeStamp = new Date((year+1)+","+(i+1)+",1");
                            timeStamp = timeStamp-24*3600*1000+hour*3600*1000;   
                        }else{
                            if(time.getFullYear()-year>1){
                                timeStamp = new Date((year+2)+",1,1").getTime();
                                timeStamp = timeStamp-24*3600*1000+hour*3600*1000;                                
                            }
                        }
                    }else{
                        timeStamp = new Date((year+1)+","+i+","+date+" "+hour+":0:0").getTime();
                    }
                    t.push(timeStamp);
                };

                intval = t;
                start = t[0];

                // 初始化显示时间
                $scope.showTime = new Date(t[0]).getFullYear()+"";
            }else if ($scope.data.tb.type=='month') {
                
                var time = new Date();
                if(year==time.getFullYear()&&month==(time.getMonth()+1)){//如果是本月，则返回
                    return;
                }
                if(year==time.getFullYear()&&month==time.getMonth()){//如果是上月
                    start = new Date(year+","+(month+1)+",1 "+hour+":"+minute+":0").getTime();
                    end = time.getTime();
                    end = end - ((end-start)%(24*3600*1000));
                }else{
                    if(month<11){//小于11月             
                        //start
                        start = new Date(year+","+(month+1)+",1 "+hour+":"+minute+":0").getTime();
                        // end
                        end = new Date(year+","+(month+2)+",1").getTime();
                        end = end-24*3600*1000+hour*3600*1000+minute*60*1000;   
                    }else if (month==11) {//11月
                        start = new Date(year+",12,1 "+hour+":"+minute+":0").getTime();
                        end = new Date((year+1)+",1,1").getTime();
                        end = end-24*3600*1000+hour*3600*1000+minute+60*1000;
                    }else{//12月
                        start = new Date((year+1)+",1,1 "+hour+":"+minute+":0").getTime();
                        end = new Date((year+1)+",2,1").getTime();
                        end = end-24*3600*1000+hour*3600*1000+minute*60*1000;
                    };    
                }
                
                // intval
                intval = 24*3600*1000;

                // 初始化显示时间
                var startStr = new Date(start);
                $scope.showTime = startStr.getFullYear()+"."+(startStr.getMonth()+1);

            }else if ($scope.data.tb.type=='week') {
                var time = new Date();
                if (parseInt($scope.data.op.end)+24*3600*1000>time.getTime()) {
                    return;
                };
                start = parseInt($scope.data.op.start)+24*3600*1000;
                end = start+7*24*3600*1000;
                intval = 24*3600*1000;

                // 初始化显示时间
                var startStr = new Date(start);
                var endStr = new Date(end);
                $scope.showTime = (startStr.getMonth()+1)+"."+startStr.getDate()+"-"+(endStr.getMonth()+1)+"."+endStr.getDate();

            }else if ($scope.data.tb.type=='day') {
                //start
                start = new Date(year+","+month+","+date+" "+hour+":"+minute+":0").getTime();
                start = start + 24*3600*1000;
                //end
                end = start + 23*3600*1000;
                // intval
                intval = 3600*1000;

                // 初始化显示时间
                var startStr = new Date(start);
                $scope.showTime = startStr.getFullYear()+"."+(startStr.getMonth()+1)+"."+startStr.getDate();

            }

            $scope.data.op.start = parseInt(start);
            $scope.data.op.end = parseInt(end);
            $scope.data.op.intval = intval;

            dsInit();
        }

    }
]);


module.controller('propTable',['$scope', '$componentProperty','$datasource_factory',
    function ($scope,$componentProperty,$datasource_factory) {
      $scope.del = function(obj){
            var elementListScope = $("#uiEditorElementList").scope();
            elementListScope.findElement(elementListScope.elementList , obj.id , function(idx , ele , elist){
                  elist.splice(idx , 1);
                  $("#" + ele.id).remove();
            })
            $("#uiComponentProperties").empty();
      }

    // 获取tags
    $datasource_factory.getTags(function(tags){
        $scope.tags = tags;
    });
    
    $scope.tagIdx=0;


    $scope.tagSelectedIdx=0;
    $scope.updateIdx = function(idx){
        $scope.tagSelectedIdx = idx;
    }

    // 添加tag
    $scope.addTag = function(){
        var tagNow = $scope.tags[$scope.tagSelectedIdx].name;
        // 已经选过的tag
        for (var i = 0; i < $scope.data.op.tags.length; i++) {
            if (tagNow==$scope.data.op.tags[i]) {
                return;
            };
        };
        $scope.data.op.tags.push(tagNow);
        $scope.refreshComponent();
    }
    // 上移tag
    $scope.upTag = function(idx){
        if(idx>0){//如果不是第一个
            var before = $scope.data.op.tags[idx-1];
            $scope.data.op.tags[idx-1] = $scope.data.op.tags[idx];
            $scope.data.op.tags[idx] = before;
            $scope.tagIdx--;
        }
        $scope.refreshComponent();
    }
    // 下移tag
    $scope.downTag = function(idx){   
        if(idx<$scope.data.op.tags.length-1){//如果不是最后一个
            var next = $scope.data.op.tags[idx+1];
            $scope.data.op.tags[idx+1] = $scope.data.op.tags[idx];
            $scope.data.op.tags[idx] = next;
            $scope.tagIdx++;
        }
        $scope.refreshComponent();   
    }
    // 移除tag
    $scope.removeTag = function(idx){
        $scope.data.op.tags.splice(idx,1);    
        $scope.refreshComponent();
    }
    // 选中tag，准备移动或者删除
    $scope.selectTag = function(idx){
        $scope.tagIdx = idx; 
    }

    $scope.refreshComponent = function(){
        $('#'+$scope.base.id).scope().refreshTable();
    }

    // 备选配色方案-颜色
    $scope.tbColors = [{odd:"#f1f5f8",even:"#ebedd2"},{odd:"#f0f9f6",even:"#eaf3f0"},{odd:"#f3f8f2",even:"#edf2ec"},{odd:"#f6f7f2",even:"#f3f0e9"},{odd:"#f7f2f8",even:"#f4eaf2"},{odd:"#f2f1f6",even:"#ecebf3"},{odd:"#faf1f4",even:"#f4ebee"},{odd:"#f7f3f0",even:"#f1edea"},{odd:"#f4f4f4",even:"#f0f0f0"}];

    $scope.changeColor = function(idx){
        var index = parseInt(idx);
        $scope.style.oddColor = $scope.tbColors[index].odd;
        $scope.style.evenColor = $scope.tbColors[index].even;
    }

}])
