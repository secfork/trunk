/**
 *	@name : component controller rect
 *	@kind : controller
 *	@description : clock组件通用controller
 */

var module = angular.module("componentsController.dyClock" , []);

module.controller('dyClock' , ['$scope' , '$unique_id' ,'$compile', '$element' , '$document' , '$datasource_factory' , '$console' , '$interval' ,'$componentProperty','$rootScope','$filter' ,

    function($scope, $unique_id,$compile, $element ,$document, $datasource_factory , $console , $interval,$componentProperty,$rootScope , $filter){
        /*	组件属性定义
         * base , 基本属性
         * style , 样式属性
         * data , 控制属性
         * directiveStr , 组件绑定设置属性的 directive
         */

        $scope.base = {
            "id": null,
            "name": "clock",
            "locked" : false,
            "logo" : "img/icon/ic_crop_free_white_48dp.png",
            "display" : "flex",
            "parentId" :$element.parent().attr('id'),
            "children" :[]
        }

        $scope.style = {
            "display":"flex",
            "position": "relative",
            "width" : "300px",
            "height" :  "140px",
            "marginLeft" : "0px",
            "marginTop" : "0px",
            "marginRight" : "0px",
            "marginBottom" : "0px",
            "fontSize" : '2em',
            "color" : 'rgb(255,255,255)',
            "backgroundColor": 'rgb(1,1,1)',
            "flexFlow": "row wrap"
        }

        $scope.data = {
          "timeDisplay" : true,
          "timeType" : "0",
          "dateDisplay" : true,
          "dateType" : "0",
          "weekDisplay" : true,
          "weekType" : "0"
        };

        $scope.directiveStr = "<div prop-clock></div>";

        $scope.stop = $interval(function(){
            var now = new Date();
            var weekDay = ['周日','周一','周二','周三','周四','周五','周六',]

            var ChineseYear = ["一","二","三","四","五","六","七","八","九","十"];
            $scope.ChineseMonth;
            $scope.ChineseDay;
            m = now.getMonth();
            if(m<10){
              $scope.ChineseMonth = ChineseYear[m]+"月";
            }
            if(m==10){
              $scope.ChineseMonth = "十月";
            }
            if(m>10){
              $scope.ChineseMonth = "十"+ChineseYear[m1.charAt(1)];
            }

            d1 = now.getDate();
            d2 = ""+d1;
            if(d1<10){
              $scope.ChineseDay = ChineseYear[d1]+"日";
            }
            if(d1==10){
              $scope.ChineseDay = "十日";
            }
            if(d1>10&&d1<20){
              $scope.ChineseDay = "十"+ChineseYear[d2.charAt(1)]+"日";
            }
            if(d1==20){
              $scope.ChineseDay = "二十日";
            }
            if(d1>20&&d1<30){
              $scope.ChineseDay = "二十"+ChineseYear[d2.charAt(1)]+"日";
            }
            if(d1==30){
              $scope.ChineseDay = "三十日";
            }
            if(d1>30){
              $scope.ChineseDay = "三十"+ChineseYear[d2.charAt(1)]+"日";
            }

            $scope.weekLong;
            $scope.weekShort;
            switch (now.getDay()) {
              case 1:
                $scope.weekLong = "星期一";
                $scope.weekShort = "周一";
                break;
              case 2:
                $scope.weekLong = "星期二";
                $scope.weekShort = "周二";
                break;
              case 3:
                $scope.weekLong = "星期三";
                $scope.weekShort = "周三";
                break;
              case 4:
                $scope.weekLong = "星期四";
                $scope.weekShort = "周四";
                break;
              case 5:
                $scope.weekLong = "星期五";
                $scope.weekShort = "周五";
                break;
              case 6:
                $scope.weekLong = "星期六";
                $scope.weekShort = "周六";
                break;
              default:
                $scope.weekLong = "星期天";
                $scope.weekShort = "周天";
            }

            if ($filter('date')(now , "a") == "AM") {
              $scope.halfDay = "上午";
            } else {
              $scope.halfDay = "下午";
            }

            $scope.time = {
                year:now.getFullYear(),
                month:checkTime(now.getMonth()+1),
                day:checkTime(now.getDate()),
                hour:checkTime(now.getHours()),
                minute:checkTime(now.getMinutes()),
                second:checkTime(now.getSeconds()),
                week:weekDay[now.getDay()]
            }
            $scope.defaultTime = new Date();

        },1000);

        function checkTime(i){
            if(i<10){
                i = '0'+i;
            }
            return i;
        }

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
    }
]);


module.controller('propClock',['$scope', '$componentProperty','$interval',function ($scope,$componentProperty,$interval) {
      $scope.del = function(obj){
            var elementListScope = $("#uiEditorElementList").scope();
            elementListScope.findElement(elementListScope.elementList , obj.id , function(idx , ele , elist){
                  elist.splice(idx , 1);
                  $("#" + ele.id).remove();
            })
            $("#uiComponentProperties").empty();
      }

}])
