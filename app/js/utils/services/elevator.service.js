(function(){
	'use strict';

	angular
	    .module('trulii.utils.services')
	    .factory('Elevator', Elevator);

  Elevator.$inject = ['$document'];

  function Elevator($document){

  	var Elevator = {
  		toTop: toTop,
      toBottom: toBottom,
      toElement: toElement
  	};

  	return Elevator;

  	//////////////  	

    var _defaultDuration = 1000;

  	function toTop(duration){

      var durationFinal = duration ? duration : _defaultDuration;

  		if ( $document.scrollTop() > 0)
  			$document.scrollTopAnimated(0, durationFinal, _easingFunction);
  	}

    function toBottom(duration){

        var durationFinal = duration ? duration : _defaultDuration;

        $document.scrollTopAnimated($document.height(), durationFinal, _easingFunction);
    }

    function toElement(id){

      // NOTE: this is not working actually

      var element = angular.element(id);

      $document.scrollToElementAnimated(element, _defaultDuration, _easingFunction);

    }    

    function _easingFunction(t){
      return t*(2-t); // More easing funtions in https://gist.github.com/gre/1650294
    }

  }

})();