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

    ActivityDetailController.$inject = ['$scope', '$state', '$stateParams', 'moment', 'Elevator',
        'Toast', 'currentUser', 'activity', 'organizer', 'relatedActivities', 'calendars', 'reviews', 'defaultCover',
        'uiGmapIsReady', 'LocationManager', 'serverConf', 'Scroll'];

    function ActivityDetailController($scope, $state, $stateParams, moment, Elevator,
                                      Toast, currentUser, activity, organizer, relatedActivities, calendars, reviews,
                                      defaultCover, uiGmapIsReady, LocationManager, serverConf, Scroll) {
        var visibleReviewListSize = 3;
        var vm = this;
        angular.extend(vm, {
            city : null,
            calendars : [],
            reviews: [],
            relatedActivities: relatedActivities,
            calendar : null,
            activity : null,
            organizer : organizer,
            calendar_selected : null,
            selectedActivity: 0,
            currentGalleryPicture: 0,
            galleryOptions: {
                interval: 0,
                noWrap: false
            },
            formData: {
                emails: '',
                message: ''
            },
            scroll: 0,
            widgetOriginalPosition: 0,
            widgetMaxPosition: 0,
            widgetAbsolutePosition: 0,
            showEmail: false,
            showSessions: false,
            hasMoreReviews: true,
            changeSelectedCalendar : changeSelectedCalendar,
            isSelectedCalendarFull : isSelectedCalendarFull,
            previousGalleryPicture: previousGalleryPicture,
            nextGalleryPicture: nextGalleryPicture,
            signUp: signUp,
            showMoreReviews: showMoreReviews,
            viewMoreCalendars: viewMoreCalendars,
            toggleEmailShow: toggleEmailShow,
            toggleSessions: toggleSessions,
            shareEmailForm: shareEmailForm,
            showAudience: false,
            showContent: false,
            showGoals: false,
            showVideo: false,
            showMethodology: false,
            showRequirements: false,
            showExtra: false
        });

        _activate();

        // console.log('currentUser:', currentUser);

        //--------- Exposed Functions ---------//

        function previousGalleryPicture(){
            if(vm.currentGalleryPicture > 0){ vm.currentGalleryPicture--; }
        }

        function nextGalleryPicture(){
            if(vm.currentGalleryPicture < (vm.activity.gallery.length - 1)){ vm.currentGalleryPicture++; }
        }

        function isSelectedCalendarFull(){
            if(vm.calendar_selected){
                return vm.calendar_selected.assistants.length >= vm.calendar_selected.capacity;
            } else {
                return true;
            }
        }

        function changeSelectedCalendar(calendar) { vm.calendar_selected = calendar; }

        function signUp(activity_id, calendar_id){
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
                switch(currentUser.user_type){
                    case 'S':
                        $state.go('activities-enroll', enrollParams);
                        break;
                    case 'O':
                        Toast.error(vm.strings.TITLE_INVALID_USER, vm.strings.MSG_INVALID_USER);
                        break;
                }
            } else {
                $state.go('register', registerParams);
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

        function viewMoreCalendars(){
            Elevator.toElement('more_calendars_section');
        }

        function toggleEmailShow(){
          vm.showEmail = !vm.showEmail;
        }
        
        function toggleSessions(){
          vm.showSessions = !vm.showSessions;
        }

        function shareEmailForm(){
            if(!vm.formData.emails){
                Toast.warning(vm.strings.COPY_EMPTY_EMAIL);
                return;
            }

            if(!vm.formData.message){
                Toast.warning(vm.strings.COPY_EMPTY_MESSAGE);
                return;
            }

            activity.share(vm.formData).then(success, error);

            function success(response){
                Toast.success(vm.strings.COPY_SHARE_SUCCESS);
            }
            function error(error){
                Toast.error(vm.strings.COPY_SHARE_ERROR);
                console.log('Error sharing activity', error);
            }
        }

        //--------- Internal Functions ---------//

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
            }

            if(!activity.main_photo){
                activity.main_photo = defaultCover;
            }

            return activity;
        }

        function _mapCalendars(activity){
            activity.upcoming_calendars = [];
            if(activity.calendars){
                activity.calendars = activity.calendars.map(mapVacancy);
                var calendars = angular.copy(activity.calendars);
                activity.upcoming_calendars = _.remove(calendars, removePastCalendars);
            }

            return activity;

            function removePastCalendars(calendar){
                var passed = moment(calendar.initial_date).isBefore(moment().valueOf(), 'day');
                return !passed;
            }

            function mapVacancy(calendar){
                calendar.vacancy = calendar.available_capacity;
                calendar.total_price = calendar.session_price;
                return calendar;
            }
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
                activity.location.name = LocationManager.getCityById(activity.location.city).name;
            }

            vm.map = LocationManager.getMap(activity.location, false);
            vm.marker = LocationManager.getMarker(activity.location);

            //uiGmapIsReady.promise(1).then(function (instances) {
            //    instances.forEach(function (inst) {
            //        var map = inst.map;
            //        google.maps.event.trigger(map, 'resize');
            //        vm.map.control.refresh(vm.map.center);
            //    });
            //});
        }

        function _setCurrentState(){
            vm.current_state = {
                toState: {
                    state: $state.current.name,
                    params: $stateParams
                }
            };
        }

        function _getSelectedCalendar(activity){
            if (!activity.closest_calendar){ return; }

            if(moment(activity.closest_calendar.initial_date).isBefore(moment().valueOf(),'days')){
                return null;
            } else {
                return activity.closest_calendar;
            }
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
                TWITTER_SHARE_HASHTAGS:vm.activity.tags.join(',')
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
                ACTION_VIEW_OTHER_DATES: "Ver más fechas de inicio",
                ACTIVITY_DISABLED : "Esta actividad se encuentra inactiva",
                ACTIVITY_SOLD_OUT: "Agotado",
                COPY_SOCIAL_BUTTONS: "¿Te gustó? Compártelo con tus amigos",
                COPY_SOCIAL_SHARE_FACEBOOK: "Compartir en Facebook",
                COPY_SOCIAL_SHARE_TWITTER: "Compartir en Twitter",
                COPY_SOCIAL_SHARE_EMAIL: "Compartir por Email",
                COPY_SHARE_WIDGET: "¡Compártelo con tus amigos!",
                COPY_NO_RATINGS: "Sin Comentarios",
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
                COPY_OTHER_OPORTUNITY: "Oportunidad",
                COPY_OTHER_OPORTUNITIES: "Oportunidades",
                COPY_ONE_REVIEW: " Evaluación",
                COPY_OTHER_REVIEWS: " Evaluaciones",
                COPY_HEADER_SIGN_UP: "¿Todo listo para aprender?",
                COPY_SIGN_UP: "Inscribirse es más rápido que Flash, más seguro que Islandia y más seguro que la tabla del 1 ¡En serio!",
                COPY_HEADER_REASONS_TO_USE: "¿Por qué inscribirte con Trulii?",
                COPY_DOUBTS:"¿Alguna duda? Estamos a tu orden todos los días. Porque tú te lo mereces ",
                COPY_HEADER_REVIEWS: "Evaluaciones de las actividades de:",
                LABEL_START: "Inicio",
                LABEL_VACANCY: "Vacantes",
                LABEL_SESSIONS_NUMBER: "N° Sesiones",
                LABEL_COST: "Precio",
                LABEL_NEXT_DATE: "Próximo Inicio",
                LABEL_CLOSING_DATE: "Ventas hasta",
                LABEL_LEVEL: "Nivel",
                LABEL_DURATION: "Duration",
                LABEL_DESCRIPTION: "Descripción",
                LABEL_GET_TO_KNOW_US: "Conócenos",
                LABEL_CONTENT: "Contenido",
                LABEL_AUDIENCE: "Dirigido a",
                LABEL_ADDRESS: "Dirección",
                LABEL_GOALS: "Objetivo",
                LABEL_INSTRUCTORS: "Instructores",
                LABEL_REQUIREMENTS: "Requisitos",
                LABEL_METHODOLOGY: "Metodología",
                LABEL_EXTRA_INFO: "Adicionales",
                LABEL_RETURN_POLICY: "Política de Devolución",
                LABEL_MORE_COMMENTS: "Ver más comentarios",
                TITLE_INVALID_USER: "Sólo estudiantes pueden inscribirse en una Actividad",
                MSG_INVALID_USER: "Acción no permitida para tipo de usuario",
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
                EMAIL_MODAL_SEND: "Enviar invitacion",
                COPY_SHARE_SUCCESS: "La Actividad fue compartida exitosamente",
                COPY_SHARE_ERROR: "Error compartiendo la actividad, por favor intenta de nuevo",
                COPY_EMPTY_EMAIL: "Por favor agrega al menos un email",
                COPY_EMPTY_MESSAGE: "Por favor agrega un mensaje"
            });
        }

        function _initWidget(){
            angular.element(document).ready(function () {
                vm.scroll = window.scrollY;
                vm.widgetOriginalPosition = document.getElementsByClassName('calendar-widget')[0].getBoundingClientRect().top + window.scrollY;
                vm.widgetMaxPosition = document.getElementsByClassName('map')[0].getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('calendar-widget')[0].offsetHeight - 80;
                vm.widgetAbsolutePosition = (document.getElementsByClassName('map')[0].getBoundingClientRect().top - document.getElementsByClassName('widget-container')[0].getBoundingClientRect().top) - document.getElementsByClassName('calendar-widget')[0].offsetHeight - 80;
                $scope.$on('scrolled',
                  function(scrolled, scroll){
                    vm.widgetMaxPosition = document.getElementsByClassName('map')[0].getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('calendar-widget')[0].offsetHeight - 80;
                    vm.widgetAbsolutePosition = (document.getElementsByClassName('map')[0].getBoundingClientRect().top - document.getElementsByClassName('widget-container')[0].getBoundingClientRect().top) - document.getElementsByClassName('calendar-widget')[0].offsetHeight - 80;
                    vm.scroll = scroll;
                    $scope.$apply();
                  }
                );
            });
        }

        function _initSignup(){
          vm.selectedActivity = 0;
        }

        function _activate(){
            _setStrings();
            _setCurrentState();
            activity = _mapCalendars(activity);
            activity = _mapPictures(activity);
            activity = _mapInfo(activity);
            _setUpLocation(activity);

            angular.extend(vm, {
                activity : activity,
                calendars : calendars,
                reviews : reviews,
                totalReviews: reviews.length,
                hasMoreReviews: reviews.length > 3,
                calendar_selected : _getSelectedCalendar(activity)
            });

            if(!(vm.activity.published)){
                Toast.setPosition("toast-top-center");
                Toast.error(vm.strings.ACTIVITY_DISABLED);
            }

            _setSocialShare();
            _initWidget();
            _initSignup();

            //console.log('detail. activity:', vm.activity);
            //console.log('detail. reviews:', reviews);
        }
    }
})();
