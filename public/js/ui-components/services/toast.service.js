

(function(){
	'use strict'

	angular
	    .module('trulii.ui-components.services')
	    .factory('Toast', Toast);

  Toast.$inject = ['$document'];

  function Toast($document){

  	var Toast = {
  		info: toastr.info,
  		success: toastr.success,
  		error: toastr.error,

  		generics: {
  			weSave: weSave
  		}
  	}

  	return Toast;

  	//////////////  	

  	function weSave(){
  		toastr.info("¡Información guardada!");   // TODO: From translate
  	}

  }

})()