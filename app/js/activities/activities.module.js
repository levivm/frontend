(function () {
  'use strict';

  angular
    .module('trulii.activities', [
      'uiGmapgoogle-maps',
      'youtube-embed',
      'trulii.activities.config',
      'trulii.activities.controllers',
      'trulii.activities.services',
      'trulii.activities.directives'
    ])
    .constant('ActivitiesTemplatesPath', "partials/activities/");

  angular
    .module('trulii.activities.config',[]);

  angular
    .module('trulii.activities.controllers',['ngTagsInput']);

  angular
    .module('trulii.activities.services', ['ngCookies']);

  angular
    .module('trulii.activities.directives', []);
})();