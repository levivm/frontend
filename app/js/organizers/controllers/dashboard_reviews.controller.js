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

    OrganizerReviewsCtrl.$inject = ['$q', 'activities', 'reviews', 'organizer'];
    function OrganizerReviewsCtrl($q, activities, reviews, organizer) {

        var vm = this;
        angular.extend(vm, {
            reviews: [],
            getReviewActivity: getReviewActivity
        });

        _activate();

        //--------- Exposed Functions ---------//

        function getReviewActivity(review){
            var activity = activities.filter(filterActivity)[0];
            return activity;

            function filterActivity(activityFilter){
                return activityFilter.id === review.activity;
            }
        }

        //--------- Internal Functions ---------//

        function _setReviews(){
            var deferred = $q.defer();
            var promiseArray = [];
            activities.map(function(activity){
                promiseArray.push(mapReview(activity));
            });

            $q.all(promiseArray).then(function(){
                deferred.resolve();
            });

            return deferred.promise;

            function mapReview(activity){
                activity.review = reviews.filter(filterReview)[0];

                function filterReview(review){
                    return review.activity === activity.id;
                }
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
            _setReviews().then(function(){
                vm.reviews = reviews;
            });
        }

    }

})();
