
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

    NotFoundController.$inject = ['serverConf'];

    function NotFoundController(serverConf) {
        var vm = this;

        
         angular.extend(vm,{
            getAmazonUrl: getAmazonUrl
        });
        
        _activate();

        //--------- Functions Implementation ---------//
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        
        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                TITLE_404: "404",
                TITLE_DOES_NOT_EXISTS: "Esta página no existe...",
                COPY_DOES_NOT_EXISTS: "Creemos que la culpa es del practicante.",
                COPY_FIND_NEW_ACTIVITIES: "Ya que estamos acá ¿Quieres buscar más actividades?" 
            });
        }

        function _activate(){
            _setStrings();
        }

    }
})();
