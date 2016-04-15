/**
 *	@name : component controller rect
 *	@kind : controller
 *	@description : img组件通用controller
 */

var module = angular.module("componentsController.dyImg", []);

module.controller('dyImg', ['$scope', '$unique_id', '$compile', '$element', '$document', '$datasource_factory', '$console', '$timeout', '$componentProperty', '$rootScope',

  function($scope, $unique_id, $compile, $element, $document, $datasource_factory, $console, $timeout, $componentProperty, $rootScope) {
    /*	组件属性定义
     * base , 基本属性
     * style , 样式属性
     * data , 数据连接属性
     * directiveStr , 组件绑定设置属性的 directive
     */

    $scope.base = {
      "id": null,
      "name": "img",
      "locked": false,
      "logo": "img/icon/ic_crop_free_white_48dp.png",
      "display": "flex",
      "parentId": $element.parent().attr('id'),
      "children": [],
      "playList" : [] // [{name : xx , url : xx}]
    };

    $scope.style = {
      "display": "flex",
      "position": "relative",
      "width": "100px",
      "height": "100px",
      "marginLeft": "0px",
      "marginTop": "0px",
      "marginRight": "0px",
      "marginBottom": "0px",

      // "flexDirection": "row",
      // "flexWrap": "wrap",
      // "justifyContent": "space-around",
      // "alignItems": "flex-start",
      // "alignContent": "flex-start",

      "backgroundColor": "rgba(0,0,0,0)",
      "background": "url('img/1.jpg')",
      "backgroundRepeat": "no-repeat",
      "backgroundPosition": "center center",
      "backgroundSize": "contain"
    };

    $scope.data = {
      "datasouceName" : "getSystemLive",
      "systemModelName" : "",
      "systemName" : "",
      "tag" : "",
      "tags" : [],
      "mode":"condition",
      "condtion" : "",
      "conditionValue" : "",
      "loop":false,
      "defaultFrame":0,
    };

    $scope.directiveStr = "<div prop-img></div>";

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

          // 获取系统tags
          $datasource_factory.getTags(function(tags) {
            $scope.data.tags = tags;
          });

          if ($scope.base.playList.length != 0) {
            $scope.style.background = "url('" + $scope.base.playList[0].rurl + "')";
          } else {
            $scope.style.background = "url('img/1.jpg')";
          }

          // 获取实时数据源
          var systemlive = $datasource_factory.find("getSystemLive");
          var evt_id = systemlive.event_id;
          $rootScope.$on(evt_id , function(evt , data){
            if (!data[$scope.data.tag]) {
              return;
            }
            var pv = data[$scope.data.tag].pv;
            if ($scope.data.mode == "condition" && $scope.data.tag) {
              if ($scope.data.condtion && $scope.data.conditionValue) {
                switch ($scope.data.condtion) {
                  case "0":
                    if (pv == parseFloat($scope.data.conditionValue)) {
                      $scope.data.defaultFrame = 0;
                      play();
                    }
                    break;
                  case "1":
                    if (pv > parseFloat($scope.data.conditionValue)) {
                      $scope.data.defaultFrame = 0;
                      play();
                    }
                    break;
                  case "2":
                    if (pv >= parseFloat($scope.data.conditionValue)) {
                      $scope.data.defaultFrame = 0;
                      play();
                    }
                    break;
                  case "3":
                    if (pv < parseFloat($scope.data.conditionValue)) {
                      $scope.data.defaultFrame = 0;
                      play();
                    }
                    break;
                  case "4":
                    if (pv <= parseFloat($scope.data.conditionValue)) {
                      $scope.data.defaultFrame = 0;
                      play();
                    }
                    break;
                  case "5":
                    if (pv & parseFloat($scope.data.conditionValue)) {
                      $scope.data.defaultFrame = 0;
                      play();
                    }
                    break;
                  case "6":
                    if (pv != parseFloat($scope.data.conditionValue)) {
                      $scope.data.defaultFrame = 0;
                      play();
                    }
                    break;
                }
              }
            }
            if ($scope.data.mode == "specify" && $scope.data.tag) {
              play_frame(pv);
            }
          })

        } else {
          dsInit();
        }

      }, 1000);
    }

    dsInit();

    var play = function(){
      $rootScope.$on("300ms" , function(evt , id){
        if ($scope.data.loop) {
          if ($scope.data.defaultFrame < $scope.base.playList.length) {
            $scope.style.background = "url("+ $scope.base.playList[$scope.data.defaultFrame].rurl +")";
            $scope.data.defaultFrame++;
            return;
          }else {
            $scope.data.defaultFrame = 0;
            $scope.style.background = "url("+ $scope.base.playList[$scope.data.defaultFrame].rurl +")";
            return;
          }
        } else {
          if ($scope.data.defaultFrame < $scope.base.playList.length) {
            $scope.style.background = "url("+ $scope.base.playList[$scope.data.defaultFrame].rurl +")";
            $scope.data.defaultFrame++;
            return;
          }
        }
      });
    }
    var play_frame = function(pv){
      if ($scope.data.defaultFrame) {
        $scope.style.background = "url("+ $scope.base.playList[$scope.data.defaultFrame].rurl +")";
      }
      $.each($scope.base.playList , function(idx , val){
        if (pv == val.trigger) {
          $scope.style.background = "url("+ $scope.base.playList[$scope.data.defaultFrame].rurl +")";
        }
      })
    }
  }
]);


module.controller('propImg', ['$scope', '$componentProperty', '$_imagesUpload' , '$_deleteImage' , '$_deleteImageMulti' , function($scope, $componentProperty , $_imagesUpload , $_deleteImage , $_deleteImageMulti) {
  $scope.playMode = "condition";
  $scope.del = function(obj) {
    var list = [];
    $.each($scope.base.playList , function(i,v){
      list.push(v.name);
    })
    $_deleteImageMulti(list , function(data){
      if (data) {
        var elementListScope = $("#uiEditorElementList").scope();
        elementListScope.findElement(elementListScope.elementList, obj.id, function(idx, ele, elist) {
          elist.splice(idx, 1);
          $("#" + ele.id).remove();
        })
        $("#uiComponentProperties").empty();
      }
    });
  }

  $scope.uploadImage = function(){
    $("#file").click();
  }

  $scope.uploadFile = function(file,inputDom){
    // 显示当前上传的图片
    // $scope.uploadImage;
    $_imagesUpload(file , function(data){
      // $scope.uploadImage = "url(" + data.ret.url + ")";
      var json = {
        "name" : data.ret.name,
        "url" : data.ret.url,
        "rurl" : data.ret.url.replace("-internal" , ""),
        "trigger":null
      }
      $scope.base.playList.push(json);

      if ($scope.base.playList.length != 0) {
        $scope.style.background = "url('" + $scope.base.playList[0].rurl + "')";
      }

      // 上传图片以后，自动保存一次页面
      $("#toolbar").scope().save(false);

      inputDom.value = "";
    })
  }

  $scope.uploadOffImage = function(num){
    if (!$scope.base.playList[num]) {
      return;
    }
    var name = $scope.base.playList[num].name;
    $_deleteImage(name , function(ret){
      $scope.base.playList.splice(num , 1);
    });
    if ($scope.base.playList.length != 0) {
      $scope.style.background = "url('" + $scope.base.playList[num-1].rurl + "')";
    } else {
      $scope.style.background = "url('img/1.jpg')";
    }
  }

  $scope.turnLeft = function(num){
    if(!num || num == 0){
      return;
    }
    var last = $scope.base.playList[num-1];
    $scope.base.playList[num-1] = $scope.base.playList[num];
    $scope.base.playList[num] = last;
  }
  $scope.turnRight = function(num){
    if(num == 9){
      return;
    }
    var next = $scope.base.playList[num+1];
    $scope.base.playList[num+1] = $scope.base.playList[num];
    $scope.base.playList[num] = next;
  }
  $scope.playState = false;
  $scope.play = function(){
    if(!$("body").scope().imagePlayerState){
      $("body").scope().imagePlayerState = true;
      $scope.playState = true;
    }else{
      $("body").scope().imagePlayerState = false;
      $scope.playState = false;
    }

    $("#dyaliasImagePlayer").scope().playList = $scope.base.playList;
  }
  $scope.setImagePlayerFrame = function(num){
    $("#dyaliasImagePlayer").scope().index = num;
  }
  $scope.selectedTag = function(tag){
    $scope.data.tag = tag;
  }
}])
