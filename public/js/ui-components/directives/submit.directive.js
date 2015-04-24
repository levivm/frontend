
(function (){
	'use strict'

	angular.module('trulii.ui-components.directives')

	.directive('truliiSubmitControls', truliiSubmitControls);

	truliiSubmitControls.$inject = ['UIComponentsTemplatesPath']

	function truliiSubmitControls(UIComponentsTemplatesPath){

		return {
			restrict: 'AE',
			templateUrl: UIComponentsTemplatesPath + "submit-controls.html",
			scope: {				
				toggle: '='
			}, 
			
			link: function(scope, element, attrs){

				var btn = element.find(".btn-success")[0];
				var progress = element.find(".progress");

				progress.removeClass("hidden");

				btn.addEventListener("click", onSubmit);

				function onSubmit(event){

					scope.toggle = true;
				}

				
			}
		}
	}

})();