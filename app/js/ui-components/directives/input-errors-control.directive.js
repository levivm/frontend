
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
            require: '^form',
            scope: {                
                field: '=?',                
                errors: '=?' // Not yet supported :/
            }, 
            link: function(scope, element, attrs, formCtrl ){
                

                if (scope.field === undefined)
                    scope.field = formCtrl[attrs.truliiInputErrorsControl] || formCtrl[attrs.fieldName] ; 

                scope.$watch('field.$invalid && !field.$dirty', function(newValue, oldValue){                               

                    if (newValue === true){
                        element.addClass("has-error");                        
                    }else{
                        element.removeClass("has-error");
                    }
                })
                
            }
        }
    }

})();