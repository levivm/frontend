

// Toast library https://github.com/CodeSeven/toastr

(function(){
	'use strict'

	angular
	    .module('trulii.ui-components.services')
	    .factory('Toast', Toast);

  Toast.$inject = ['$document'];

  function Toast($document){

  	_initialize();

  	var Toast = {
  		info: toastr.info,
  		success: toastr.success,
  		error: toastr.error,
  		warning: toastr.warning,

  		generics: {
  			weSave: weSave  			
  		}
  	}

  	return Toast;

  	//////////////  	

  	function weSave(complement){
  		toastr.info( complement, "¡Información guardada!");   // TODO: From translate
  	}

  	function _initialize(){
  		toastr.options = {
	  		"progressBar": true,
	  		"timeOut": "3500",
	  		"positionClass": "toast-bottom-right",
	  	}
  	}

  }

})()