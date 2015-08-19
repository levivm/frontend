(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileController', OrganizerProfileController);

    OrganizerProfileController.$inject = ['$state', '$stateParams', 'LocationManager', 'organizer', 'activities'];

    function OrganizerProfileController($state, $stateParams, LocationManager, organizer, activities) {

        var vm = this;

        angular.extend(vm, {
            organizer : organizer,
            city : null,
            options : {
                actions: ['view']
            },
            paginationOpts : {
                'totalItems': activities.length,
                'itemsPerPage': 3
            },
            pageNumber : 1,
            activities : [],
            activityPageChange : activityPageChange
        });

        _activate();

        //--------- Functions Implementation ---------//

        function activityPageChange(){
            var offset = vm.paginationOpts['itemsPerPage'];
            var start = (vm.pageNumber - 1) * offset;
            var end = vm.pageNumber * offset;
            vm.activities = activities.slice(start, end);
        }

        function _getCity(cities, organizer){
            console.log('cities:', cities);
            console.log('organizer:', organizer);
            if(organizer.locations.length > 0){
                var cityId = organizer.locations[0].city.id;
                cities.find(isSameCity);
            } else {
                return null;
            }

            function isSameCity(city){
                console.log(city.id, cityId);
                return city.id === cityId;
            }
        }

        function _setCurrentState(){
            vm.current_state = {
                toState: {
                    state: $state.current.name,
                    params: $stateParams
                }
            };
            console.log('vm.current_state:', vm.current_state);
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                LABEL_PUBLISHED_ACTIVITIES: "Actividades Publicadas",
                LABEL_BIO: "Biografía",
                LABEL_CONTACT: "Contactar",
                COPY_MEMBER_SINCE: "Miembro desde "
            });
        }

        function _activate(){
            _setStrings();
            _setCurrentState();
            LocationManager.getAvailableCities().then(successCities);
            vm.activities = activities.slice(0, vm.paginationOpts.itemsPerPage);

            function successCities(cities){
                vm.city = _getCity(cities, organizer);
                console.log('vm.city:', vm.city);
            }
        }
    }
})();