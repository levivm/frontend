

(function (){
	'use strict'

	angular.module('trulii.ui-components.directives')

	.directive('truliiExpandableContent', truliiExpandableContent);

	truliiExpandableContent.$inject = ['UIComponentsTemplatesPath']

	function truliiExpandableContent(UIComponentsTemplatesPath){

		return {
			restrict: 'AE',		
			scope: {
				toggle: "=?",
				duration: "=?"
			},			
			link: function(scope, element, attrs){				

				scope.duration = scope.duration || "fast";
				
				element[0].style.display = "none";				

				function expand(){					
					element.slideDown(scope.duration);										
				}

				function retract(){					
					element.slideUp(scope.duration);										
				}

				if (attrs.toggle != undefined){

					if (scope.toggle)
						expand();

					scope.$watch("toggle", function(newValue, oldValue){

						if (newValue)
							expand();

						if (!newValue)
							retract();
					});
				}else{
					expand();	
				}

				/*element.on("$destroy", function(e){

					retract();
				});*/

				
			}
			

		}
	}

})();