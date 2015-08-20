/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use static';

  angular
    .module('trulii.authentication.controllers')
    .controller('ResetPasswordCtrl', ResetPasswordCtrl);

  ResetPasswordCtrl.$inject = ['$location', '$scope','$modal',
                               '$stateParams','$state','Authentication','Error'];

  /**
  * @namespace ResetPasswordCtrl
  */
  function ResetPasswordCtrl($location, $scope,$modal,$stateParams,$state,Authentication,Error) {
    var vm = this;

    vm.resetPassword = _resetPassword;
    

    function _resetPassword(){
      Error.form.clear(vm.reset_password_form);
        Authentication.reset_password($stateParams.reset_key,vm.password1,vm.password2)
                        .then(success,error);


        function success(response){

          $state.go('general-message',{'module_name':'authentication',
                                       'template_name':'change_password_success',
                                       'redirect_state':'home'});

        }

        function error(response){

          var responseErrors = response.data['form_errors'];
          if (responseErrors) {
              Error.form.add(vm.reset_password_form, responseErrors);
          }

        }

    }



    // function _passwordResetSuccess(response){

      
    //   $state.go('general-message',{'module_name':'authentication',
    //                                'template_name':'change_password_success',
    //                                'redirect_state':'home'});
    // }


    // function _passwordResetError(response) {
    //   _errored(response.data);
    // }


    // function _errored(response) {


    //   if (response['form_errors']) {

    //     angular.forEach(response['form_errors'], function(errors, field) {

    //       _addError(field, errors[0]);

    //     });

    //   }
    // }

    // function _clearErrors(){
    //   vm.errors = {};
    // }



    // function _addError(field, message) {

    //   vm.errors[field] = message;
    //   vm.reset_password_form[field].$setValidity(message, false);


    // };


  }
})();