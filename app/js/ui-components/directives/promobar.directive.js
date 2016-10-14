(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')
        .directive('promoBar', promoBar);

    promoBar.$inject = ['$state', 'UIComponentsTemplatesPath', 'Analytics'];

    function promoBar($state, UIComponentsTemplatesPath, Analytics) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "promobar.html",
            scope: {
                message: '@',
                url: '@',
                messageurl: '@',
                size: '@'
            },
            link: function (scope, element, attrs) {
                scope.clickUrl = function(){
                    Analytics.generalEvents.promoBar($state.current.url);
                }
            }
        }
    }

})();