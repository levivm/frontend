

(function (){
	'use strict'

	angular.module('trulii.ui-components.directives')

	.directive('truliiPreloader', truliiPreloader);

	truliiPreloader.$inject = ['UIComponentsTemplatesPath', '$rootScope']

	function truliiPreloader(UIComponentsTemplatesPath, $rootScope){

		return {
			restrict: 'AE',
			templateUrl: UIComponentsTemplatesPath + "preloader.html",
			scope: {				
				'loaderControl': '=',
				'isGlobal': '=', // If true only responds to parents states				
			},
			link: function(scope, element, attrs){

				scope.loaderControl = false;
				
				$rootScope.$on('$stateChangeSuccess', toggleLoader);
				$rootScope.$on('$stateChangeStart', toggleLoader);
				$rootScope.$on('$stateChangeError', toggleLoader);

				//////

				function toggleLoader(event, toState, toParams, fromState, fromParams){

		            if (scope.isGlobal && toState.name.indexOf(".") == -1  || fromState.name.indexOf(".") == -1 ){  // We are changing to or from an parent state
		                scope.loaderControl = !scope.loaderControl;
		            }

		            if (!scope.isGlobal){
		            	scope.loaderControl = !scope.loaderControl;
		            }


				}


			}
		}
	}

})();