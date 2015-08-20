(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')

        .directive('truliiPreloader', truliiPreloader);

    truliiPreloader.$inject = ['$rootScope', 'UIComponentsTemplatesPath'];
    function truliiPreloader($rootScope, UIComponentsTemplatesPath) {

        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "preloader.html",
            scope: {
                'loaderControl': '=?',
                'isGlobal': '=' // If is true only responds to parents states
            },
            link: function (scope, element, attrs) {

                if (!attrs.loaderControl) {
                    scope.loaderControl = scope.isGlobal ? true : false;
                    $rootScope.$on('$stateChangeSuccess', toggleLoader);
                    $rootScope.$on('$stateChangeStart', toggleLoader);
                    $rootScope.$on('$stateChangeError', toggleLoader);
                    $rootScope.$on('$stateChangeCancel', toggleLoader);
                }

                if (attrs.centerLoader){
                    var container = element.find('.preloader-container')[0];
                    container.style.margin = 0;
                    container.style.position = 'relative';
                    container.style.marginTop = "30%";
                }

                //--------- Functions Implementation ---------//

                function toggleLoader(event, toState, toParams, fromState, fromParams) {
                    if (scope.isGlobal) {
                        scope.loaderControl = '$stateChangeStart' == event.name;
                    }

                    if (!scope.isGlobal) {
                        scope.loaderControl = '$stateChangeStart' == event.name;
                    }
                }


            }
        }
    }

})();