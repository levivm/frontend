/**
 * @ngdoc service
 * @name trulii.authentication.services.sessionInjector
 * @description Session Injector Service
 * @requires LocalStorageModule.localStorageService
 */

(function () {
  'use strict';

  angular
    .module('trulii.authentication.services')
    .factory('sessionInjector', sessionInjector);

  sessionInjector.$inject = ['localStorageService'];

  function sessionInjector(localStorageService) {

  	//noinspection UnnecessaryLocalVariableJS
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