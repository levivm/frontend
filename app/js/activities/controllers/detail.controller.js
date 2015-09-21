/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDetailController
 * @description Controller for Activity Detail Component. Handles
 * display of activity info, available calendars and assistants.
 * @requires ui.router.state.$state
 * @requires ng.$window
 * @requires uiGmapgoogle-maps.providers.uiGmapGoogleMapApi
 * @requires trulii.ui-components.services.Toast
 * @requires cities
 * @requires activity
 * @requires calendars
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailController', ActivityDetailController);

    ActivityDetailController.$inject = ['$state', '$stateParams', '$window', 'uiGmapGoogleMapApi', 'Toast',
        'cities', 'activity', 'calendars', 'defaultPicture', 'defaultCover'];

    function ActivityDetailController($state, $stateParams, $window, uiGmapGoogleMapApi, Toast,
                                      cities, activity, calendars, defaultPicture, defaultCover) {
        var MAX_DAYS = 30;
        var vm = this;
        angular.extend(vm, {
            city : null,
            calendars : [],
            calendar : null,
            activity : null,
            organizer : null,
            calendar_selected : null,
            changeState : changeState,
            changeSelectedCalendar : changeSelectedCalendar,
            getOrganizerPhoto : getOrganizerPhoto,
            getMapStyle : getMapStyle,
            getStarStyle : getStarStyle,
            isSelectedCalendarFull : isSelectedCalendarFull
        });

        _activate();

        //--------- Functions Implementation ---------//

        function isSelectedCalendarFull(){
            if(vm.calendar_selected){
                return vm.calendar_selected.assistants.length >= vm.calendar_selected.capacity;
            } else {
                return true;
            }
        }

        function changeState(state) {
            $state.go('activities-detail.' + state);
        }

        function changeSelectedCalendar(calendar) {
            vm.calendar_selected = calendar;
        }

        function getOrganizerPhoto(){
            if(vm.organizer && !!vm.organizer.photo){
                return vm.organizer.photo;
            } else {
                return defaultPicture;
            }
        }

        function getMapStyle(){
            return {
                'width': $window.innerWidth + 'px',
                'height': '240px'
            };
        }

        function getStarStyle(star){
            if(star <= 4){
                return {
                    'color': 'yellow'
                };
            } else {
                return {
                    'color': 'white'
                }
            }
        }

        function _mapClosestCalendar(activity){
            var today = Date.now();
            activity.days_to_closest = null;
            activity.closest_date = null;
            activity.closest_calendar = null;

            if(activity.chronograms){
                activity.chronograms.forEach(function(calendar){
                    if(calendar.initial_date >= today
                        && (calendar.initial_date < activity.closest_date || !activity.closest_date)){
                        activity.closest_date = calendar.initial_date;
                        activity.closest_calendar = calendar;
                    }
                });
            }

            if(activity.closest_date){
                activity.days_to_closest = Math.floor((activity.closest_date - today)/(1000*60*60*24));
            } else {
                activity.days_to_closest = -1;
            }

            _mapDateMsg(activity);

            return activity;
        }

        function _mapDateMsg(activity){
            if(activity.days_to_closest < 0){
                activity.date_msg = vm.strings.COPY_WAIT_NEW_DATES;
            } else if(activity.days_to_closest === 0){
                activity.date_msg = vm.strings.COPY_TODAY;
            } else if(activity.days_to_closest === 1){
                activity.date_msg = vm.strings.COPY_IN + " "
                    + activity.days_to_closest + " " + vm.strings.COPY_DAY;
            } else if(activity.days_to_closest <= MAX_DAYS){
                activity.date_msg = vm.strings.COPY_IN + " "
                    + activity.days_to_closest + " " + vm.strings.COPY_DAYS;
            } else {
                activity.date_msg = $filter('date')(activity.closest_date, 'dd MMM');
            }
            return activity;
        }

        function _mapPictures(activity){
            var gallery = [];
            if(activity.hasOwnProperty('pictures') && activity.pictures.length > 0){
                angular.forEach(activity.pictures, function(picture, index, array){
                    if(picture.main_photo){
                        activity.main_photo = picture.photo;
                    } else {
                        gallery.push(picture);
                    }

                    if( index === (array.length - 1) && !activity.main_photo){
                        activity.main_photo = array[0].photo;
                    }
                });
                activity.gallery = gallery;
            } else {
                activity.main_photo = defaultCover;
            }
            return activity;
        }

        function _mapInfo(activity){
            if(!activity.content){ activity.content = vm.strings.COPY_EMPTY_SECTION; }
            if(!activity.audience){ activity.audience = vm.strings.COPY_EMPTY_SECTION; }
            if(!activity.goals){ activity.goals = vm.strings.COPY_EMPTY_SECTION; }
            if(!activity.requirements){ activity.requirements = vm.strings.COPY_EMPTY_SECTION; }
            if(!activity.extra_info){ activity.extra_info = vm.strings.COPY_EMPTY_SECTION; }
            if(!activity.return_policy){ activity.return_policy = vm.strings.COPY_EMPTY_SECTION; }
            return activity;
        }

        function _setUpLocation(activity){
            if(activity.location && activity.location.city){
                vm.city = _.result(_.findWhere(cities, {id: activity.location.city}), 'name');
            } else {
                vm.city = null;
            }

            if(activity.location && activity.location.point
                && activity.location.point[0] && activity.location.point[1]){

                uiGmapGoogleMapApi.then(function(maps) {
                    var position = new maps.LatLng(activity.location.point[0], activity.location.point[1]);
                    var gmapOptions = {
                        zoom: 16,
                        center: position
                    };

                    var gmap = new maps.Map(document.getElementById('map-canvas'), gmapOptions);

                    var marker = new maps.Marker({
                        position: position,
                        map: gmap
                    });

                });

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
                ACTION_VIEW_PROFILE: "Ver Perfil",
                ACTION_CONTACT: "Contactar",
                ACTION_SIGN_UP: "Inscribirme",
                ACTIVITY_DISABLED : "Esta actividad se encuentra inactiva",
                ACTIVITY_SOLD_OUT: "No quedan cupos disponibles para esta actividad",
                COPY_WAIT_NEW_DATES: "Espere nuevas fechas",
                COPY_EMPTY_SECTION: "El Organizador no ha completado la información de esta sección aún ¡Regresa pronto!",
                COPY_TODAY: "Hoy",
                COPY_DAY: "día ",
                COPY_DAYS: "días ",
                COPY_IN: "En ",
                LABEL_CATEGORY: "Categoría",
                LABEL_SUBCATEGORY: "Sub-Categoría",
                LABEL_LEVEL: "Nivel",
                LABEL_DURATION: "Duration",
                LABEL_DESCRIPTION: "Descripción",
                LABEL_GET_TO_KNOW_US: "Conócenos",
                LABEL_CONTENT: "Contenido",
                LABEL_AUDIENCE: "Audiencia",
                LABEL_GOALS: "Objetivo(s)",
                LABEL_REQUIREMENTS: "Requerimientos",
                LABEL_EXTRA_INFO: "Información Adicional",
                LABEL_RETURN_POLICY: "Política de Devolución",
                TAB_INFO: "Información",
                TAB_CALENDARS: "Calendarios",
                TAB_ASSISTANTS: "Asistentes"
            });
        }

        function _activate(){
            _setStrings();
            _setCurrentState();
            _setUpLocation(activity);
            vm.activity = _mapPictures(activity);
            vm.activity = _mapClosestCalendar(vm.activity);
            vm.activity = _mapInfo(vm.activity);
            vm.activity.rating = [1, 2, 3, 4, 5];

            vm.calendars = calendars;
            vm.organizer = activity.organizer;
            vm.calendar_selected = vm.activity.closest_calendar;

            if(!(vm.activity.published)){
                Toast.setPosition("toast-top-center");
                Toast.error(vm.strings.ACTIVITY_DISABLED);
            }

            console.log('detail. activity:', vm.activity);

        }
    }
})();
