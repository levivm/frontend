

(function (){
	'use strict'

	angular.module('trulii.ui-components.directives')

	.directive('truliiExpandableContent', truliiExpandableContent);

	truliiExpandableContent.$inject = ['UIComponentsTemplatesPath']

	function truliiExpandableContent(UIComponentsTemplatesPath){

		return {
			restrict: 'AE',		
			scope: {
				toggle: "=?"
			},			
			link: function(scope, element, attrs){				
				
				element[0].style.display = "none";				

				function expand(){					
					element.slideDown("fast");										
				}

				function retract(){					
					element.slideUp("fast");										
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