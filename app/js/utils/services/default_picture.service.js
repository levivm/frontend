/**
 * @ngdoc service
 * @name trulii.utils.services.defaultPicture
 * @description Default Picture URL
 */

(function () {
    'use strict';

    angular
        .module('trulii.utils.services')
        .value("defaultPicture", "https://s3-us-west-2.amazonaws.com/trulii-dev/static/img/default_profile_pic.jpg");

})();