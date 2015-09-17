
(function (){
	'use strict';

	angular.module('trulii.ui-components.directives')

	.directive('truliiSubmitControls', truliiSubmitControls);

	truliiSubmitControls.$inject = ['$timeout', '$window', 'UIComponentsTemplatesPath'];

	function truliiSubmitControls($timeout, $window, UIComponentsTemplatesPath){

		return {
			restrict: 'AE',
			templateUrl: UIComponentsTemplatesPath + "submit-controls.html",
			transclude: true,
			scope: {				
				isSaving: '=',
				cancelActive: '='
				//value: '=?'
			}, 
			
			link: function(scope, element, attrs){

				if (scope.value == undefined){  // Si el atributo value no es una variable 

					if (attrs.value)					
						scope.value = attrs.value;
					else
						scope.value = "Guardar"; // TODO: Debería tomarse de las cadenas de translate

				}				

		        var btn = element.find(".btn-success")[0];

		        btn.addEventListener("click", onSubmit);
		        scope.cancelAction = cancelDefaultResponse;

		        ///////////////// 

				function onSubmit(event){
					scope.isSaving = true;
				}												

				function cancelDefaultResponse(event){

					$window.history.back();
				}
			}		
		}
	}

})();