
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

    AboutController.$inject = ['$scope', '$window', '$state', 'serverConf'];

    function AboutController($scope, $window, $state, serverConf) {
        var vm = this;
        var TEAM_STATE = 'about.team',
            MISSION_STATE = 'about.mission',
            CULTURE_STATE = 'about.culture';
             
        angular.extend(vm,{
          scroll: 0,
          widgetOriginalPosition: 0,
          widgetMaxPosition: 0,
          widgetAbsolutePosition: 0,
          getAmazonUrl: getAmazonUrl,
          changeContentCover: changeContentCover,
          selectTitle: '',
          showSidebar: false,
          toggleSidebar:toggleSidebar
          
        });

        _activate();

        //--------- Functions Implementation ---------//
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        
        function changeContentCover(state) {
            switch (state) {
                case TEAM_STATE:
                    vm.selectTitle = vm.strings.WIDGET_TEAM_COPY;
                    break;
                case MISSION_STATE:
                    vm.selectTitle = vm.strings.WIDGET_MISSION_COPY;
                    break;
                case CULTURE_STATE:
                    vm.selectTitle = vm.strings.WIDGET_CULTURE_COPY;
                    break;    
                default:
                    break;
            }
            
           
        }
        
        function toggleSidebar() {
            vm.showSidebar=!vm.showSidebar;
        }
        

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                
                TERMS_TITLE:"Términos y condiciones",
                PRIVACY_TITLE: "Política de privacidad",
                WIDGET_MISSION_COPY: "Misión",
                WIDGET_CULTURE_COPY: "Cultura",
                WIDGET_TEAM_COPY: "Equipo",
                ACTION_VIEW_PRESENTATION: "Ver presentación",

                // CULTURE

                CULTURE_TITLE: "Comienza el viaje",
                CULTURE_TITLE_TEXT: "Nuestro deseo es llegar a cada rincón del planeta.",
                SHOW_PRESENTATION_COPY: "Ver presentación",
                CULTURE_SECTION_1_CONTENT_TITLE: "Aspiramos a mucho más",
                CULTURE_SECTION_1_CONTENT_TEXT_1: "Trulii = Startup = Crecimiento. Como cualquier startup aspiramos a crecer en cada rincón del planeta para consolidarnos como una empresa lider en el sector y hacer de cada ciudad un lugar con infinitas posibilidades para aprender cosas nuevas.",
                CULTURE_SECTION_1_CONTENT_TEXT_2: "Aspiramos a ser una empresa global, rentable y próspera donde prima el bienestar y la fecilidad que nuestros usuarios, aliados y trabajadores. Tenemos las ganas, la determinación y el corazón para que todo sea posible.",
                CULTURE_SECTION_1_CONTENT_TEXT_3: "Y aunque apenas estamos comenzando, ya estamos pensando en el mañana. Porque aspiramos a mucho más.", 

                CULTURE_GRAPH_BRANCH_1_HEADER: "Priorizar",
                CULTURE_GRAPH_BRANCH_1_TEXT_1: "Trulii",
                CULTURE_GRAPH_BRANCH_1_TEXT_2: "Equipo",
                CULTURE_GRAPH_BRANCH_1_TEXT_3: "Usuarios",

                CULTURE_GRAPH_BRANCH_2_HEADER: "Planificar",
                CULTURE_GRAPH_BRANCH_2_TEXT_1: "Misión",
                CULTURE_GRAPH_BRANCH_2_TEXT_2: "Producto",
                CULTURE_GRAPH_BRANCH_2_TEXT_3: "Métricas",
                CULTURE_GRAPH_BRANCH_2_TEXT_4: "Resultados",

                CULTURE_GRAPH_BRANCH_3_HEADER: "Deleitar",
                CULTURE_GRAPH_BRANCH_3_TEXT_1: "Detallistas",
                CULTURE_GRAPH_BRANCH_3_TEXT_2: "Creativos",
                CULTURE_GRAPH_BRANCH_3_TEXT_3: "Atentos",

                CULTURE_GRAPH_BRANCH_4_HEADER: "Aprender",
                CULTURE_GRAPH_BRANCH_4_TEXT_1: "Investigar",
                CULTURE_GRAPH_BRANCH_4_TEXT_2: "Analizar",
                CULTURE_GRAPH_BRANCH_4_TEXT_3: "Compartir",
                CULTURE_GRAPH_BRANCH_4_TEXT_4: "Aprender",

                CULTURE_COVER_TITLE: "Nuestros valores",
                CULTURE_COVER_TEXT: "Conoce nuestro código de ética y conducta.",

                CULTURE_SECTION_2_CONTENT_TITLE: "¿Cuáles valores son importantes para nosotros?",
                CULTURE_SECTION_2_CONTENT_TEXT_1: "Determinamos un conjunto de valores que:",

                CULTURE_DETERMINING_VALUE_1: "Se apliquen en el trabajo y puedan extrapolarse a la vida cotidiana.",
                CULTURE_DETERMINING_VALUE_2: "Optimicen nuestra relación con los usuarios.",
                CULTURE_DETERMINING_VALUE_3: "Hagan que el ambiente inspirador y agradable.",
                CULTURE_DETERMINING_VALUE_4: "Nos mantenga en constante aprendizaje.",
                CULTURE_DETERMINING_VALUE_5: "Aude a deleitar a los usuarios.",
                CULTURE_DETERMINING_VALUE_6: "Nos permita discernir candidatos en nuestro proceso de reclutamiento.",

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
                MISSION_CONTENT_SECTION_1_TEXT_1: "La vida es muy corta. Quieres hacer y aprender al mismo tiempo miles de cosas que siempre te han apasionado o dado curiosidad, pero el tiempo transcurre y aún no lo haces. Muchas veces por falta de tiempo, otras por pereza o miedo. Las razones pueden ser diversas. Nosotros te entendemos, por eso hemos creado Trulii.",
                MISSION_CONTENT_SECTION_1_TEXT_2: "En Trulii queremos dejarte sin razones ni excusas. Descubrir una nueva pasión, mejorar tus habilidades profesionales o simplemente aprender algo nuevo no tiene por qué ser una tarea imposible. Ahora tu ciudad podrá ser un lugar con infinitas posibilidades para hacer aquello qie llevas tiempo posponiendo.",
                MISSION_CONTENT_SECTION_1_TEXT_3: "Trulii es el primer marketplace local de actividades educativas que realmente conecta a personas que quieren enseñar con las que quieren aprender. Suena fácil, pero es un reto. Y muy bonito, por cierto. Trabajamos fuerte para brindarte una plataforma amigable e intuitiva que te permita encontrar todo lo que quieras aprender en tu ciudad y pagar la inscripción de forma fácil, rápida y segura.",
                MISSION_CONTENT_SECTION_1_TEXT_4: "Hecho en y para Colombia por un equipo de jóvenes desarrolladores, diseñadores y apasionados del marketing. Aunque estamos comenzando este emocionante proyecto en Colombia, no somos egoistas: todos los días le ponemos el alma para compartir este sueño en todos los rincones del planeta. Y en este momento, nos emociona compartirlo contigo.",

                MISSION_CONTENT_SECTION_2_TITLE: "Hecho con amor para ti.",

                MISSION_ACTION_LEARN_1: "¡Quiero aprender algo nuevo!",

                MISSION_ACTION_PUBLISH_1: "¡Quiero aumentar mis inscripciones!",

                // END MISSION

                // TEAM

                TEAM_TITLE: "Trabajamos para deleitarte",
                TEAM_TITLE_TEXT: "Poniéndole corazónpara hacerte feliz y ofrecerte el mejor servicio posible.",

                TEAM_CONTENT_SECTION_1_TITLE: "El Equipo",
                TEAM_CONTENT_SECTION_1_TEXT: "Somos un equipo pequeño conformado en su mayoría por programadores, creativos y diseñadores trabajando con muchísimas ganas para que te enamores de Trulii y llevar nuestra misión a escala global.",

                // END TEAM
            });
        }

    

        function _activate(){
            _setStrings();
           
            changeContentCover($state.current.name);
        };

    }
})();
