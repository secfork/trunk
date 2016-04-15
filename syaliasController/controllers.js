var module = angular.module("syaliasApp.controllers", []);

// main controller , 初始化加载的controller
module.controller('main', ['$scope', '$route', '$routeParams', '$location', '$compile', '$timeout', '$urlParams', '$_pagesList', '$datasource_factory', '$_getAccessKey', '$componentsControllerFactory',

  function($scope, $route, $routeParams, $location, $compile, $timeout, $urlParams, $_pagesList, $datasource_factory, $_getAccessKey, $componentsControllerFactory) {

    $_getAccessKey.init("syalias");

    // Global var
    $scope.loading = false;
    $scope.imagePlayerState = false;
    $scope.runSystemName = "syalias";

    //初始化 datasource
    $datasource_factory.init(function() {
      $scope.loading = true;
    });


    var setDisplay = function(dom, val) {
      $timeout(function() {
        if (val.type == "init") {
          dom.scope().base.display = "flex";
        } else {
          dom.scope().base.display = "none";
        }
      }, 300);
    }

    var addContent = function(data) {
      // 系统数据加载完成后，跳转到初始页面，在跳转页面时，会自动调用 match controller
      if (!data) {
        return
      }
      $.each(data, function(idx, val) {
        var content = val.content;
        var dom = $compile(content)($scope);
        $("#uiDrawPanel").append(dom);

        setDisplay(dom, val);
      })

    }
    // 初始化加载main后，异步加载所有的page信息
    $_pagesList(function(data) {
      if ($componentsControllerFactory.state) {
        addContent(data);
      } else {
        $componentsControllerFactory.init(function(args) {
          if (args) {
            addContent(data);
          } else {
            $console.log("页面列表初始化失败")
          }
        })
      }
    });

  }

]);


module.controller('match', ['$scope', '$routeParams', '$compile',

  function($scope, $routeParams, $compile) {
    // 当前系统要跳转的页面
    var curr_name = $routeParams.name;

    // 获取所有数据后，将dom数据添加到container中
    for (var i in $scope.data) {
      if (!$scope.data_load) {
        var content = $scope.data[i].content;
        var dom = $compile(content)($scope);
        $("#uiDrawPanel").append(dom);
      }
    }
    $scope.data_load = true;

    var doms = $("#uiDrawPanel").children();
    $(doms).each(function(idx, val) {
      if ($(val).attr("id") == curr_name) {
        $(val).css("display", "flex");
      } else {
        $(val).css("display", "none");
      }
    });

  }

]);
