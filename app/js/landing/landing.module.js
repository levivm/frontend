(function () {
    'use strict';

    angular
        .module('trulii.landing', [
            'trulii.landing.controllers',
            'trulii.landing.services'
        ]);

    angular
        .module('trulii.landing.controllers', ['ngCookies']);

    angular
        .module('trulii.landing.services', []);

})();