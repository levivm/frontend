

(function (){
	'use strict'

	angular.module('trulii.ui-components.directives')

	.directive('truliiPreloader', truliiPreloader);

	truliiPreloader.$inject = ['UIComponentsTemplatesPath']

	function truliiPreloader(UIComponentsTemplatesPath){

		return {
			restrict: 'AE',
			templateUrl: UIComponentsTemplatesPath + "preloader.html",
			scope: {				
				'isReady': '='				
			},
			link: function(scope, element, attrs){
				console.log(scope);				
			}
		}
	}

})();