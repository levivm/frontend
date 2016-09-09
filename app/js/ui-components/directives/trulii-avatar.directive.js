/**
 * @ngdoc directive
 * @name trulii.ui-components.directives.truliiAvatar
 * @description truliiAvatar
 */

(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')
        .directive('truliiAvatar', truliiAvatar);

    truliiAvatar.$inject = ['UIComponentsTemplatesPath'];

    function truliiAvatar(UIComponentsTemplatesPath) {
        return {
            restrict: 'AE',
            scope: {
				user: "=",
                size:'@',
                avatarClass: '@'
			},	
            templateUrl: UIComponentsTemplatesPath + "trulii-avatar.html",
            link: function (scope, element, attrs) {

                var colors = [
                    { hex:'#ff5a5f'},
                    { hex:'#b75c8b'},
                    { hex:'#e5cb52'},
                    { hex:'#b0ca64'},
                    { hex:'#808cd1'},
                    { hex:'#d3304e'},
                    { hex:'#32a3d7'},
                    { hex:'#173770'},
                    { hex:'#32cdda'},
                    { hex:'#00e2aa'}
                ];
                _activate();
                

                //--------- Internal Functions ---------//

               
                
                function _setAvatar() {
                    var name='';
                    if(scope.user){
                       if(!scope.user.photo){
                            if(!scope.user.user || scope.user.is_organizer){
                                name= scope.user.name;
                            }else{
                                name = scope.user.user.first_name;
                            }
                            scope.initial =name.substring(0,1);
                            element.css('background', colors[scope.user.id % 10].hex);
                            element.css('border-radius', '50%');
                            element.css('width', scope.size + 'px');
                            element.css('height', scope.size + 'px');
                            element.css('display', 'block');
                        } 
                    }
                    
                }

                function _activate() {
                    _setAvatar();
                    scope.$watch('user', function(newVal, oldVal){scope.user = newVal; _setAvatar()});
                }
            }
        }
    }

})();