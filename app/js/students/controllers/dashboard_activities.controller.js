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

    StudentActivitiesCtrl.$inject = ['$q', '$state', 'LocationManager', 'ActivitiesManager', 'currentActivities', 'pastActivities', 'nextActivities', 'reviews', 'orders', 'student'];

    function StudentActivitiesCtrl($q, $state, LocationManager, ActivitiesManager, currentActivities, pastActivities, nextActivities, reviews, orders, student) {

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
            searchActivities: searchActivities,
            nextPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 12,
                maxPagesSize:12,
                pageNumber: 1
            },
            pastPaginationOpts: {
              totalItems: 0,
              itemsPerPage: 12,
              maxPagesSize:12,
              pageNumber: 1
            },
            currentPaginationOpts: {
              totalItems: 0,
              itemsPerPage: 12,
              maxPagesSize:12,
              pageNumber: 1
            },
            updateByQuery:updateByQuery,
            TYPE_NEXT: 'next',
            current_cards: [],
            future_cards: []
        });

        _activate();

        //--------- Exposed Functions ---------//

        function updateByQuery(type){
            switch(type){
                case vm.TYPE_NEXT:
                  ActivitiesManager.getStudentActivities(student.id, vm.TYPE_NEXT, vm.nextPaginationOpts.pageNumber, vm.nextPaginationOpts.itemsPerPage)
                  .then(function(response){
                    vm.future_activities = response.results;
                    vm.nextPaginationOpts.totalItems = response.count;
                    _mapTemplatesFuture();
                  });
                  break;
                case vm.TYPE_PAST:
                  ActivitiesManager.getStudentActivities(student.id, vm.TYPE_PAST, vm.pastPaginationOpts.pageNumber, vm.pastPaginationOpts.itemsPerPage)
                  .then(function(response){
                    vm.past_activities = response.results;
                    vm.pastPaginationOpts.totalItems = response.count;
                  });
                  break;
                case vm.TYPE_CURRENT:
                  ActivitiesManager.getStudentActivities(student.id, vm.TYPE_CURRENT, vm.currentPaginationOpts.pageNumber, vm.currentPaginationOpts.itemsPerPage)
                  .then(function(response){
                    vm.current_activities = response.results;
                    vm.currentPaginationOpts.totalItems = response.count;
                    _mapTemplatesCurrent();
                  });
                  break;
            }
        }

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

        function _mapReviews(activity, reviews){
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
            var deferred = $q.defer();
            var promiseArray = [];

            orders.forEach(function(order){
              promiseArray.push(processOrder(order));
            });

            $q.all(promiseArray).then(function(){
              deferred.resolve(orders);
            });

            return deferred.promise;

            function processOrder(order){
                order = setOrderActivity(order, activities);
            }

            function setOrderActivity(order, activities){
                order.activity = activities.filter(function(activity){
                  return activity.id == order.activity.id;
                })[0];

                return order;
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
                LABEL_EMPTY_ACTIVITIES: "Hasta ahora no ha terminado ninguna actividad",
                LABEL_EMPTY_CURRENT_ACTIVITIES: "Por los momentos no tiene ninguna actividad en curso",
                COPY_EMPTY_ACTIVITIES: "Parece ser el momento perfecto para que descubra una nueva pasión,"
                    + " aprenda un nuevo pasatiempo o mejore su currículo",
                TAB_OPEN: "Próximas",
                TAB_CLOSED: "Anteriores",
                TAB_CURRENT: "Actuales",
                COPY_ORDER_DETAIL: "Detalle de la compra",
                COPY_BEGINNING_ON: "Iniciado el "
            });
        }

        function _setOrders(){
           var activities = nextActivities.results.concat(pastActivities.results).concat(currentActivities.results);
            _mapOrders(orders.results, activities, reviews)
            .then(function(){
                _mapReviews(vm.past_activities, reviews);
            });
        }

        function _setActivities(){

            vm.nextPaginationOpts.totalItems = nextActivities.count;
            vm.future_activities = nextActivities.results;

            vm.pastPaginationOpts.totalItems = pastActivities.count;
            vm.past_activities = pastActivities.results;

            vm.currentPaginationOpts.totalItems = currentActivities.count;
            vm.current_activities = currentActivities.results;

        }
        
        function _mapTemplatesCurrent(){
            for(var i = 0; i < vm.current_activities.length; i++){
                vm.current_activities[i].template = "partials/activities/dynamic_layout_item.html";
            }
            vm.current_cards = vm.current_activities;
            
        }
        
        function _mapTemplatesFuture(){
            for(var i = 0; i < vm.future_activities.length; i++){
                vm.future_activities[i].template = "partials/activities/dynamic_layout_item.html";
            }
            vm.future_cards = vm.future_activities;
            
        }

        function _activate() {
            _setStrings();
            _setActivities();
            _setOrders();
            _mapTemplatesCurrent();
            _mapTemplatesFuture();
        }

    }

})();
