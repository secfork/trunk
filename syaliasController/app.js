'use strict';

var app = angular.module("syaliasApp", [
  'ngRoute',
  'syaliasApp.controllers',

  'componentsController.factory',

  'common.common_directive',
  'common.data_connect_service',

  'factory.datasource',
  'application.common_service_base',
  'componentController.common',

  'ui.bootstrap',

  'ui.load',
  'oc.lazyLoad',
  'angularFileUpload'
]);

app.config(['$routeProvider', '$controllerProvider',

  function($routeProvider, $controllerProvider) {

    app.registerCtrl = $controllerProvider.register;

  }

]);

app.directive('uiLoading' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/dview/ui-loading.html"
	}
});
