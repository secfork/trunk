/**
 *	@name : editor panel page controller
 *	@kind : controller
 *	@description : 编辑已经创建好的页面
 */
var module = angular.module("controller.editorPanelPageController", []);

module.controller('editorPanelPage', ['$scope', '$http', '$urlParams', '$_pageDel', '$service_hint', '$_pageRename', '$compile', '$_pageInit', '$console', '$componentsControllerFactory', '$_pagesList', '$timeout', '$input_validate', '$_deleteImage',

  function($scope, $http, $urlParams, $_pageDel, $service_hint, $_pageRename, $compile, $_pageInit, $console, $componentsControllerFactory, $_pagesList, $timeout, $input_validate , $_deleteImage) {

    /* page list 已经创建的页面列表
    	[
    		{
    			editor: true
    			home: null
    			id: "s_e_29594373_0"
    			name: "x12"
    			prompt: null
    			state: "unactive"
    		} , ....
    	]
    */
    $scope.pageList = [];
    $scope.page_name_info = "";
    $scope.oldName;

    // 初始化 , 加载已经创建的页面
    var addContent = function(data) {
      if (!data) {
        return;
      }
      $.each(data, function(idx, val) {
        var content = angular.element(val.content);
        var contentCompile = $compile($(content))($("#dyaliasDrawArea").scope());
        $("#dyaliasDrawArea").append(contentCompile);

        $timeout(function() {
          compile(contentCompile, val);
        }, 0)
      })
    }

    var compile = function(contentCompile, val) {
      var id = $(contentCompile).attr("id");
      var name = val.name;

      // 新加载页面默认设置不显示
      if (!$(contentCompile).scope().base) {
        $timeout(function() {
          compile(contentCompile, val);
        }, 100)
        return;
      }

      $(contentCompile).scope().base.display = "none";

      var pageJson = {
        "id": id,
        "name": name,
        "state": "unactive",
        "home": val.type,
        "editor": true,
        "prompt": null
      }
      $scope.pageList.push(pageJson);
    }

    var initLoadPageList = function(data) {
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
    }
    $_pagesList(initLoadPageList);

    // 设置主页
    $scope.setHome = function(pname) {
      // ioname原主页名称
      var ioname
      $.each($scope.pageList, function(idx, val) {
        if (val.home == "init") {
          ioname = val.name;
        }
        if (val.name == pname) {
          val.home = "init";
        } else {
          val.home = null;
        }
      })

      //如果原主页和现主页相同则不改变
      if (ioname == pname) {
        return;
      }

      var json = {
        "ioname": ioname,
        "inname": pname,
      }
      $_pageInit(json, function(ret) {
        if (ret) {
          $console.log("设置主页成功");
        }
      })

    }

    // 设置当前页被选中
    $scope.pageSelected = function(page) {

      var pname = page.name;

      $.each($scope.pageList, function(idx, val) {
        if (val.name == pname) {
          val.state = "active";
          $("#" + val.id).scope().base.display = "flex";
          $scope.oldName = pname;
        } else {
          val.state = "unactive";
          $("#" + val.id).scope().base.display = "none";
          val.editor = true;
        }
      })

      // 元素列表中同步选中
      $('#elementListTreeOuter').scope().elementSelected(page);
    }

    // 设置当前页面为编辑状态
    $scope.setEditor = function(pname) {
      $.each($scope.pageList, function(idx, val) {
        if (val.name == pname) {
          val.editor = false;
        } else {
          val.editor = true;
        }
      })
    }

    // 取消当前page的选中状态
    $scope.cancelEditor = function() {
      $.each($scope.pageList, function(idx, val) {
        val.editor = true;
      })
    }

    // page重命名
    $scope.pageRename = function(obj) {
      var oname = $scope.oldName;
      var data = {
        'oname': oname,
        'nname': obj.page.name
      };
      if (obj.page.name == oldName) {
        return;
      }
      if (!$input_validate(obj.page.name, obj.page.id)) {
        obj.page.prompt = "页面名称重复,或者页面名称包含特殊字符,请更换页面名称";
        obj.page.name = oldName;
        return;
      } else {
        obj.page.prompt = null;
      }
      $_pageRename(data, function(res) {
        if (!res) {
          obj.page.prompt = "重命名错误";
          obj.page.name = oldName;
        } else {
          // 重命名成功后,需要设置元素列表中对应的元素的名字与重命名确定 并设置当前page元素名字
          var elementListScope = $("#uiEditorElementList").scope();
          elementListScope.findElement(elementListScope.elementList, obj.page.id, function(idx, ele, elist) {
            ele.name = obj.page.name;
						$("#toolbar").scope().save(false);
          })

          oldName = obj.page.name;
        }
      })
    }

    // 删除page
    $scope.deletePage = function(obj) {
      // 删除客户端页面后，连同服务器端页面也一同删除
      var data = {
        'name': obj.name
      };
      var pageScope = $("#" + obj.id).scope();
      var bgImgName = pageScope.base.backgroundImageName;
      if (bgImgName) {
        $_deleteImage(bgImgName , function(ret){
          if (ret) {
            $_pageDel(data, function(state) {
              (state) ? $console.log("数据库删除页成功"): $console.log("数据库删除页失败");
              $.each($scope.pageList, function(idx, val) {
                if (!val) {
                  return
                }
                if (val.name == obj.name) {
                  $("#" + val.id).remove();
                  $scope.pageList.splice(idx, 1);
                }
              });

              var elementListScope = $("#uiEditorElementList").scope();
              elementListScope.findElement(elementListScope.elementList, obj.id, function(idx, ele, elist) {
                elist.splice(idx, 1);
              })

              $("#uiComponentProperties").empty();
            });
          }
        });
      } else {
        $_pageDel(data, function(state) {
          (state) ? $console.log("数据库删除页成功"): $console.log("数据库删除页失败");
          $.each($scope.pageList, function(idx, val) {
            if (!val) {
              return
            }
            if (val.name == obj.name) {
              $("#" + val.id).remove();
              $scope.pageList.splice(idx, 1);
            }
          });

          var elementListScope = $("#uiEditorElementList").scope();
          elementListScope.findElement(elementListScope.elementList, obj.id, function(idx, ele, elist) {
            elist.splice(idx, 1);
          })

          $("#uiComponentProperties").empty();

        });
      }
    }
  }

]);
