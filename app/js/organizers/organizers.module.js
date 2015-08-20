(function () {
  'use strict';

  angular
    .module('trulii.organizers', [
      'trulii.organizers.controllers',
      'trulii.organizers.services',
      //'trulii.organizers.directives'
    ]);



  angular
    .module('trulii.organizers.controllers',['angularFileUpload']);

  angular
    .module('trulii.organizers.services', ['ngCookies']);

  // angular
  //  .module('trulii.organizer.directives',[]);

})();