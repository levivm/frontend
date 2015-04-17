(function () {
  'use strict';

  angular
    .module('trulii.landing', [
      'trulii.landing.controllers',
      //'trulii.landing.directives'
    ]);

  angular
    .module('trulii.landing.controllers', ['ngCookies']);

  // angular
  //  .module('trulii.organizer.directives',[]);

})();