
/**
 * @ngdoc controller
 * @name trulii.help.controllers
 * @description HelpController
 */

(function () {
    'use strict';

    angular
        .module('trulii.help.controllers')
        .controller('HelpController', HelpController);

    HelpController.$inject = [];

    function HelpController() {
        var vm = this;

        _activate();

        //--------- Functions Implementation ---------//

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {

            });
        }

        function _activate(){
            _setStrings();
            //Function for angularSeo
            $scope.htmlReady();
        }

    }
})();
