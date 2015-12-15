
/**
 * @ngdoc controller
 * @name trulii.about.controllers
 * @description AboutController
 */

(function () {
    'use strict';

    angular
        .module('trulii.about.controllers')
        .controller('AboutController', AboutController);

    AboutController.$inject = ['$scope', '$window'];

    function AboutController($scope, $window) {
        var vm = this;

        angular.extend(vm,{
          scroll: 0,
          widgetOriginalPosition: 0,
          widgetMaxPosition: 0,
          widgetAbsolutePosition: 0
        });

        _activate();

        //--------- Functions Implementation ---------//

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                WIDGET_MISSION_COPY: "Misión",
                WIDGET_CULTURE_COPY: "Cultura",
                WIDGET_TEAM_COPY: "Equipo",
                ACTION_VIEW_PRESENTATION: "Ver presentación",

                // CULTURE

                CULTURE_TITLE: "Comienza el viaje",
                CULTURE_TITLE_TEXT: "Nuesto deseo es llegar a cada rincón del planeta.",

                CULTURE_SECTION_1_CONTENT_TITLE: "Queremos ser memorables",
                CULTURE_SECTION_1_CONTENT_TEXT_1: "Es muy común que las empresas que generan un impacto positivo en las vidas de las personas y hacen del mundo un lugar mejor tienen presencia en casi cada rincón del planeta. Para lograrlo hace falta determinación, ganas y muchísima motivación para cecer y consolidarnos como empresa.",
                CULTURE_SECTION_1_CONTENT_TEXT_2: "Apenas estamos comenzando, pero créenos, estamos más que preparados.",

                CULTURE_GRAPH_BRANCH_1_HEADER: "Prioridades",
                CULTURE_GRAPH_BRANCH_1_TEXT_1: "Usuario > Equipo > Trulii",

                CULTURE_GRAPH_BRANCH_2_HEADER: "Estrategia",
                CULTURE_GRAPH_BRANCH_2_TEXT_1: "Misión",
                CULTURE_GRAPH_BRANCH_2_TEXT_2: "Producto",
                CULTURE_GRAPH_BRANCH_2_TEXT_3: "Métricas",
                CULTURE_GRAPH_BRANCH_2_TEXT_4: "Resultados",

                CULTURE_GRAPH_BRANCH_3_HEADER: "Transparencia",
                CULTURE_GRAPH_BRANCH_3_TEXT_1: "Rendición de cuentas",
                CULTURE_GRAPH_BRANCH_3_TEXT_2: "Motivación",
                CULTURE_GRAPH_BRANCH_3_TEXT_3: "Disciplina",
                CULTURE_GRAPH_BRANCH_3_TEXT_4: "Confianza",

                CULTURE_GRAPH_BRANCH_4_HEADER: "Balance vida - trabajo",
                CULTURE_GRAPH_BRANCH_4_TEXT_1: "Equipo contento",
                CULTURE_GRAPH_BRANCH_4_TEXT_2: "+ Desempeño",

                CULTURE_COVER_TITLE: "Valores en Trulii",
                CULTURE_COVER_TEXT: "Los valores que nos mueven como empresa.",

                CULTURE_SECTION_2_CONTENT_TITLE: "¿Cuáles valores son importantes para nosotros?",
                CULTURE_SECTION_2_CONTENT_TEXT_1: "Determinamos un conjunto de valores que:",

                CULTURE_DETERMINING_VALUE_1: "Se apliquen en el trabajo.",
                CULTURE_DETERMINING_VALUE_2: "Optimicen nuestra relación con los usuarios.",
                CULTURE_DETERMINING_VALUE_3: "Hagan un ambiente inspirador y agradable.",
                CULTURE_DETERMINING_VALUE_4: "Puedan extrapolarse a la vida cotidiana.",
                CULTURE_DETERMINING_VALUE_5: "Nos hagan eficientes para deleitar a los usuarios.",
                CULTURE_DETERMINING_VALUE_6: "Permita discernir candidatos en nuestro proceso de reclutamiento.",

                CULTURE_VALUE_1: "Humildad",
                CULTURE_VALUE_2: "Claridad",
                CULTURE_VALUE_3: "Empatía",
                CULTURE_VALUE_4: "Eficiencia",
                CULTURE_VALUE_5: "Curiosidad",
                CULTURE_VALUE_6: "Pasión",


                // END CULTURE

                // MISSION

                MISSION_TITLE: "Ofreciendo una nueva forma",
                MISSION_TITLE_TEXT: "de encontrar y aprender lo que te apasiona en tu ciudad. Y apenas estamos calentando motores...",

                MISSION_CONTENT_SECTION_1_TITLE: "Nuestra misión",
                MISSION_CONTENT_SECTION_1_TEXT_1: "La vida es muy corta. Todos lo sabemos y es por ello que debemos tratar de vivirla al máximo; para ello, no hay mejor forma de hacerlo que a través de experiencias que te enseñen. Descubrir una nueva pasión, mejorar tus habilidades profesionales o simplemente aprender algo nuevo no tiene por qué ser una tarea imposible.",
                MISSION_CONTENT_SECTION_1_TEXT_2: "Cada ciudad es un mundo propio con un sinfín de opciones para aprender cosas que realmente te apasionan y te llenan como persona. ¿Por qué entonces no lo hacemos? En realidad, no había una plataforma digital de calidad, segura e intuitiva que permitiera encontrar lo que quieres aprender cerca de donde vives y que, además, facilitara la posibilidad de inscribirse de manera rápida, fácil y sin costo alguno.",
                MISSION_CONTENT_SECTION_1_TEXT_3: "En Trulii queremos cambiar esto creando el primer marketplace local de clases y eventos educativos con la misión bonita de cambiar (y mejorar) cómo se conectan las personas que quieren enseñar su pasión con las que quieren aprender. En pocas palabras, queremos abrirte las puertas para aprender algo nuevo, mejorar tu currículo o descubrir una nueva pasión.",
                MISSION_CONTENT_SECTION_1_TEXT_4: "Somos un equipo pequeño y apasionado conformado por jóvenes programadores, diseñadores y comunicadores reunidos en Colombia para llevar a cabo esta linda tarea. Aunque etamos comenzando nada más en Colombia, no somos egoístas: estamos trabajando día y noche para compartir este sueño en todos los rincones del planeta. Y en este preciso momento, nos enorgullece compartirlo contigo.",

                MISSION_CONTENT_SECTION_2_TITLE: "¡Bienvenido a Trulii!",

                MISSION_ACTION_LEARN_1: "¡Hoy es un nuevo dia para aprender!",
                MISSION_ACTION_LEARN_2: "¡Quiero aprender ahora!",

                MISSION_ACTION_PUBLISH_1: "Publicar mi actividad",
                MISSION_ACTION_PUBLISH_2: "¡Quiero organizar mi actividad!",

                // END MISSION

                // TEAM

                TEAM_TITLE: "Trabajamos para deleitarte",
                TEAM_TITLE_TEXT: "Poniéndole mucho corazón y talento para alcanzar la excelencia",

                TEAM_CONTENT_SECTION_1_TITLE: "El equipo",
                TEAM_CONTENT_SECTION_1_TEXT: "Somos un equipo pequeño conformado en su mayoría por programadores, creativos y diseñadores trabajando con muchísimas ganas para llevar nuestra misión a escala global.",

                // END TEAM
            });
        }

        function _initWidget(){
            angular.element(document).ready(function () {
                vm.scroll = document.body.scrollTop;
                vm.widgetOriginalPosition = document.getElementsByClassName('about-container')[0].getBoundingClientRect().top + window.scrollY;

                vm.widgetOriginalPosition = document.getElementsByClassName('navigation-widget')[0].getBoundingClientRect().top + window.scrollY;
                vm.widgetMaxPosition = document.getElementsByClassName('about-delimiter')[0].getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('navigation-widget')[0].offsetHeight - 200;
                vm.widgetAbsolutePosition = (document.getElementsByClassName('about-delimiter')[0].getBoundingClientRect().top - document.getElementsByClassName('navigation-container')[0].getBoundingClientRect().top) - document.getElementsByClassName('navigation-widget')[0].offsetHeight - 200;
                $scope.$on('scrolled',
                  function(scrolled, scroll){
                    vm.scroll = scroll;
                    vm.widgetMaxPosition = document.getElementsByClassName('about-delimiter')[0].getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('navigation-widget')[0].offsetHeight - 200;
                    vm.widgetAbsolutePosition = (document.getElementsByClassName('about-delimiter')[0].getBoundingClientRect().top - document.getElementsByClassName('navigation-container')[0].getBoundingClientRect().top) - document.getElementsByClassName('navigation-widget')[0].offsetHeight - 200;
                    $scope.$apply();
                  }
                );
            });
        }


        function _activate(){
            _setStrings();
            _initWidget();
            console.log(vm.widgetMaxPosition);
            console.log(vm.scroll);
        };

    }
})();
