(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileController', OrganizerProfileController);

    OrganizerProfileController.$inject = ['$state', '$scope', '$stateParams', 'uiGmapGoogleMapApi', 'LocationManager', 'organizer', 'activities'
        , 'ActivitiesManager', 'reviews', 'serverConf'];

    function OrganizerProfileController($state, $scope, $stateParams, uiGmapGoogleMapApi, LocationManager, organizer, activities
        , ActivitiesManager, reviews, serverConf) {

        var REVIEW_STEP = 3;
        var visibleReviewListSize = REVIEW_STEP;
        var vm = this;

        angular.extend(vm, {
            organizer : organizer,
            city : null,
            map : {},
            marker : {},
            options : {
                actions: ['view']
            },
            activitiesPaginationOpts : {
                totalItems : 0,
                itemsPerPage : 8,
                pageNumber : 1,
                maxPagesSize : 10
            },
            activities : [],
            reviews : [],
            organizerRating: 0,
            totalReviews: 0,
            hasMoreReviews: true,
            showMoreReviews: showMoreReviews,
            pageChange:pageChange,
            getAmazonUrl: getAmazonUrl,
            cards: []
        });

        _activate();

        //--------- Functions Implementation ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }

        function pageChange(){
          ActivitiesManager.loadOrganizerActivities(organizer.id, 'opened', vm.activitiesPaginationOpts.pageNumber,  vm.activitiesPaginationOpts.itemsPerPage)
          .then(function (response) {
            vm.activities = response.results;
            vm.activitiesPaginationOpts.totalItems = response.count;
            vm.activities = vm.activities.slice(0, vm.activitiesPaginationOpts.itemsPerPage);

            for(var i = 0; i < vm.activities.length; i++){
                vm.activities[i].template = "partials/activities/dynamic_layout_item.html";
            }

            vm.cards = vm.activities;
          });
        }


        function showMoreReviews(){
            if(visibleReviewListSize < vm.reviews.length){
                visibleReviewListSize += REVIEW_STEP;
                vm.reviews = vm.reviews.slice(0, visibleReviewListSize);
            }

            if(visibleReviewListSize >= vm.reviews.length){
                vm.hasMoreReviews = false;
            }
        }

        function _setActivities(){
            vm.activitiesPaginationOpts.totalItems = activities.count;
            vm.activities = activities.results;
            for(var i = 0; i < activities.results.length; i++){
                activities.results[i].template = "partials/activities/dynamic_layout_item.html";
            }
            vm.cards = activities.results;

        }

        function _setOrganizerCity(){
            LocationManager.getAvailableCities().then(successCities);

            vm.map = LocationManager.getMap(organizer.location, false)
            vm.marker = LocationManager.getMarker(organizer.location)

            function successCities(cities){
                vm.city = _getCity(cities, organizer);
            }

            function _getCity(cities, organizer){
                if(organizer.locations.length > 0){
                    var cityId = organizer.locations[0].city.id;
                    cities.find(isSameCity);
                    vm.organizer.location = organizer.locations[0];
                } else {
                    return null;
                }

                function isSameCity(city){
                    return city.id === cityId;
                }
            }
        }

        function _setReviews(){

            vm.reviews = reviews.results;
            vm.totalReviews = reviews.results.length;
            vm.hasMoreReviews= vm.reviews.length > visibleReviewListSize;
        }

        function _setCurrentState(){
            vm.current_state = {
                toState: {
                    state: $state.current.name,
                    params: $stateParams
                }
            };
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                LABEL_PUBLISHED_ACTIVITIES: "Actividades de ",
                LABEL_UNPUBLISHED_ACTIVITIES: "Este organizador aún no ha publicado ninguna actividad.",
                LABEL_BIO: "Biografía",
                LABEL_CONTACT: "Contactar",
                LABEL_REVIEWS: "Evaluaciones",
                LABEL_TOTAL: "en total",
                LABEL_MORE_REVIEWS: "Ver más evaluaciones",
                LABEL_ADDRESS: "Dirección",
                LABEL_NO_MORE_REVIEWS: "No hay más evaluaciones",
                COPY_MEMBER_SINCE: "Miembro desde ",
                COPY_VERIFIED_1: "Organizador",
                COPY_VERIFIED_2: "verficado por Trulii",
                COPY_TOTAL_REVIEWS: "evaluaciones totales",
                COPY_NO_REVIEWS: "El organizador aún no ha recibido evaluaciones en sus actividades"
            });
        }

        function _updateUrl(){
            // Title sanitation
            var name = organizer.name;
            name = name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

            // Replacing whitespaces with hyphen
            name = name.split(' ').join('-').toLowerCase();

            // Replacing most common special characters
            var dict = {"á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u", "ç":"c", "ñ":"n"}
            name = name.replace(/[^\w ]/g, function(char) {
              return dict[char] || char;
            });

            $state.go('organizer-profile', {organizer_id: organizer.id, organizer_name: name} ,{location: "replace", notify: false, reload: true});

        }
        function _setOrganizerRating(){
            vm.organizerRating = organizer.rating.toString().replace(',', '.');
        }

        function _activate(){
            _updateUrl();
            _setStrings();
            _setOrganizerCity();
            _setCurrentState();
            _setActivities();
            _setReviews();
            _setOrganizerRating();
            //Function for angularSeo
            $scope.htmlReady();
        }
    }
})();
