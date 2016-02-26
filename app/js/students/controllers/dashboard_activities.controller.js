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

    StudentActivitiesCtrl.$inject = ['$q', '$state', 'LocationManager', 'activities', 'reviews', 'orders', 'student'];

    function StudentActivitiesCtrl($q, $state, LocationManager, activities, reviews, orders, student) {

        var futureOrders = [];
        var pastOrders = [];
        var vm = this;
        angular.extend(vm, {
            future_activities: [],
            past_activities: [],
            options : {
                actions: ["contact"]
            },
            getReviewByActivityId: getReviewByActivityId,
            searchActivities: searchActivities
        });

        _activate();

        //--------- Exposed Functions ---------//

        function getReviewByActivityId(activityId){
            var review = reviews.filter(filterById)[0];
            //console.log('getReviewByActivityId', review);
            if(review){
               return review;
            } else {
                return {};
            }

            function filterById(review){ return review.activity.id === activityId; }
        }

        function searchActivities(){
            var searchCity = LocationManager.getSearchCity();
            $state.go('search', {'city': searchCity.id});
        }

        //--------- Internal Functions ---------//

        //function _classifyActivities(){
        //    vm.future_activities = [];
        //    vm.past_activities = [];
        //    angular.forEach(activities, filterActivity);
        //
        //    function filterActivity(activity){
        //        var deferred = $q.defer();
        //        if(activity.last_date < Date.now()){
        //            vm.past_activities.push(activity);
        //        } else {
        //            vm.future_activities.push(activity);
        //        }
        //        deferred.resolve();
        //        return deferred.promise;
        //    }
        //}

        //function _mapReviews(reviews){
        //    console.log('reviews', reviews);
        //    var deferred = $q.defer();
        //    var promiseArray = [];
        //    activities.map(function(activity){
        //        promiseArray.push(mapReview(activity));
        //    });
        //
        //    $q.all(promiseArray).then(function(){
        //        deferred.resolve();
        //    });
        //
        //    return deferred.promise;
        //
        //    function mapReview(activity){
        //        var review = reviews.filter(filterReview)[0];
        //        if(!review){ review = {}; }
        //        activity.review = review;
        //
        //        function filterReview(review){
        //            return review.activity === activity.id;
        //        }
        //    }
        //}

        //function _mapOrders(activities, orders){
        //    angular.forEach(activities, mapOrders);
        //    return activities;
        //
        //    function mapOrders(activity){
        //        activity.orders = orders.filter(filterOrders);
        //
        //        function filterOrders(order){
        //            return order.activity_id === activity.id;
        //        }
        //    }
        //}

        function _classifyActivities(activities, pastOrders, futureOrders){
            var deferred = $q.defer();
            var promiseArray = [];

            activities.results.forEach(function(activity){
              promiseArray.push(classifyActivity(activity));
            });

            $q.all(promiseArray).then(function(){
                //console.log('future_activities:', vm.future_activities);
                //console.log('past_activities:', vm.past_activities);
                deferred.resolve();
            });

            return deferred.promise;

            function classifyActivity(activity){
                activity = _mapReviews(activity, reviews);
                var orders;
                // Filter pastOrders
                orders = pastOrders.filter(filterOrdersByActivity);
                // console.log(pastOrders);
                if(orders.length > 0){
                    var pastActivity = angular.copy(activity);
                    pastActivity.orders = orders;
                    vm.past_activities.push(pastActivity);
                }
                // Filter futureOrders
                orders = futureOrders.filter(filterOrdersByActivity);
                if(orders.length > 0){
                    var futureActivity = angular.copy(activity);
                    futureActivity.orders = orders;
                    vm.future_activities.push(futureActivity);
                }

                function filterOrdersByActivity(order){
                    return activity.id === order.activity_id;
                }
            }
        }

        function _mapReviews(activity, reviews){
            //console.log('reviews', reviews);
            //console.log('activity', activity);
            var review = reviews.filter(function(review){
                return review.activity == activity.id;
            })[0];

            if(!review){
                review = {
                    'activity' : activity.id
                };
            }
            activity.review = review;
            return activity;
        }

        function _mapOrders(orders, activities, reviews){
            var COMPARISON_DATE = Date.now();
            var deferred = $q.defer();
            var promiseArray = [];

            orders.forEach(function(order){
              console.log(order.activity);
                promiseArray.push(processOrder(order));
            });

            $q.all(promiseArray).then(function(){
                deferred.resolve(orders);
            });

            return deferred.promise;

            function processOrder(order){
                order = setOrderActivity(order, activities);
                // console.log(order);
                if(order.calendar_initial_date < COMPARISON_DATE){
                  // console.log(order);
                    pastOrders.push(order);
                } else {
                    futureOrders.push(order);
                }
            }

            function setOrderActivity(order, activities){
                order.activity = activities.filter(function(activity){
                    return activity.id == order.activity_id;
                })[0];

                return order;
            }
            
            // console.log(vm.past_activities);
            // console.log(vm.future_activities);
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
          // console.log(activities);
            _setStrings();
            console.log('??');
            console.log(orders);
            _mapOrders(orders.results, activities.results, reviews)
            .then(function(){
                _classifyActivities(activities, pastOrders, futureOrders);
            })
            .then(function(){
                console.log(vm.past_activities);
                console.log(vm.future_activities);
                _mapReviews(vm.past_activities, reviews);
            });
            
        }

    }

})();
