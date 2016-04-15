/**
 *	@name : component controller button
 *	@kind : controller
 *	@description : button组件通用controller
 */

var module = angular.module("componentsController.dyButton", []);

module.controller('dyButton', ['$scope', '$unique_id', '$compile', '$element', '$document', '$datasource_factory', '$console', '$timeout', '$componentProperty', '$rootScope', '$ocLazyLoad',

  function($scope, $unique_id, $compile, $element, $document, $datasource_factory, $console, $timeout, $componentProperty, $rootScope, $ocLazyLoad) {
    /*	组件属性定义
     * base , 基本属性
     * style , 样式属性
     * data , 数据连接属性
     * directiveStr , 组件绑定设置属性的 directive
     */
    $scope.base = {
      "id": null,
      "name": "button",
      "locked": false,
      "logo": "img/icon/ic_crop_free_white_48dp.png",
      "display": "flex",
      "parentId": $element.parent().attr('id'),
      "children": []
    }

    $scope.style = {
      "display": "flex",
      "position": "relative",
      "width": "80px",
      "height": "40px",
      "marginLeft": "0px",
      "marginTop": "0px",
      "marginRight": "0px",
      "marginBottom": "0px",
      "flex": '0 0 auto',

      "btnText": "按钮",
      "fontFamily": "Microsoft YaHei",
      "fontSize": "1.4em",
      "borderWidth": "0px",
      "borderStyle": "solid",
      "borderColor": "",
      "borderRadius": "20px",
      "color": "rgba(61,105,249,1)",
      "backgroundColor": "rgba(255,255,255,1)",
    }

    $scope.data = {
      "type": "ctrl", //ctrl,call,openLink,openPage
      "tag": "", //选择下置的tag
      "run": false, //是否运行态下设置参数:true/false
      "data": "", //下置的数据
      "link": "", //打开链接的地址
      "page": "", //打开页面
      "redirectMode": "_blank" //打开方式now/new
    }

    $scope.tags = [];

    $scope.directiveStr = "<div prop-button></div>";

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

    // 数据源数据初始化
    function dsInit() {
      //监听到系统加载完毕，组件内部的数据源才开始使用
      var stop = setInterval(function() {
        if ($scope.loading) {
          //停止循环
          clearInterval(stop);

          // 获取系统tags
          $datasource_factory.getTags(function(tags) {
            $scope.tags = tags;
          });

          $element.bind("click" , function(){
            $scope.clickBtn();
          })


          $element.popover({
            html: true,
            content: function () {
              return $compile($element.parent().find('.content').html())($scope);
            }
          });

        } else {
          dsInit();
        }

      }, 1000);
    }

    dsInit();
    // 点击按钮触发
    $scope.clickBtn = function() {
      switch ($scope.data.type) {
        //ctrl,call,openLink,openPage
        case "ctrl":
          if ($scope.data.run) {
            var getSystemWrite = $datasource_factory.find("getSystemWrite");
            getSystemWrite.push_data = {};
            getSystemWrite.push_data[$scope.data.tag] = $scope.data.data;
            getSystemWrite.refresh(function(){});
            $element.popover('disable')
          } else {
            $element.popover('enable')
          }
          break;
        case "call":
          $element.popover('disable')
          var callSystemRealTimeData = $datasource_factory.find("callSystemRealTimeData");
          callSystemRealTimeData.refresh(function(){});
          break;
        case "openLink":
          $element.popover('disable');
          if ($scope.$parent.runSystemName == "syalias") {
            if (!$scope.data.link) {
              return;
            }
            window.open($scope.data.link, $scope.base.redirectMode);
            break;
          }
        default:
          $element.popover('disable');
          if ($scope.$parent.runSystemName == "syalias") {
            // $("#" + $scope.data.page).show().siblings().hide();
            $.each($("#uiDrawPanel").children() , function(idx , val){
              var scope = $(val).scope();
              console.log($scope.data.page)
              if (scope.base.name == $scope.data.page) {
                scope.base.display = "flex";
              } else {
                scope.base.display = "none";
              }

            })
          }
          break;
      }

    }

    $scope.submuit = function(){
      var getSystemWrite = $datasource_factory.find("getSystemWrite");
      getSystemWrite.push_data = {};
      getSystemWrite.push_data[$scope.data.tag] = $scope.data.data;
      getSystemWrite.refresh(function(){});
      $element.popover('hide');
    }


  }
]);


module.controller('propButton', ['$scope', '$componentProperty', '$datasource_factory',
  function($scope, $componentProperty, $datasource_factory) {

    $scope.del = function(obj) {
      var elementListScope = $("#uiEditorElementList").scope();
      elementListScope.findElement(elementListScope.elementList, obj.id, function(idx, ele, elist) {
        elist.splice(idx, 1);
        $("#" + ele.id).remove();
      })
      $("#uiComponentProperties").empty();
    }

    // 获取tags
    $scope.getTags = function() {
      $scope.tags = $("#" + $scope.base.id).scope().tags;
    };


  }
])
