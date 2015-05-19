
(function (){
    'use strict'

    angular.module('trulii.ui-components.directives')

    .directive('truliiInputErrorsControl', truliiInputErrorsControl);

    truliiInputErrorsControl.$inject = ['UIComponentsTemplatesPath']

    function truliiInputErrorsControl(UIComponentsTemplatesPath){

        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "input-errors-control.html",
            transclude: true,
            scope: {                
                field: '=',
                errors: '='
            }, 
            link: function(scope, element, attrs){

                var breakdown = attrs.field.split('.');

                var fieldName = breakdown[breakdown.length - 1];

                scope.$watch('errors', function(newValue, oldValue){

                    if (newValue != oldValue){
                        element.addClass("has-error");
                    }
                })
                
            }
        }
    }

})();