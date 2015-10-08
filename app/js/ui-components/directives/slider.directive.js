/**
 * @ngdoc controller
 * @name trulii.ui-components.directives.truliiSlider
 * @description Slider Directive
 */

(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')

        .directive('truliiSlider', truliiSlider);

    truliiSlider.$inject = ['$timeout', 'UIComponentsTemplatesPath'];

    function truliiSlider($timeout, UIComponentsTemplatesPath) {

        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "slider.html",
            scope: {
                start: '=',
                end: '=',
                min: '=',
                max: '='
            },
            link: function (scope, element, attrs) {
                var slider = document.getElementById('slider-anchor');
                var options = {
                    start: [scope.start, scope.end],
                    step: 10000,
                    margin: 50,
                    connect: true,
                    direction: 'ltr',
                    orientation: 'horizontal',
                    behaviour: 'tap-drag',
                    range: {
                        min: scope.min,
                        max: scope.max
                    }
                };

                noUiSlider.create(slider, options);

                slider.noUiSlider.on('update', function( values, handle ) {
                    //console.log('slider update:', values[handle], handle);
                    // $timeout is used to hook 'update' event inside angular digest cycle
                    $timeout(function(){
                        if (handle) {
                            // Is moving end handle
                            scope.end = parseInt(values[handle]);
                        } else {
                            // Is moving the start handle
                            scope.start = parseInt(values[handle]);
                        }
                    }, 0);
                });
            }
        }
    }

})();