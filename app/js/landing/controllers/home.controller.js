
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

    HomeController.$inject = ['Elevator', '$state', '$scope', 'activities', 'generalInfo', 'LocationManager','serverConf', 'Analytics', '$sce', '$stateParams'];
    function HomeController(Elevator, $state, $scope, activities, generalInfo, LocationManager, serverConf, Analytics, $sce, $stateParams) {


        var ACTIVITIES_STEP = 8;
        var activitiesIndex = 0;
        var vm = this;
        angular.extend(vm, {
            activities : [],
            categories: [],
            options : {
                actions: ['view', 'edit', 'contact', 'manage', 'republish']
            },
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
            getAmazonVideoUrl:getAmazonVideoUrl
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
                HEADER_TEXT_COPY: "Consigue e inscríbete en las mejores actividades y eventos educativos de tu ciudad.",
                HEADER_SEARCH_PLACEHOLDER: "¿Qué quieres aprender hoy?",
                HEADER_CITY_PLACEHOLDER: "Elige tu ciudad",
                REASON_NO_COMMISSIONS: "Sin comisiones",
                REASON_COPY_NO_COMMISSIONS: "En serio ¡Te lo prometemos!",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND: "Por si no se realiza la actividad",
                REASON_SECURE: "Pago seguro",
                REASON_COPY_SECURE: "Inscríbete con tranquilidad",
                ACTIVITIES_TITLE_COPY: "Actividades",
                ACTIVITIES_TEXT_COPY: "Encuentra en tu ciudad talleres, cursos, diplomados y ponencias de cualquier tipo. Tú eliges.",
                ACTIVITIES_BUTTON_COPY: "Ver más actividades",
                VIDEO_COPY: "¡Con Trulii puedes ser quien tú quieras!",
                CATEGORIES_TITLE_COPY: "Categorías",
                CATEGORIES_TEXT_COPY: "Habla un nuevo idioma. Aprende a tocar un nuevo instrumento. Ponte en forma. Mejora tu currículo. ¡Aprende lo que quieras!",
                HOW_TITLE_COPY: "¿Cómo funciona?",
                HOW_TEXT_COPY: "En cada rincón de tu ciudad existe algo nuevo que aprender. Nosotros te lo facilitamos en tres pasos:",
                HOW_FIND_COPY: "Encuentra",
                HOW_FIND_TEXT: "Lo que quieras aprender.",
                HOW_SIGN_UP_COPY: "Inscríbete",
                HOW_SIGN_UP_TEXT: "Tu pago está en buenas manos con nosotros.",
                HOW_LEARN_COPY: "Aprende",
                HOW_LEARN_TEXT: "La vida es corta. ¡Aprende todo lo que puedas!",
                PUBLISH_COPY: "¿Quieres publicar una actividad?",
                PUBLISH_TEXT_1: "Trulii es el mejor espacio para dar a conocer " +
                "tu actividad. Bien sea un curso de cocina, una classe de crossfit, un foro de negocios o un diplomado universitario, nosotros " +
                "te abrimos la puerta a nuevos clientes y hacemos el trabajo sucio por ti.",
                PUBLISH_TEXT_2: "Regístrate sin costo alguno y disfruta de nuestra prueba gratuita en tus primeras tres actividades.",
                PUBLISH_TEXT_3: "¡Crece con nosotros!",
                PUBLISH_BUTTON_COPY: "Quiero ser organizador"
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

        function _activate(){
            _setStrings();
            _setCategories();
            loadActivities();
            _initScroll();
            _fromBurgerMenu();
            //Analytics.generalEvents.landing();

        }

    }
})();
