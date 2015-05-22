

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
  			weSaved: weSaved  			
  		},
      setPosition: setPosition
  	}

  	return Toast;

  	//////////////  	

  	function weSaved(complement){
  		toastr.info( complement, "¡Información guardada!");   // TODO: From translate
  	}
    function setPosition(classPos){
      toastr.options["positionClass"] = classPos;

    }


  	function _initialize(){
      // var progressBar = progressBar ? progressBar : true;
      // var timeOut = timeout ? timeout : "3500";
      // var positionClass = positionClass ? positionClass : "toast-bottom-right";
  		toastr.options = {
	  		"progressBar": true,
	  		"timeOut": "3500",
	  		"positionClass": "toast-bottom-right",
	  	}
  	}

  }

})()