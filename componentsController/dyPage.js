/**
 *	@name : page controller
 *	@kind : controller
 *	@description : 页面通用controller
 */

var module = angular.module("componentsController.dyPage" , []);

module.controller('dyPage' , ['$scope' , '$unique_id' ,'$compile', '$element' , '$document' , '$datasource_factory' , '$console' , '$timeout' ,'$componentProperty','$rootScope',

    function($scope, $unique_id,$compile, $element ,$document, $datasource_factory , $console , $timeout,$componentProperty,$rootScope){

        /*	页面属性定义
         * base , 基本属性
         * style , 样式属性
         * data , 数据连接属性
         * directiveStr , 组件绑定设置属性的 directive
         */

        $scope.base = {
            "id": null,
            "name": "page",
            "backgroundImageName": "",
            "locked" : false,
            "logo" : "img/icon/ic_crop_free_white_48dp.png",
            "display" : "flex",
            "parentId": null,
            "children":[]
        }

        $scope.style = {
            "display": "flex",
            "position": "relative",
            "width" : "100%",
            "height" :  "auto",
            "minHeight" : "100%",
            "margin" : "0px",

            "backgroundColor" : "#FFFFFF",
            "flexDirection":"row",
            "flexWrap":"wrap",
            "justifyContent":"space-around",
            "alignItems":"flex-start",
            "alignContent":"flex-start",
            "backgroundImage" : "",
            "backgroundSize" : "100% 100%"
        }

        $scope.data = {};

        $scope.directiveStr = "<div prop-page></div>";

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
            idata.base = $.extend(true,{},$scope.base);
            idata.style = $.extend(true,{},$scope.style);

            // 不需要保存的数据项清空
            idata.base.children = [];

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
                // elementListScope.regist($scope.base , $element.parent().attr("id"));
            }

        }
        // 执行一次
        componentDataInit();
    }
]);


module.controller('propPage', ['$scope', '$componentProperty', '$_imagesUpload' , '$_deleteImage' , function($scope, $componentProperty , $_imagesUpload , $_deleteImage) {
  $scope.del = function(obj) {
    if ($scope.base.backgroundImageName) {
      $_deleteImage($scope.base.backgroundImageName , function(ret){
        var pageScope = $("#uiEditorPanelPages").scope();
        pageScope.deletePage(obj);
      });
    } else {
      var pageScope = $("#uiEditorPanelPages").scope();
      pageScope.deletePage(obj);
    }
  }

  $scope.uploadImage = function(){
    $("#file").click();
  }

  $scope.uploadFile = function(file){
    $_imagesUpload(file , function(data){
      $scope.style.backgroundImage = "url(" + data.ret.url + ")";
      $scope.base.backgroundImageName = data.ret.name;
    })
  }

  $scope.uploadOffImage = function(){
    $_deleteImage($scope.base.backgroundImageName , function(ret){
      $scope.base.backgroundImageName = "";
      $scope.style.backgroundImage = "";
    });
  }
}])
