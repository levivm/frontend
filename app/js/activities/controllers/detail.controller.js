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

    ActivityDetailController.$inject = ['$state', '$stateParams', 'uiGmapGoogleMapApi', 'Toast',
        'cities', 'activity', 'calendars', 'defaultPicture', 'defaultCover'];

    function ActivityDetailController($state, $stateParams, uiGmapGoogleMapApi, Toast,
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
            isListVisible: false,
            galleryOptions: {
                interval: 0,
                noWrap: false
            },
            showList: showList,
            hideList: hideList,
            setSelectedCalendar: setSelectedCalendar,
            changeState : changeState,
            changeSelectedCalendar : changeSelectedCalendar,
            getOrganizerPhoto : getOrganizerPhoto,
            getStarStyle : getStarStyle,
            isSelectedCalendarFull : isSelectedCalendarFull
        });

        _activate();

        //--------- Exposed Functions ---------//

        function showList(){
            vm.isListVisible = true;
        }

        function hideList(){
            vm.isListVisible = false;
        }

        function setSelectedCalendar(calendar){
            vm.calendar_selected = calendar;
            hideList();
        }

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

        //--------- Internal Functions ---------//

        function _mapClosestCalendar(activity){
            var today = Date.now();
            activity.days_to_closest = null;
            activity.closest_date = null;
            activity.closest_calendar = null;
            activity.upcoming_calendars = [];

            if(activity.calendars){
                activity.calendars.forEach(function(calendar){
                    if(calendar.initial_date >= today
                        && (calendar.initial_date < activity.closest_date || !activity.closest_date)){
                        activity.closest_date = calendar.initial_date;
                        activity.closest_calendar = calendar;
                    }
                    if(calendar.initial_date >= today){
                        activity.upcoming_calendars.push(calendar);
                    }
                });
            }

            if(activity.closest_date){
                activity.days_to_closest = Math.floor((activity.closest_date - today)/(1000*60*60*24));
            } else {
                activity.days_to_closest = -1;
            }

            return activity;
        }

        function _mapPictures(activity){
            activity.gallery = [];
            if(activity.hasOwnProperty('pictures') && activity.pictures.length > 0){
                angular.forEach(activity.pictures, function(picture){
                    if(picture.main_photo){
                        activity.main_photo = picture.photo;
                    } else {
                        activity.gallery.push(picture);
                    }
                });
            } else {
                activity.main_photo = defaultCover;
            }
            console.log('_mapPictures. activity:', activity);
            return activity;
        }

        function _mapCalendars(activity){
            activity.calendars = activity.calendars.map(mapVacancy);

            function mapVacancy(calendar){
                calendar.vacancy = calendar.capacity - calendar.assistants.length;
                calendar.total_price = calendar.session_price * calendar.sessions.length;
                return calendar;
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
                        center: position,
                        scrollwheel: false
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
                ACTION_CONTACT_US: "Contáctanos",
                ACTION_SIGN_UP: "Inscribirme",
                ACTION_SELECT_CALENDAR: "Ver Detalle",
                ACTION_VIEW_OTHER_DATES: "Ver otras fechas",
                ACTIVITY_DISABLED : "Esta actividad se encuentra inactiva",
                ACTIVITY_SOLD_OUT: "Agotado",
                COPY_SOCIAL_BUTTONS: "Te gustó? Compartelo con tus amigos ",
                COPY_SOCIAL_SHARE_FACEBOOK: "Compartir en Facebook",
                COPY_SOCIAL_SHARE_TWITTER: "Compartir en Twitter",
                COPY_SOCIAL_SHARE_EMAIL: "Compartir por Email",
                COPY_WAIT_NEW_DATES: "Espere nuevas fechas",
                COPY_ONE_CALENDAR_AVAILABLE: "Esta actividad se realizara en otra oportunidad ",
                COPY_MORE_CALENDARS_AVAILABLE: "Esta actividad se realizara en otras ",
                COPY_NO_CALENDARS_AVAILABLE: "Actualmente no hay otros calendarios disponibles",
                COPY_OPORTUNITIES: " oportunidades",
                COPY_EMPTY_SECTION: "El Organizador no ha completado la información de esta sección aún ¡Regresa pronto!",
                COPY_TODAY: "Hoy",
                COPY_DAY: "día ",
                COPY_DAYS: "días ",
                COPY_IN: "En ",
                COPY_TO: " a ",
                COPY_NOT_AVAILABLE: "No Disponible",
                COPY_VACANCY: " Vacantes",
                COPY_ONE_SESSION: "Sesión",
                COPY_OTHER_SESSIONS: "Sesiones",
                COPY_HEADER_SIGN_UP: "¿Todo listo para aprender?",
                COPY_SIGN_UP: "Inscribirse es más rápido que Flash, más seguro que Islandia y más seguro que la tabla del 1 ¡En serio!",
                COPY_HEADER_REASONS_TO_USE: "¿Por qué inscribirte con Trulii?",
                COPY_DOUBTS:"¿Alguna duda? Estamos a tu orden todos los días. Porque tú te lo mereces ",
                LABEL_COST: "Precio",
                LABEL_NEXT_DATE: "Próximo Inicio",
                LABEL_CLOSING_DATE: "Ventas hasta",
                LABEL_LEVEL: "Nivel",
                LABEL_DURATION: "Duration",
                LABEL_DESCRIPTION: "Descripción",
                LABEL_GET_TO_KNOW_US: "Conócenos",
                LABEL_CONTENT: "Contenido",
                LABEL_AUDIENCE: "Dirigido a",
                LABEL_GOALS: "Objetivo",
                LABEL_INSTRUCTORS: "Instructores",
                LABEL_REQUIREMENTS: "Requisitos",
                LABEL_METHODOLOGY: "Metodologia",
                LABEL_EXTRA_INFO: "Adicionales",
                LABEL_RETURN_POLICY: "Política de Devolución",
                TAB_CALENDARS: "Calendarios",
                LABEL_ATTENDEES: "Asistentes",
                VALUE_WITH_CERTIFICATION: "Con Certificado",
                VALUE_WITHOUT_CERTIFICATION: "Sin Certificado",
                REASON_NO_COMMISSIONS: "Sin Comisiones",
                REASON_COPY_NO_COMMISSIONS: "¡En serio Te lo prometemos!",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND: "Por si no se realiza la actividad",
                REASON_SECURE: "Pago Seguro",
                REASON_COPY_SECURE: "Inscribete con tranquilidad"
            });
        }

        function _activate(){
            _setStrings();
            _setCurrentState();
            vm.activity = activity;
            _setUpLocation(vm.activity);
            vm.activity = _mapCalendars(vm.activity);
            vm.activity = _mapPictures(vm.activity);
            vm.activity = _mapClosestCalendar(vm.activity);
            vm.activity = _mapInfo(vm.activity);
            vm.activity.rating = [1, 2, 3, 4, 5];

            vm.calendars = calendars;
            vm.organizer = vm.activity.organizer;
            vm.calendar_selected = vm.activity.closest_calendar;

            if(!(vm.activity.published)){
                Toast.setPosition("toast-top-center");
                Toast.error(vm.strings.ACTIVITY_DISABLED);
            }

            console.log('detail. activity:', vm.activity);

        }
    }
})();
