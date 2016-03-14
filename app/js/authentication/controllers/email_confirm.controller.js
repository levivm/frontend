/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.authentication.controllers')
    .controller('EmailConfirmCtrl', EmailConfirmCtrl);

  EmailConfirmCtrl.$inject = ['$scope','$modal','$state','$stateParams','Authentication'];
  /**
  * @namespace RegisterController
  */
  function EmailConfirmCtrl($scope,$modal,$state,$stateParams,Authentication) {

    console.log('???');
    var error = false;
    var key = $stateParams.key;

    if (key)
      Authentication.confirmEmail(key).then(confirmed_email, invalid_token);


    function confirmed_email(){

      var modalInstance = $modal.open({
          templateUrl: 'partials/authentication/email_confirmation_success.html',
          controller: 'ModalInstanceCtrl',
          controllerAs:'modal',

        });

      modalInstance.result.then(function(){


        $state.go("home");
      });

    } 

    function invalid_token(){

      var modalInstance = $modal.open({
          templateUrl: 'partials/authentication/email_confirmation_error.html',
          controller: 'ModalInstanceCtrl',
          controllerAs:'modal',

        });

      modalInstance.result.then(function(){

        $state.go("home");
      });



    }
  }

  })();