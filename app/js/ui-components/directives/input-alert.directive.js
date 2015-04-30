
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
			}
		}
	}

})();