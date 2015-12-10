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
                TAB_REVIEWS_PENDING: "Sin revisar",
                TAB_REVIEWS_DONE: "Revisados",
                COPY_SEARCH_REVIEWS: "Revisa los comentarios que han hecho a tus actividades",
                LABEL_SEARCH_ORDERS: "Filtrar por nombre de actividad",
                COPY_EMPTY_UNREAD: "No tienes comentarios por leer",
                COPY_EMPTY_READ: "Aún no has respondido ni leído ningún comentario"
            });
        }

        function _activate() {
            _setStrings();
            _classifyReviews(reviewObjects);
        }

    }

})();
