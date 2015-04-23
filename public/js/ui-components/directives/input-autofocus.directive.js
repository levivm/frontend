

(function (){
	'use strict'

	angular.module('trulii.ui-components.directives')

	.directive('truliiInputAutofocus', truliiInputAutofocus);

	truliiInputAutofocus.$inject = []

	function truliiInputAutofocus(){

		return {
			restrict: 'A',
			link: function(scope, element, attrs){

				if (attrs.truliiInputAutofocus == "" || (attrs.truliiInputAutofocus && true)){
					element[0].focus(); 	
				}
				
			}		
		}
	}

})();