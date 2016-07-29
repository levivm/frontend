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

    ActivityDetailController.$inject = ['$scope', '$state', '$stateParams', '$filter', '$timeout', 'moment', 'Elevator',
        'Toast', 'currentUser', 'activity', 'organizer', 'relatedActivities', 'calendars', 'reviews', 'defaultCover',
        'uiGmapIsReady', 'LocationManager', 'serverConf', 'Scroll', 'Facebook', 'Analytics', 'StudentsManager', 'SearchManager'];

    function ActivityDetailController($scope, $state, $stateParams, $filter, $timeout, moment, Elevator,
                                      Toast, currentUser, activity, organizer, relatedActivities, calendars, reviews,
                                      defaultCover, uiGmapIsReady, LocationManager, serverConf, Scroll, Facebook, Analytics, StudentsManager, SearchManager) {
                                          
        var visibleReviewListSize = 3;
        var vm = this;

        angular.extend(vm, {
            city : null,
            calendars : [],
            reviews: [],
            cards: [],
            relatedActivities: relatedActivities.results.slice(0, 4),
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
            calendarSignUp:calendarSignUp,
            widgetSignup:widgetSignup,
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
            showExtra: false,
            shareSocialAnalytic:shareSocialAnalytic,
            wishList:wishList,
            verifyWishList:verifyWishList,
            getAmazonUrl: getAmazonUrl,
            facebookShares: 0,
        });

        _activate();

        //--------- Exposed Functions ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' + file;
        }

        function previousGalleryPicture(){
            if(vm.currentGalleryPicture > 0){ vm.currentGalleryPicture--; }
        }

        function nextGalleryPicture(){
            if(vm.currentGalleryPicture < (vm.activity.gallery.length - 1)){ vm.currentGalleryPicture++; }
        }

        function isSelectedCalendarFull(){
            if(vm.calendar_selected){
                return vm.calendar_selected.available_capacity <= 0;
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


        function wishList(){
          var registerParams = {
              toState: {
                  state: 'activities-detail',
                  params: {
                      activity_id: vm.activity.id,
                      activity_title: vm.activity.title
                  }
              }
          };

          if(currentUser){
              switch(currentUser.user_type){
                  case 'S':
                      StudentsManager.postWishList(vm.activity.id).then(function(data){
                          vm.activity.wish_list=!vm.activity.wish_list;
                      });
                      break;
                  case 'O':
                      Toast.error(vm.strings.TITLE_INVALID_LIKE_USER, vm.strings.MSG_INVALID_USER);
                      break;
              }
          } else {
              $state.go('register', registerParams);
          }

        }
        function verifyWishList(){

          return currentUser ? vm.activity.wish_list: false;

        }
        //Functions for analytics states
        function calendarSignUp(){
            Analytics.studentEvents.enrollCalendar();
        }
        function widgetSignup(){
            Analytics.studentEvents.enrollWidget();
        }
        function shareSocialAnalytic(social, target){
            Analytics.generalEvents.shareActivity(social, target);
        }
        // End Functions for analytics states


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
            vm.formData.message = vm.social.EMAIL_SHARE_TEXT;
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
                shareSocialAnalytic(vm.strings.EMAIL_MODAL_HEADER, vm.activity.title);
                Toast.success(vm.strings.COPY_SHARE_SUCCESS);
            }
            function error(error){
                Toast.error(vm.strings.COPY_SHARE_ERROR);
                console.log('Error sharing activity', error);
            }
        }

        function _setSearchData(){
            SearchManager.setCategory(activity.category.id);
            SearchManager.setCity(activity.location.city);
            vm.searchData = SearchManager.getSearchData();
            // $state.go('search', vm.searchData);
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
                var passed = moment(calendar.closing_sale).isBefore(moment().valueOf() , 'day');
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
                activity.location.city = activity.location.city.id ? activity.location.city.id: activity.location.city;
                activity.location.name = LocationManager.getCityById(activity.location.city).name;
            }
            vm.map = LocationManager.getMap(activity.location, false);
            vm.marker = LocationManager.getMarker(activity.location);
            vm.marker.options = {icon: getAmazonUrl('static/img/map.png')};
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
                FACEBOOK_SHARE_TEXT: 'Comparte esto con tus amigos o menciónalos con @ "' + vm.activity.title + ' - ' + vm.activity.short_description + '"',
                FACEBOOK_SHARE_MEDIA: vm.activity.main_photo,
                FACEBOOK_SHARE_DESCRIPTION: vm.activity.short_description,
                FACEBOOK_REDIRECT_URI: current_url,
                FACEBOOK_SHARE_URL: current_url,
                TWITTER_SOCIAL_PROVIDER: 'twitter',
                TWITTER_SHARE_ACCOUNT: 'Trulii_',
                TWITTER_SHARE_TEXT: 'Amé esta actividad en @Trulii_  ' + vm.activity.title + ' #Aprende',
                TWITTER_SHARE_URL:current_url,
                TWITTER_SHARE_HASHTAGS: '#Aprende',
                LINKEDIN_SOCIAL_PROVIDER: 'linkedin',
                LINKEDIN_SHARE_TEXT: vm.activity.title + ' - ' + vm.activity.short_description,
                LINKEDIN_SHARE_DESCRIPTION: vm.activity.short_description,
                LINKEDIN_SHARE_URL: current_url,
                WHATSAPP_SOCIAL_PROVIDER: 'whatsapp',
                WHATSAPP_SHARE_TEXT: '¡Hey!, échale un vistazo a esta actividad en Trulii a la que planeo asistir dentro de poco. Avísame si te interesa y vamos juntos. ¡Sé que te encantará!',
                WHATSAPP_SHARE_URL: current_url,
                MESSENGER_SOCIAL_PROVIDER: 'facebook-messenger',
                MESSENGER_SHARE_URL: current_url,
                EMAIL_SHARE_TEXT: '¡Hey!, échale un vistazo a esta actividad en Trulii a la que planeo asistir dentro de poco. Avísame si te interesa y vamos juntos. ¡Sé que te encantará!'
            });

            Facebook.api({
                    method: 'links.getStats',
                    urls: current_url.toString()
                },
                function (response) {
                    if(response.length > 0){
                        vm.facebookShares = response[0].share_count;
                        console.log(response[0].share_count);
                    }
            });

        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_CONTACT_US: "Contáctanos",
                ACTION_SIGN_UP: "Inscribirme",
                ACTION_VIEW_OTHER_DATES: "Ver más fechas de inicio",
                COPY_SIMILAR_ACTIVITIES: "Actividades Similares",
                COPY_MORE_SIMILAR_ACTIVITIES: "Ver más actividades similares",
                COPY_TO: " a ",
                COPY_FREE: " Gratis",
                COPY_VACANCY_SINGULAR: " vacante",
                COPY_VACANCY: " vacantes",
                COPY_NO_VACANCY: "Sin vacantes",
                COPY_HEADER_SIGN_UP: "¿Todo listo para aprender?",
                COPY_SIGN_UP: "Inscribirse es más rápido que Flash, más seguro que Islandia y más fácil que la tabla del 1. ¡En serio!",
                COPY_SIGN_UP_NO_DATES: "Por ahora no hay fechas disponibles para la clase, agrégala a favoritos y te avisaremos cuando hayan más fechas disponibles.",
                COPY_HEADER_REASONS_TO_USE: "¿Por qué inscribirte con Trulii?",
                COPY_DOUBTS:"¿Alguna duda? Estamos a tu orden todos los días",
                LABEL_SCHEDULE: "Horario",
                LABEL_START: "Inicio",
                LABEL_VACANCY: "Vacantes",
                LABEL_SESSIONS_NUMBER: "N° de Clases",
                LABEL_COST: "Precio",
                LABEL_NEXT_DATE: "Próxima fecha de inicio",
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
                LABEL_EXTRA_INFO: "Info Extra",
                LABEL_RETURN_POLICY: "Política de Devolución",
                LABEL_MORE_COMMENTS: "Ver más comentarios",
                TITLE_INVALID_USER: "Sólo estudiantes pueden inscribirse en una Actividad",
                TITLE_INVALID_LIKE_USER: "Sólo estudiantes pueden agregar una actividad a mis favoritos",
                MSG_INVALID_USER: "Acción no permitida para tipo de usuario",
                VALUE_WITH_CERTIFICATION: "Con Certificado",
                VALUE_WITHOUT_CERTIFICATION: "Sin Certificado",
                VALUE_DOESNT_APPLY: "No aplica",
                VALUE_LEVEL: "Nivel",
                VALUE_DURATION: "Duración",
                REASON_NO_COMMISSIONS: "Sin Comisiones",
                REASON_COPY_NO_COMMISSIONS_1: "Nuestro servicio para ti",
                REASON_COPY_NO_COMMISSIONS_2: "es totalmente gratuito.",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND_1: "Protegemos tu pago hasta",
                REASON_COPY_REFUND_2: "que se efectúe la clase.",
                REASON_SECURE: "Pago Seguro",
                REASON_COPY_SECURE_1: "Los datos del pago de tu",
                REASON_COPY_SECURE_2: "inscripción están seguros",
                REASON_COPY_SECURE_3: "con nosotros.",
                EMAIL_MODAL_HEADER: "Compartir la actividad correo electrónico",
                EMAIL_MODAL_SEND_TO_LABEL: "Enviar a:",
                EMAIL_MODAL_SEND_TO_PLACEHOLDER: "Ingresa correos electronicos. Sepáralos entre sí con comas",
                EMAIL_MODAL_MESSAGE_LABEL: "Escribe un mensaje:",
                EMAIL_MODAL_MESSAGE_PLACEHOLDER: "Hey, échale un vistazo a esta actividad en Trulii. ¡Sé que te encantará!",
                EMAIL_MODAL_SEND: "Enviar",
                EMAIL_MODAL_DISMISS: "Cancelar",
                COPY_SHARE_SUCCESS: "La Actividad fue compartida exitosamente",
                COPY_SHARE_ERROR: "Error compartiendo la actividad, por favor intenta de nuevo",
                COPY_EMPTY_EMAIL: "Por favor agrega al menos un email",
                COPY_EMPTY_MESSAGE: "Por favor agrega un mensaje",
                COPY_NUMBER_OF_LIKES: "personas aman esto",
                COPY_BE_THE_FIRST: "¡Sé el primero!",
                COPY_VIEW_PUBLISHED_ACTIVITIES: "Ver actividades publicadas: "
            });
        }
        function _updateWidgetValues(){
            vm.scroll = window.scrollY;
            vm.widgetOriginalPosition = document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().top + window.scrollY + 50;
            vm.widgetMaxPosition = document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().bottom + window.scrollY - 420 - 70;
            vm.widgetAbsolutePosition = (document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().bottom + window.scrollY) - 420 - (document.getElementsByClassName('trulii-cover-regular')[0].getBoundingClientRect().bottom + window.scrollY);
            vm.widgetFixedPositionLeft = document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().left + 30;
            vm.widgetFixedPositionRight = document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().right - 30 - 250;
        }
        function _initWidget(){
            angular.element(document).ready(function () {
                _updateWidgetValues()
                $scope.$on('scrolled',
                  function(scrolled, scroll){
                    _updateWidgetValues()
                    $scope.$apply();
                  }
                );
                $scope.$on('resized', function(){
                    _updateWidgetValues()
                    $scope.$apply();
                });
            });
        }

        function _initSignup(){
          vm.selectedActivity = 0;
        }

        function _updateUrl(){

            // Title sanitation
            var title = activity.title;
            title = title.replace(/[`~!¡¿@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

            // Replacing whitespaces with hyphens
            title = title.split(' ').join('-').toLowerCase();

            // Replacing most common special characters
            var dict = {"á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u", "ç":"c", "ñ":"n"};
            title = title.replace(/[^\w ]/g, function(char) {
              return dict[char] || char;
            });
            
            $state.go('activities-detail', {activity_id: activity.id, activity_title: title, category_slug: activity.category.slug} ,{location: "replace", notify: false, reload: true});
            
        }
        
        function _mapTemplates(){
            for(var i = 0; i < vm.relatedActivities.length; i++){
                vm.relatedActivities[i].template = "partials/activities/dynamic_layout_item.html";
            }
            vm.relatedActivities = vm.relatedActivities.splice(0, 4);
            vm.cards = vm.relatedActivities;
        }

        function _updateViewCount() {
            activity.updateViewsCounter();

        }


        function _activate(){
            console.log('activating');
            _setStrings();
            _setCurrentState();
            _updateUrl();
            activity.calendars = angular.copy(calendars);
            activity = _mapCalendars(activity);
            activity = _mapPictures(activity);
            activity = _mapInfo(activity);
            _mapTemplates();
            _setUpLocation(activity);
            angular.extend(vm, {
                activity : activity,
                calendars : calendars,
                reviews : reviews.results,
                totalReviews: reviews.results.length,
                hasMoreReviews: reviews.results.length > 3,
                calendar_selected : _getSelectedCalendar(activity)
            });


            if(!(vm.activity.published)){
                Toast.setPosition("toast-top-center");
                Toast.error(vm.strings.ACTIVITY_DISABLED);
            }

            _setSocialShare();
            _initWidget();
            _initSignup();
            _setSearchData();
            _updateViewCount();

            console.log(vm.organizer);

        }
    }
})();
