(function () {
  'use strict';


  angular
    .module('trulii.utils.controllers')
    .controller('DialogModalCtrl', DialogModalCtrl);

  DialogModalCtrl.$inject = ['$scope','$modal','$http','$stateParams','$state'];
  /**
  * @namespace RegisterController
  */
  function DialogModalCtrl($scope,$modal,$http,$stateParams,$state) {
  	


  	var modalInstance = $modal.open({
  	    templateUrl:'partials/utils/base_dialog_modal.html',
  	    controller: 'ModalInstanceCtrl',
        controllerAs:'modal',

        //backdrop: 'static',
  	});

    modalInstance.result.then(function(){

    },function(){
        $state.go("home");
    })

   



  };

  })();