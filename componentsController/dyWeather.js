/**
 *	@name : component controller weather
 *	@kind : controller
 *	@description : weather组件通用controller
 */

var module = angular.module("componentsController.dyWeather", []);

module.controller('dyWeather', ['$scope', '$unique_id', '$compile', '$element', '$document', '$datasource_factory', '$console', '$timeout', '$componentProperty', '$rootScope',

  function($scope, $unique_id, $compile, $element, $document, $datasource_factory, $console, $timeout, $componentProperty, $rootScope) {
    /*	组件属性定义
     * base , 基本属性
     * style , 样式属性
     * data , 数据连接属性
     * directiveStr , 组件绑定设置属性的 directive
     */

    $scope.base = {
      "id": null,
      "name": "weather",
      "locked": false,
      "logo": "img/icon/ic_crop_free_white_48dp.png",
      "display": "flex",
      "parentId": $element.parent().attr('id'),
      "children": []
    }

    $scope.style = {
      "display": "flex",
      "flexFlow":"row wrap",
      "justifyContent":"flex-start",
      "alignContent":"space-between",
      "width": "300px",
      "height": "140px",
      "marginLeft": "0px",
      "marginTop": "0px",
      "marginRight": "0px",
      "marginBottom": "0px",
      "fontFamily": "Microsoft YaHei",
      "color": "#FFFFFF",
      "backgroundColor": 'rgba(73, 76, 177, 1)'
    }

    $scope.data = {
      "datasouceName" : "getSystemLive",
      "systemModelName" : "",
      "systemName" : "",
      "lat":null,
      "lng":null
    };

    $scope.display = true;

    $scope.directiveStr = "<div prop-weather></div>";


    // 监听组件选中事件
    $rootScope.$on('COMPONENT_SELECTED', function(evt, id) {

      if ($scope.id == id) {
        //显示反选框
        $element.addClass('selectedFrame');
        //设置组件属性
        $scope.setProperty();

      } else {
        //去掉反选框
        $element.removeClass('selectedFrame');
      }
    })

    // 组件选中后 , 同步组件属性栏与组件
    $scope.setProperty = function() {
      var propertyScope = $('#uiComponentProperties').scope();
      propertyScope.regist($scope.id, $scope.directiveStr);
    }

    // 数据写会到dom节点上
    $scope.writeBack = function() {
      var idata = {};
      idata.base = $scope.base;
      idata.style = $scope.style;
      idata.data = $scope.data;
      var idataString = JSON.stringify(idata);
      $element.attr("data", idataString);
    }

    // 初始化数据，获取标签data数据，初始化给$scope对象
    function componentDataInit() {
      var ida = $element.attr('data');
      var data = angular.fromJson(ida);
      //组件通用属性,连接属性，拓展属性
      $.each(data.base, function(idx, val) {
        $scope.base[idx] = val;
      });

      $.each(data.style, function(idx, val) {
        $scope.style[idx] = val;
      });


      if (data.data) {
        $.each(data.data, function(idx, val) {
          $scope.data[idx] = val;
        });
      }
      //对新建的组件，创建一个唯一系统id
      if ($scope.base.id) {
        $scope.id = $scope.base.id;
      } else {
        $scope.id = $unique_id();
        $scope.base.id = $scope.id;
        $scope.writeBack();
      }
      // 初始化 , 向元素列表中注入自身 base 属性 , 允许元素列表对组件 base 属性进行设置 , 除base属性外,还可以设置display
      var elementListScope = $("#uiEditorElementList").scope();
      if (elementListScope) {
        elementListScope.regist($scope.base);
      }


    }
    // 执行一次
    componentDataInit();



    function dsInit() {
      //监听到系统加载完毕，组件内部的数据源才开始使用
      var stop = setInterval(function() {
        if ($scope.loading) {
          //停止循环
          clearInterval(stop);

          // 系统初始化完毕后，获取系统模型
          var systemModel = $datasource_factory.find("getSystemsByModel");
          $scope.data.systemModelName = systemModel.parameters[0].value;
          $scope.data.systemName = systemModel.ret[systemModel.index].name;

          // 获取当前默认选择系统
          var currentSystem = systemModel.ret[systemModel.index];
          if (currentSystem.latitude && currentSystem.longitude) {
            $scope.data.lat = currentSystem.latitude;
            $scope.data.lng = currentSystem.longitude;
            weather();
            $scope.display = true;
          } else {
            $scope.display = false;
          }

          $rootScope.$on("3600000ms" , function(evt , data){
            weather();
          });

        } else {
          dsInit();
        }

      }, 1000);
    }

    dsInit();


    var weather = function(){
      $('#' + $scope.base.id).find('.weather-temperature').openWeather({
        key: 'c9d49310f8023ee2617a7634de23c2aa',
        lat:$scope.data.lat,
        lng:$scope.data.lng,
        lang:"zh_cn",
        units : "c",
        descriptionTarget: '.weather-description',
        windSpeedTarget: '.weather-wind-speed',
        minTemperatureTarget: '.weather-min-temperature',
        maxTemperatureTarget: '.weather-max-temperature',
        humidityTarget: '.weather-humidity',
        sunriseTarget: '.weather-sunrise',
        sunsetTarget: '.weather-sunset',
        placeTarget: '.weather-place',
        iconTarget: '.weather-icon',
        customIcons: 'lib/open-weather-master/img/icons/weather/',
        success: function() {
          $('#' + $scope.base.id).find('.weather-temperature').show();
        },
        error: function(message) {
          console.log(message);
        }
      });
    }

  }
]);


module.controller('propWeather', ['$scope', '$componentProperty', function($scope, $componentProperty) {
  $scope.del = function(obj) {
    var elementListScope = $("#uiEditorElementList").scope();
    elementListScope.findElement(elementListScope.elementList, obj.id, function(idx, ele, elist) {
      elist.splice(idx, 1);
      $("#" + ele.id).remove();
    })
    $("#uiComponentProperties").empty();
  }
}])
