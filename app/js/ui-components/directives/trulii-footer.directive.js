/**
 * @ngdoc directive
 * @name trulii.ui-components.directives.truliiFooter
 * @description truliiFooter
 */

(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')
        .directive('truliiFooter', truliiFooter);

    truliiFooter.$inject = ['UIComponentsTemplatesPath', 'serverConf', 'Elevator', '$state', '$window'];

    function truliiFooter(UIComponentsTemplatesPath, serverConf, Elevator, $state, $window) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "trulii-footer.html",
            link: function (scope) {
                var STATE_HOW_TO_WORK_HOME = 'home';
                var STATE_HOW_TO_WORK_ORGANIZER = 'organizer-landing';
                angular.extend(scope, {
                    toggleFooter: toggleFooter,
                    showFooter: {}
                });
                
                _activate();
                

                scope.getAmazonUrl = function(file){
                  return  serverConf.s3URL + '/' +  file;
                };
                scope.howToWorkStudent = function(){
                  _stateGoHowto(STATE_HOW_TO_WORK_HOME);
                }
                scope.howToWorkOrganizer = function(){
                  _stateGoHowto(STATE_HOW_TO_WORK_ORGANIZER);
                }

                function toggleFooter(param) {
                    scope.showFooter[param] = !scope.showFooter[param];
                }
                //---- Internal Functions----//

                function _stateGoHowto(howToWType){
                  var currentState = $state.current.name;
                  if(currentState===howToWType)
                    Elevator.toElement('anchor-how');
                  else
                    $state.go((currentState==='home') ? 'organizer-landing': 'home', {from_menu: true})

                }

                function _setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {
                        FOOTER_LINKS_ABOUT_US_HEADER: "Conócenos",
                        FOOTER_LINKS_ABOUT_US_ABOUT: "Sobre Nosotros",
                        FOOTER_LINKS_ABOUT_US_BLOG: "Blog",
                        FOOTER_LINKS_ABOUT_US_TERMS: "Términos y Condiciones",
                        FOOTER_LINKS_ABOUT_US_PRIVACY: "Políticas de Privacidad",
                        FOOTER_LINKS_ABOUT_US_CONTACT: "Contáctanos",
                        FOOTER_LINKS_STUDENTS_HEADER: "Asistentes",
                        FOOTER_LINKS_STUDENTS_HOW: "¿Cómo funciona?",
                        FOOTER_LINKS_STUDENTS_SUGGEST: "Sugiere un organizador",
                        FOOTER_LINKS_STUDENTS_INVITE: "Invita a un amigo",
                        FOOTER_LINKS_STUDENTS_FEEDBACK: "Danos tu feedback",
                        FOOTER_LINKS_STUDENTS_HELP: "Ayuda",
                        FOOTER_LINKS_STUDENTS_FAQ: "FAQ",
                        FOOTER_LINKS_ORGANIZER_HEADER: "Organizador",
                        FOOTER_LINKS_ORGANIZER_BE: "Sé Organizador",
                        FOOTER_LINKS_ORGANIZER_HOW: "¿Cómo funciona?",
                        FOOTER_LINKS_ORGANIZER_GUIDE: "Guía del Organizador",
                        FOOTER_LINKS_ORGANIZER_FEEDBACK: "Danos tu feedback",
                        FOOTER_LINKS_ORGANIZER_HELP: "Ayuda",
                        FOOTER_LINKS_ORGANIZER_FAQ: "FAQ",
                        FOOTER_LINKS_SOCIAL_HEADER: "¡Sé nuestro amigo!",
                        FOOTER_SHOW_ABOUT: 'about',
                        FOOTER_SHOW_STUDENT: 'student',
                        FOOTER_SHOW_ORGANIZER: 'organizer',
                        FOOTER_SHOW_SOCIAL: 'social'
                        
                    });

                }
                function _initShows() {
                    scope.showFooter={
                        about: !_isMobile(),
                        student: !_isMobile(),
                        organizer: !_isMobile(),
                        social: !_isMobile()
                    }
                    
                }
                function _isMobile(){
                    return $window.innerWidth < 768;
                }
                function _activate() {
                    _setStrings();
                    _initShows();
                }
            }
        }
    }

})();
