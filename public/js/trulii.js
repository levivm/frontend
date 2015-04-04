(function () {
  'use strict';



	angular
	.module('trulii', [
	  'ui.bootstrap',
	  'LocalStorageModule',
	  'trulii.config',
	  'trulii.routes',
	  'trulii.authentication',
	  'trulii.organizers',
	  'trulii.activities',
	  'trulii.locations',
	  'trulii.landing',
    'trulii.utils'

	]);


	angular
  	.module('trulii.config',[]);

	angular
	.module('trulii.routes',['ui.router']);




	angular
	  .module('trulii')
	  .run(run);

	run.$inject = ['$rootScope','$http','$cookies','Authentication','LocationManager'];








	/**
	* @name run
	* @desc Update xsrf $http headers to align with Django's defaults
	*/
	function run($rootScope,$http,$cookies,Authentication,LocationManager) {


		//$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];





	    // $rootScope.$watch(function() { return $cookies.authenticatedAccount	;}, function(newValue,oldValue) {
	    // 	if ($cookies.authenticatedAccount == null){
	    // 		if (newValue!=oldValue){  
		   //  		Authentication.logout();
		   //  		console.log('aqui hago logout');

	    // 		}

	    // 	}
	    // });

	  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
	  $http.defaults.xsrfCookieName = 'csrftoken';
	}

})();



