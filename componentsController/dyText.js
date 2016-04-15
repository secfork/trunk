/**
 *	@name : component controller rect
 *	@kind : controller
 *	@description : text组件通用controller
 */

var module = angular.module("componentsController.dyText", []);

module.controller('dyText', ['$scope', '$unique_id', '$compile', '$element', '$document', '$datasource_factory', '$console', '$timeout', '$componentProperty', '$rootScope',

  function($scope, $unique_id, $compile, $element, $document, $datasource_factory, $console, $timeout, $componentProperty, $rootScope) {
    /*	组件属性定义
     * base , 基本属性
     * style , 样式属性
     * data , 数据连接属性
     * directiveStr , 组件绑定设置属性的 directive
     */

    $scope.base = {
      "id": null,
      "name": "text",
      "locked": false,
      "logo": "img/icon/ic_crop_free_white_48dp.png",
      "display": "flex",
      "parentId": $element.parent().attr('id'),
      "children": [],
      "hrefState": false,
      "href": "",
      "redirectMode": "_blank"
    }

    $scope.style = {
      "display": "block",
      "position": "relative",
      "width": "100px",
      "height": "50px",
      "marginLeft": "0px",
      "marginTop": "0px",
      "marginRight": "0px",
      "marginBottom": "0px",
      "background": 'rgba(0,0,0,0)',

      "text": "context",
      "fontFamily": "Microsoft YaHei",
      "fontWeight": "normal",
      "textAlign": "left",
      "textDecoration": "none",
      "fontSize": "2em",
      "fontStyle": "normal",
      "color": "#000000",
      "wordBreak": ""
    }

    $scope.data = {
      "datasouceName" : "getSystemLive",
      "systemModelName" : "",
      "systemName" : "",
      "tag" : "",
      "tags" : [],
      "property" : "",
      "meta" : [],
      "properties" : []
    };

    $scope.directiveStr = "<div prop-text></div>";

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

      $scope.addRedirect();

    }

    $scope.addRedirect = function() {
        $("#" + $scope.base.id).unbind("click");
        if ($scope.base.hrefState) {
          $("#" + $scope.base.id).css("cursor", "pointer");
          $("#" + $scope.base.id).bind("click", function() {
            if ($scope.base.href) {
              window.open($scope.base.href, $scope.base.redirectMode);
            }
          })
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

          // 获取系统tags
          $datasource_factory.getTags(function(tags) {
            $scope.data.tags = tags;
          });

          // 获取实时数据源
          var systemlive = $datasource_factory.find("getSystemLive");
          var evt_id = systemlive.event_id;
          systemlive.getMeta(function(meta){
            $scope.data.meta = meta;
          })

          $rootScope.$on(evt_id , function(evt , data){
            var ret = systemlive.ret[0];
            if (ret && $scope.data.tag && $scope.data.property) {
              $scope.style.text = ret[$scope.data.tag][$scope.data.property];
            }
          });


        } else {
          dsInit();
        }

      }, 1000);
    }

    dsInit();
  }
]);


module.controller('propText', ['$scope', '$componentProperty', function($scope, $componentProperty) {
  $scope.del = function(obj) {
    var elementListScope = $("#uiEditorElementList").scope();
    elementListScope.findElement(elementListScope.elementList, obj.id, function(idx, ele, elist) {
      elist.splice(idx, 1);
      $("#" + ele.id).remove();
    })
    $("#uiComponentProperties").empty();
  }
  $scope.addRedirect = function() {
    $("#" + $scope.base.id).unbind("click");
    if ($scope.base.hrefState) {
      $("#" + $scope.base.id).css("cursor", "pointer");
      $("#" + $scope.base.id).bind("click", function() {
        if ($scope.base.href) {
          window.open($scope.base.href, $scope.base.redirectMode);
        }
      })
    }
  }
  $scope.selectedTag = function(tag){
    $scope.data.tag = tag;
    $scope.selectedMeta();
  }
  $scope.selectedMeta = function(){
    $scope.data.properties = [];
    if ($scope.data.meta && $scope.data.tag) {
      $.each($scope.data.meta[$scope.data.tag].field , function(i,v){
        console.log(i);
        $scope.data.properties.push(i);
      });
    } else {
      $scope.data.properties = [];
    }
  }
  $scope.selectedProperty = function(field){
    $scope.data.property = field;
  }
}])
