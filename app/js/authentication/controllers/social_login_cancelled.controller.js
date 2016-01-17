-/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.authentication.controllers')
    .controller('SocialLoginCancelledCtrl', SocialLoginCancelledCtrl);

  SocialLoginCancelledCtrl.$inject = ['$scope','$modal','$http',];
  /**
  * @namespace RegisterController
  */
  function SocialLoginCancelledCtrl($scope,$modal,$http) {

    var modalInstance = $modal.open({
      templateUrl: 'partials/socialaccount_login_cancelled.html',
      controller: 'ModalInstanceCtrl',
      controllerAs:'modal',

    });

  };

  })();