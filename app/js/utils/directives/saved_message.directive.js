/**
* Authentication
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('trulii.utils.directives')




    .directive('ngSavedmessage',ngSavedmessage);

    ngSavedmessage.$inject = ['$timeout'];

    function ngSavedmessage($timeout){

      return {
        restrict: 'A',
        require: '^ngModel',
        scope: {
            message: '@',
            ngModel: '=',
        },
        template: '{{message}}',
        link: function(scope, iElement, iAttrs, ctrl) {
            scope.$watch('ngModel',function(oldValue,newVal) {
                if(oldValue!=newVal) { 
                    var timer = $timeout(function() {
                        scope.ngModel = true;
                      }, 1000);
                }
                

            });
        }
      }


    }

})();