(function () {
  'use strict';

  angular
    .module('trulii.locations', [
      'trulii.locations.services'
    ]);

  angular
    .module('trulii.locations.services', ['ngCookies']);

})();