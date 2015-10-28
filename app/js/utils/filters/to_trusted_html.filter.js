(function () {
  'use strict';

  angular
    .module('trulii.utils.filters')


    .filter('toTrustedHTML',toTrustedHTML);

    toTrustedHTML.$inject = ['$sce'];

    function toTrustedHTML($sce){

    	function applySce(text){
			return $sce.trustAsHtml(text);
    	}

        return applySce;

    }

})();