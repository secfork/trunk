/**
 *	@name : application.common_service_base
 *	@kind : service
 *	@description :
 *		common service base 向系统提供基础服务，一些通用的服务，都封装到本service中
 */

var module = angular.module("componentController.common" , []);


module.service('$component' , ['$unique_id','$datasource_factory','$timeout',function($unique_id,$datasource_factory,$timeout){
    var component = function () {

        //初始化一下$compment服务，传递参数作用域和dom给
        this.scope;
        this.element;
        this.init = function ($scope,$element) {
            this.scope = $scope;
            this.element = $element;
        }


    	//common改变时触发
        this.commonWatch = function($scope,$element) {
            var n = $scope.common;
            if (n) {
                //保存改变
                this.writeBack($scope,$element);


                var minheight = parseInt(n.height) + String(n.heightStyle);
                var minwidth = parseInt(n.width) + String(n.widthStyle);

                $element.find('.panel').css({
                    "height": minheight,
                    "width": minwidth
                });
                // 同步组件名称
                // this.syncName($scope,n.name);
            }
        }

        //写回数据，参数：
        // 1.$scope
        // 2.$element
        this.writeBack = function ($scope,$element){
             var idata = []
            if(!$scope.extend.options )
            {
                $scope.extend.options = [];
            }
            $.each($scope.extend.options , function(idx , val){
                delete val['$$hashKey'];
            });
            idata.push({'id' : $scope.id , 'common' : $scope.common , 'connect' : $scope.connect , 'extend' : $scope.extend});

            var idataString = JSON.stringify(idata);
            $element.parent().attr("data", idataString);
        }


        //取消修改，属性设置页面关闭按钮触发
        this.reset = function ($scope,callback) {
            //common
            if(angular.isObject($scope.common)){
                $scope.commonMirror = angular.copy($scope.common);
            }
            //connect
            $scope.connectMirror = angular.copy($scope.connect);
            //触发watch函数
            callback();

            //extend
            if(angular.isObject($scope.extend)){
                $scope.extendMirror = angular.copy($scope.extend);
            }
        }


        //保存设置
        this.save = function ($scope,$element,ds,connectWatch,extendWatch) {
            console.log('$component.saveFn!!!!');
            //common
            if(angular.isObject($scope.commonMirror)){
                $scope.common = angular.copy($scope.commonMirror);
            }
            //connect
            $scope.connect = angular.copy($scope.connectMirror);

            //extend
            if(angular.isObject($scope.extendMirror)){
                $scope.extend = angular.copy($scope.extendMirror);
                $scope.extend.options = $scope.extendMirrorOptions;
            }
            // if datasource , component will set datasource options , save it
            if(ds)
            {
                ds.options = $scope.options;
            }

            //触发watch函数
            this.commonWatch($scope,$element);
            connectWatch();
            extendWatch();

        }

        //响应组件拖拽，缩放，其他组件被点击，数据源变化四个事件
        this.onFn = function ($scope,$element) {

            //this_传递一下this
            var this_ = this;
            //响应组件拖拽，更改元素位置
            $scope.$on('COMPONENT_DRAGGABLE', function (evt, data) {
                var left = $element.parent().css("left");
                var top = $element.parent().css("top");
                $scope.common.left = parseInt(left);
                $scope.common.top = parseInt(top);
                this_.commonWatch($scope,$element);
            });

            //响应组件缩放
            $scope.$on('COMPONENT_RESIZABLE', function (evt, data) {
                var width = $element.parent().css("width");
                var height = $element.parent().css("height");
                $scope.common.width = parseInt(width);
                $scope.common.height = parseInt(height);
                this_.commonWatch($scope,$element);
            });

            //响应其他组件被点击，关闭自身的属性栏
            $scope.$on('COMPONENT_CLOSE_PROPERTY' , function(evt , data){
                if(data != $scope.id)
                {
                    $scope.close_properties_dialog();
                }
            });
        }



        //组件数据初始化
        this.componentDataInit = function ($scope,$element,connectWatch,extendWatch,connectMirrorWatch) {
            var ida = $element.parent().attr('data');

            var idata = angular.fromJson(ida);
            //组件通用属性,连接属性，拓展属性
            $scope.common = idata[0].common;
            $scope.connect = idata[0].connect;
            $scope.extend = idata[0].extend;
            this.commonWatch($scope,$element);
            connectWatch();
            extendWatch();
            //对新建的组件，创建一个唯一系统id
            if(idata[0].id){
                $scope.id = idata[0].id;
            }else{
                $scope.id = $unique_id();
                this.writeBack($scope,$element);
            }


            // 元素初始化以后，父类的element_list中，添加自己
            var pageId = $element.parent().parent().parent().attr("id");
            if($scope.element_list)
            {
                $.each($scope.element_list , function(idx , val){
                    var page_name = val.page_name ;
                    if(page_name == pageId)
                    {
                        var cjson = {"component_id" : $scope.id , "component_name" : $scope.common.name , "state" : "unactive" , "locked" : false};
                        val.child.push(cjson);
                    }
                });
            }

            $scope.commonMirror = angular.copy($scope.common);
            $scope.connectMirror = angular.copy($scope.connect);
            connectMirrorWatch();
            $scope.extendMirror = angular.copy($scope.extend);
        }




        //      组件根据用户配置的数据源名称，在datasource_factory中湖区数据源
        // 如果第一时间没有获取到数据源，本方法会自动递归调用，如果5次没有获取数据源
        // 则放弃获取数据源
        var si;
        this.datasourceLoadTimes = 0;
        this.getDatasourceByName = function (n, callback) {

            var this_ = this;
            if ($datasource_factory.source.length == 0 && this_.datasourceLoadTimes <= 5) {
                this_.datasourceLoadTimes++;
                $timeout(function () {
                    this_.getDatasourceByName(n, callback)
                }, 1000)
                return;
            }
            var datasource = $datasource_factory.find(n);
            if (this_.datasourceLoadTimes <= 5 && !datasource) {
                clearInterval(si);
                this_.datasourceLoadTimes++;
                si = setInterval(function () {
                    this_.getDatasourceByName(n, callback)
                }, 1000)
                return;
            }
            if (this_.datasourceLoadTimes > 5) {
                clearInterval(si);
            }
            if (datasource) {
                clearInterval(si);
                callback(datasource);
                return;
            }
        }

    }
    return new component();
}]);


module.service('$componentProperty', function(){
    return {};
});