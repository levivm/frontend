(function () {
  'use strict';


  angular
    .module('trulii.utils.controllers')
    .controller('DialogModalCtrl', DialogModalCtrl);

  DialogModalCtrl.$inject = ['$scope','$modal','$http','$stateParams','$state'];
  /**
  * @namespace RegisterController
  */
  function DialogModalCtrl($scope,$modal,$http,$stateParams,$state) {
  	


  	var modalInstance = $modal.open({
  	    templateUrl:'partials/utils/base_dialog_modal.html',
  	    controller: 'ModalInstanceCtrl',
        //backdrop: 'static',
  	});

    modalInstance.result.then(function(){

      console.log("cancele");
      console.log("cancele");
      console.log("cancele");
       // modalInstance.close();
      //$state.go("home");
      

      //$state.go($state.previous.name,{reload:true});

      //var redirect_state = $stateParams.redirect_state;
      //if(redirect_state)
      //  $state.go(redirect_state);
    },function(){
        console.log("dismiss");
        $state.go("home");
    })

   



  };

  })();