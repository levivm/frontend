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

    truliiNavbar.$inject = ['$rootScope', '$timeout', 'UIComponentsTemplatesPath', 'LocationManager', 'Authentication',
        'defaultPicture'];

    function truliiNavbar($rootScope, $timeout, UIComponentsTemplatesPath, LocationManager, Authentication,
                          defaultPicture) {
        return {
            restrict : 'AE',
            templateUrl: UIComponentsTemplatesPath + "navbar.html",
            link : function (scope, element, attrs) {

                scope.cities = [];
                scope.isStudent = Authentication.isStudent;
                scope.isOrganizer = Authentication.isOrganizer;

                var unsubscribeUserChanged = null;
                var unsubscribeUserLoggedOut = null;

                activate();

                function setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {
                        PLACEHOLDER_WANT_TO_LEARN : '¿Qué quieres aprender hoy?',
                        CITY_LABEL: 'Ciudad',
                        CITY_DEFAULT_LABEL: 'Ciudad..',
                        PROFILE_LABEL: 'Mi Perfil',
                        LOGIN_LABEL: 'Iniciar Sesión',
                        REGISTER_LABEL: 'Registrarse',
                        ORGANIZER_LABEL: 'Organizador',
                        STUDENT_LABEL: 'Estudiante',
                        LOGOUT_LABEL: 'Logout'
                    });
                }

                function getUser(){
                    Authentication.getAuthenticatedAccount().then(success, error);

                    function success(user){
                        console.log('user:', user, '!!user:', !!user);
                        if(!user){
                            scope.user = null;
                            return;
                        }
                        scope.user = user;
                        scope.user.is_organizer = Authentication.isOrganizer();
                        scope.user.is_student = Authentication.isStudent();
                        mapDisplayName(scope.user);
                    }

                    function error(){
                        console.log('navbar response reject');
                        scope.user = null;
                    }
                }

                function mapDisplayName(data){
                    //console.log('mapDisplayName. data:', data);
                    var user = data.user;
                    var company = data.name;
                    if (company){
                        user.full_name = company;
                    } else if(user.full_name){
                        console.log('Full Name already defined');
                    } else if(user.first_name && user.last_name){
                        user.full_name = [user.first_name, user.last_name].join(' ');
                    } else {
                        user.full_name = 'User';
                    }

                    if(!data.photo) {
                        data.photo = defaultPicture;
                    }

                    $timeout(function(){
                        scope.$apply();
                    }, 0);
                }

                function getCities(){
                    LocationManager.getAvailableCities().then(success, error);

                    function success(cities) { scope.cities = cities; }
                    function error() { console.log("truliiNavbar. Couldn't get cities"); }
                }

                function cleanUp(){
                    unsubscribeUserChanged();
                    unsubscribeUserLoggedOut();
                }

                function activate() {
                    setStrings();
                    getUser();
                    getCities();

                    unsubscribeUserChanged = $rootScope.$on(Authentication.USER_CHANGED_EVENT, function(event){
                        console.log('navBar. on' + Authentication.USER_CHANGED_EVENT);
                        getUser();
                    });

                    unsubscribeUserLoggedOut = $rootScope.$on(Authentication.USER_LOGOUT_EVENT, function(event){
                        console.log('navBar. on' + Authentication.USER_LOGOUT_EVENT);
                        getUser();
                    });

                    scope.$on('$destroy', cleanUp);

                }
            }
        }
    }

})();