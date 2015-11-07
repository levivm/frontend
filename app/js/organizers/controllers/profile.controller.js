(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileController', OrganizerProfileController);

    OrganizerProfileController.$inject = ['$state', '$stateParams', 'LocationManager', 'organizer', 'activities'
        , 'reviews', 'cities'];

    function OrganizerProfileController($state, $stateParams, LocationManager, organizer, activities
        , reviews, cities) {

        var vm = this;
        var visibleReviewListSize = 5;
        var reviewObjects = [];

        angular.extend(vm, {
            organizer : organizer,
            city : null,
            map : LocationManager.getMap(organizer.location),
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
            if(visibleReviewListSize < reviews.length){
                visibleReviewListSize += 5;
                vm.reviewObjects = reviewObjects.slice(0, visibleReviewListSize);
            } else {
                vm.hasMoreReviews = false;
            }
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

        function _getReviewRatingAvg(reviews){
            return reviews.map(getRatings).reduce(reduceRatings);

            function getRatings(review){ return review.rating; }

            function reduceRatings(previous, current){ return previous + current; }
        }

        function _setReviews(){
            reviewObjects = reviews.map(mapActivityToReview);
            vm.reviewObjects = reviewObjects.slice(0, 5);
            console.log('reviewObjects', vm.reviewObjects);

            function mapActivityToReview(review){
                var activity = activities.filter(filterById)[0];

                return {
                    'activity': activity,
                    'review': review
                };

                function filterById(activity){
                    return activity.id === review.activity;
                }
            }
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
                COPY_MEMBER_SINCE: "Miembro desde ",
                COPY_VERIFIED_1: "Organizador",
                COPY_VERIFIED_2: "verficado por Trulii"
            });
        }

        function _activate(){
            _setStrings();
            _setCurrentState();
            _setReviews();

            vm.reviewsAvg = _getReviewRatingAvg(reviews);

            //console.log('map',vm.map);
            vm.map.options.scrollwheel = false;

            LocationManager.getAvailableCities().then(successCities);
            vm.activities = activities.slice(0, vm.paginationOpts.itemsPerPage);

            function successCities(cities){
                vm.city = _getCity(cities, organizer);
                //console.log('vm.city:', vm.city);
            }
        }
    }
})();
