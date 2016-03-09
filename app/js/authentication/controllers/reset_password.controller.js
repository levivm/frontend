/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use static';

  angular
    .module('trulii.authentication.controllers')
    .controller('ResetPasswordCtrl', ResetPasswordCtrl);

  ResetPasswordCtrl.$inject = ['$location', '$scope', '$modal',
                               '$stateParams', '$state', 'Authentication', 'Error'];

  /**
  * @namespace ResetPasswordCtrl
  */
  function ResetPasswordCtrl($location, $scope, $modal, $stateParams, $state, Authentication, Error) {
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
          console.log(response);
          
          var responseErrors = response.data[0];
          if (responseErrors === 'The passwords do not match.') {
            console.log('error');
            Error.form.add(vm.reset_password_form, 'Las contraseñas no coinciden');
          }
          else if(responseErrors === "This token is not valid."){
              Error.form.add(vm.reset_password_form, 'Token invalido');
          }

        }

    }

  }
})();