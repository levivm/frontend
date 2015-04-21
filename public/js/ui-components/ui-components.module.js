(function () {
  'use strict';

  angular
    .module('trulii.ui-components', [
      'trulii.ui-components.directives',      
    ])

    .constant('UIComponentsTemplatesPath', "partials/ui-components/");

  angular
    .module('trulii.ui-components.directives', []);

})();