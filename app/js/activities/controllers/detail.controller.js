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

    ActivityDetailController.$inject = ['$scope', '$state', '$stateParams', '$window', 'uiGmapGoogleMapApi', 'Elevator', 'Toast', 'currentUser',
        'cities', 'activity', 'calendars', 'reviews', 'defaultPicture', 'defaultCover', 'ActivitiesManager','LocationManager',
        'serverConf'];

    function ActivityDetailController($scope, $state, $stateParams, $window, uiGmapGoogleMapApi, Elevator, Toast, currentUser,
                                      cities, activity, calendars, reviews, defaultPicture, defaultCover, ActivitiesManager,LocationManager,
                                      serverConf) {
        var MAX_DAYS = 30;
        var visibleReviewListSize = 3;
        var vm = this;
        angular.extend(vm, {
            city : null,
            calendars : [],
            reviews: [],
            hasMoreReviews: true,
            relatedActivities: [],
            calendar : null,
            activity : null,
            organizer : null,
            calendar_selected : null,
            isListVisible: false,
            currentGalleryPicture: 0,
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
            getOrganizerCity : getOrganizerCity,
            isSelectedCalendarFull : isSelectedCalendarFull,
            previousGalleryPicture: previousGalleryPicture,
            nextGalleryPicture: nextGalleryPicture,
            nextState: nextState,
            showMoreReviews: showMoreReviews,
            viewMoreDates: viewMoreDates,
            scroll: 0,
            widgetOriginalPosition: 0,
            widgetMaxPosition: 0,
            widgetAbsolutePosition: 0,
            selectedActivity: 0,
            showEmail: false,
            toggleEmailShow: toggleEmailShow,
        });

        _activate();

        //--------- Exposed Functions ---------//

        function previousGalleryPicture(){
            if(vm.currentGalleryPicture > 0){ vm.currentGalleryPicture--; }
        }

        function nextGalleryPicture(){
            if(vm.currentGalleryPicture < (vm.activity.gallery.length - 1)){ vm.currentGalleryPicture++; }
        }

        function showList(){ vm.isListVisible = true; }

        function hideList(){ vm.isListVisible = false; }

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

        function changeState(state) { $state.go('activities-detail.' + state); }

        function changeSelectedCalendar(calendar) { vm.calendar_selected = calendar; }

        function nextState(activity_id, calendar_id){
            var enrollParams = {
                activity_id: vm.activity.id,
                calendar_id: calendar_id
            };

            var registerParams = {
                toState: {
                    state: 'activities-enroll',
                    params: {
                        activity_id: activity_id,
                        calendar_id: calendar_id
                    }
                }
            };

            if(currentUser){
                $state.go('activities-enroll', enrollParams);
            } else {
                $state.go('register', registerParams);
            }
        }

        function getOrganizerPhoto(){
            if(vm.organizer && !!vm.organizer.photo){
                return vm.organizer.photo;
            } else {
                return defaultPicture;
            }
        }

        function getOrganizerCity(){
            if(vm.organizer.locations[0]){
                var city_id = vm.organizer.locations[0].city;
                return LocationManager.getCityById(city_id).name;
            }
        }

        function showMoreReviews(){
            if(visibleReviewListSize < reviews.length){
                visibleReviewListSize += 3;
                vm.reviews = reviews.slice(0, visibleReviewListSize);
            } else {
                vm.hasMoreReviews = false;
            }
        }

        function viewMoreDates(){
            console.log('VIEW MORE DAATESSS');
            Elevator.toElement('calendar_widget');

        }

        function toggleEmailShow(){
          vm.showEmail = !vm.showEmail;
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
            return activity;
        }

        function _mapCalendars(activity){
            if(activity.calendars)
              activity.calendars = activity.calendars.map(mapVacancy);

            function mapVacancy(calendar){
                calendar.vacancy = calendar.capacity - calendar.assistants.length;
                calendar.total_price = calendar.session_price;
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

        function _getOrganizerActivities(organizer){
            ActivitiesManager.loadOrganizerActivities(organizer.id).then(success);

            function success(activities){
                console.log("Related Activities",activities);
                vm.relatedActivities = angular.copy(activities);
            }
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
        }

        function _getReviewRatingAvg(reviews){
            if(reviews.length === 0){ return 0; }
            if(reviews.length < 3){
              vm.hasMoreReviews = false;
            }
            return reviews.map(getRatings).reduce(reduceRatings);

            function getRatings(review){ return review.rating; }

            function reduceRatings(previous, current){ return previous + current; }
        }

        function _setSocialShare(){
            var current_url = $state.href($state.current.name, $state.params, {absolute: true});
            vm.social = {};
            angular.extend(vm.social, {
                FACEBOOK_SOCIAL_PROVIDER: 'facebook',
                FACEBOOK_API_KEY: serverConf.FACEBOOK_APP_KEY,
                FACEBOOK_SHARE_TYPE: "feed",
                FACEBOOK_SHARE_CAPTION: "Trulii.com | ¡Aprende lo que quieras en tu ciudad!",
                FACEBOOK_SHARE_TEXT: vm.activity.title,
                FACEBOOK_SHARE_MEDIA: vm.activity.main_photo,
                FACEBOOK_SHARE_DESCRIPTION: vm.activity.short_description,
                FACEBOOK_REDIRECT_URI: current_url,
                FACEBOOK_SHARE_URL: current_url,
                TWITTER_SOCIAL_PROVIDER: 'twitter',
                TWITTER_SHARE_ACCOUNT:'Trulii_',
                TWITTER_SHARE_TEXT:'Échale un vistazo a ' + vm.activity.title,
                TWITTER_SHARE_URL:current_url,
                TWITTER_SHARE_HASHTAGS:vm.activity.tags.join(','),
            });
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
                COPY_SOCIAL_BUTTONS: "¿Te gustó? Compártelo con tus amigos",
                COPY_SOCIAL_SHARE_FACEBOOK: "Compartir en Facebook",
                COPY_SOCIAL_SHARE_TWITTER: "Compartir en Twitter",
                COPY_SOCIAL_SHARE_EMAIL: "Compartir por Email",
                COPY_WAIT_NEW_DATES: "Espere nuevas fechas",
                COPY_ONE_CALENDAR_AVAILABLE: "Esta actividad se realizará en otra oportunidad ",
                COPY_MORE_CALENDARS_AVAILABLE: "Esta actividad se realizara en otras ",
                COPY_NO_CALENDARS_AVAILABLE: "Actualmente no hay otros calendarios disponibles",
                COPY_OPPORTUNITIES: " oportunidades",
                COPY_EMPTY_SECTION: "El Organizador no ha completado la información de esta sección aún ¡Regresa pronto!",
                COPY_SIMILAR_ACTIVITIES: "Actividades Similares",
                COPY_TODAY: "Hoy",
                COPY_DAY: "día ",
                COPY_DAYS: "días ",
                COPY_IN: "En ",
                COPY_TO: " a ",
                COPY_OF: " de ",
                COPY_NOT_AVAILABLE: "No Disponible",
                COPY_FREE: " Gratis",
                COPY_VACANCY_SINGULAR: " Vacante",
                COPY_VACANCY: " Vacantes",
                COPY_NO_VACANCY: "Sin vacantes",
                COPY_ONE_SESSION: "Sesión",
                COPY_OTHER_SESSIONS: "Sesiones",
                COPY_ONE_REVIEW: " Evaluación",
                COPY_OTHER_REVIEWS: " Evaluaciones",
                COPY_HEADER_SIGN_UP: "¿Todo listo para aprender?",
                COPY_SIGN_UP: "Inscribirse es más rápido que Flash, más seguro que Islandia y más seguro que la tabla del 1 ¡En serio!",
                COPY_HEADER_REASONS_TO_USE: "¿Por qué inscribirte con Trulii?",
                COPY_DOUBTS:"¿Alguna duda? Estamos a tu orden todos los días. Porque tú te lo mereces ",
                COPY_HEADER_REVIEWS: "Evaluaciones de las actividades de:",
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
                LABEL_METHODOLOGY: "Metodología",
                LABEL_EXTRA_INFO: "Adicionales",
                LABEL_RETURN_POLICY: "Política de Devolución",
                LABEL_MORE_COMMENTS: "Ver más comentarios",
                TAB_CALENDARS: "Calendarios",
                LABEL_ATTENDEES: "Asistentes",
                VALUE_WITH_CERTIFICATION: "Con Certificado",
                VALUE_WITHOUT_CERTIFICATION: "Sin Certificado",
                REASON_NO_COMMISSIONS: "Sin Comisiones",
                REASON_COPY_NO_COMMISSIONS: "En serio, ¡te lo prometemos!",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND: "Por si no se realiza la actividad.",
                REASON_SECURE: "Pago Seguro",
                REASON_COPY_SECURE: "Inscribete con tranquilidad.",
                EMAIL_MODAL_HEADER: "Comparte vía correo electrónico",
                EMAIL_MODAL_SEND_TO_LABEL: "Enviar a:",
                EMAIL_MODAL_SEND_TO_PLACEHOLDER: "Ingresa correos electronicos. Sepáralos entre sí con comas",
                EMAIL_MODAL_MESSAGE_LABEL: "Escribe un mensaje:",
                EMAIL_MODAL_MESSAGE_PLACEHOLDER: "Hey, échale un vistazo a esta actividad en Trulii. ¡Sé que te encantará!",
                EMAIL_MODAL_SEND: "Enviar invitacion"



                });
        }

        function _initWidget(){
            angular.element(document).ready(function () {
                vm.scroll = window.scrollY;
                vm.widgetOriginalPosition = document.getElementsByClassName('calendar-widget')[0].getBoundingClientRect().top + window.scrollY;
                vm.widgetMaxPosition = document.getElementsByClassName('map')[0].getBoundingClientRect().top + window.scrollY  - 80 - document.getElementsByClassName('calendar-widget')[0].offsetHeight;
                vm.widgetAbsolutePosition = document.getElementsByClassName('map')[0].getBoundingClientRect().top + window.scrollY - 80 - document.getElementsByClassName('calendar-widget')[0].offsetHeight * 2;
                $window.onscroll = function(){
                    vm.widgetMaxPosition = document.getElementsByClassName('map')[0].getBoundingClientRect().top + window.scrollY - 80 - document.getElementsByClassName('calendar-widget')[0].offsetHeight;
                    vm.widgetAbsolutePosition = document.getElementsByClassName('map')[0].getBoundingClientRect().top + window.scrollY - 80 - document.getElementsByClassName('calendar-widget')[0].offsetHeight * 2;
                    vm.scroll = window.scrollY;
                    $scope.$apply();
                };
            });
        }

        function _initSignup(){
          vm.selectedActivity = 0;
        }

        function _activate(){
            _setStrings();

            _setCurrentState();
            _setUpLocation(activity);
            _getOrganizerActivities(activity.organizer);
            activity = _mapCalendars(activity);
            activity = _mapPictures(activity);
            activity = _mapClosestCalendar(activity);
            activity = _mapInfo(activity);

            var reviewsAvg = _getReviewRatingAvg(reviews);
            console.log('avg', reviewsAvg);

            angular.extend(vm, {
                activity : activity,
                calendars : calendars,
                reviews : reviews,
                reviewsAvg: reviewsAvg,
                totalReviews: reviews.length,
                organizer : activity.organizer,
                calendar_selected : activity.closest_calendar
            });

            if(!(vm.activity.published)){
                Toast.setPosition("toast-top-center");
                Toast.error(vm.strings.ACTIVITY_DISABLED);
            }

            _setSocialShare();
            _initWidget();
            _initSignup();

            console.log('detail. activity:', vm.activity);
            console.log('detail. reviews:', reviews);
        }
    }
})();
