/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.authentication.controllers')
    .controller('EmailConfirmCtrl', EmailConfirmCtrl);

  EmailConfirmCtrl.$inject = ['$scope','$modal','$http','$state','$stateParams','Authentication'];
  /**
  * @namespace RegisterController
  */
  function EmailConfirmCtrl($scope,$modal,$http,$state,$stateParams,Authentication) {

    var error = false;
    var success = $stateParams.status === "success" ? true:false;

    if(success){    
      var modalInstance = $modal.open({
          templateUrl: 'partials/authentication/email_confirmation_success.html',
          controller: 'ModalInstanceCtrl',
        });

      console.log(modalInstance);
      modalInstance.result.then(function(){


        $state.go("home");
      })
    }
    else{

      var modalInstance = $modal.open({
          templateUrl: 'partials/authentication/email_confirmation_error.html/',
          controller: 'ModalInstanceCtrl',
        });
      $state.go("home");
    }
  };

  })();