(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileController', OrganizerProfileController);

    OrganizerProfileController.$inject = ['$state', '$stateParams', 'uiGmapGoogleMapApi', 'LocationManager', 'organizer', 'activities'
        , 'ActivitiesManager', 'reviews', 'serverConf', '$ngSilentLocation'];

    function OrganizerProfileController($state, $stateParams, uiGmapGoogleMapApi, LocationManager, organizer, activities
        , ActivitiesManager, reviews, serverConf, $ngSilentLocation) {

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
            console.log(response);
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
            vm.marker.options = {icon: getAmazonUrl('static/img/map.png')};

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
            console.log('reviews', vm.reviews);
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
                LABEL_UNPUBLISHED_ACTIVITIES: "no tiene actividades",
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

            // Updating the URL

            var params = [organizer.id, name];
            var stateUrl = "/organizers/";
            var newLocation = stateUrl.concat(params.join('/'));
            $ngSilentLocation.silent(newLocation);

        }

        function _activate(){
            console.log(organizer.name);
            _updateUrl();
            _setStrings();
            _setOrganizerCity();
            _setCurrentState();
            _setActivities();
            _setReviews();

            //console.log('organizer:', organizer);

            //vm.activities = activities.slice(0, vm.activitiesPaginationOpts.itemsPerPage);
            //if(vm.activities.length > 0)
            //  vm.activities = activities.slice(0, vm.activitiesPaginationOpts.itemsPerPage);
            //console.log('organizer:', organizer);
            //console.log('reviews:', reviews);
        }
    }
})();
