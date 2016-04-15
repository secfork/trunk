'use strict';

var app = angular.module("dyaliasApp" , [

	'controller.bodyController' ,
	'controller.createPageController',
	'controller.editorPanelPageController',
	'controller.componentController',
	'controller.componentPropertiesController',
	'controller.elementListController',
	'controller.toolbarController',
	'controller.alertController',
	'controller.imagePlayerController',

	'directive.selectorDirective' ,
	'dyaliasApp.dy_draggable' ,
	'dyaliasApp.dy_droppable' ,
	'dyaliasApp.dy_selectable' ,

	'application.common_service_base' ,
	'componentController.common' ,
	'application.common_filter' ,

	'ui.load' ,

	'common.common_directive' ,
	'factory.datasource',
	'common.data_connect_service',

	'ui.bootstrap',

	'dyaliasApp.dy_directive',

	'componentsController.factory',

	'oc.lazyLoad',
	'angularFileUpload',

	'colorpicker.module'
]);



app.config(['$controllerProvider' ,

	function($controllerProvider){

		app.registerCtrl = $controllerProvider.register;

	}

]);

app.directive('uiLoading' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/dview/ui-loading.html"
	}
});

app.directive('uiToolbar' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/dview/ui-toolbar.html"
	}
});


app.directive('uiEditorPanel' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/dview/ui-editor-panel.html"
	}
});

app.directive('uiDrawPanel' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/dview/ui-draw-panel.html"
	}
});

app.directive('uiAlert' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/dview/ui-alert.html"
	}
});

app.directive('uiComponentProperties' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/dview/ui-component-properties.html"
	}
});




/**
	以下部分都是组件配置属性需要使用的directive
*/

/**
	properties box
*/
app.directive('propertiesBox' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/properties-box.html",
		"scope" : {
			"dirTitle" : "@"
		},
		"transclude" : true,
		"controller" : function($scope,$element,$transclude) {
			$scope.flexible=false
		//	$element.find('.uiPropertyContent').append($transclude());
	    	}
	}
});


//组件设置栏，宽高指令
app.directive('unitSelect' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/unit-select.html",
		"scope" : {
			"dirClass" : "@",
			"dirUnit" : "@",
			"dirModel" : "@"
		},
		'replace' : true,
		"controller" : function($rootScope , $scope,$element,$attrs,$timeout){
			//父级作用域
			var parentScope = $element.parent().scope();
			var key = $scope.dirModel.split('.');
			//初始化
			$timeout(function(){
				if (!parentScope[key[0]]) {
					return;
				}
				$scope.newModel = parseFloat(parentScope[key[0]][key[1]]);
				if(parentScope[key[0]][key[1]].indexOf('px')>=0){
					$scope.newStyle = 'px';
				}else if (parentScope[key[0]][key[1]].indexOf('%')>=0) {
					$scope.newStyle = '%';
				};
			},0);

			//变动时触发
			$scope.change = function(){
				if ($scope.newStyle == 'auto') {//如果选择的是auto
					parentScope[key[0]][key[1]] = 'auto';
					$scope.newModel = 'auto';
				}else{
					var value = parseFloat($scope.newModel);
					if(!isNaN(value)){
						parentScope[key[0]][key[1]] = value + $scope.newStyle;
					}
				}

				$rootScope.$broadcast("unitSelected" , "");

			}
		}
	}
});



//组件设置栏，单位外移指令
app.directive('unitOut' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/unit-out.html",
		"scope" : {
			"dirClass" : "@",
			"dirUnit" : "@",
			"dirModel" : "@"
		},
		'replace' : true,
		"controller" : function($scope,$element,$attrs,$timeout){
			//父级作用域
			var parentScope = $element.parent().scope();
			var key = $scope.dirModel.split('.');
			//初始化
			$timeout(function(){
				if (!parentScope[key[0]]) {
					return;
				}
				$scope.newModel = parseFloat(parentScope[key[0]][key[1]]);
			},0);
			$scope.numberChange = function(){
				var value = parseFloat($scope.newModel);
				if(!isNaN(value)){
					parentScope[key[0]][key[1]] = value + $scope.dirUnit;
				}

			}
		}
	}
});

/**
	widget config directive
*/
app.directive('widgetConfigProperties' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/config-properties.html"
	}
});

/**
	widget single config directive
*/
app.directive('widgetSingleConfigProperties' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/config-properties-single.html"
	}
});

/**
	getSystemsByModels interface properties config page
*/
app.directive('getSystemsByModel' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/getSystemsByModel.html"
	}
});

/**
	getSystemLive interface properties config page
*/
app.directive('getSystemLive' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/getSystemLive.html"
	}
});

/**
	getSystemHistoryReadRaw interface properties config page
*/
app.directive('getSystemHistoryReadRaw' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/getSystemHistoryReadRaw.html"
	}
});

/**
	getSystemHistoryReadInterval interface properties config page
*/
app.directive('getSystemHistoryReadInterval' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/getSystemHistoryReadInterval.html"
	}
});

/**
	getSystemAlarms interface properties config page
*/
app.directive('getSystemAlarms' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/getSystemAlarms.html"
	}
});

/**
	getSystemWrite interface properties config page
*/
app.directive('getSystemWrite' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/widgetDirective/getSystemWrite.html"
	}
});


//元素树结构指令
app.directive('elementTree', function() {
    return {
        template: '<div element ng-repeat="item in elementList track by $index"></div>',
        replace: true,
        transclude: true,
        restrict: 'EA',
        scope: {
            elementList : '=ngModel'
        }
    };
});

//元素树结构指令
app.directive('element', function($compile) {
    return {
        restrict: 'EA',
        templateUrl: "/syalias/trunk/widgetDirective/elementListTemplate.html",
        controller : function($scope, $element, $attrs,$rootScope) {
            if ($scope.item.children.length > 0) {
                var childChoice = $compile('<div style="padding-left: 10px;display:none;" element-tree ng-model="item.children"></div>')($scope);
                $element.append(childChoice);
            }

            $scope.toggle = function(){
	            $element.children('.pageElement').siblings('div').slideToggle('fast');
            }
        }
    };
});
