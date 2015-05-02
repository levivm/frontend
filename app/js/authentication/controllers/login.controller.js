/**
 * LoginController
 * @namespace thinkster.authentication.controllers
 */
(function () {
    'use static';

    angular
        .module('trulii.authentication.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$location', '$state','$q','Authentication'];

    /**
     * @namespace LoginController
     */
    function LoginController($scope, $location, $state, $q, Authentication) {
        var vm = this;
        vm.errors = {};
        vm.auth = {};
        vm.login = _login;
        vm.facebookLogin = _facebookLogin;
        vm.is_new = true;

        vm.clearErrors = clearErrors;

        //--------- Functions Implementation ---------//

        function clearErrors(){
            vm.errors = null;
            vm.errors = {};
        }

        function _addError(field, message) {
            vm.errors[field] = message;
            vm.login_form[field].$setValidity(message, false);
        }

        function _errored(data) {
            if (data['form_errors']) {
                angular.forEach(data['form_errors'], function(errors, field) {
                    _addError(field, errors[0]);
                });
            }
        }

        /**
         * @name login
         * @desc Log the user in
         * @memberOf thinkster.authentication.controllers.LoginController
         */
        function _login() {
            clearErrors();
            console.log("vm auth",vm.auth);
            return  Authentication.login(vm.auth.email, vm.auth.password)
                .then(_loginSuccess,_loginError);
        }


        function _facebookLogin() {

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

                $state.go('general-message',{'module_name':'authentication',
                               'template_name':'social_login_cancelled',
                               'redirect_state':'home'});



            }
        }


        /**
         * @name loginSuccessFn
         * @desc Set the authenticated account and redirect to index
         */
        function _loginSuccess(redirect_state) {
            console.log("redirect state",redirect_state);
            $state.go(redirect_state.data.location);
            Authentication.updateAuthenticatedAccount();
        }

        /**
         * @name loginErrorFn
         * @desc Log "Epic failure!" to the console
         */
        function _loginError(response) {
            _errored(response.data);
            return $q.reject(response);
        }

    }
})();