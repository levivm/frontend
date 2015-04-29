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