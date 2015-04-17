(function () {
  'use strict';

  angular
    .module('trulii.locations', [
      'trulii.locations.services',
      //'trulii.locations.directives'
    ]);

  angular
    .module('trulii.locations.services', ['ngCookies']);

  // angular
  //  .module('trulii.organizer.directives',[]);

})();