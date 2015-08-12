(function () {
  'use strict';

    /**
     * @ngdoc object
     * @name trulii
     * @description Trulii Main Module
     */
	angular
	.module('trulii', [
	  'ngAnimate',
	  'ui.bootstrap',
	  'LocalStorageModule',
	  'trulii.config',
	  'trulii.routes',
	  'trulii.authentication',
	  'trulii.ui-components',
	  'trulii.organizers',
	  'trulii.students',
	  'trulii.activities',
	  'trulii.locations',
	  'trulii.landing',
	  'trulii.search',
    'trulii.utils'
	]);

	angular
  	.module('trulii.config',['facebook']);

	angular
	.module('trulii.routes',['ui.router', 'trulii.routes.config']);

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
		//$('[data-toggle=tooltip]').tooltip();

		$http.defaults.xsrfHeaderName = 'X-CSRFToken';
	  $http.defaults.xsrfCookieName = 'csrftoken';
	}

})();



