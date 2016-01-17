(function () {
  'use strict';

  angular
    .module('trulii.utils.directives')
    .directive('elastic',elastic);

    elastic.$inject = ['$timeout'];

    function elastic($timeout){

        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };

    }


})();
