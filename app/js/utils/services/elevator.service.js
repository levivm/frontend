(function(){
	'use strict';

	angular
	    .module('trulii.utils.services')
	    .factory('Elevator', Elevator);

  Elevator.$inject = ['$document'];

  function Elevator($document){

  	var Elevator = {
  		toTop: toTop
  	};

  	return Elevator;

  	//////////////  	

  	function toTop(){

  		if ( $document.scrollTop() > 0)
  			$document.scrollTopAnimated(0, 1000, 
          function (t) { return t*(2-t); // Easing funtions in https://gist.github.com/gre/1650294
        });
  	}

  }

})();