/**
 * @ngdoc directive
 * @name trulii.ui-components.directives.truliiDashboardFooter
 * @description truliiDashboardFooter
 */

(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')
        .directive('truliiDashboardFooter', truliiDashboardFooter);

    truliiDashboardFooter.$inject = ['UIComponentsTemplatesPath'];

    function truliiDashboardFooter(UIComponentsTemplatesPath) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "trulii-dashboard-footer.html",
            link: function (scope) {

                _activate();

                function _setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {
                        FOOTER_LINKS_BLOG: "Blog",
                        FOOTER_LINKS_TERMS_CONDITIONS: "Terminos y condiciones",
                        FOOTER_LINKS_TIPS: "Tips para publicar",
                        FOOTER_LINKS_FEEDBACK: "Danos tu feedback",
                        FOOTER_LINKS_CONTACT_US: "Contáctanos"
                    });
                }

                function _activate() {
                    _setStrings();
                }
            }
        }
    }

})();
