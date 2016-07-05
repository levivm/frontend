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
    vm.errors = {};
    vm.resetPassword = _resetPassword;
    vm.strings = {
      COPY_TITLE: "Restablecer contraseña",
      COPY_TEXT: "Define tu nueva contraseña para acceder a tu cuenta. Procura que sea segura y fácil de recordar",
      COPY_NEW_PASSWORD: "Nueva contraseña",
      ACTION_SAVE_PASSWORD: "Guardar contraseña"
    }
    

    function _resetPassword(){
      Error.form.clear(vm.reset_password_form);
        Authentication.reset_password($stateParams.reset_key,vm.password1,vm.password2)
                        .then(success,error);


        function success(response){

          $state.go('general-message',{'module_name':'authentication',
                                       'template_name':'change_password_success',
                                       'redirect_state':'login'});

        }

        function error(response){
          
          vm.errors.__all__ = response.data;

        }

    }

  }
})();