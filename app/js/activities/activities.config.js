(function () {
  'use strict';

  angular
    .module('trulii.activities.config', ['textAngular'])
    .config(config);


 	config.$inject = ['uiGmapGoogleMapApiProvider', '$provide'];

	function config(uiGmapGoogleMapApiProvider, $provide) {

  //decorator for edit toolbar of AngularText
    $provide.decorator('taOptions', [
       'taRegisterTool',
       '$delegate',
       function (taRegisterTool, taOptions) {

            taOptions.toolbar = [
                 ['bold', 'italics', 'underline',  'ul', 'ol', 'redo', 'undo']
             ];
           return taOptions;
       }]);

	    uiGmapGoogleMapApiProvider.configure({
	        //    key: 'your api key',
	        v: '3.17',
	        libraries: 'weather,geometry,visualization'
	    });

	}

})();
