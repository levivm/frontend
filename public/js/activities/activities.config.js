(function () {
  'use strict';

  angular
    .module('trulii.activities.config')
    .config(config);


 	config.$inject = ['uiGmapGoogleMapApiProvider'];

	function config(uiGmapGoogleMapApiProvider) {

	    uiGmapGoogleMapApiProvider.configure({
	        //    key: 'your api key',
	        v: '3.17',
	        libraries: 'weather,geometry,visualization'
	    });
	}

})();