(function () {
  'use strict';

  angular
    .module('trulii.students', [
      'trulii.students.controllers',
      'trulii.students.services',
    ]);



  angular
    .module('trulii.students.controllers',['angularFileUpload']);

  angular
    .module('trulii.students.services',[]);

})();