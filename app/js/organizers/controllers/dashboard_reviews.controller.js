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

    OrganizerReviewsCtrl.$inject = ['$q', 'reviewObjects', 'Toast', 'unreadReviewsCount'];
    function OrganizerReviewsCtrl($q, reviewObjects, Toast, unreadReviewsCount) {

        var vm = this;
        angular.extend(vm, {
            unread_reviews: [],
            read_reviews: [],
            searchUnreadQuery: "",
            searchReadQuery: "",
            changeReviewStatus: changeReviewStatus
        });

        _activate();

        //--------- Exposed Functions ---------//

        function changeReviewStatus(reviewObject){
            var readReviewObject = _.remove(vm.unread_reviews, removeById)[0];
            vm.read_reviews.push(reviewObject);
            unreadReviewsCount.count += -1;
            Toast.success(vm.strings.COPY_REVIEW_READ);

            function removeById(unreadReviewObject){
                return unreadReviewObject.review.id === reviewObject.review.id;
            }
        }


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
                COPY_EMPTY_READ: "Aún no has respondido ni leído ningún comentario",
                COPY_REVIEW_READ: "Su comentario fue movido a revisados."
            });
        }

        function _activate() {
            _setStrings();
            _classifyReviews(reviewObjects);
        }

    }

})();
