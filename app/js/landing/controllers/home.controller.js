
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

    HomeController.$inject = ['video', 'activities', 'generalInfo'];
    function HomeController(video, activities, generalInfo) {

        var ACTIVITIES_STEP = 5;
        var activitiesIndex = 0;
        var categories = [];
        var vm = this;
        angular.extend(vm, {
            activities : [],
            categories: [],
            options : {
                actions: ['view', 'edit', 'contact', 'manage', 'republish']
            },
            showVideo: false,
            activitiesCount: activities.length,
            hasMoreActivities: true,
            toggleVideoShow: toggleVideoShow,
            loadActivities: loadActivities

        });

        _activate();

        //--------- Exposed Functions ---------//

        function toggleVideoShow(){
          vm.showVideo = !vm.showVideo;
        }

        function loadActivities(){
            if(activities.length > activitiesIndex){
                var begin = activitiesIndex;
                var end = activitiesIndex + ACTIVITIES_STEP;
                if(activities.length < end) { end = activities.length; }
                vm.activities = activities.slice(begin, end);
                activitiesIndex = end;
            } else {
                vm.hasMoreActivities = false;
                console.log('End of activities reached');
            }
        }

        //--------- Internal Functions ---------//

        function _setCategories(){
            categories = [
                {
                    id: 1,
                    cover: "/css/img/categories/languages.jpg"
                },
                {
                    id: 2,
                    cover: "/css/img/categories/fitness.jpg"
                },
                {
                    id: 3,
                    cover: "/css/img/categories/lifestyle.jpg"
                },
                {
                    id: 4,
                    cover: "/css/img/categories/technology.jpg"
                },
                {
                    id: 5,
                    cover: "/css/img/categories/kids.jpg"
                },
                {
                    id: 6,
                    cover: "/css/img/categories/art.jpeg"
                },
                {
                    id: 7,
                    cover: "/css/img/categories/professional.jpg"
                },
                {
                    id: 8,
                    cover: "/css/img/categories/gastronomy.jpg"
                },
                {
                    id: 9,
                    cover: "/css/img/categories/dance.jpg"
                },
                {
                    id: 10,
                    cover: "/css/img/categories/music.jpeg"
                }
            ];
            categories.forEach(extendCategory);
            vm.categories = categories;

            function extendCategory(category){
                var categoryInfo = getCategoryById(category.id);
                if(categoryInfo){
                    angular.extend(category, categoryInfo);
                }

                function getCategoryById(id){
                    return generalInfo.categories.filter(function(category){
                        return category.id === id;
                    })[0];
                }
            }
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
                PUBLISH_TEXT_1: "Trulii es el mejor espacio para",
                PUBLISH_TEXT_2: "dar a conocer",
                PUBLISH_TEXT_3: "tu actividad. Bien sea un curso de cocina, una classe de crossfit, un foro de negocios o un diplomado universitario, nosotros",
                PUBLISH_TEXT_4: "te abrimos la puerta",
                PUBLISH_TEXT_5: "a nuevos clientes y hacemos el trabjao sucio por ti.",
                PUBLISH_TEXT_6: "Regístrate",
                PUBLISH_TEXT_7: "sin costo alguno",
                PUBLISH_TEXT_8: "y disfruta de nuestra prueba",
                PUBLISH_TEXT_9: "gratuita",
                PUBLISH_TEXT_10: "en tus primeras tres actividades.",
                PUBLISH_TEXT_11: "¡Crece con nosotros!",
                PUBLISH_BUTTON_COPY: "Ser organizador",
                CATEGORY_FITNESS: "Fitness",
                CATEGORY_MUSIC: "Música",
                CATEGORY_LIFESTYLE: "Estilo de vida",
                CATEGORY_PROFESSIONAL: "Profesional",
                CATEGORY_ART: "Arte",
                CATEGORY_TECHNOLOGY: "Tecnología",
                CATEGORY_KIDS: "Niños",
                CATEGORY_GASTRONOMY: "Gastronomía",
                CATEGORY_LANGUAGES: "Idiomas",
                CATEGORY_DANCE: "Danza"
            });
        }

        function _activate(){
            _setStrings();
            _setCategories();
            loadActivities();
            video.addSource('webm', '/videos/home1.webm');
            video.addSource('webm', '/videos/home2.webm');
            video.addSource('webm', '/videos/home3.webm');
        }

    }
})();
