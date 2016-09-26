
/**
 * @ngdoc controller
 * @name trulii.landing.controllers.HomeController
 * @description HomeController
 * @requires trulii.activities.services.ActivitiesManager
 */

(function () {
    'use strict';

    angular
        .module('trulii.landing.controllers')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['Elevator', '$state', '$scope', '$rootScope', 'activities', 'generalInfo', 'LocationManager','serverConf', 'Analytics', '$sce', '$stateParams'];
    function HomeController(Elevator, $state, $scope, $rootScope, activities, generalInfo, LocationManager, serverConf, Analytics, $sce, $stateParams) {


        var ACTIVITIES_STEP = 8;
        var activitiesIndex = 0;
        var vm = this;
        angular.extend(vm, {
            activities : [],
            categories: [],
            options : {
                actions: ['view', 'edit', 'contact', 'manage', 'republish']
            },
            trendingCategories: [],
            showVideo: false,
            activitiesCount: activities.count,
            hasMoreActivities: true,
            toggleVideoShow: toggleVideoShow,
            loadActivities: loadActivities,
            viewMoreActivities: viewMoreActivities,
            organizerCategories: organizerCategories,
            searchCategory:searchCategory,
            coverVideo: {},
            getAmazonUrl: getAmazonUrl,
            getAmazonVideoUrl:getAmazonVideoUrl,
            cards: []
        });

        _activate();

        //--------- Exposed Functions ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        function getAmazonVideoUrl(file){
            return  $sce.trustAsResourceUrl( serverConf.s3URL + '/' +  file);
        }

        function toggleVideoShow(){
          vm.showVideo = !vm.showVideo;
        }

        function loadActivities(){
            if(activities.results.length > activitiesIndex){
                var begin = activitiesIndex;
                var end = activitiesIndex + ACTIVITIES_STEP;
                if(activities.results.length < end) { end = activities.results.length; }
                vm.activities = activities.results.slice(begin, end);
                activitiesIndex = end;
            } else {
                vm.hasMoreActivities = false;
                console.log('End of activities reached');
            }
        }

        function viewMoreActivities(){
            var city = LocationManager.getSearchCity();
            $state.go('search', {'city': city.id});
        }

        function organizerCategories(index){
            return index < 2 ? 'col-md-6' :  index === 5 ?  'col-md-8': 'col-md-4';
        }

        function searchCategory(category){
            Analytics.generalEvents.searchCategoryLanding(category.name)
        }
        // --------- Internal Functions ---------//

        function _setCategories(){
            vm.categories = angular.copy(generalInfo.categories);
        }

        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                HEADER_TITLE_COPY: "¡Hoy es un nuevo día para aprender!",
                HEADER_TEXT_COPY: "Encuentra e inscríbete en las mejores clases y cursos en Bogotá.",
                HEADER_SEARCH_PLACEHOLDER: "¿Qué quieres aprender hoy?",
                HEADER_CITY_PLACEHOLDER: "Elige tu ciudad",
                REASON_NO_COMMISSIONS: "Servicio gratuito",
                REASON_COPY_NO_COMMISSIONS: "Sólo paga por el valor de la clase. No cobramos comisiones.",
                REASON_REFUND: "Devolución garantizada",
                REASON_COPY_REFUND: "Te devolvemos tu dinero en caso de no realizarse la actividad.",
                REASON_SECURE: "Paga seguro",
                REASON_COPY_SECURE: "Los datos de tu pago están encriptados y seguros con nosotros.",
                ACTIVITIES_TITLE_COPY: "Actividades populares",
                ACTIVITIES_TEXT_COPY: "Hacemos de tu ciudad un sitio con infinitas posibilidades para aprender algo nuevo.",
                ACTIVITIES_BUTTON_COPY: "Ver más actividades similares",
                VIDEO_COPY: "¡Con Trulii puedes ser quien tú quieras!",
                VIDEO_TEXT: "Queremos abrirte las puertas del conocimiento en tu ciudad, facilitar tu aprendizaje, ayudarte a mejorar tu currículum y ayudarte a aprovechar tu tiempo libre. " +
                             "Encuentra en un solo sitio e inscríbete en línea en cualquier clase, curso, taller o diplomado de tu ciudad, desde clases de yoga hasta diplomados de finanzas. "+
                             "<br>¡Ve nuestro video para que nos conozcas un poquito más!",
                CATEGORIES_TITLE_COPY: "Categorías",
                CATEGORIES_TEXT_COPY: "Habla un nuevo idioma. Aprende a tocar un nuevo instrumento. Ponte en forma. Mejora tu currículo. ¡Aprende lo que quieras!",
                HOW_TITLE_COPY: "¿Cómo funciona?",
                HOW_TEXT_COPY: "En cada rincón de tu ciudad existe algo nuevo que aprender. Nosotros te lo facilitamos en tres pasos:",
                HOW_FIND_COPY: "Encuentra",
                HOW_FIND_TEXT: "Clases y cursos de cualquier tipo. ¡Tú eliges!",
                HOW_SIGN_UP_COPY: "Inscríbete",
                HOW_SIGN_UP_TEXT: "En la actividad que más te llame la atención.",
                HOW_LEARN_COPY: "Aprende",
                HOW_LEARN_TEXT: "¡Disfruta y aprende todo lo que puedas!",
                HOW_REVIEW_COPY: "Evalúa",
                HOW_REVIEW_TEXT: "La actividad para que otros tengan una referencia.",
                ORGANIZERS_TITLE: "Algunos de nuestros organizadores",
                PUBLISH_COPY: "¿Quieres publicar una actividad?",
                PUBLISH_TEXT_1: "Trulii es el <strong>mejor espacio</strong> para dar a conocer " +
                "tu actividad. Bien sea un curso de cocina, una classe de cross-fit, un foro de negocios o un diplomado universitario, nosotros " +
                "te ayudamos a <strong>aumentar tus ingresos</strong> buscándote nuevos asistentes mientras tú <strong>te enfocas en enseñar</strong> lo que te gusta.",
                PUBLISH_TEXT_2: "Regístrate sin costo alguno y comienza a llenar tus cupos. ¡Trabajemos juntos!",
                PUBLISH_TEXT_3: "¡Crece con nosotros!",
                PUBLISH_BUTTON_COPY: "Me interesa, ¡Cuéntame más!"
            });
        }



        function _initScroll(){
            $scope.$on('scrolled',
              function(scrolled, scroll){
                vm.scroll = scroll;
                $scope.$apply();
              }
            );
        }
        function _fromBurgerMenu(){
          angular.element(document).ready(function () {
              if ($stateParams.from_menu){
                  setTimeout(function(){ Elevator.toElement('anchor-how'); }, 2000);
                  $stateParams.from_menu=null;
              }
           });

        }

        function _mapTemplates(){
            for(var i = 0; i < activities.results.length; i++){
                activities.results[i].template = "partials/activities/dynamic_layout_item.html";
            }
            vm.cards = activities.results;

        }

        function _setTrendingCategories() {
            var categories = [];
            angular.forEach(vm.categories, function(category){
                angular.forEach(category.subcategories, function(subcategory){
                    if(subcategory.featured){
                        var sub = angular.copy(subcategory);
                        sub.category = category;
                        categories.push(sub);
                    }
                });
            });
            vm.trendingCategories = categories.slice(0, 3);
        }

        function _activate(){
            _setStrings();
            _setCategories();
            loadActivities();
            _initScroll();
            _fromBurgerMenu();
            _mapTemplates();
            _setTrendingCategories();
            //Analytics.generalEvents.landing();
             vm.currentCity = LocationManager.getCurrentCity();
            //Function for angularSeo
            $scope.htmlReady();
        }

    }
})();
