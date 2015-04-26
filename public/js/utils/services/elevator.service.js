(function(){
	'use strict'

	angular
	    .module('trulii.utils.services')
	    .factory('Elevator', Elevator);

  Elevator.$inject = ['$document'];

  function Elevator($document){

  	var Elevator = {
  		toTop: toTop
  	}

  	return Elevator;

  	//////////////  	

  	function toTop(){

  		if ( $document.scrollTop() > 0)
  			$document.scrollTop(0, 1000);
  	}

  }

})()