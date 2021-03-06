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
        'Toast', 'currentUser', 'activity', 'organizer', 'relatedActivities', 'calendars', 'reviews', 'builtReviews', 'defaultCover',
        'uiGmapIsReady', 'LocationManager', 'serverConf', 'Scroll', 'Facebook', 'Analytics', 'StudentsManager', 'SearchManager'];

    function ActivityDetailController($scope, $state, $stateParams, $filter, $timeout, moment, Elevator,
                                      Toast, currentUser, activity, organizer, relatedActivities, calendars, reviews, builtReviews,
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
            package_selected: 1,
            selectedPackage: 0,
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
            showGallery: false,
            showSessions: false,
            hasMoreReviews: true,
            showSchedules: false,
            changeSelectedCalendar : changeSelectedCalendar,
            isSelectedCalendarFull : isSelectedCalendarFull,
            isSelectedPackageFull : isSelectedPackageFull,
            previousGalleryPicture: previousGalleryPicture,
            nextGalleryPicture: nextGalleryPicture,
            signUp: signUp,
            calendarSignUp:calendarSignUp,
            widgetSignup:widgetSignup,
            showMoreReviews: showMoreReviews,
            toggleSchedules: toggleSchedules,
            toggleEmailShow: toggleEmailShow,
            toggleGalleryShow: toggleGalleryShow,
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
            schedulesScrollUp: schedulesScrollUp,
            schedulesScrollDown: schedulesScrollDown,
            schedulesOffset: 0,
            changePackage: changePackage,
            organizerRating: 0


        });

        _activate();

        //--------- Exposed Functions ---------//

        function changePackage(pack){
            vm.package_selected = _.find(vm.activity.calendars[0].packages, {'id': parseInt(pack)});
        }

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' + file;
        }

        function schedulesScrollUp (){
            if(vm.schedulesOffset < 0){
                vm.schedulesOffset++;
                document.getElementsByClassName('schedules-container__html')[0].style.transform = 'translateY('+ vm.schedulesOffset*60 +'px)';
            }
        }
        function schedulesScrollDown(){
            vm.schedulesOffset--;
            document.getElementsByClassName('schedules-container__html')[0].style.transform = 'translateY('+ vm.schedulesOffset*60 +'px)';
        }

        function previousGalleryPicture(){
            if(vm.currentGalleryPicture > 0){ vm.currentGalleryPicture--; }
        }

        function nextGalleryPicture(){
            if(vm.currentGalleryPicture < (vm.activity.gallery.length - 1)){ vm.currentGalleryPicture++; }
        }

        function isSelectedCalendarFull(){
            if(vm.calendar_selected){
                return vm.calendar_selected.available_capacity <= 0 ||
                       moment(vm.calendar_selected.initial_date).isBefore(moment().valueOf() , 'day') ||
                       !vm.calendar_selected.enroll_open;
            } else {
                return true;
            }
        }

        function isSelectedPackageFull(){
            if(vm.package_selected)
                return vm.activity.calendars[0].available_capacity <= 0 || !vm.activity.calendars[0].enroll_open ;

            return true;

        }

        function changeSelectedCalendar(calendar) { vm.calendar_selected = vm.activity.upcoming_calendars[calendar]; }

        function signUp(activity_id, calendar_id, package_id){
            var enrollParams = {
                category_slug: vm.activity.category.slug,
                activity_title: vm.title,
                activity_id: vm.activity.id,
                calendar_id: calendar_id,
                package_id: package_id,
            };

            if(vm.activity.is_open){
                enrollParams.package_id = vm.selectedPackage;
            }
            var registerParams = {
                toState: {
                    state: 'activities-enroll',
                    params: {
                        activity_id: activity_id,
                        calendar_id: calendar_id,
                        package_id: package_id
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
                      activity_title: vm.activity.title,
                      category_slug: vm.activity.category_slug
                  }
              }
          };

          if(currentUser){
              switch(currentUser.user_type){
                  case 'S':
                      StudentsManager.postWishList(vm.activity.id).then(function(data){
                          vm.activity.wish_list=!vm.activity.wish_list;
                          vm.activity.wishlist_count = vm.activity.wish_list ? vm.activity.wishlist_count+1:vm.activity.wishlist_count-1;
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
                vm.reviews = reviews.results.slice(0, visibleReviewListSize);
            } else {
                vm.hasMoreReviews = false;
            }
        }

        function toggleSchedules(){
            vm.showSchedules = !vm.showSchedules;
        }

        function toggleEmailShow(){
            vm.showEmail = !vm.showEmail;
            vm.formData.message = vm.social.EMAIL_SHARE_TEXT;
        }

        function toggleGalleryShow(){
            vm.showGallery = !vm.showGallery;
            console.log(vm.showGallery);
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
            var calendars;
            if (activity.is_open && activity.calendars){
                calendars = angular.copy(activity.calendars);
                activity.upcoming_calendars = angular.copy(_.remove(calendars, removePastCalendarOpenActivity));

            }
            else if(!activity.is_open && activity.calendars){
                activity.calendars = activity.calendars.map(mapVacancy);
                calendars = angular.copy(activity.calendars);
                activity.upcoming_calendars = angular.copy(_.remove(calendars, removePastCalendars));
            }

            return activity;

            function removePastCalendarOpenActivity(calendar){
                return true;
            }

            function removePastCalendars(calendar){
                var passed = moment(calendar.initial_date).isBefore(moment().valueOf() , 'day');
                var vacancy = calendar.available_capacity > 0;
                return !passed && vacancy;
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
                LocationManager.getCityById(activity.location.city).then(function(response){
                     activity.location.name = response.name;
                });
            }
            vm.map = LocationManager.getMap(activity.location, false);
            vm.marker = LocationManager.getMarker(activity.location);


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

            var calendar = _.find(activity.upcoming_calendars, {'id': parseInt($stateParams.calendar_id)});
            if (calendar)
                return calendar;

            if (!activity.closest_calendar){ return; }
            if(moment(activity.closest_calendar.initial_date).isBefore(moment().valueOf(),'days')){
                return null;
            } else {
                return activity.closest_calendar;
            }
        }

        function _getSelectedPackage(activity){
            if(activity.is_open){
                var calendar = _getSelectedCalendar(activity);
                if (!calendar)
                    return;
                var _package = calendar.packages[0];
                if ($stateParams.package_id)
                     _package = _.find(calendar.packages, {'id': parseInt($stateParams.package_id)});

                vm.selectedPackage = _package ? _package.id.toString(): null;
                return _package;
            }
        }
        function _mapProductObj(productObj){
            var offer = {  
                "@type":"Offer",
                "priceCurrency":"COP",
                "price": 0,
                "availability":"In Stock",
                "availabilityStarts":"",
                "availabilityEnds": "",
                "url":productObj.url
            };
            var review =  {  
                "@type":"Review",
                "datePublished":"",
                "reviewBody":" ",
                "author":"",
                "reviewRating":{  
                    "@type":"Rating",
                    "ratingValue":0,
                    "bestRating":5,
                    "worstRating":1
                }
            };
            if( vm.package_selected ){
                angular.forEach(vm.activity.calendars[0].packages, function(pack){
                    offer.price = pack.price;
                    offer.availabilityStarts = vm.activity.calendars[0].initial_date.toString();
                    productObj.offers.push(offer);
                });
            }else{
                 angular.forEach(vm.activity.calendars, function(calendar){
                    offer.price = calendar.session_price;
                    offer.availabilityStarts = calendar.initial_date.toString();
                    productObj.offers.push(offer);
                });
            }
            angular.forEach(vm.reviews, function(rev){
                review.datePublished = rev.created_at.toString();
                review.reviewBody = rev.comment;
                review.author = rev.author.user.first_name +' '+ rev.author.user.last_name;
                review.reviewRating.ratingValue = rev.rating;
                productObj.review.push(review);
            });
            
        }
        
        function _removeScriptSeo() {
            var element = document.getElementById('seoJson');
            if(!element){
                return true;
            }else{
                 document.getElementsByTagName("head")[0].removeChild (element);
                 _removeScriptSeo();
            }
        }
        
        function _initObjectsSeo(){
            var current_url = $state.href($state.current.name, $state.params, {absolute: true});
            var websiteObj = {  
                "@context":"http://schema.org",
                "@type":"WebSite",
                "name":"Trulii",
                "url":"https://www.trulii.com",
                "potentialAction":{  
                    "@type":"SearchAction",
                    "target":"https://www.trulii.com/buscar?q=search_term_string&city=1",
                    "query-input":"required name=search_term_string"
                }
            }
            var breadCrumbObj = {
                "@context": "http://schema.org",
                "@type":"BreadcrumbList",
                "itemListElement":[  
                    {  
                        "@type":"ListItem",
                        "item":{  
                            "@type":"Thing",
                            "@id":"https://trulii.com",
                            "name":"Home",
                            "url":"https://trulii.com"
                        },
                        "position":1
                    },
                    {  
                        "@type":"ListItem",
                        "item":{
                            "@type":"Thing",
                            "@id":"https://trulii.com/actividades/"+vm.activity.category.slug,
                            "name":vm.activity.category.name,
                            "image": getAmazonUrl(vm.activity.category.cover_photo),
                            "url":"https://trulii.com/actividades/"+vm.activity.category.slug
                        },
                        "position":2
                    },
                    {  
                        "@type":"ListItem",
                        "item":{  
                            "@type":"Thing",
                            "@id":current_url,
                            "name":vm.activity.title,
                            "image": vm.activity.main_photo,
                            "url":current_url,
                        },
                        "position":3
                    },
                ]
            }
            var productObj = {
                "@context": "http:\/\/schema.org",
                "@type": "Product",
                "image": vm.activity.main_photo,
                "name": vm.activity.title,
                "description": vm.activity.short_description,
                "url": current_url,
                "offers": [],
                "brand": {
                    "@context": "http:\/\/schema.org",
                    "@type": "Organization",
                    "name": vm.activity.organizer.name,
                    "description": vm.activity.organizer.bio,
                    "url": "https://trulii.com/organizador/"+vm.activity.organizer.id,
                    "location": {
                        "@context": "http:\/\/schema.org",
                        "@type": "Place",
                        "@id": vm.activity.location.id,
                        "name": vm.activity.organizer.name,
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": vm.activity.location.address,
                            "addressRegion": "Bogotá"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": vm.activity.location.point[0],
                            "longitude": vm.activity.location.point[1],
                        }
                    }
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": vm.activity.rating
                },
                "review": []
            }
            
            _mapProductObj(productObj);
            _removeScriptSeo();
            _setSeoScript(websiteObj);
            _setSeoScript(breadCrumbObj);
            _setSeoScript(productObj);
        }
        function  _setSeoScript(dataObj) {
            var script   = document.createElement("script");
            script.type  = "application/ld+json"; // use this for linked script
            script.text  = JSON.stringify(dataObj)
            script.id= "seoJson";
            document.getElementsByTagName("head")[0].appendChild(script); 
        }
        function _setSocialShare(){
            var current_url = $state.href($state.current.name, $state.params, {absolute: true});
            vm.social = {};
            angular.extend(vm.social, {
                FACEBOOK_SOCIAL_PROVIDER: 'facebook',
                FACEBOOK_API_KEY: serverConf.FACEBOOK_APP_KEY,
                FACEBOOK_SHARE_TYPE: "feed",
                FACEBOOK_SHARE_CAPTION: "Trulii.com | ¡Aprende lo que quieras en tu ciudad!",
                FACEBOOK_SHARE_TEXT: vm.activity.title + ' - ' + vm.activity.short_description + '"',
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
                    }
            });

        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_CONTACT_US: "Contáctanos",
                ACTION_SIGN_UP: "Inscribirme",
                ACTION_VIEW_SCHEDULES: "Ver horarios",
                ACTIVITY_DISABLED:"Así está quedando tu publicación. Regresa a editar en caso que quieras hacer algún cambio",
                COPY_SIMILAR_ACTIVITIES: "Actividades Similares",
                COPY_MORE_SIMILAR_ACTIVITIES: "Ver más actividades similares",
                COPY_TO: " a ",
                COPY_FREE: " Gratis",
                COPY_VACANCY_SINGULAR: " vacante",
                COPY_VACANCY: " vacantes",
                COPY_NO_VACANCY: "Sin vacantes",
                COPY_HEADER_SIGN_UP: "¿Todo listo para aprender?",
                COPY_SIGN_UP: "Inscribirse es más rápido que Flash, más seguro que Islandia y más fácil que la tabla del 1. ¡En serio!",
                COPY_SIGN_UP_NO_DATES: "Por ahora no hay fechas disponibles para la clase.",
                COPY_ENROLL_CLOSED: "Por ahora las inscripciones están deshabilitadas.",
                COPY_HEADER_REASONS_TO_USE: "¿Por qué inscribirte con Trulii?",
                COPY_DOUBTS:"¿Alguna duda? Estamos a tu orden todos los días",
                LABEL_EVALUATIONS: "Evaluaciones",
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
                LABEL_EXTRA_INFO: "Información importante",
                LABEL_RETURN_POLICY: "Política de Devolución",
                LABEL_MORE_COMMENTS: "Ver más comentarios",
                LABEL_SHOW_GALLERY: "Mostrar galería",
                TITLE_INVALID_USER: "Sólo estudiantes pueden inscribirse en una Actividad",
                TITLE_INVALID_LIKE_USER: "Sólo estudiantes pueden agregar una actividad a mis favoritos",
                MSG_INVALID_USER: "Acción no permitida para tipo de usuario",
                VALUE_WITH_CERTIFICATION: "Con Certificado",
                VALUE_WITHOUT_CERTIFICATION: "Sin Certificado",
                VALUE_DOESNT_APPLY: "No aplica",
                VALUE_LEVEL: "Nivel",
                VALUE_DURATION: "Duración",
                REASON_NO_COMMISSIONS: "Servicio gratuito",
                REASON_COPY_NO_COMMISSIONS: "Sólo paga por el valor de la clase. No cobramos comisiones.",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND: "Te devolvemos tu dinero en caso de no realizarse la actividad.",
                REASON_SECURE: "Pago Seguro",
                REASON_COPY_SECURE: "Los datos de tu pago están encriptados y seguros con nosotros.",
                EMAIL_MODAL_HEADER: "CUÉNTALE A UN AMIGO SOBRE ESTA ACTIVIDAD POR CORREO ELECTRÓNICO",
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
                COPY_SINGULAR_NUMBER_OF_LIKES: "persona ama esto",
                COPY_BE_THE_FIRST: "¡Sé el primero!",
                COPY_VIEW_PUBLISHED_ACTIVITIES: "Ver actividades publicadas",
                LABEL_OPEN_CALENDAR: "Horario Abierto",
                LABEL_CLOSED_CALENDAR: "Horario Fijo",
                LABEL_STARTS: "Inicios",
                LABEL_PACKAGES: "Planes",
                COPY_CLASSES_SINGULAR: " Clase",
                COPY_CLASSES: " Clases",
                COPY_ADD_TO_WISHLIST: "Agregar a favoritos",
                COPY_REMOVE_FROM_WISHLIST: "Quitar de favoritos"
            });
        }
        function _updateWidgetValues(){
            if(document.getElementsByClassName('activity-detail')[0]){
               vm.scroll = window.scrollY;
                vm.widgetOriginalPosition = document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().top + window.scrollY + 50;
                vm.widgetMaxPosition = document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().bottom + window.scrollY ;
                vm.widgetAbsolutePosition = (document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().bottom + window.scrollY) - (document.getElementsByClassName('trulii-cover-regular')[0].getBoundingClientRect().bottom + window.scrollY) +100;
                vm.widgetFixedPositionLeft = document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().left + 30;
                vm.widgetFixedPositionRight = document.getElementsByClassName('activity-detail')[0].getBoundingClientRect().right - 30 - 250; 
            }
            
        }
        function _initWidget(){
            angular.element(document).ready(function () {
                _updateWidgetValues();
                $scope.$on('scrolled',
                  function(scrolled, scroll){
                    _updateWidgetValues();
                    $scope.$apply();
                  }
                );
                $scope.$on('resized', function(){
                    _updateWidgetValues();
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
            vm.title = title;
            $state.go('activities-detail', 
                      {activity_id: activity.id, activity_title: title, 
                       category_slug: activity.category.slug} ,
                      {location: "replace", notify: false, reload: false, inherit: false});

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

        function _setOrganizerRating(){
            vm.organizerRating = vm.organizer.rating.toString().replace(',', '.');
        }

        function _activate(){
            _setStrings();
            _setCurrentState();
            _updateUrl();
            activity.calendars = angular.copy(calendars);
            activity = _mapCalendars(activity);
            activity = _mapPictures(activity);
            activity = _mapInfo(activity);
            _mapTemplates();
            _setUpLocation(activity);
            reviews.results = builtReviews.concat(reviews.results);
            console.log(reviews.results);
            angular.extend(vm, {
                activity : activity,
                calendars : calendars,
                reviews : reviews.results.slice(0, visibleReviewListSize),
                totalReviews: reviews.results.length,
                hasMoreReviews: reviews.results.length > 3,
                calendar_selected : _getSelectedCalendar(activity),
                package_selected: _getSelectedPackage(activity)
            });


            if(!(vm.activity.published)){
                Toast.success(vm.strings.ACTIVITY_DISABLED);
            }
            
           

            _setSocialShare();
            _initWidget();
            _initSignup();
            _setSearchData();
            _updateViewCount();
            _setOrganizerRating();
            _initObjectsSeo();
            vm.showLevel = vm.activity.level === "N" ? false:true;
            //Function for angularSeo
            Analytics.ecommerce.detailActivity(vm.activity, vm.package_selected?vm.package_selected:vm.calendar_selected);
            
            $scope.htmlReady();
        }
    }
})();
