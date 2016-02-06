(function (){
	'use strict'

	angular.module('trulii.ui-components.directives')

	.directive('truliiInputPopover', truliiInputPopover);

	truliiInputPopover.$inject = ['$window']

	function truliiInputPopover($window){

		return {
			restrict: 'A',
			scope:{
				helpText: '='
			},
			link: function(scope, element, attrs){

				var options = {};
				var position = 'right'
				var w = angular.element($window);
				options['content'] = scope.helpText;
				options['trigger'] = 'focus';
				options['container'] = 'body';

				var title = attrs.truliiInputPopover;

				options['title'] = attrs.truliiInputPopover && attrs.truliiInputPopover != "" ? attrs.truliiInputPopover : undefined;

				options['placement'] = attrs.popoverPlacement && attrs.popoverPlacement != "" ?  attrs.popoverPlacement : _calcPosition();

				function _calcPosition(){
					console.log(w.width());
					if(w.width()<768){
						return 'top';
					}else{
						return 'right'
					}
				}
				/*
				w.bind('resize', function(){

					scope.width = $window.innerWidth;
					console.log(scope.width);
					scope.$digest();
				});
				*/
				$(element).popover(options);

/*				if (attrs.truliiInputPopover == "" || (attrs.truliiInputPopover && true)){
					element[0].focus();
				}
*/

			}
		}
	}

})();
