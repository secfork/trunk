/**
 *	@name : image player controller
 *	@kind : controller
 *	@description : 图片预览播放器
 */

var module = angular.module("controller.imagePlayerController", []);

module.controller('imagePlayerController', ['$scope', '$rootScope',

  function($scope , $rootScope) {

    $scope.playList = [];
    $scope.index = 0;

    $scope.playState = false;
    $scope.play = function(){
      $scope.playState = !$scope.playState;
    }
    $rootScope.$on('100ms', function(evt, id) {
      if($scope.playState){
        if($scope.index < $scope.playList.length-1){
          $scope.index++;
        }else{
          $scope.index = 0;
        }

        $(".imgListManager").children()[$scope.index].click();
      }
    })

  }

]);
