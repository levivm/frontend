-/**
 * ModalInstanceCtrl
 * @namespace thinkster.authentication.controllers
 */
    (function () {
        'use strict';

        angular
            .module('trulii.utils.controllers')
            .controller('ModalInstanceCtrl', function ($scope, $modalInstance, $state) {

                var vm = this;
                vm.strings = {};
                vm.strings.REQUEST_SIGNUP_TITLE = "Solicitud de Registro";
                vm.strings.REQUEST_SIGNUP_SUCCESS_MSG = "Su solicitud de registro fue procesada existosamente";
                vm.strings.REQUEST_SIGNUP_SUCCESS_MSG += ". Pronto le enviaremos un correo de confirmación";


                $scope.ok = function () {
                    $modalInstance.close();
                };

                $scope.cancel = function () {

                    // //$state.go('modal-dialog.login');

                    // //console.log("cancel twicce");
                    $modalInstance.dismiss('cancel');
                    // $state.go('home');
                    // //$modalInstance.dismiss('cancel');

                    // //$state.go($state.previous,{reload:true});
                    // //console.log($state.previous,"pre");
                    // //$state.reload();
                    // $state.go($state.previous.name,{reload:true});
                    // if($state.previous !== undefined && !$state.previous.abstract){


                    // 	$state.go($state.previous.name,{reload:true});
                    // 	//$modalInstance.close();
                    // 	//$modalInstance.close();
                    // 	//$state.go('modal-dialog.login',{reload:true});
                    // 	//state.reload();
                    // }

                    // if($state.previous.abstract)
                    // 	$state.go('home');
                };
            });


    })();