(function () {
    'use strict';

    angular
        .module('trulii.organizers', [
            'trulii.organizers.controllers',
            'trulii.organizers.services',
            'trulii.organizers.directives'
        ])
        .constant('OrganizersTemplatesPath', "partials/organizers/");

    angular
        .module('trulii.organizers.controllers', ['angularFileUpload']);

    angular
        .module('trulii.organizers.services', ['ngCookies']);

     angular
      .module('trulii.organizers.directives',[]);

})();