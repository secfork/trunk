/**
 *	@name : create page controller
 *	@kind : controller
 *	@description : 创建页面controller
 */

var module = angular.module("controller.createPageController", []);

module.controller('createPageController', ['$scope', '$http', '$input_validate', '$compile', '$urlParams', 'uiLoad', '$_pagesList', '$_layoutGet', '$timeout', '$_pageSave', '$componentsControllerFactory',

  function($scope, $http, $input_validate, $compile, $urlParams, uiLoad, $_pagesList, $_layoutGet, $timeout, $_pageSave, $componentsControllerFactory) {

    $scope.layoutId; // 新页面使用的模板id
    $scope.pageName; // 新建页面名称
    $scope.prompts; // 提示信息

    var cb = function(val) {
      // append to dy_display_container
      var content = val.content;

      var contentCompile = $compile(content)($("#dyaliasDrawArea").scope());
      $("#dyaliasDrawArea").append(contentCompile);

      $timeout(function() {
        var id = $(contentCompile).attr("id");
        // save page name to pageList
        var pageScope = $(contentCompile).scope();
        pageScope.base.name = $scope.pageName;
        pageScope.writeBack();

        // 新加载页面默认设置不显示
        $(contentCompile).scope().base.display = "none";

        var pageJson = {
            "id": id,
            "name": $scope.pageName,
            "state": "unactive",
            "home": null,
            "editor": true,
            "prompt": null
          }
          //				console.log(pageJson)
        $("#uiEditorPanelPages").scope().pageList.push(pageJson);

        var ncontent = $("#" + id).get(0).outerHTML.replace(/(\n)+|(\r)+/g, "").replace(/<!--(.*)-->/g, "");

        // create page & save new page to mongodb
        var savePageContent = {
          name: $scope.pageName,
          type: null,
          content: ncontent,
          doc_type: "page",
          operator: "",
          locked: false
        }
        $_pageSave(savePageContent, function(ret) {
          if (ret) {
            $scope.prompts = "页面创建成功，并同步到服务器中";
          }
        });

      }, 100)


    }

    $scope.addPage = function() {
      if (!$scope.pageName) {
        $scope.prompts = "请输入页面名称";
        return;
      }

      // 检查用户输入的新页面名称是否合法 , 并且检查是否存在重复的名字
      if (!$input_validate($scope.pageName)) {
        $scope.prompts = "页面名称重复,或者页面名称包含特殊字符,请更换页面名称";
        return;
      }

      // 如果没有选中模板 不允许用户创建页面
      if (!$scope.layoutId) {
        $scope.prompts = "请选择一个模板";
        return;
      }

      // 初始化 , 获取创建页面的模板
      if ($componentsControllerFactory.state) {
        $_layoutGet($scope.layoutId, cb);
      } else {
        $componentsControllerFactory.init(function(args) {
          if (args) {
            $_layoutGet($scope.layoutId, cb);
          } else {
            $scope.prompts = "创建页面失败";
          }
        })
      }

    };

    $scope.closePage = function() {
      $("body").scope().createPageState = false;
    }

  }

]);
