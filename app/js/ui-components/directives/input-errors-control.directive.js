
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

                scope.$watch('field.$valid', function(newValue, oldValue){       

                    var s = scope;             

                    if (newValue === false){
                        element.addClass("has-error");
                        scope.message = scope.errors[scope.field.$name];
                    }else{
                        element.removeClass("has-error");
                    }
                })
                
            }
        }
    }

})();