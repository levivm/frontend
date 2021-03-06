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
                itemsPerPage: 8,
                maxPagesSize:8,
                pageNumber: 1
            },
            pastPaginationOpts: {
              totalItems: 0,
              itemsPerPage: 8,
              maxPagesSize:8,
              pageNumber: 1
            },
            currentPaginationOpts: {
              totalItems: 0,
              itemsPerPage: 8,
              maxPagesSize:8,
              pageNumber: 1
            },
            updateByQuery:updateByQuery,
            TYPE_NEXT: 'next',
            TYPE_PAST: 'past',
            TYPE_CURRENT: 'current',
            current_cards: [],
            future_cards: [],
            titleSize: 10
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
                    _setOrders();
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

        function _mapOrders(activities, orders){
            angular.forEach(activities, mapOrders);
            return activities;

            function mapOrders(activity){
                activity.orders = orders.filter(filterOrders);

                function filterOrders(order){
                    if(order.activity.id === activity.id){
                        return order;
                    }
                }
            }
        }

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
        function _(params) {

        }
        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SEARCH_ACTIVITIES: "A ver qué encuentro",
                COPY_CURRENT: "Estas son las actividades que estás cursando en este momento. Recuerda evaluarlas al terminar.",
                COPY_LAST: "Estas son las actividades que tienes que evaluar. Tu evaluación es importante para la comunidad. Sé sincero y respetuoso(a).",
                SECTION_ACTIVITIES: "Mis Actividades",
                LABEL_EMPTY_ACTIVITIES: "En este momento no estás cursando ninguna actividad. ¿Qué esperas para aprender algo nuevo? ¡Anímate, pues!",
                LABEL_EMPTY_CURRENT_ACTIVITIES: "No tienes ninguna actividad próxima a realizar. ¿Qué estás esperando? ¡Venga, pues!",
                LABEL_EMPTY_LAST_ACTIVITIES:"Por los momentos no tienes ninguna actividad para evaluar. ¿Qué tal si pruebas buscando algo? Quizá encuentres algo interesante.",
                COPY_EMPTY_ACTIVITIES: "Parece ser el momento perfecto para que descubra una nueva pasión,"
                    + " aprenda un nuevo pasatiempo o mejore su currículo",
                TAB_NEXT: "Actividades / Próximas",
                COPY_NEXT: "Estas son las actividades que próximamente realizarás. ¡Ya falta poco!",
                TAB_LAST: "Actividades / Por revisar",
                TAB_CURRENT: "Actividades / Actuales",
                COPY_ORDER_DETAIL: "Detalle de la compra",
                COPY_BEGINNING_ON: "Iniciado el "
            });
        }

        function _setOrders(){
            vm.past_activities =  _mapOrders(vm.past_activities, orders.results);
            _mapReviews(vm.past_activities, reviews);
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
