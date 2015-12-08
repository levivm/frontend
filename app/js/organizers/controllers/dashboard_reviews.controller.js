/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerReviewsCtrl
 * @description Handles Organizer Review Dashboard
 * @requires organizer
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerReviewsCtrl', OrganizerReviewsCtrl);

    OrganizerReviewsCtrl.$inject = ['$q', 'reviewObjects'];
    function OrganizerReviewsCtrl($q, reviewObjects) {

        var vm = this;
        angular.extend(vm, {
            unread_reviews: [],
            read_reviews: [],
            searchUnreadQuery: "",
            searchReadQuery: ""
        });

        _activate();

        //--------- Exposed Functions ---------//

        //--------- Internal Functions ---------//

        function _classifyReviews(reviewObjects){
            vm.unread_reviews = [];
            vm.read_reviews = [];
            var deferred = $q.defer();
            var promiseArray = [];
            angular.forEach(reviewObjects, function(reviewObject){
                promiseArray.push(filterReview(reviewObject));
            });

            $q.all(promiseArray).then(function(){
                deferred.resolve();
                console.log('unread_reviews:', vm.unread_reviews);
                console.log('read_reviews:', vm.read_reviews);
            });

            return deferred.promise;

            function filterReview(reviewObject){
                if(reviewObject.review.read){
                    vm.read_reviews.push(reviewObject);
                } else {
                    vm.unread_reviews.push(reviewObject);
                }
                return true;
            }
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SAVE: "Guardar",
                TAB_REVIEWS_PENDING: "Sin revisar",
                TAB_REVIEWS_DONE: "Revisados",
                COPY_SEARCH_REVIEWS: "Revisa los comentarios que han hecho a tus actividades",
                COPY_PENDING_APPROVAL: "Comentario siendo revisado por trulii",
                COPY_COMMENT_PLACEHOLDER: "Escribe aqui tu respuesta al comentario",
                COPY_REPORT_DISCLAIMER: "Al reportar un comentario como inapropiado este será revisado por el "
                    + "equipo de Trulii para ser retirado público. Próximamente la enviaremos un correo con"
                    + " el resultado de nuestra evaluación",
                LABEL_SEARCH_ORDERS: "Filtrar por nombre de actividad",
                LABEL_REPORT_BUTTON: "Reportar",
                LABEL_REPLY_BUTTON: "Responder",
                LABEL_CANCEL_BUTTON: "Cancelar",
                LABEL_CONTINUE_BUTTON: "Continuar"
            });
        }

        function _activate() {
            _setStrings();
            _classifyReviews(reviewObjects);
        }

    }

})();
