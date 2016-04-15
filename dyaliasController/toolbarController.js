var module = angular.module("controller.toolbarController", []);

/**
 *	@name : toolbar controller
 *	@kind : controller
 *	@description :
 *		左侧工具栏控制器
 */
module.controller('toolbarController', ['$scope', '$_pageSave', '$urlParams', '$window',

  function($scope, $_pageSave, $urlParams, $window) {

    //保存
    $scope.save = function(state) {
      var uiEditorPanelPagesScope = $("#uiEditorPanelPages").scope();
      var pageList = uiEditorPanelPagesScope.pageList;

      var elementListScope = $("#uiEditorElementList").scope();
      var elementList = elementListScope.elementList;

      // 保存组件数据
      elementListWriteBack(elementList);

      // 保存页面数据
      $.each(pageList, function(idx, val) {
        if (val.state == "active") {
          var pageClone = $("#" + val.id).clone();
          pageClone.find('.noContain').empty(); //清空非容器组件的内部
          var content = pageClone.get(0).outerHTML;
          var ncontent = content.replace(/(\n)+|(\r)+/g, "").replace(/<!--(.*)-->/g, "").replace(/[\s]+style="[^"]*"/g, "").replace(/<div class="highcharts-container"(.*?)<\/svg><\/div>/g, "");

          var page_info = {
            "name": val.name,
            "type": val.home,
            "content": ncontent,
            "doc_type": "page",
            "operator": "xiaoming",
            "locked": false
          }
          $_pageSave(page_info, function(data) {
						if(data && !state){
							return;
						}
						if (data) {
              $("#alertBox").scope().info = "页面保存成功!";
							$("#alertBox").scope().open();
            } else {
							$("#alertBox").scope().info = "页面保存失败!";
							$("#alertBox").scope().open();
            }
          });
        }
      })
    }

    //运行
    $scope.play = function() {
      var uuid = $urlParams("uuid")
      var url = "/syalias/trunk/syalias.html?uuid=" + uuid + "&systemModelName=LiuZ";
      $window.open(url, '_blank');
    }

    //显示添加页面
    $scope.showAddPage = function() {
      $("body").scope().createPageState = true;
      $("body").scope().uploadImageState = false;
    }

    //打开上传图片列表
    $scope.showUploadImage = function() {
      $("body").scope().createPageState = false;
      $("body").scope().uploadImageState = true;
    }

    // 遍历elementlist树保存元素
    function elementListWriteBack(elementList) {
      $.each(elementList, function(idx, val) {
        // 递归
        if (val.children.length > 0) {
          elementListWriteBack(val.children);
        }
        // 保存自己
        $("#" + val.id).scope().writeBack();

      })
    }

  }

]);
