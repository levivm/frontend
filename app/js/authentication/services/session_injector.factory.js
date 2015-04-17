/**
* Authentication
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('trulii.authentication.services')
    .factory('sessionInjector', sessionInjector);

  sessionInjector.$inject = ['localStorageService'];

  /**
  * @namespace sessionInjector
  * @returns {Factory}
  */
  function sessionInjector(localStorageService) {

  	var sessionInjector = {
  		request: function(config){
        var token = localStorageService.get('token');   
  			if(token){
          config.headers['Authorization'] = "Token " + token;
        }
           
        return config;

  		}





  	};

  	return sessionInjector;
  	

  }



})();