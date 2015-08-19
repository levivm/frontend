-/**
 * Register controller
 * @namespace thinkster.authentication.controllers
 */
    (function () {
        'use strict';

        angular
            .module('trulii.utils.controllers')
            .controller('SimpleModalMsgCtrl', SimpleModalMsgCtrl);

        SimpleModalMsgCtrl.$inject = ['$modal', '$stateParams', '$state'];
        /**
         * @namespace RegisterController
         */
        function SimpleModalMsgCtrl($modal, $stateParams, $state) {

            var vm = this;
            var template_name = $stateParams.template_name;
            var module_name = $stateParams.module_name;

            var modalInstance = $modal.open({
                templateUrl: 'partials/' + module_name + '/messages/' + template_name + '.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'vm'
            });

            modalInstance.result.then(function () {
                var redirect_state = $stateParams.redirect_state;
                var redirect_params = $stateParams.redirect_params? $stateParams.redirect_params : {};
                if (redirect_state) {
                    $state.go(redirect_state, redirect_params);
                }
            })

        }


    })();