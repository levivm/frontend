/**
 * @ngdoc directive
 * @name trulii.ui-components.directives.truliiGallery
 * @description truliiGallery
 */

(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')
        .directive('truliiGallery', truliiGallery);

    truliiGallery.$inject = ['UIComponentsTemplatesPath'];

    function truliiGallery(UIComponentsTemplatesPath) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "gallery.html",
            link: function (scope, element, attrs) {

                _activate();

                //--------- Internal Functions ---------//

                function _setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {

                    });
                }

                function _activate() {
                    _setStrings();

                }
            }
        }
    }

})();