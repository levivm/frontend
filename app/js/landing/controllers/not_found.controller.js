
/**
 * @ngdoc controller
 * @name trulii.landing.controllers.NotFoundController
 * @description NotFoundController
 */

(function () {
    'use strict';

    angular
        .module('trulii.landing.controllers')
        .controller('NotFoundController', NotFoundController);

    NotFoundController.$inject = [];

    function NotFoundController() {
        var vm = this;

        _activate();

        //--------- Functions Implementation ---------//

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                TITLE_DOES_NOT_EXISTS: "Esta página no existe...",
                COPY_DOES_NOT_EXISTS: "Creemos que la culpa es del practicante",
                COPY_FIND_NEW_ACTIVITIES: "Ya que estamos acá ¿Quieres buscar más actividades?"
            });
        }

        function _activate(){
            _setStrings();
        }

    }
})();
