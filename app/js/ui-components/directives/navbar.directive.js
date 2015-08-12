/**
 * @ngdoc directive
 * @name trulii.ui-components.directives.truliiNavbar
 * @description truliiNavbar
 * @requires trulii.locations.services.LocationManager
 * @requires trulii.activities.services.Activity
 */

(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')
        .directive('truliiNavbar', truliiNavbar);

    truliiNavbar.$inject = ['$rootScope', '$timeout', '$state', 'UIComponentsTemplatesPath', 'Authentication', 'defaultPicture'];

    function truliiNavbar($rootScope, $timeout, $state, UIComponentsTemplatesPath, Authentication, defaultPicture) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "navbar.html",
            link: function (scope, element, attrs) {

                var unsubscribeUserChanged = null;
                var unsubscribeUserLoggedOut = null;
                
                scope.isSearchVisible = true;

                _activate();

                //--------- Internal Functions ---------//

                function _getUser() {
                    Authentication.getAuthenticatedAccount().then(success, error);

                    function success(user) {
                        if (!user) {
                            scope.user = null;
                            return;
                        }
                        scope.user = user;
                        Authentication.isOrganizer().then(function (result) {
                            scope.user.is_organizer = result;
                            scope.isSearchVisible = !result;
                        });
                        Authentication.isStudent().then(function (result) {
                            scope.user.is_student = result;
                        });
                        _mapDisplayName(scope.user);
                    }

                    function error() {
                        console.log('navbar response reject');
                        scope.user = null;
                    }
                }

                function _mapDisplayName(data) {
                    var user = data.user;
                    var company = data.name;
                    if (company) {
                        user.full_name = company;
                    } else if (user.full_name) {
                        console.log('Full Name already defined');
                    } else if (user.first_name && user.last_name) {
                        user.full_name = user.first_name;
                    } else {
                        user.full_name = 'User';
                    }

                    if (!data.photo) {
                        data.photo = defaultPicture;
                    }

                    $timeout(function () {
                        scope.$apply();
                    }, 0);
                }

                function _setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {
                        PLACEHOLDER_WANT_TO_LEARN: '¿Qué quieres aprender hoy?',
                        COPY_BECOME_ORGANIZER: '¿Quieres ser Organizador?',
                        ACTION_LOGIN: 'Inicia Sesión',
                        ACTION_REGISTER: 'Registrate',
                        ACTION_CREATE: 'Crear Actividad',
                        LABEL_CITY: 'Ciudad',
                        LABEL_CITY_DEFAULT: 'Ciudad..',
                        LABEL_PROFILE: 'Mi Perfil',
                        LABEL_ORGANIZER: 'Organizador',
                        LABEL_STUDENT: 'Estudiante',
                        LABEL_LOGOUT: 'Logout'
                    });
                }

                function _cleanUp() {
                    unsubscribeUserChanged();
                    unsubscribeUserLoggedOut();
                }

                function _activate() {
                    _setStrings();
                    _getUser();

                    unsubscribeUserChanged = $rootScope.$on(Authentication.USER_CHANGED_EVENT, function (event) {
                        console.log('navBar. on' + Authentication.USER_CHANGED_EVENT);
                        _getUser();
                    });

                    unsubscribeUserLoggedOut = $rootScope.$on(Authentication.USER_LOGOUT_EVENT, function (event) {
                        console.log('navBar. on' + Authentication.USER_LOGOUT_EVENT);
                        _getUser();
                    });

                    scope.$on('$destroy', _cleanUp);

                }
            }
        }
    }

})();