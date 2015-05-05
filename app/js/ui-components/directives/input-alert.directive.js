
(function (){
	'use strict'

	angular.module('trulii.ui-components.directives')

	.directive('truliiInputAlert', truliiInputAlert);

	truliiInputAlert.$inject = ['UIComponentsTemplatesPath']

	function truliiInputAlert(UIComponentsTemplatesPath){

		return {
			restrict: 'AE',
			templateUrl: UIComponentsTemplatesPath + "input-alert.html",
			scope: {				
				field: '=',
				errors: '='
			}, 
			link: function(scope, element, attrs){

				var breakdown = attrs.field.split('.');

				var fieldName = breakdown[breakdown.length - 1];

				scope.$watch('errors', function(newValue, oldValue){

					if (newValue){
						scope.message = scope.errors[fieldName];		
					}
				})
				
			}
		}
	}

})();