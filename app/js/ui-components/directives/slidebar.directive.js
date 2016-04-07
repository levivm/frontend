(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')
        .directive('truliiSlidebar', truliiSlidebar);

    truliiSlidebar.$inject = ['UIComponentsTemplatesPath', 'serverConf'];

    function truliiSlidebar(UIComponentsTemplatesPath, serverConf) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "slidebar.html",
            scope: {
                title: '@',
                header: '@',
                body: '=',
                show:   '='
            },
            link: function (scope, element, attrs) {
                scope.toggleShow = function(){
                    scope.show = !scope.show;
                };
                scope.getAmazonUrl = function(file){
                    return  serverConf.s3URL + '/' +  file;
                };
            }
        }
    }

})();