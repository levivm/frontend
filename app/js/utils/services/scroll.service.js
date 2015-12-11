(function () {
    'use strict';

    angular
        .module('trulii.utils.services')
        .factory('Scroll', Scroll);

    Scroll.$inject = ['$window', '$rootScope'];

    function Scroll($window, $rootScope) {

        var scroll = 0;

        angular.element(document).ready(function () {
            scroll = window.scrollY;
            $window.onscroll = function(){
                scroll = window.scrollY;
                $rootScope.$broadcast('scrolled', scroll);
            };
        });

        return scroll;

    }

})();
