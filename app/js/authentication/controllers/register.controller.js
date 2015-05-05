/**
 * @ngdoc controller
 * @name trulii.authentication.controllers.RegisterController
 * @description RegisterController
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.authentication.controllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', '$q', 'Authentication', '$modal', '$http', '$state', 'validatedData'];

    function RegisterController($scope, $q, Authentication, $modal, $http, $state, validatedData) {

        var vm = this;
        var selectedMethod = null;

        vm.auth = {};
        vm.errors = {};

        vm.register = register;
        vm.set_usertype = function_name;
        vm.isSelectedMethod = isSelectedMethod;
        vm.setSelectedMethod = setSelectedMethod;

        initialize();

        function isSelectedMethod(method){
            return selectedMethod === method;
        }

        function setSelectedMethod(method){
            selectedMethod = method;
        }

        function function_name(user_type) {
            vm.user_type = user_type;
        }

        function _clearErrors() {
            vm.errors = null;
            vm.errors = {};
        }

        function _addError(field, message) {
            vm.errors[field] = message;
            vm.signup_form[field].$setValidity(message, false);
        }

        function _errored(data) {
            if (data['form_errors']) {
                angular.forEach(data['form_errors'], function (errors, field) {
                    _addError(field, errors[0]);
                });
            }
        }

        function register() {
            _clearErrors();
            vm.auth.user_type = vm.user_type;

            return Authentication.register(vm.auth)
                .then(function (response) {
                    $state.go("home");
                    //TODO HERE SHOULD SHOW A POP UP
                }, _registerError);

        }

        function _registerError(response) {
            _errored(response.data);
            return $q.reject(response);

        }

        function setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                SIGNUP_LABEL : "Registrarme",
                LOGIN_LABEL : "Inicia Sesión",
                EMAIL_LABEL : "Correo electrónico",
                PASSWORD_LABEL : "Contraseña",
                FIRST_NAME_LABEL : "Nombre",
                LAST_NAME_LABEL : "Apellido"
            });
        }

        function initialize(){
            setStrings();
            if (validatedData) {
                vm.auth.email = validatedData.email;
                vm.auth.name = validatedData.name;
            }
        }
    }

})();

/**
 * @ngdoc controller
 * @name trulii.authentication.controllers.serverError
 * @description serverError
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.authentication.controllers')
        .directive('serverError', serverError);

    function serverError() {
        return {
            restrict : 'A',
            require : '?ngModel',
            link : function (scope, element, attrs, ctrl) {

                element.on('change', function (event) {

                    scope.$apply(function () {
                        console.log("aqui");
                        ctrl.$setValidity('server', true);
                    });

                });
            }
        }

    }

})();