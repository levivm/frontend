/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';



  angular
    .module('trulii.authentication.controllers')
    .controller('RegisterController', RegisterController);

  angular
    .module('trulii.authentication.controllers')
    .directive('serverError',serverError);

  angular
    .module('trulii.authentication.controllers')
    


  RegisterController.$inject = ['$scope','$q','Authentication','$modal','$http','$state','validatedData'];


  function RegisterController($scope, $q, Authentication,$modal,$http,$state,validatedData) {
    var vm = this;

    vm.strings = {};
    vm.strings.SIGNUP_LABEL = "Registrate";
    vm.strings.PLACEHOLDER_EMAIL = "Correo electrónico";
    vm.strings.PLACEHOLDER_PASSWORD = "Contraseña";




    vm.auth   = {};
    console.log(validatedData,"data valida");
    if (validatedData){
        vm.auth.email = validatedData.email;
        vm.auth.name = validatedData.name;
    }
      

    vm.errors = {};

    vm.register = register;
    vm.facebookRegister = _facebookRegister;



    vm.set_usertype = function function_name(user_type) {
      vm.user_type = user_type;
    }


    function _clearErrors(){
      vm.errors = null;
      vm.errors = {};
    }



    function _addError(field, message) {

      vm.errors[field] = message;
      vm.signup_form[field].$setValidity(message, false);

    };


    function _errored(data) {
      if (data['form_errors']) {

        angular.forEach(data['form_errors'], function(errors, field) {

          _addError(field, errors[0]);

        });

      }
    }


    function register() {
      _clearErrors();
      vm.auth.user_type = vm.user_type;

      return Authentication.register(vm.auth)
            .then(function(response){

              $state.go("home");
              //HERE SHOULD HSHOW A POP UP

            },_registerError);

    }


    function _facebookRegister() {

      console.log(Authentication);
      return  Authentication.facebookLogin()
                  .then(successFbLogin,errorFbLogin);


      /**
        * @name successFbLogin
        * @desc redirect to home when facebook login is successful
        */
      function successFbLogin(response){

          $state.go("home")
      }

      /**
        * @name errorFbLogin
        * @desc redirect to error message when facebook login fails
        */
      function errorFbLogin(response){

          console.log("hubo error");
          $state.go('general-message',{'module_name':'authentication',
                         'template_name':'social_login_cancelled',
                         'redirect_state':'home'});



        }
    }


    function _registerError(response){
      _errored(response.data);
      return $q.reject(response);

    }
  }




  function serverError(){
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ctrl) {

        element.on('change',function(event){

          scope.$apply(function () {
            console.log("aqui");
            ctrl.$setValidity('server', true);

          });

        });
      }
    }

  };

})();