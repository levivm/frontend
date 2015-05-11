(function () {
  'use strict';

  angular
    .module('trulii.ui-components', [
      'trulii.ui-components.directives',      
      'trulii.ui-components.services',
      'trulii.ui-components.controllers',
    ])

    .constant('UIComponentsTemplatesPath', "partials/ui-components/");

  angular
    .module('trulii.ui-components.directives', []);

  angular
    .module('trulii.ui-components.services', []);

  angular
    .module('trulii.ui-components.controllers', []);

})();