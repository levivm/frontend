(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileController', OrganizerProfileController);

    OrganizerProfileController.$inject = ['$state', '$stateParams', 'uiGmapGoogleMapApi', 'LocationManager', 'organizer', 'activities'
        , 'ActivitiesManager', 'reviews', 'serverConf'];

    function OrganizerProfileController($state, $stateParams, uiGmapGoogleMapApi, LocationManager, organizer, activities
        , ActivitiesManager, reviews, serverConf) {

        var REVIEW_STEP = 3;
        var visibleReviewListSize = REVIEW_STEP;
        var vm = this;

        angular.extend(vm, {
            organizer : organizer,
            city : null,
            map : LocationManager.getMap(organizer.location, false),
            marker : LocationManager.getMarker(organizer.location),
            options : {
                actions: ['view']
            },
            paginationOpts : {
                totalItems: 0,
                itemsPerPage: 6,
                maxPagesSize:6,
                pageNumber: 1
            },
            pageNumber : 1,
            activities : [],
            reviews : [],
            totalReviews: 0,
            hasMoreReviews: true,
            showMoreReviews: showMoreReviews,
            pageChange:pageChange,
            getAmazonUrl: getAmazonUrl
        });

        _activate();

        //--------- Functions Implementation ---------//
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        
        function pageChange(){
          ActivitiesManager.loadOrganizerActivities(organizer.id, 'opened', vm.paginationOpts.pageNumber,  vm.paginationOpts.itemsPerPage)
          .then(function (response) {
            console.log(response);
            vm.activities = response.results;
            vm.paginationOpts.totalItems = response.count;
            vm.activities = vm.activities.slice(0, vm.paginationOpts.itemsPerPage);
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
            vm.paginationOpts.totalItems = activities.count;
            vm.activities = activities.results;
        }

        function _setOrganizerCity(){
            LocationManager.getAvailableCities().then(successCities);

            function successCities(cities){
                vm.city = _getCity(cities, organizer);
            }

            function _getCity(cities, organizer){
                if(organizer.locations.length > 0){
                    var cityId = organizer.locations[0].city.id;
                    cities.find(isSameCity);
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
                LABEL_COMMENTS: "Comentarios",
                LABEL_TOTAL: "en total",
                LABEL_MORE_COMMENTS: "Ver más comentarios",
                LABEL_NO_MORE_COMMENTS: "No hay más comentarios",
                COPY_MEMBER_SINCE: "Miembro desde ",
                COPY_VERIFIED_1: "Organizador",
                COPY_VERIFIED_2: "verficado por Trulii"
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
            $state.go($state.current, {organizer_id: organizer.id, organizer_name: name}, {notify: false, reload: $state.current});
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

            //vm.activities = activities.slice(0, vm.paginationOpts.itemsPerPage);
            //if(vm.activities.length > 0)
            //  vm.activities = activities.slice(0, vm.paginationOpts.itemsPerPage);
            //console.log('organizer:', organizer);
            //console.log('reviews:', reviews);
        }
    }
})();
