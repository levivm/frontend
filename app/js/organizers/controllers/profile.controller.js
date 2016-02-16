(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileController', OrganizerProfileController);

    OrganizerProfileController.$inject = ['$state', '$stateParams', 'uiGmapGoogleMapApi', 'LocationManager', 'organizer', 'activities'
        , 'reviewObjects'];

    function OrganizerProfileController($state, $stateParams, uiGmapGoogleMapApi, LocationManager, organizer, activities
        , reviewObjects) {

        var REVIEW_STEP = 5;
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
                'totalItems': activities.length,
                'itemsPerPage': 3
            },
            pageNumber : 1,
            activities : [],
            reviewObjects: [],
            hasMoreReviews: true,
            activityPageChange : activityPageChange,
            showMoreReviews: showMoreReviews
        });

        _activate();

        //--------- Functions Implementation ---------//

        function activityPageChange(){
            var offset = vm.paginationOpts['itemsPerPage'];
            var start = (vm.pageNumber - 1) * offset;
            var end = vm.pageNumber * offset;
            vm.activities = activities.slice(start, end);
        }

        function showMoreReviews(){
            if(visibleReviewListSize < reviewObjects.length){
                visibleReviewListSize += REVIEW_STEP;
                vm.reviewObjects = reviewObjects.slice(0, visibleReviewListSize);
            }

            if(visibleReviewListSize >= reviewObjects.length){
                vm.hasMoreReviews = false;
            }
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
            vm.reviewObjects = reviewObjects.slice(0, visibleReviewListSize);
            vm.hasMoreReviews= reviewObjects.length > visibleReviewListSize;
            //console.log('reviewObjects', vm.reviewObjects);
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
            var dict = {"á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u", "ç":"c"}
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
            _setReviews();
            vm.activities = activities.slice(0, vm.paginationOpts.itemsPerPage);
            //console.log('organizer:', organizer);
            //console.log('reviews:', reviews);
        }
    }
})();
