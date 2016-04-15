/**
 *	@name : component controller rect
 *	@kind : controller
 *	@description : chart组件通用controller
 */

var module = angular.module("componentsController.dyChart", []);

module.controller('dyChart', ['$scope', '$unique_id', '$compile', '$element', '$document', '$datasource_factory', '$console', '$timeout', '$componentProperty', '$rootScope', '$ocLazyLoad',

  function($scope, $unique_id, $compile, $element, $document, $datasource_factory, $console, $timeout, $componentProperty, $rootScope, $ocLazyLoad) {
    /*	组件属性定义
     * base , 基本属性
     * style , 样式属性
     * data , 数据连接属性
     * directiveStr , 组件绑定设置属性的 directive
     */
    var chart;
    $scope.series;

    $scope.base = {
      "id": null,
      "name": "chart",
      "locked": false,
      "logo": "img/icon/ic_crop_free_white_48dp.png",
      "display": "flex",
      "parentId": $element.parent().attr('id'),
      "children": []
    }

    $scope.style = {
      "display": "flex",
      "position": "relative",
      "width": "400px",
      "height": "300px",
      "rHeight": "",
      "marginLeft": "0px",
      "marginTop": "0px",
      "marginRight": "0px",
      "marginBottom": "0px",
      "background": 'rgba(0,0,0,0)',
    }

    $scope.data = {
      "datasouceName" : "getSystemLive",
      "systemModelName" : "",
      "systemName" : "",
      "tags" : [],
      "configTags" : [
        {"tag_name" : "" , "tag_color" : "#09AFE8" , "tag_area_map" : "line"},
        {"tag_name" : "" , "tag_color" : "#22FBEE" , "tag_area_map" : "line"},
        {"tag_name" : "" , "tag_color" : "#E87609" , "tag_area_map" : "line"},
        {"tag_name" : "" , "tag_color" : "#E809E6" , "tag_area_map" : "line"}
      ],
      "timeType" : "userDefineTime",
      "fixedTime" : "day",
      "customTime" : null,
      "customTimeType" : "m"
    };

    $scope.directiveStr = "<div prop-chart></div>";

    // var chartHeight,chartWidth;

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
        $scope.style.rHeight = (parseFloat($scope.style.height)-30)+'px';
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


    // 模拟数据
    var demoData = [];

    //初始化图表
    function chartInit() {

      // console.log('chartInit',$scope.id);
      Highcharts.setOptions({
        global: {
          useUTC: false
        },
        lang: {
          //reset zoom按钮title
          resetZoom: '重置'
        }
      });

      $('#' + $scope.id).find("#" + $scope.base.id + "_chart").highcharts({
        chart: {
          zoomType: 'x',
          resetZoomButton: {
            theme: {
              fill: '#41739D',
              stroke: '#41739D',
              style: {
                color: 'white'
              },
              r: 0,
              states: {
                hover: {
                  fill: 'white',
                  style: {
                    color: '#41739D'
                  }
                }
              }
            }
          },
          events: {
            click: function(e) {
              $('#' + $scope.id).click();
            },
            load: function(){
              $scope.series = this.series[0];
            }
          },
          // height:chartHeight,
          // width:chartWidth,
          //设置透明
          backgroundColor: "rgba(0,0,0,0)",
          type: 'area'
        },
        title: {
          text: false
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          formatter: function() {
            return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
              '<b>' + this.series.name + '</b>：' + this.y;
          }
        },
        credits: {
          enabled: false
        },
        //导出
        exporting: {
          enabled: false
        },
        series: []
      });
      chart = $('#' + $scope.id).find("#" + $scope.base.id + "_chart").highcharts();

      // console.log('chartInit结束！！');

    }

    $scope.clearChart = function() {
      if (!chart) {
        chart = $('#' + $scope.id).find("#" + $scope.base.id + "_chart").highcharts();
      }
      if (chart.series.length != 0) {
        for (var i = chart.series.length - 1; i >= 0; i--) {
          chart.series[i].remove();
        }
        console.log(chart.series);
      }
    }



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

          var systemLive = $datasource_factory.find("getSystemLive");
          var systemHistory = $datasource_factory.find("getSystemHistoryReadInterval");
          var evt_id = systemLive.event_id;

          // 获取系统tags
          $datasource_factory.getTags(function(tags) {
            $scope.data.tags = tags;
            $scope.data.tags.splice(0, 0, "")
          });

          $ocLazyLoad.load(['lib/highCharts/highcharts.js']).then(function() {
            chartInit();

            $scope.refreshChart(systemHistory , evt_id);
          })

        }

      }, 1000);
    }

    dsInit();

    $scope.refreshChart = function(systemHistory , evt_id){
      var startTime = new Date().getTime() - 60 * 60 * 1000;
      var limit;
      if ($scope.data.datasouceName == "getSystemLive") {
        if ($scope.data.timeType == "userDefineTime") {
          if ($scope.data.customTime && $scope.data.customTimeType) {
            startTime = new Date().getTime() - parseFloat($scope.data.customTime) * 60 * 1000;
            limit = parseFloat($scope.data.customTime) * 2;
          }
        }

        var opTags = [];
        $.each($scope.data.configTags , function(i , v){
          if (v.tag_name) {
            opTags.push({"name":v.tag_name});
          }
        })

        systemHistory.options[0].value = opTags;
        systemHistory.options[1].value = startTime
        systemHistory.options[2].value = new Date().getTime();
        systemHistory.options[3].value = limit;
        systemHistory.refresh(function(){
          systemHistory.getAllData(function(data){
              $.each($scope.data.configTags , function(i , v){

                if (chart.series) {
                  $.each(chart.series , function(idx , val){
                    if (val.name == v.tag_name) {
                      return;
                    }
                  })
                }
                if (v && v.tag_name) {
                  var json = {};
                  json["name"] = v.tag_name;
                  json["type"] = v.tag_area_map;
                  // json["data"] = [{x:(new Date()).getTime() , y:1}];
                  json["data"] = [];
                  json["color"] = v.tag_color;
                  console.log(json)
                  chart.addSeries(json);

                }
              });

              $.each(chart.series , function(i , v){
                $.each(data , function(idx , val){
                  var list = [val[v.name].ts , val[v.name].pv];
                  v.addPoint(list,false);
                  // if (v.data.length > 20) {
                    // v.removePoint(0)
                  // }
                })
              });
              chart.redraw();


              $rootScope.$on(evt_id , function(evt , data){
                if (chart.series) {
                  $.each(chart.series , function(i , v){
                    var list = [new Date().getTime() , data[v.name].pv];
                    v.addPoint(list);
                    if (v.data.length > 100) {
                      v.removePoint(0);
                    }
                  })
                }
              });


          })
        });

      }
      else {

        if ($scope.data.timeType == "userDefineTime") {
          if ($scope.data.customTime && $scope.data.customTimeType) {
            switch ($scope.data.customTimeType) {
              case "s":
                endTime = parseFloat($scope.data.customTime) * 1000;
                break;
              default:
                endTime = parseFloat($scope.data.customTime) * 1000 * 60;
            }
          }
          systemHistory.options[2].value = new Date().getTime()-endTime;
        }

        if ($scope.data.timeType == "fixedTime") {
          switch ($scope.data.fixedTime) {
            case "day":
              startTime = new Date().setHours(00,00,00,00);
              limit = (new Date().getTime() - startTime)/300000;
              break;
            case "week":
              startTime = new Date(new Date().getTime() - 518400000).setHours(00,00,00,00);
              limit = (new Date().getTime() - startTime)/3600000;
              break;
            case "month":
              startTime = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
              limit = (new Date().getTime() - startTime)/14400000;
              break;
            case "year":
              startTime = new Date(new Date().getFullYear(), 0, 1);
              limit = (new Date().getTime() - startTime)/86400000;
              break;
          }
          systemHistory.options[1].value = startTime;
        }

        var opTags = [];
        $.each($scope.data.configTags , function(i , v){
          if (v.tag_name) {
            opTags.push({"name":v.tag_name});
          }
        })

        systemHistory.options[0].value = opTags;

        systemHistory.options[2].value = new Date().getTime();
        systemHistory.options[3].value = limit;
        systemHistory.refresh(function(){
          systemHistory.getAllData(function(data){
              $.each($scope.data.configTags , function(i , v){

                if (chart.series) {
                  $.each(chart.series , function(idx , val){
                    if (val.name == v.tag_name) {
                      return;
                    }
                  })
                }
                if (v && v.tag_name) {
                  var json = {};
                  json["name"] = v.tag_name;
                  json["type"] = v.tag_area_map;
                  json["data"] = [{x:(new Date()).getTime() , y:1}];
                  json["color"] = v.tag_color;
                  chart.addSeries(json);
                }
              });

              $.each(chart.series , function(i , v){
                $.each(data , function(idx , val){
                  var list = [val[v.name].ts , val[v.name].pv];
                  v.addPoint(list,false);
                  // if (v.data.length > 20) {
                    // v.removePoint(0)
                  // }
                })
              });
              chart.redraw();


          })
        });

      }
    }


    $scope.ui = {
      "uiStartTime" : null,
      "uiTimeInterval" : null,
      "uiTimeIntervalUnit" : null
    };

    $scope.uiChanged = function(){
      if (!$scope.ui.uiStartTime || !$scope.ui.uiTimeInterval || !$scope.ui.uiTimeIntervalUnit) {
        return;
      }
      var systemHistory = $datasource_factory.find("getSystemHistoryReadInterval");
      var startTime = new Date($scope.ui.uiStartTime).getTime();
      var endTime ;
      switch ($scope.ui.uiTimeIntervalUnit) {
        case "day":
          endTime = startTime + parseFloat($scope.ui.uiTimeInterval) * 24 * 60 * 60 * 1000;
          break;
        case "hour":
          endTime = startTime + parseFloat($scope.ui.uiTimeInterval) * 1 * 60 * 60 * 1000;
          break;
        case "minute":
          endTime = startTime + parseFloat($scope.ui.uiTimeInterval) * 1 * 60 * 1000;
          break;
      }

      $scope.clearChart();

      var opTags = [];
      $.each($scope.data.configTags , function(i , v){
        if (v.tag_name) {
          opTags.push({"name":v.tag_name});
        }
      })

      systemHistory.options[0].value = opTags;
      systemHistory.options[1].value = startTime
      systemHistory.options[2].value = endTime;
      systemHistory.options[3].value = 100;

      systemHistory.refresh(function() {
        systemHistory.getAllData(function(data) {
          $.each($scope.data.configTags, function(i, v) {

            if (chart.series) {
              $.each(chart.series, function(idx, val) {
                if (val.name == v.tag_name) {
                  return;
                }
              })
            }
            if (v && v.tag_name) {
              var json = {};
              json["name"] = v.tag_name;
              json["type"] = v.tag_area_map;
              // json["data"] = [{x:(new Date()).getTime() , y:1}];
              json["data"] = [];
              json["color"] = v.tag_color;
              chart.addSeries(json);

            }
          });

          $.each(chart.series, function(i, v) {
            $.each(data, function(idx, val) {
              var list = [val[v.name].ts, val[v.name].pv];
              v.addPoint(list, false);
            })
          });
          chart.redraw();
        })
      })
    }

    $scope.query = function(args){
      $scope.data.fixedTime = args;
      var systemLive = $datasource_factory.find("getSystemLive");
      var systemHistory = $datasource_factory.find("getSystemHistoryReadInterval");
      var evt_id = systemLive.event_id;
      $scope.refreshChart(systemHistory , evt_id);
    }



  }
]);


module.controller('propChart', ['$scope', '$componentProperty', '$datasource_factory' , function($scope, $componentProperty , $datasource_factory) {

  $scope.del = function(obj) {
    var elementListScope = $("#uiEditorElementList").scope();
    elementListScope.findElement(elementListScope.elementList, obj.id, function(idx, ele, elist) {
      elist.splice(idx, 1);
      $("#" + ele.id).remove();
    })
    $("#uiComponentProperties").empty();
  }

  var systemLive = $datasource_factory.find("getSystemLive");
  var systemHistory = $datasource_factory.find("getSystemHistoryReadInterval");
  var evt_id = systemLive.event_id;

  $scope.redrawChart = function(){
    $('#'+$scope.base.id).scope().clearChart();
    $('#'+$scope.base.id).scope().refreshChart(systemHistory , evt_id);
  }

  $scope.checkMax = function(){
    if ($scope.data.customTime > 120 || $scope.data.customTime < 0) {
      $scope.data.customTime = 0;
    }
  }

}])
