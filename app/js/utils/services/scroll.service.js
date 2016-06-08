/**
 * @ngdoc service
 * @name trulii.utils.services.Scroll
 * @description Window Scroll Service
 * @requires ng.$window
 * @requires ng.$rootScope
 */


(function () {
    'use strict';

    angular
        .module('trulii.utils.services')
        .factory('Scroll', Scroll);

    Scroll.$inject = ['$window', '$rootScope'];

    function Scroll($window, $rootScope) {
        var scroll = 0;

        angular.element($window).bind('scroll ', function () {
          scroll = window.scrollY;
          $rootScope.$broadcast('scrolled', scroll);
        });

        angular.element($window).bind('resize', function () {
            $rootScope.$broadcast('resized');
        });
        

        return scroll;

    }

})();
