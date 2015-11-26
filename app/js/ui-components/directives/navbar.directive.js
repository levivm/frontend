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
            templateUrl: UIComponentsTemplatesPath + "trulii-navbar.html",
            link: function (scope, element, attrs) {

                var unsubscribeUserChanged = null;
                var unsubscribeUserLoggedOut = null;
                var unsubscribeStateChange = null;
                angular.extend(scope, {
                    state: null,
                    isSearchVisible : true,
                    showBurger : false,
                    toggleBurger: toggleBurger
                });

                _activate();

                // --------- Exposed Functions ----------//

                function toggleBurger(){
                  scope.showBurger = !scope.showBurger;
                }

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
                        ACTION_LOGIN: 'Iniciar Sesión',
                        ACTION_REGISTER: 'Registrarme',
                        ACTION_CREATE: 'Crear Actividad',
                        ACTION_CLOSE: "Cerrar",
                        ACTION_EXIT: "Salir",
                        COPY_BECOME_ORGANIZER: '¿Quieres ser Organizador?',
                        COPY_INVITE_FRIEND: 'Invita a un amigo',
                        LABEL_BLOG: 'Blog',
                        LABEL_ABOUT_US: 'Conócenos',
                        LABEL_ABOUT_MISSION: 'Misión',
                        LABEL_ABOUT_CULTURE: 'Cultura',
                        LABEL_ABOUT_TEAM: 'Equipo',
                        LABEL_ABOUT_CONTACT_US: 'Contáctanos',
                        LABEL_ORGANIZER: 'Organizador',
                        LABEL_ORGANIZER_HOW: '¿Cómo funciona?',
                        LABEL_ORGANIZER_HELP: 'Ayuda',
                        LABEL_STUDENT: 'Asistentes',
                        LABEL_STUDENT_HOW: '¿Cómo funciona?',
                        LABEL_STUDENT_HELP: 'Ayuda',
                        LABEL_ORGANIZER_ACTIVITIES: 'Mis Actividades',
                        LABEL_ORGANIZER_SALES: 'Mis Ventas',
                        LABEL_ORGANIZER_PROFILE: 'Perfil',
                        LABEL_ORGANIZER_ACCOUNT: 'Cuenta',
                        LABEL_ORGANIZER_REVIEWS: 'Comentarios Recibidos',
                        LABEL_ORGANIZER_INSTRUCTORS: 'Mis Instructores',
                        LABEL_STUDENT_ACTIVITIES: 'Mis Actividades',
                        LABEL_STUDENT_INVITE: 'Invitar Amigos',
                        LABEL_STUDENT_PROFILE: 'Perfil',
                        LABEL_STUDENT_ACCOUNT: 'Cuenta',
                        LABEL_STUDENT_PURCHASES: 'Mis Compras',
                        PLACEHOLDER_WANT_TO_LEARN: '¿Qué quieres aprender hoy?'
                    });
                }

                function _cleanUp() {
                    unsubscribeUserChanged();
                    unsubscribeUserLoggedOut();
                }

                function _activate() {
                    _setStrings();
                    _getUser();

                    unsubscribeStateChange = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                        scope.state = toState.name;
                        console.log(scope.state);
                    });

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
