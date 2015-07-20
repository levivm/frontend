
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

                scope.form = formCtrl;

                scope.$watch('field.$invalid && !field.$dirty', function(newValue, oldValue){
                    //console.group("$watch. fieldName: ", scope.field.$name);
                    //console.log('scope.field:', scope.field);
                    //console.log('$invalid:', scope.field.$invalid);
                    //console.log('$dirty:', scope.field.$dirty);
                    //console.log('newValue:', newValue, 'oldValue:', oldValue);
                    //console.log('formField:', scope.field);
                    console.groupEnd();
                    if(!scope.field){
                        console.log('watch. field non existent');
                    } else if (newValue === true){
                        element.addClass("has-error");                        
                    }else{
                        scope.field.$setValidity(scope.field.$name, true);
                        element.removeClass("has-error");
                    }
                });
                
            }
        }
    }

})();