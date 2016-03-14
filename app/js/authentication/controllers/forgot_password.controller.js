/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use static';

  angular
    .module('trulii.authentication.controllers')
    .controller('ForgotPasswordCtrl', ForgotPasswordCtrl);

  ForgotPasswordCtrl.$inject = ['$scope','$location','$modal','$state','$stateParams','Authentication','Error'];

  /**
  * @namespace ForgotPasswordCtrl
  */
  function ForgotPasswordCtrl($scope, $location,$modal,$state,$stateParams,Authentication,Error) {
    var vm = this;



    vm.errors = {};
    vm.forgotPassword = forgotPassword;


    function forgotPassword() {
      Error.form.clear(vm.forgot_password_form);


      return  Authentication.forgot_password(vm.email)
              .then(success,error);
              // .error(passwordResetErrorFn)
              // .success(passwordResetFn);


      function success(response){

        $state.go('general-message',{'module_name':'authentication',
                                   'template_name':'password_reset_done',
                                   'redirect_state':'home'});


      }

      function error(response){
            
        var responseErrors = response.data;
        if (responseErrors) {
            Error.form.add(vm.forgot_password_form, responseErrors);
        }

      }

    }







  }
})();