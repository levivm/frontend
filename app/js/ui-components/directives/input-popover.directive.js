(function (){
	'use strict'

	angular.module('trulii.ui-components.directives')

	.directive('truliiInputPopover', truliiInputPopover);

	truliiInputPopover.$inject = []

	function truliiInputPopover(){		

		return {
			restrict: 'A',
			scope:{
				helpText: '='
			},
			link: function(scope, element, attrs){

				var options = {};

				options['content'] = scope.helpText;
				options['placement'] = 'right';
				options['trigger'] = 'focus';				
				options['container'] = 'body';

				var title = attrs.truliiInputPopover

				if (title && title != "" )
					options['title'] = title;


				$(element).popover(options);

/*				if (attrs.truliiInputPopover == "" || (attrs.truliiInputPopover && true)){
					element[0].focus(); 	
				}
*/
				
			}		
		}
	}

})();