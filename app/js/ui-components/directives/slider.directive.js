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
                max: '=',
                step : '=',
                update: '&',
                stopDrag: '&'
            },
            link: function (scope, element, attrs) {
                var slider = document.getElementById('slider-anchor');
                var options = {
                    start: [scope.start, scope.end],
                    step: scope.step,
                    margin: 50,
                    connect: true,
                    direction: 'ltr',
                    orientation: 'horizontal',
                    behaviour: 'drag-tap',
                    range: {
                        min: scope.min,
                        max: scope.max
                    }
                };
                scope.currency = "COP ";
                scope.more = '+';

                noUiSlider.create(slider, options);

                slider.noUiSlider.on('update', function( values, handle ) {
                    //console.log('slider update:', values[handle], handle);
                    // $timeout is used to hook 'update' event inside angular digest cycle
                    $timeout(function(){
                        if (handle) {
                            // Is moving end handle
                            scope.end =  parseInt(values[handle]);
                            // scope.end = parseInt(values[handle]);
                        } else {
                            // Is moving the start handle
                            scope.start = parseInt(values[handle]);
                        }
                        scope.$apply(scope.update({ 'start': scope.start, 'end': scope.end}));
                    }, 0);
                });

                slider.noUiSlider.on('change', function(){
                    $timeout(function(){
                        scope.$apply(scope.stopDrag());
                    }, 0);
                });
            }
        }
    }

})();
