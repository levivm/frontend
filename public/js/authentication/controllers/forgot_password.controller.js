/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use static';

  angular
    .module('trulii.authentication.controllers')
    .controller('ForgotPasswordCtrl', ForgotPasswordCtrl);

  ForgotPasswordCtrl.$inject = ['$scope','$location','$modal','$state','$stateParams','Authentication'];

  /**
  * @namespace ForgotPasswordCtrl
  */
  function ForgotPasswordCtrl($scope, $location,$modal,$state,$stateParams,Authentication) {
    var vm = this;


    // console.log("parent controller",$scope.$parent);
    // if ($stateParams.reset_key){

    //   var modalInstance = $modal.open({
    //     templateUrl: 'partials/authentication/reset_password.html',
    //     controller: 'ResetPasswordCtrl',
    //     controllerAs:'vm'
    //   });

    //   modalInstance.result.then(function(){

      
    //   $state.go('general-message',{'module_name':'authentication',
    //                                'template_name':'change_password_success',
    //                                'redirect_state':'home'});

    //   });

    // }
    // else if ($stateParams.confirmation_key_done){

    //   var modalInstance = $modal.open({
    //     templateUrl: 'partials/authentication/password_reset_key_done.html',
    //     controller: 'ModalInstanceCtrl',
    //   });
    // }
    // else{

    //   var modalInstance = $modal.open({
    //     templateUrl: 'partials/authentication/reset_password.html',
    //     controller: 'ResetPasswordCtrl',
    //     controllerAs:'vm'
    //   });

    // }


    vm.errors = {};
    vm.forgotPassword = forgotPassword;

    vm.clearErrors = _clearErrors;

    function _clearErrors(){
      vm.errors = null;
      vm.errors = {};
    }



    function _addError(field, message) {

      vm.errors[field] = message;
      vm.forgot_password_form[field].$setValidity(message, false);


    };




    function _errored(response) {


      if (response['form_errors']) {

        angular.forEach(response['form_errors'], function(errors, field) {

          _addError(field, errors[0]);

        });

      }
    }


    function forgotPassword() {
      _clearErrors();

     return  Authentication.forgot_password(vm.email)
              .error(passwordResetErrorFn)
              .success(passwordResetFn);
    }


    function passwordResetFn(data, status, headers, config) {

    

     $state.go('general-message',{'module_name':'authentication',
                                   'template_name':'password_reset_done',
                                   'redirect_state':'home'});

      //Authentication.setAuthenticatedAccount(vm.user);

      //window.location = '/';
    }

    /**
     * @name passwordResetErrorFn
     * @desc Log "Epic failure!" to the console
     */
    function passwordResetErrorFn(data) {
      console.log("errroor",data);
      _errored(data);
    }




  }
})();