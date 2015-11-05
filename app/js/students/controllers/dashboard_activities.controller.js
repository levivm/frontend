/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentActivitiesCtrl
 * @description Handles Student Activities Dashboard
 * @requires activities
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentActivitiesCtrl', StudentActivitiesCtrl);

    StudentActivitiesCtrl.$inject = ['$q', 'activities', 'reviews', 'orders', 'student'];

    function StudentActivitiesCtrl($q, activities, reviews, orders, student) {

        var vm = this;
        angular.extend(vm, {
            open_activities: [],
            closed_activities: [],
            options : {
                actions: ["contact"]
            },
            getReviewByActivityId: getReviewByActivityId
        });

        _activate();

        //--------- Exposed Functions ---------//

        function getReviewByActivityId(activityId){
            var review = reviews.filter(filterById)[0];
            console.log('getReviewByActivityId', review);
            if(review){
               return review;
            } else {
                return {};
            }

            function filterById(review){ return review.activity.id === activityId; }
        }

        //--------- Internal Functions ---------//

        function _assignActivities(){
            vm.open_activities = [];
            vm.closed_activities = [];
            angular.forEach(activities, filterActivity);

            function filterActivity(activity){
                var deferred = $q.defer();
                if(activity.last_date < Date.now()){
                    vm.closed_activities.push(activity);
                } else {
                    vm.open_activities.push(activity);
                }
                deferred.resolve();
                return deferred.promise;
            }
        }

        function _mapReviews(reviews){
            console.log('reviews', reviews);
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
                var review = reviews.filter(filterReview)[0];
                if(!review){ review = {}; }
                activity.review = review;

                function filterReview(review){
                    return review.activity === activity.id;
                }
            }
        }

        function _mapOrders(activities, orders){
            angular.forEach(activities, mapOrders);
            return activities;

            function mapOrders(activity){
                activity.orders = orders.filter(filterOrders);

                function filterOrders(order){
                    return order.activity_id === activity.id;
                }
            }
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SEARCH_ACTIVITIES: "Buscar Actividades",
                COPY_CURRENT: "Revisa las actividades que estás cursando actualmente o que inician próximamente.",
                COPY_HISTORY: "Revisa las actividades en las que te has inscrito anteriormente.",
                SECTION_ACTIVITIES: "Mis Actividades",
                LABEL_EMPTY_ACTIVITIES: "Hasta ahora no se ha inscrito en alguna actividad",
                COPY_EMPTY_ACTIVITIES: "Parece ser el momento perfecto para que descubra una nueva pasión,"
                    + " aprenda un nuevo pasatiempo o mejore su currículo",
                TAB_OPEN: "Próximas",
                TAB_CLOSED: "Anteriores",
                COPY_ORDER_DETAIL: "Detalle de la compra",
                COPY_BEGINNING_ON: "Iniciado el "
            });
        }

        function _activate() {
            _setStrings();
            activities = _mapOrders(activities, orders);
            _mapReviews(reviews).then(function(){ _assignActivities(); });
        }

    }

})();
