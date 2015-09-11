
/**
 * @ngdoc controller
 * @name trulii.landing.controllers.HomeController
 * @description HomeController
 * @requires trulii.activities.services.ActivitiesManager
 */

(function () {
    'use strict';

    angular
        .module('trulii.landing.controllers')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['ActivitiesManager'];

    function HomeController(ActivitiesManager) {

        var vm = this;
        angular.extend(vm, {
            activities : [],
            options : {
                actions: ['view', 'edit', 'contact', 'manage', 'republish']
            }
        });

        _activate();

        //--------- Internal Functions ---------//

        function _getActivities(){
            ActivitiesManager.getActivities().then(success, error);

            function success(response){
                vm.activities = response;
            }
            function error(response){
                console.log('getActivities. Error obtaining Activities from ActivitiesManager');
            }
        }

        //function _setStrings(){
        //    if(!vm.strings){ vm.strings = {}; }
        //    angular.extend(vm.strings, {});
        //}

        function _activate(){
            //_setStrings();
            _getActivities();
        }

    }
})();