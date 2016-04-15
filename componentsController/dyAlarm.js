/**
 *	@name : component controller rect
 *	@kind : controller
 *	@description : table组件通用controller
 */

var module = angular.module("componentsController.dyAlarm" , []);

module.controller('dyAlarm' , ['$scope' , '$unique_id' ,'$compile', '$element' , '$document' , '$datasource_factory' , '$console' , '$timeout' ,'$componentProperty','$rootScope','$ocLazyLoad',

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
                pickerPosition: "bottom-right",
                
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
            "width" : "500px",
            "height" :  "300px",
            "marginLeft" : "0px",
            "marginTop" : "0px",
            "marginRight" : "0px",
            "marginBottom" : "0px",
            "background":'rgba(0,0,0,0)',
            "flex": '0 0 auto',

            "alarmCtrl": '0',//是否显示设置控件
            "tbBorder": '1',//报表是否有内边框
            "oddColor": "#f1f5f8",//奇数行颜色
            "evenColor": "#ebedd2",//偶数行颜色
        }

        $scope.data = {
            "ds":{

            },
            "op":{
                'headJson':{
                    id:{
                        name:'id',
                        title:'报警ID',
                        state:'0',
                    },
                    sys:{
                        name:'system_id',
                        title:'系统',
                        state:'0',
                    },
                    importance:{
                        name:'severity',
                        title:'重要性',
                        state:'0',
                    },
                    type:{
                        name:'class_id',
                        title:'类别',
                        state:'0',
                    },
                    confirmer:{
                        name:'confirmer',
                        title:'确认人',
                        state:'0',
                    },
                    confirmTime:{
                        name:'confirmTime',
                        title:'确认时间',
                        state:'0',
                    },
                    confirmInfo:{
                        name:'confirmInfo',
                        title:'确认信息',
                        state:'0',
                    },
                    operate:{
                        name:'operate',
                        title:'操作',
                        state:'0',
                    },
                    state:{
                        name:'active',
                        title:'活跃状态',
                        state:'0',
                    }
                },
                'headList':[{name:'timestamp',title:'报警时间'},{name:'desc',title:'报警主题'}],
                "size":10,
                "cycle":30,
            }
        };

        $scope.directiveStr = "<div prop-alarm></div>";

        $scope.options = {
            start:"",
            end:"",
            severity:0,//重要性，紧急程度，0-4
            class_id:0,//类别，0-10
            desc:"",//返回数据中的描述
            active:""//0,-1,1
        }

        $scope.thead = [];
        $scope.tbody = [];

        $scope.realData;


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

        var startTime,endTime;
        $scope.query = function(intvalNum,intvalUnit){
            var start = $scope.options.start;
            var end = $scope.options.end;

            if(start&&end){//如果设置了时间
                startTime = new Date(start).getTime();
                endTime = new Date(end).getTime();
                if(startTime<endTime){//如果开始早于结束
                    dsInit();
                }else{
                    console.log('时间设置不正确，请重新设置');
                }
            }
        }



        // 数据源数据初始化
        var datasource;//数据源
        function dsInit(){
            //监听到系统加载完毕，组件内部的数据源才开始使用
            var stop = setInterval(function(){
                if($scope.loading){
                    //停止循环
                    clearInterval(stop);
                    datasource = $datasource_factory.find('getSystemAlarms');
                    if($scope.style.alarmCtrl=='1'){
                        datasource.options[0].value = startTime;
                        datasource.options[1].value = endTime;
                        datasource.options[4].value = parseInt($scope.options.class_id);
                        datasource.options[6].value = parseInt($scope.options.severity);                        
                    }else{
                        datasource.options[0].value = new Date().getTime()-365*24*3600*1000;
                        datasource.options[1].value = new Date().getTime();
                        datasource.options[2].value = 10;//设置为查询10条报警
                    }

                    // 获取数据
                    if (datasource) {
                        datasource.ret = [];
                        datasource.refresh(function(){
                            datasource.getAllData(function(data){
                                $scope.realData = data;
                                //确定表头
                                $scope.thead = $scope.data.op.headList;
                                //确定数据
                                $scope.tbody = dataFormat(data);

                            })
                        });
                        
                    };
                }                
            },1000);           
        }

        // tbody数据格式转换
        function dataFormat(data){
            var rdata=[];
            $.each(data,function(idx,val){
                var subData = [];
                $.each($scope.data.op.headList,function(cidx,cval){
                    var td;
                    if(cval.name=='operate'){
                        td = 'td_operate';
                    }else{
                        td = val[cval.name]?val[cval.name]:"";
                    }
                    subData.push(td);
                })
                subData.state = idx;
                rdata.push(subData);
            })
            return rdata;
        }


        $scope.refreshTable = function(){
            // 确定数据源，获取数据
            dsInit();
        }

        // 不显示报警查询条件，执行
        var intervalStop;
        $scope.alarmInit = function(){
            if($scope.style.alarmCtrl=='1'){
                if(intervalStop){
                    clearInterval(intervalStop);
                }
            }else{
                if(intervalStop){
                    clearInterval(intervalStop);
                }
                //先执行一次
                dsInit();
                // 然后按照周期循环刷新
                intervalStop = setInterval(function(){
                    dsInit();
                },$scope.data.op.cycle*1000);
            }
        }
        // 自执行一次
        $scope.alarmInit();

        // 关闭报警
        $scope.closeAlarm = function(idx){
            //获取需要关闭的报警的id
            var ids = $scope.realData[idx].id;
            // 获取数据源
            var closeDs = $datasource_factory.find('closeAlarm');
            var arr = [ids];
            closeDs.options[0].value = arr;
            closeDs.refresh(function(data){
                if(data){
                    // 如果成功确认。重新请求一次，刷新一次报警
                    dsInit();
                }else{
                    console.log('close alarm failed');
                }
            })

        }
    }
]);


module.controller('propAlarm',['$scope', '$componentProperty','$datasource_factory',
    function ($scope,$componentProperty,$datasource_factory) {
      $scope.del = function(obj){
            var elementListScope = $("#uiEditorElementList").scope();
            elementListScope.findElement(elementListScope.elementList , obj.id , function(idx , ele , elist){
                  elist.splice(idx , 1);
                  $("#" + ele.id).remove();
            })
            $("#uiComponentProperties").empty();
      }

    // 勾选报警条件
    $scope.changeCondition = function(){
        $.each($scope.data.op.headJson,function(idx,val){//遍历headArray，如果不在列表则添加
            if (val.state=='1') {
                var existTemp = false;
                for (var i = 0; i < $scope.data.op.headList.length; i++) {
                    if(val.name==$scope.data.op.headList[i].name){
                        existTemp = true;
                    }
                };
                if(!existTemp){
                    $scope.data.op.headList.push(val);
                }
            }else{
                var temp;
                for (var i = 0; i < $scope.data.op.headList.length; i++) {
                    if(val.name==$scope.data.op.headList[i].name){
                        temp = i;
                        break;      
                    }
                };
                if(angular.isNumber(temp)){
                    $scope.data.op.headList.splice(temp,1);
                }
            }
        });
        $scope.refreshComponent();
    }

    
    $scope.tagIdx=0;
    // 上移条件
    $scope.upTag = function(idx){
        if(idx>0){//如果不是第一个
            var before = $scope.data.op.headList[idx-1];
            $scope.data.op.headList[idx-1] = $scope.data.op.headList[idx];
            $scope.data.op.headList[idx] = before;
            $scope.tagIdx--;
        }
        $scope.refreshComponent();
    }
    // 下移条件
    $scope.downTag = function(idx){   
        if(idx<$scope.data.op.headList.length-1){//如果不是最后一个
            var next = $scope.data.op.headList[idx+1];
            $scope.data.op.headList[idx+1] = $scope.data.op.headList[idx];
            $scope.data.op.headList[idx] = next;
            $scope.tagIdx++;
        }
        $scope.refreshComponent();   
    }
    // 选中条件，准备移动
    $scope.selectTag = function(idx){
        $scope.tagIdx = idx;
    }

    // 触发重新刷新组件
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
    $scope.alarmCtrl = function(){
        $('#'+$scope.base.id).scope().alarmInit();   
    }

}])
