

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
				'loaderControl': '=?',
				'isGlobal': '=' // If is true only responds to parents states						
			},
			link: function(scope, element, attrs){				
				
				if (!attrs.loaderControl){

					scope.loaderControl = scope.isGlobal ? true : false;
					
					scope.$on('$stateChangeSuccess', toggleLoader);
					scope.$on('$stateChangeStart', toggleLoader);
					scope.$on('$stateChangeError', toggleLoader);	
				}

				if (attrs.centerLoader){

					var container = element.find('.preloader-container')[0];

					container.style.margin = 0;
					container.style.position = 'relative';
					container.style.marginTop = "30%";

				}

				//////

				function toggleLoader(event, toState, toParams, fromState, fromParams){					

		            if (scope.isGlobal && toState.name.indexOf(".") == -1  || fromState.name.indexOf(".") == -1 ){  // We are changing to or from an parent state
		                scope.loaderControl = '$stateChangeSuccess' == event.name ? false : true;	
		            }

		            if (!scope.isGlobal){
		            	scope.loaderControl = '$stateChangeStart' == event.name ? true : false;
		            }


				}


			}
		}
	}

})();